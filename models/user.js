const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/mohit2002/image/upload/v1656355528/150417827-photo-not-available-vector-icon-isolated-on-transparent-background-photo-not-available-logo-concept_kfdhwm.webp"
    },
    followers:[{type:ObjectId,ref:'Users'}],
    following:[{type:ObjectId,ref:'Users'}]
})

mongoose.model('Users',UserSchema);