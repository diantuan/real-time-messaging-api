const mongoose = require('mongoose');
const SignUpModel = require('./sign-up-model')

const newSchema = new mongoose.Schema(
  {
    channelName :{
      type:String,
      required:false
    },
    createdAt:{
      type:Date,
      default:Date.now()
    },
    members:[{memberId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: SignUpModel
    }}]
  }
)

const ChannelModel = mongoose.model('Channel', newSchema)

module.exports = ChannelModel