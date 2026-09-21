const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const transactionContoller = require("../contollers/transaction.controller")


const router = express.Router()



router.post("/",authMiddleware.authUser,transactionContoller.createTransaction)

router.get("/history",authMiddleware.authUser,transactionContoller.getTransactionHistory)

router.post("/system/initial-funds",authMiddleware.authSystemUser,transactionContoller.createInitialFunds)

module.exports = router;