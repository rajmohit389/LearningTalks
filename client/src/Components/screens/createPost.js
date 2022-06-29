import {React,useState,useEffect,useContext} from 'react'
import Model from './modal'
import { MessageContext,FlagContext } from '../../App'
// import {  } from 'react-router-dom'
// import {useNavigate} from 'react-router-dom';

export default function CreatePost() {
    const {message,setMessage}=useContext(MessageContext);
    const { flag, setFlag } = useContext(FlagContext);
    const [title,setTitle]=useState("");
    const [body,setBody]=useState("");
    const [url,setUrl]=useState("");
    const [image,setImage]=useState("");
    const [label,setLabel]=useState("Choose an image")
    useEffect(()=>{
        if(url){
            fetch('/createpost',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+ localStorage.getItem('jwt')
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then(res => res.json()).then(data => {
                if(data.error){
                    setMessage({type:"change",newValue:data.error});
                }
                else{
                    setMessage({type:"change",newValue:data.message});
                    setFlag({type:"change",newflag:true});
                }
            })
            setTitle("");
            setBody("");
            setUrl("");
            setImage("");
            setLabel("Choose an image");
        }
    },[url]);
    const postDetails=()=>{
        const data=new FormData();
        data.append('file',image);
        data.append('upload_preset','Mern Project')
        data.append('cloud_name','mohit2002')
        fetch('https://api.cloudinary.com/v1_1/mohit2002/image/upload',{
            method:'POST',
            body:data
        }).then(res => res.json()).then(data => {
            setUrl(data.url);
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <div>
            <div className="shadow-lg px-4 pb-2 pt-5 mt-3 mb-4 bg-white rounded container" style={{ width: '60%' }}>
                <input type="text" className="form-control container mt-2 mb-4" style={{ border: "0.5px solid" }}
                value={title} onChange={(e)=>{
                    setTitle(e.target.value);
                }} placeholder="title"></input>
                <input type="text" className="form-control container mt-2 mb-4" style={{ border: "0.5px solid" }} 
                value={body} onChange={(e)=>{
                    setBody(e.target.value);
                }} placeholder="body"></input>
                <div className="input-group mb-3">
                    <div className="custom-file">
                        <label className="custom-file-label" htmlFor="inputGroupFile01" >{label}</label>
                        <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" onChange={(e)=>{
                            var fileDetails = e.target.files[0];
                            setImage(fileDetails);
                            //replace the "Choose a file" label
                            var fileName;
                            if(fileDetails){
                                fileName=fileDetails.name;
                            }
                            else{
                                fileName="Choose an Image";
                            }
                            setLabel(fileName);
                        }}/>
                    </div>  
                </div>
                <div className="container text-center">
                    <button type="button" className="btn btn-primary btn-sm mt-2" onClick={() => {
                        if(image){
                            postDetails();
                        }
                        else{
                            setMessage({type:"change",newValue:"insert a pic"})
                            setTitle("");
                            setBody("");
                        }
                        }} data-toggle="modal" data-target="#exampleModal">Post</button>
                    <Model path="/"/>
                </div>
                
            </div>

        </div>
    )
}
