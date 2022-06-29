require('dotenv').config()
const express=require("express");
const app=express();
const port=process.env.PORT || 5000;

const mongoose=require("mongoose");
mongoose.connect(process.env.mongourl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
    console.log("connected to mongodb yeah")
})
mongoose.connection.on('error',(err)=>{
    console.log("error while connecting"+err)
})

require('./models/user')
require('./models/post')

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(port,()=>{
    console.log('server running at port 5000');
})
