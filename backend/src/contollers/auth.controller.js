const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenBlackListModel = require("../models/blackList.model")
const cookieParser = require("cookie-parser")

// controller for register 
async function registerController(req,res){
    try{
        const {email,name,password} = req.body;
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.status(409).json({
                message:"this email is already in use"
            })
        }

        const user = await userModel.create({
            name,email,password
        })

        const token = jwt.sign({
            _id:user._id
        },process.env.JWT_SEC,{expiresIn:"7d"})

        res.cookie("token",token)

        try {
            await emailService.sendRegistertionEmail(user.email,user.name)
        } catch (emailErr) {
            console.error("Failed to send registration email:", emailErr.message)
        }

        return res.status(201).json({
            message:"user created successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                systemUser: user.systemUser || false
            },
            token
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}

async function loginController(req,res){
    try {
        const {email,password} = req.body;

        const user = await userModel.findOne({email}).select("+password +systemUser")

        if(!user){
            return res.status(404).json({
                message:"you are not registered"
            })
        }

        const validPassword = await user.comparePassword(password)

        if(!validPassword){
            return res.status(401).json({
                message:"password is incorrecr"
            })
        }
       
        const token = jwt.sign({
            _id:user._id
        },process.env.JWT_SEC,{
            expiresIn:"7d"
        })

        res.cookie("token",token)

        return res.status(200).json({
            message:"user logged in successfully",
            token,
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                systemUser: user.systemUser || false
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"can not login due to internal server error"
        })
    }
}

async function getMeController(req, res) {
    try {
        return res.status(200).json({
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                systemUser: req.user.systemUser || false
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function userLogoutController(req,res) { 
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(400).json({
            message:"token not present for blacklisting"
        })
    }
    
    await tokenBlackListModel.create({
        token
    }) 

    res.clearCookie("token")

    return res.status(200).json({
        message:"user logged out successfully"
    })
}

module.exports = { registerController, loginController, getMeController, userLogoutController };
