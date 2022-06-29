
const jwt=require('jsonwebtoken');

const mongoose=require('mongoose');
const Users=mongoose.model('Users');

module.exports=(req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization){
        return res.status(400).json({error:'you must be logged in1'});
    }
    else{
        // Authorization= Bearer (token)
        const token =authorization.replace("Bearer ","");
        jwt.verify(token,process.env.jwt_secret,(err,payload)=>{
            if(err){
                return res.status(400).send('you must be logged in2');
            }
            const {_id}=payload;
            Users.findById(_id).then((userdata)=>{
                req.user=userdata;
                next();
            })
        })
    }
}
