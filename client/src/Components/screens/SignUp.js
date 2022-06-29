import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Model from './modal'
import { MessageContext, FlagContext } from '../../App';

export default function SignUp() {
    const { message, setMessage } = useContext(MessageContext);
    const { flag, setFlag } = useContext(FlagContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [url, setUrl] = useState(undefined);
    const [image, setImage] = useState("");
    const [label, setLabel] = useState("Choose an image")

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url]);

    const uploadFields = () => {
        let emailPatten = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
        if (emailPatten.test(email)) {
            fetch("/signup", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        name,
                        email,
                        password,
                        pic: url
                    }
                )
            }).then(res => res.json()).then(data => {
                if (data.error) {
                    setMessage({ type: "change", newValue: data.error });
                }
                else {
                    setMessage({ type: "change", newValue: data.message });
                    setFlag({ type: "change", newflag: true });
                }
            })
        }
        else{
            setMessage({ type: 'change', newValue: "email is not correct" })
            setFlag(true)
        }
        setName("");
        setEmail("");
        setPassword("");
        setUrl(undefined);
        setImage("");
        setLabel("Choose an image");
    }

    const uploadPics = () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'Mern Project')
        data.append('cloud_name', 'mohit2002')
        fetch('https://api.cloudinary.com/v1_1/mohit2002/image/upload', {
            method: 'POST',
            body: data
        }).then(res => res.json()).then(data => {
            setUrl(data.url);
        }).catch(err => {
            console.log(err);
        })
    }
    const post = () => {
        if (image) {
            uploadPics();
        }
        else {
            uploadFields();
        }
    }
    return (
        <>
            <div className='container mt-4' style={{ width: "65%", height: "45%", border: "1px solid blue", padding: "20px 15px", "borderRadius": "7px" }}>
                <h2 className='text-center'>Learning Talks</h2>
                <div className="form-group">
                    <label htmlFor="exampleInputName1">Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} id="exampleInputName1" placeholder="Enter name" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" placeholder="Enter email" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword1" aria-describedby="emailHelp" placeholder="Password" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your password with anyone else.</small>
                </div>
                <div className="form-group">
                    <div className="custom-file">
                        <label className="custom-file-label" htmlFor="inputGroupFile01" >{label}</label>
                        <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" onChange={(e) => {
                            var fileDetails = e.target.files[0];
                            setImage(fileDetails);
                            //replace the "Choose a file" label
                            var fileName;
                            if (fileDetails) {
                                fileName = fileDetails.name;
                            }
                            else {
                                fileName = "Choose an Image";
                            }
                            setLabel(fileName);
                        }} />
                    </div>
                </div>
                <div className="container text-center">
                    <div><Link to="/login">Already have an account?</Link></div>
                    <button type="button" className="btn btn-primary btn-sm mt-2" onClick={() => {
                        post()
                    }} data-toggle="modal" data-target="#exampleModal">SignUp</button>
                    <Model path="/login" />
                </div>
            </div>
        </>
    )
}
