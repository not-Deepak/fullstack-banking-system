const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")
const mongoose = require("mongoose");
const userModel = require("../models/user.model");

async function createTransaction(req,res){

    const {fromAccount , toAccount , amount , idempotencyKey} = req.body;

    if(!fromAccount||!toAccount||!amount||!idempotencyKey){
        return res.status(400).json({
            message:"all of these is required to create an transaction"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount||!toUserAccount){
        try {
            await emailService.sendTransactionFailedEmail(
                req.user.email,
                req.user.name,
                amount,
                toAccount,
                "Recipient or Sender account ID does not exist"
            );
        } catch (emailErr) {}

        return res.status(400).json({
            message:"enter correct fromAccount/toAccount"
        })
    }

    // validate idempotency key 
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExists){
       if(isTransactionAlreadyExists.status==="COMPLETED"){
        return res.status(200).json({
            message:"transaction already completed",
            transaction: isTransactionAlreadyExists
        })
       }
       if(isTransactionAlreadyExists.status==="PENDING"){
        return res.status(202).json({
            message:"transaction is in pending state"
        })
       }
       if(isTransactionAlreadyExists.status==="FAILED"){
        return res.status(500).json({
            message:"transaction failed"
        })
       }
       if(isTransactionAlreadyExists.status==="REVERSED"){
        return res.status(500).json({
            message:"transaction REVERSED"
        })
       }
    }

    // check account status
    if(fromUserAccount.status!=="ACTIVE"||toUserAccount.status!=="ACTIVE"){
        try {
            await emailService.sendTransactionFailedEmail(
                req.user.email,
                req.user.name,
                amount,
                toAccount,
                "Account status is not ACTIVE"
            );
        } catch (emailErr) {}

        return res.status(401).json({
            message:"fromAccount/toAccount status should be ACTIVE"
        })
    }

    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        try {
            await emailService.sendTransactionFailedEmail(
                req.user.email,
                req.user.name,
                amount,
                toAccount,
                `Insufficient balance. Current balance is ₹${balance}`
            );
        } catch (emailErr) {}

        return res.status(400).json({
            message:`Insufficient balance in fromAccount current balance is ${balance} and asked amount is ${amount}`
        })
    }

    // create transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account:fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{session})

    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    // Calculate updated balances for email notifications
    const senderNewBalance = await fromUserAccount.getBalance();
    const recipientNewBalance = await toUserAccount.getBalance();

    // 1. Send DEBIT email to Sender
    try {
        await emailService.sendTransactionEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccount,
            senderNewBalance
        );
    } catch (emailErr) {
        console.error("Failed to send sender debit email:", emailErr.message);
    }

    // 2. Send CREDIT email to Recipient
    try {
        const recipientUser = await userModel.findById(toUserAccount.user);
        if (recipientUser && recipientUser.email) {
            await emailService.sendCreditEmail(
                recipientUser.email,
                recipientUser.name,
                amount,
                fromAccount,
                recipientNewBalance
            );
        }
    } catch (creditErr) {
        console.error("Failed to send recipient credit email:", creditErr.message);
    }

    return res.status(200).json({
        message:"transaction completed successfully",
        transaction:transaction
    })
}

async function createInitialFunds(req,res){
    const {toAccount,amount,idempotencyKey} = req.body;

    if(!toAccount||!amount||!idempotencyKey){
        return res.status(400).json({
            message:"toAccount , amount and idempotencyKey is required to initiate funds"
        })
    }

    const toUserAccount = await accountModel.findOne({_id:toAccount})

    if(!toUserAccount){
        return res.status(400).json({
            message:"no account is created with this id"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user:req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{session})

    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    // Send CREDIT email to Recipient for initial deposit
    const recipientNewBalance = await toUserAccount.getBalance();
    try {
        const recipientUser = await userModel.findById(toUserAccount.user);
        if (recipientUser && recipientUser.email) {
            await emailService.sendCreditEmail(
                recipientUser.email,
                recipientUser.name,
                amount,
                "SYSTEM_FAUCET",
                recipientNewBalance
            );
        }
    } catch (creditErr) {
        console.error("Failed to send initial funds credit email:", creditErr.message);
    }

    return res.status(201).json({
        message:"initial funds transaction completed successfully",
        transaction:transaction
    })
}

async function getTransactionHistory(req, res) {
    try {
        const userAccounts = await accountModel.find({ user: req.user._id }).select("_id");
        const accountIds = userAccounts.map(acc => acc._id);

        const transactions = await transactionModel.find({
            $or: [
                { fromAccount: { $in: accountIds } },
                { toAccount: { $in: accountIds } }
            ]
        })
        .sort({ createdAt: -1 })
        .populate("fromAccount", "_id currency user")
        .populate("toAccount", "_id currency user");

        const ledgerEntries = await ledgerModel.find({
            account: { $in: accountIds }
        })
        .sort({ createdAt: -1 })
        .populate("transaction");

        return res.status(200).json({
            message: "Transaction history fetched successfully",
            transactions,
            ledgerEntries
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({
            message: "Failed to fetch transaction history"
        });
    }
}

module.exports={createTransaction,createInitialFunds,getTransactionHistory}
