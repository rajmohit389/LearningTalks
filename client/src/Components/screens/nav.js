import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'

export default function Nav() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("")
    const [userList, setUserList] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const renderList = () => {
        if (state) {
            return [
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg"><i className="fa-solid fa-magnifying-glass"></i></button>,
                <li className="nav-item active" key="1">
                    <Link className="nav-link" to="/profile">Profile</Link>
                </li>,
                <li className="nav-item active" key="2">
                    <Link className="nav-link" to="/createpost">CreatePost</Link>
                </li>,
                <li className="nav-item active" key="3">
                    <Link className="nav-link" to="/myfollowingPosts">MyFollowingPosts</Link>
                </li>,
                <li className="nav-item active" key="4">
                    <button type="button" className="btn btn-sm btn-danger nav-link" onClick={() => {
                        localStorage.clear();
                        dispatch({ type: "CLEAR" });
                        navigate('/login');
                    }}>Logout</button>
                </li>
            ]
        }
        else {
            return [
                <li className="nav-item active" key="5">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>,
                <li className="nav-item active" key="6">
                    <Link className="nav-link" to="/signup">SignUp</Link>
                </li>
            ]
        }
    }
    useEffect(() => {
        if (search) {
            fetch('/searchUsers', {
                method:'post',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body:JSON.stringify({
                    query:search
                })

            }).then(res => res.json())
                .then(data => {
                    setUserList(data);
                })
        }
    }, [search])
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to={state ? '/' : '/login'} >LearningTalks</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        {renderList()}
                    </ul>
                </div>
                
                <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <input type="text" className="form-control" value={search} onChange={(e) => {
                                setSearch(e.target.value)
                                
                            }} placeholder="Enter" />
                            <ul className="list-group">
                                {userList.map(item => {
                                    return (
                                        <li className="list-group-item border border-success"><Link to={"/profile/"+item._id}onClick={()=>{
                                            document.querySelector('.bd-example-modal-lg').modal('close')
                                        }}>{item.email}</Link></li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

            </nav>

        </>
    )
}
