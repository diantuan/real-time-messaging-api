const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const emailRegex = /^[a-zA-Z0-9_\-^\s]+@[a-zA-Z0-9_\-^\s]+(\.\w+)+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W]).{8,}$/

const signUpSchema = new mongoose.Schema(
{
  email:{
    type:String,
    required:true,
    unique: true,
    match:[emailRegex, 'email is invalid']
  },
  password:{
    type:String,
    required:true,
    match:[passwordRegex, 'password length must be at least 8 and must contain at least one uppercase, lowercase, number and special character']
  },
  password_confirmation:{
    type:String,
    required:true,
    
  },
  nickname:{
    type:String,
    required:false
  },

  picture:{
    type:Buffer,
    required:false
  },
  picture_type:{
    type:String,
    required:false
  }
}
)

signUpSchema.pre('save', async function(next){
  if(this.isModified('password')){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

const SignUpModel = mongoose.model("Sign-Up", signUpSchema);

module.exports = SignUpModel