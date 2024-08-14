const express=require('express');
const app=express();

const momgoose=require('mongoose');
const { authMiddleware } = require('../middleware');
const { default: mongoose } = require('mongoose');

const router=express.Router();

router.get("/balance",authMiddleware,async (req,res)=>{
    const account=await Account.FindOne({
        userId:req.userId
    });
    res.json({
        balance:account.balance
    });
})


router.post('/transfer',authMiddleware,async (req,res)=>{
    const session=await mongoose.startSession();

    session.startTransaction();
    const {amount,to}=req.body;
    const account=await Account.findOne({userId:req.userId}).session(session);

    //insufficient balance case
    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"insufficient balance"
        });
    };
    //account does not exist
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    //all checks are done
    await session.commitTransaction();
    res.json({
        message:"Transfer successful"
    })

})

module.exports={
    router
}