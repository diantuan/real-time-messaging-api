const jwt = require('jsonwebtoken');

const verify = (req,res,next)=>{

  const token = req.headers["authorization"] ? req.headers["authorization"].replace("Bearer ", "") : null

  if(!token){
   return res.status(400).json({error:"token is required --diane"})
  }
  try{
    const decoded = jwt.verify(token, "balahurahaha")
    req.user = decoded
    next()
  }
  catch(error){
    res.status(401).json({error:"cant verify token --diane"})
  }
}

module.exports = verify