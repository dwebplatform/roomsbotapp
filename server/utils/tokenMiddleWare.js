
require('dotenv').config();
const jwt = require('jsonwebtoken');
 function tokenHandler(req,res,next){
   const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.json({
    status:'error',
    msg:'not authorized'
  }); // if there isn't any token

  jwt.verify(token, process.env.TOKEN_PRIVATE_KEY, (err, user) => {
    if (err) return res.json({status:'error',msg:'not authorized'});
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
}

module.exports ={
  tokenHandler
}