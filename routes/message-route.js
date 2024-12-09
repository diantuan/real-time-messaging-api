const express = require('express')
const router = express.Router()
const verify = require('../verify-middleware')
const ChannelMessagesModel = require('../models/channel-messages-model')
const MessagesModel = require('../models/messages-model')

router.post('/api/v1/messages', verify, async (req,res)=>{
  const {receiver, body, receiver_class} = req.body;
  
  const io = req.app.get('io');

  if(!receiver || !body){
    return res.status(400).json({error: "all fields are required --diane"})
  }

  const sender = req.user.uid

  if(receiver_class === "channel"){
    const newChannelMessage = new ChannelMessagesModel({
      sender, receiver, body
    })
    
  
    try{
      
      await newChannelMessage.save()
      const foundt = await ChannelMessagesModel.findOne({sender:sender, receiver:receiver, body:body}).populate('sender')
      
      io.emit('refresh', foundt)
      return res.status(200).json(newChannelMessage)
    }
    catch(error){
      return res.status(500).json({error:"cannot send message", message:error})
    }
  }
  

  const newMessage = new MessagesModel(
    {sender, receiver,body}
  )
  const mes = {
    sender:{
      _id:sender
    },
    receiver,
    body,
    _id: Date.now()
  }
  try{
    io.emit('refresh', mes)
    await newMessage.save()
    return res.status(201).json(newMessage);
  }
  catch(error){
    return res.status(500).json({error: "cant send message", message: error})
  }
})

router.get('/api/v1/messages/:channel/:receiverid', verify, async (req,res)=>{
  const {channel, receiverid} = req.params;

  if(!receiverid && !channel){
    return res.status(400).json({error: "ObjectID is required for receiver --diane"})
  }

  const senderid = req.user.uid

  if(channel === "channel"){
    try{
      const channelHistory = await ChannelMessagesModel.find({receiver:receiverid}).sort({createdAt: 1}).populate('sender receiver')
      return res.status(200).json(channelHistory)
    }
    catch(error){
      return res.status(500).json({error:"cannot find channel", message: error})
    }
  }

  try{

    const history = await MessagesModel.find({
      $or: [
        {sender: senderid, receiver: receiverid},
        {sender: receiverid, receiver:senderid}
      ]
    }).sort({createdAt: 1}).populate('sender receiver')
    return res.status(200).json(history)
  }
  catch(error){
    return res.status(500).json({error: 'cant retrieve messages', message:error})
  }
  
})

module.exports = router