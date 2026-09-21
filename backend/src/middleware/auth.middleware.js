
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blackList.model")

async function authUser(req,res,next) {
   
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    

  try{

  if(!token){
    return res.status(401).json({
        message:"token should be present"
    })
  }

  const isBlackListed = await tokenBlackListModel.findOne({token})

  if(isBlackListed){
    return res.status(401).json({
        message:"token is already blacklisted"
    })
  }


  const decoded = jwt.verify(token,process.env.JWT_SEC)

  if(!decoded){
    return res.status(401).json({
        message:"token not verified you can not create an account"
    })
  }

  const user = await userModel.findById(decoded._id)

  if (!user) {
    return res.status(401).json({
      message: "User not found or session invalid"
    })
  }

  req.user = user;

  return next();


  }catch(err){
    console.log(err)
    return res.status(500).json({
        message:"internal server error"
    })
  }





}

async function authSystemUser(req,res,next){

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    try{

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access , token is missing"
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({token})

    if(isBlackListed){
    return res.status(401).json({
        message:"token is already blacklisted"
    })
  }
    
    const decoded = jwt.verify(token,process.env.JWT_SEC)

    const user = await userModel.findOne({_id:decoded._id}).select("+systemUser")

    if(!user || !user.systemUser){
        return res.status(401).json({
            message:"you are not authorized to be an system user"
        })
    }

    req.user=user;
    return next();





    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"internal server error"
        })

    }
}


module.exports={authUser,authSystemUser}
