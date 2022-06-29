import {React,useState,useContext,useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Model from './modal'
import { UserContext,MessageContext,FlagContext } from '../../App'

export default function Login() {
  const {state,dispatch}=useContext(UserContext);
  const {message,setMessage}=useContext(MessageContext);
  const { flag, setFlag } = useContext(FlagContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const post=()=>{
    fetch('/login',{
      method:"POST",
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        email,
        password
      })
    }).then(res => res.json()).then(data =>{
      if(data.error){
        setMessage({type:"change",newValue:data.error});
      }
      else{
        localStorage.setItem('jwt',data.token);
        localStorage.setItem('user',JSON.stringify(data.user));
        dispatch({type:"USER",payload:data.user});
        setMessage({type:"change",newValue:"signed in successfully"});
        setFlag({type:"change",newflag:true});
      }
    })
    setEmail("");
    setPassword("");
  }
  return (
    <>
      <form className='container mt-4 ' style={{ width: "65%", height: "60%", border: "1px solid blue", padding: "35px 15px", "borderRadius": "7px" }}>
        <h2 className='text-center'>Learning Talks</h2>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter email" />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" aria-describedby="emailHelp" value={password} onChange={(e)=>{setPassword(e.target.value)}}  placeholder="Password" />
          <small id="emailHelp" className="form-text text-muted">We'll never share your password with anyone else.</small>
        </div>
        <div className="container text-center">
          <div><Link to="/signup">Don't have an account?</Link></div>
          <button type="button" className="btn btn-primary btn-sm mt-2" onClick={post} data-toggle="modal" data-target="#exampleModal">Login</button>
          <Model path="/"/>
        </div>
      </form>
    </>
  )
}
