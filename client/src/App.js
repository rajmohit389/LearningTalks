import React, { useEffect, createContext, useReducer, useContext } from 'react'
import './App.css'
import Nav from './Components/screens/nav'
import Home from './Components/screens/Home'
import Profile from './Components/screens/profile'
import Login from './Components/screens/LogIn'
import SignUp from './Components/screens/SignUp'
import UserProfile from './Components/screens/UserProfile'
import SubscribedPosts from './Components/screens/getSubposts'
import CreatePost from './Components/screens/createPost'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { reducer, initialState } from './Components/reducers/userReducer'
import { messageReducer, initialMessage } from './Components/reducers/msgReducer'
import { flagReducer, initialFlag } from './Components/reducers/flagReducer'

export const UserContext = createContext();
export const MessageContext = createContext();
export const FlagContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const { message, setMessage } = useContext(MessageContext);
  const { flag, setFlag } = useContext(FlagContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    }
    else {
      navigate('/login');
    }
  }, [])

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route exact path="/login" element={
          <Login />
        }></Route>
        <Route exact path="/signup" element={
          <SignUp />
        }></Route>
        <Route exact path="/createpost" element={
          <CreatePost />
        }></Route>
        <Route exact path="/profile/:userId" element={
          <UserProfile/>
        }></Route>
        <Route exact path="/myfollowingPosts" element={
          <SubscribedPosts/>
        }></Route>
      </Routes>
    </>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [message, setMessage] = useReducer(messageReducer, initialMessage);
  const [flag, setFlag] = useReducer(flagReducer, initialFlag);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}><FlagContext.Provider value={{ flag, setFlag }}>
        <MessageContext.Provider value={{ message, setMessage }}>
          <BrowserRouter>
            <Nav />
            <Routing />
          </BrowserRouter>

        </MessageContext.Provider>
      </FlagContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
