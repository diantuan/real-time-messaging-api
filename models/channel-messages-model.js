const mongoose = require('mongoose')
const SignUpModel = require('./sign-up-model');
const ChannelModel = require('./channel-model')

const newSchema = new mongoose.Schema(
  {
    sender:{
      type:mongoose.Schema.Types.ObjectId,
      ref: SignUpModel,
      required:true
    },
    receiver:{
      type:mongoose.Schema.Types.ObjectId,
      ref: ChannelModel,
      required:true
    },
    body:{
      type:String,
      required:true
    },
    createdAt:{
      type:Date,
      default:Date.now()
    }
  }
)

const ChannelMessagesModel = mongoose.model('Channel Messages', newSchema)

module.exports = ChannelMessagesModel