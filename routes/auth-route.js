const express= require('express')
const router = express.Router()
const SignUpModel = require('../models/sign-up-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretKey = 'balahurahaha'
const upload = require('../upload-middleware')

router.post('/api/v1/auth/', upload.single('picture'), async (req,res)=>{

  const {email, nickname, password, password_confirmation} = req.body;
  const {buffer, mimetype} = req.file

  const existingEmail = await SignUpModel.findOne({email});

  if(existingEmail){
    return res.status(400).json({error:'email already in use --Diane'})
  }

  if (password !== password_confirmation) {
    return res.status(400).json({error:'passwords do not match --diane'})
  }

  const newSignUp = new SignUpModel(
    {email, nickname, password, password_confirmation, 
    picture: buffer,  
    picture_type:mimetype}
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


router.post('/api/v1/auth/sign_in/', async (req,res)=>{

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
      res.status(200).json({token:token, uid:user._id})
    }else{
      res.status(400).json({error:'password is incorrect'})
    }

  }
  catch(error){
    console.log(error)
    res.status(500).json({error:'an error occurred during login', message: error.message})
  }

})


module.exports = router