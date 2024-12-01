const mongoose = require('mongoose');
const SignUpModel = require('./sign-up-model')

const friendSchema = new mongoose.Schema({
  friendId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: SignUpModel,
    required: true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:SignUpModel,
    required:true
  },
  addedAt:{
    type:Date,
    default: Date.now()
  }

})

const FriendModel = mongoose.model('Friends', friendSchema)

module.exports = FriendModel