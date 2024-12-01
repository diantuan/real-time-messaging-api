const mongoose = require('mongoose');

const connectMongoose = async()=>{

  try{

    await mongoose.connect('mongodb+srv://diminibonboulash:Biminibonboulash1!@kaikai.ubjlw.mongodb.net/?retryWrites=true&w=majority&appName=Kaikai')

    console.log('mongoose is connected')

  }
  catch(error){
    console.log('mongoose failed to connect' + error)
    process.exit(1)
  }
  

}

module.exports = connectMongoose;