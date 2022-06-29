const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const Posts=mongoose.model('Posts')
const requireLogin=require('../middleware/requireLogin')

router.get('/allposts',requireLogin,(req,res)=>{
    Posts.find().
    populate("postedBy","_id name")
    .populate("comments.commentedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts});
    }).catch(err=>{
        console.log(err);
    })
})

router.get('/getsubpost',requireLogin,(req,res) => {
    Posts.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.commentedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        if(!posts){
            res.json({message:"no posts on this id"});
        }
        res.json({posts});
    }).catch(err=>{
        console.log(err);
    })
})
router.get('/mypost',requireLogin,(req,res) => {
    Posts.find({postedBy:req.user})
    .populate("postedBy","_id name")
    .populate("comments.commentedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        if(!posts){
            res.json({message:"no posts on this id"});
        }
        res.json({posts});
    }).catch(err=>{
        console.log(err);
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic}=req.body;
    if(!title || !body || !pic){
        return res.status(401).json({error:"title or body cannot be blank"});
    }
    req.user.password=undefined;
    const newPost =new Posts({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    newPost.save().then(postdata=>{
        res.json({message:"posted succesfully",post:postdata});
    }).catch(err=>{
        console.log(err);
    })
})

router.put('/like',requireLogin,(req,res)=>{
    Posts.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            res.status(422).json({error:err})
        }
        else{
            res.status(200).json(result);
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Posts.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            res.status(422).json({error:err})
        }
        else{
            res.status(200).json(result);
        }
    })
})

router.put('/comment',requireLogin,(req,res) => {
    if(!(req.body.text)){
        res.status(400).json({error:"section can not be blank"})
    }
    const comment={
        text:req.body.text,
        commentedBy:req.user
    }
    Posts.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.commentedBy","_id name")
    .exec((err,result) => {
        if(err){
            res.status(422).json({error:err})
        }
        else{
            res.status(200).json(result);
        }
    })
})

router.delete('/delete/:postId',requireLogin,(req,res)=>{
    Posts.findOne({_id:req.params.postId})
    .exec((err,post) => {
        if(err){
            res.status(422).json({error:err});
        }
        if(!post){
            res.status(404).json({error:"post not found"})
        }
        post.remove()
        .then((result)=>{
            res.status(200).json(result);
        }).catch(err=>{
            res.status(422).json({error:err});
        })
    })
})

module.exports=router;
