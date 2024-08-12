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

const user=mongoose.model('user',UserSchema)



module.exports={User};