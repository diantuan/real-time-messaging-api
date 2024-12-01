const mongoose = require('mongoose');
const SignUpModel = require('./sign-up-model')

const messagesSchema = new mongoose.Schema(
  {
    sender:{
      type: mongoose.Schema.Types.ObjectId,
      ref: SignUpModel,
      required:true
    },
    receiver:{
      type: mongoose.Schema.Types.ObjectId,
      ref: SignUpModel,
      required: true
    },
    body:{
      type:String,
      required:true
    },
    createdAt:{
      type:Date,
      default: Date.now()
    }
  }
)

const MessagesModel = mongoose.model('Messages', messagesSchema);

module.exports = MessagesModel;