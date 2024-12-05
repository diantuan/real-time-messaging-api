const express= require('express')
const router = express.Router()
const verify = require('../verify-middleware')
const ChannelModel = require('../models/channel-model')

router.post('/api/v1/create-channel', verify, async (req,res)=>{
  const{channelName, members} = req.body

  const userId = req.user.uid

  const io = req.app.get('io')
  
  const newChannel = new ChannelModel({
    channelName, members:[...members, {memberId: userId}]
  })

  try{
    await newChannel.save()
    io.emit('refreshChannel')
    return res.status(200).json(newChannel)
   

  }
  catch(error){
    return res.status(500).json({error:"can't create channel", message:error})
  }
})

router.get('/api/v1/get-channel/', verify, async (req,res)=>{

  const userId = req.user.uid

  try{
    const channel = await ChannelModel.find(
      {"members.memberId": userId}).populate('members.memberId')
    return res.status(200).json(channel)
  }
  catch(error){
    return res.status(500).json({error:'cant find channel', message: error})
  }
})

router.post('/api/v1/add-channel/', verify, async(req,res)=>{

  const io = req.app.get('io')
  const {channelid, memberId} = req.body

  if(!channelid || !memberId){
    return res.status(400).json({error:"channel id and member id are required"})
  }

  try{

    const match = await ChannelModel.findOne(
        {_id: channelid,
        "members.memberId" : memberId}
      )

    if(match){
      return res.status(400).json({error:"friend is already in the channel"})
    }
    const channel = await ChannelModel.findByIdAndUpdate(
      channelid,
      {$addToSet : {members: {memberId}}},
      {new: true}
    )
    io.emit('refreshChannel')
    return res.status(200).json(channel)
  }
  catch(error){
    return res.status(500).json({error:"cannot add member", message: error})
  }
})

module.exports = router