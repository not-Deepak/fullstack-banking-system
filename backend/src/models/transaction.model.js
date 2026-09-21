const mongoose = require("mongoose")



const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"from account(sender account) is required to create an transaction"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"to account(reciever account) is required to create an transaction"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"transaction can be either PENDING/COMPLETED/FAILED/REVERSED"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"],
        min:[1,"Transaction amount cannot be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"idempotency key is required for creating a transaction"],
        index:true,
        unique:true
    }
   
},{
    timestamps:true
})

const transactionModel = mongoose.model("transaction",transactionSchema)

module.exports=transactionModel;