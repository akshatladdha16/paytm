const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/paytmApp')

const UserSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    }
})

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,//refernce to user model
        ref:'User', // to ensure that we can't enter anyhtiong that is not referred from user table first
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});

const Account=mongoose.model('Account',accountSchema);
const user=mongoose.model('user',UserSchema)



module.exports={User,Account};