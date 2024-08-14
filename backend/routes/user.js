const express=require('express');
const router=express.Router();
const zod=require('zod');
const jwt=require("jsonwebtoken");
const JWT_SECRET = require('../config');
const { authMiddleware } = require('../middleware');

const signupSchema=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()

})
router.post('/signup',async (req,res)=>{
    const body=req.body;
    const {success}=signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Email already taken/incorrect ijnputs"
        })
    }

    const user=User.findOne({
        username:body.username
    })
    if(user._id){
        return res.status(411).json({
            message:"Email already taken/Incorrect inputs"
        })
    }
    const dbUser=await User.create(body);
    const token=jwt.sign({
        userID:dbUser._id
    },JWT_SECRET)
    res.json({
        message:"user created successfully",
        token:token
    })
})


/// simple profile updater for users
const updateBody=zod.object({
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
})
router.put('/',authMiddleware,async (req,res)=>{
    const {success}=updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message:"Error while updating the information"
        })
    }
    await User.updateOne(req.body),{
        id:req.userId
    }
    res.json({
        message:'Updated Successfully'
    })
})

/// to find their friends with substring too
router.get('/bulk',async (req,res)=>{
    const filter=req.query.filter|| "";
    const users=await User.find({
        $or:[{ ///or is for either of firstname or lastname
            firstname:{
                "$regex":filter
            }
        },{
            lastname:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user:users.map(user=>({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user._id
        }))
    })
})



module.exports =router;