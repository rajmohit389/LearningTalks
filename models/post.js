const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:'Users'}],
    comments:[{
        text:String,
        commentedBy:{
            type:ObjectId,
            ref:'Users'
        }
    }],
    postedBy:{
        type:ObjectId,
        ref:'Users'
    }
},{timestamps:true})

mongoose.model('Posts',postSchema)