const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const connectMongoose = require('../mongoose-connection.js')
const SignUpModel = require('../models/sign-up-model.js'); 
const MessagesModel = require('../models/messages-model.js');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const verify = require('../verify-middleware.js')
const FriendModel = require('../models/friends-model.js');
const ChannelModel = require('../models/channel-model.js');
const ChannelMessagesModel = require('../models/channel-messages-model.js')

const secretKey = 'balahurahaha'


connectMongoose();

app.use(cors({
  origin: '*',  // This allows requests from any domain
  methods: 'GET, POST, OPTIONS',  // Allow these HTTP methods
  allowedHeaders: 'Content-Type, Authorization'  // Allow these headers
}))

// Handle OPTIONS requests (preflight checks) for CORS
app.options('*', cors());  // This will handle the preflight requests for all routes

app.use(express.json());

app.get("/", (req,res)=>{
  res.status(200).send('Please specify your endpoint. --Diane')
})

app.post('/api/v1/auth/', async (req,res)=>{

  const {email, password, password_confirmation} = req.body;

  const existingEmail = await SignUpModel.findOne({email});

  if(existingEmail){
    return res.status(400).json({error:'email already in use --Diane'})
  }

  if (password !== password_confirmation) {
    return res.status(400).json({error:'passwords do not match --diane'})
  }

  const newSignUp = new SignUpModel(
    {email, password, password_confirmation}
  )

  
  try{
    await newSignUp.save();
    
    console.log("new account saved")
    res.status(201).json(email)
  }
  catch(error){
    console.log('new signup failed' + error)
    res.status(400).json({error:'error creating account --Diane', message: error.message})
  }

  

})


app.post('/api/v1/auth/sign_in/', async (req,res)=>{

  const {email, password} = req.body;

  try{
    const user = await SignUpModel.findOne({email})

    if(!user){
      return res.status(400).json({error:'email not found'})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    const token = jwt.sign(
      {uid: user._id},
      secretKey,
      {expiresIn: "1d"}
    )

    if(isMatch){
      res.status(200).json(token)
    }else{
      res.status(400).json({error:'password is incorrect'})
    }

  }
  catch(error){
    console.log(error)
    res.status(500).json({error:'an error occurred during login', message: error.message})
  }

})



app.post('/api/v1/messages', verify, async (req,res)=>{
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
      io.emit('refresh')
      return res.status(200).json(newChannelMessage)
    }
    catch(error){
      return res.status(500).json({error:"cannot send message", message:error})
    }
  }
  

  const newMessage = new MessagesModel(
    {sender, receiver,body}
  )
  try{
    await newMessage.save();
    io.emit('refresh')
    return res.status(201).json(newMessage);
  }
  catch(error){
    return res.status(500).json({error: "cant send message", message: error})
  }
})

app.get('/api/v1/messages/:channel/:receiverid', verify, async (req,res)=>{
  const {channel, receiverid} = req.params;

  if(!receiverid && !channel){
    return res.status(400).json({error: "ObjectID is required for receiver --diane"})
  }

  const senderid = req.user.uid

  if(channel === "channel"){
    try{
      const channelHistory = await ChannelMessagesModel.find({receiver:receiverid}).populate('sender receiver')
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


app.post('/api/v1/addfriend', verify, async (req,res)=>{

  const {friendEmail} = req.body;

  const io = req.app.get('io')

  if(!friendEmail){
    return res.status(400).json({error:"email is required for the person u wanna add --diane"})
  }

  const userId = req.user.uid;

  try{
    const friendFound = await SignUpModel.findOne({email:friendEmail})
    const friendId = friendFound._id
    const friendExists = await FriendModel.findOne(
      {friendId:friendId, userId:userId});
    if(friendExists){
      return res.status(400).json({error:"the user is currently a friend --diane"})
    }


    const newFriend = new FriendModel({
      friendId, userId
    })

    await newFriend.save()
    io.emit('refreshFriends')
    return res.status(200).json(newFriend)
    
  }
  catch(error){
    return res.status(500).json({error:"error finding or adding friend", message: error})
  }

})

app.get('/api/v1/friendlist', verify, async(req,res)=>{
  const userId = req.user.uid;


  try{

    const friendlist = await FriendModel.find({
      $or:
        [
          {userId:userId},
          {friendId:userId}
        ]
      
    }).sort({addedAt:1})
    

    friendlist.forEach(entry=>{

      if(entry.friendId.toString() === userId){
        const savedUserId = entry.userId
        entry.userId = userId
        entry.friendId = savedUserId;
      }
    })

    await Promise.all(
      friendlist.map((entry)=> entry.populate('friendId'))
    )


    return res.status(200).json(friendlist)
    
  }


  catch(error){
    return res.status(500).json({error:"cannot find friend list --diane", message:error})

  }
  
}
)


app.post('/api/v1/create-channel', verify, async (req,res)=>{
  const{channelName, members} = req.body

  const userId = req.user.uid
  
  const newChannel = new ChannelModel({
    channelName, members:[...members, {memberId: userId}]
  })

  try{
    await newChannel.save()
    return res.status(200).json(newChannel)

  }
  catch(error){
    return res.status(500).json({error:"can't create channel", message:error})
  }
})

app.get('/api/v1/get-channel/', verify, async (req,res)=>{

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

app.post('/api/v1/add-channel/', verify, async(req,res)=>{


  const {channelid, member} = req.body

  

  try{
    const channel = await ChannelModel.findByIdAndUpdate(
      channelid,{
        $addToSet : {members: member},
        new: true
      }
    )
    return res.status(200).json(channel)
  }
  catch(error){
    return res.status(500).json({error:"cannot add member", message: error})
  }
})



app.all('*', (req,res)=>{
  res.status(404).send('Into the unknown... --Diane')
})


module.exports = app;