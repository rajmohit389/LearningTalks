
const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const Posts=mongoose.model('Posts')
const requireLogin=require('../middleware/requireLogin')
const Users=mongoose.model('Users')

router.get('/user/:userId',requireLogin,(req,res) => {
    Users.findOne({_id:req.params.userId})
    .select("-password")
    .then(user => {
        Posts.find({postedBy:req.params.userId})
        .populate("postedBy","_id name")
        .populate("comments.commentedBy","_id name")
        .sort('createdAt')
        .exec((err,posts) => {
            if(err){
                res.status(422).json({error:err});
            }
            res.status(200).json({user,posts});
        })
    }).catch(err => {
        res.status(404).json({error:"User not found"})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    Users.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result) => {
        if(err){
            res.status(422).json({error:err});
        }
        Users.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password").then(result=>{
            res.status(200).json(result)
        }).catch(err => {
            res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    Users.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result) => {
        if(err){
            res.status(422).json({error:err});
        }
        Users.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            res.status(200).json(result)
        }).catch(err => {
            res.status(422).json({error:err})
        })
    })
})

router.put('/updatepic',requireLogin,(req,res)=>{
    Users.findByIdAndUpdate(req.user._id,{
        $set:{pic:req.body.pic}
    },{
        new:true
    },(err,result)=>{
        if(err){
            res.status(404).json({error:err})
        }
        res.status(200).json(result)
    })
})

router.post('/searchUsers',requireLogin,(req,res)=>{
    let userPattern=new RegExp("^"+req.body.query)
    Users.find({email:{$regex:userPattern}})
    .then(result=>{
        res.status(200).json(result)
    }).catch(err => {
        res.status(400).json({error:err})
    })
})

module.exports=router;