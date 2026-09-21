const accountModel = require("../models/account.model")

async function createAccountController(req,res){

    try {

        const user = req.user;
        const account = await accountModel.create({
        user
        })

        const accountObj = {
            ...account.toObject(),
            balance: 0
        };

        return res.status(201).json({
            message:"account created successfully",
            account: accountObj
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"couldn't open an account"
        })
    }

}

async function getUserAccounts(req,res){
    try {
        const accounts = await accountModel.find({user:req.user._id});
        const accountsWithBalance = await Promise.all(
            accounts.map(async (acc) => {
                const balance = await acc.getBalance();
                return {
                    ...acc.toObject(),
                    balance
                };
            })
        );

        res.status(200).json({
            message:"user all accounts fetched successfully",
            accounts: accountsWithBalance
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch accounts" });
    }
}

async function getBalanceController(req,res){

    const {accountId} = req.params;
    
    const account = await accountModel.findOne({
        _id:accountId,
        user:req.user._id
    })

    if(!account){
        return res.status(404).json({
            message:"account not found"
        })
    }

    const balance = await account.getBalance();

    return res.status(200).json({
        message:"account balance fetched successfully",
        accountId:accountId,
        balance:balance
    })



}

module.exports = {createAccountController,getUserAccounts,getBalanceController}