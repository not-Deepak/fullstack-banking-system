const express = require("express")

const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../contollers/account.contorller")



// create account post 

router.post("/",authMiddleware.authUser,accountController.createAccountController)


// get accounts 


router.get("/",authMiddleware.authUser,accountController.getUserAccounts)

// get balance

router.get("/balance/:accountId", authMiddleware.authUser,accountController.getBalanceController)






module.exports=router



















