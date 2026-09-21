const express = require("express")
const authController = require("../contollers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const router = express.Router()

// post api to create user
router.post("/register",authController.registerController)

// post api for login
router.post("/login",authController.loginController)

// get current user profile
router.get("/me", authMiddleware.authUser, authController.getMeController)

//auth logout
router.post("/logout",authController.userLogoutController)

module.exports=router;




















