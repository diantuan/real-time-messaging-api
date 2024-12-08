const express= require('express')
const router = express.Router()
const SignUpModel = require('../models/sign-up-model')
const FriendModel = require('../models/friends-model')
const verify = require('../verify-middleware')

router.post('/api/v1/addfriend', verify, async (req,res)=>{

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

  router.get('/api/v1/friendlist', verify, async(req,res)=>{
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
        friendlist.map((entry)=>{
          return entry.populate('friendId')
        } )
      )
      friendlist.forEach(friend=>{
        friend.friendId.picture = friend.friendId.picture ? `data:${friend.friendId.picture_type};base64, ${friend.friendId.picture.toString('base64')}` : null
      }
      )


      return res.status(200).json(friendlist)
      
    }


    catch(error){
      return res.status(500).json({error:"cannot find friend list --diane", message:error})

    }
    
  }
  )

module.exports = router