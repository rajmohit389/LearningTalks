import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { UserContext } from '../../App'

export default function UserProfile() {
    const navigate = useNavigate();
    const [userdetails, setUser] = useState(null);
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const { userId } = useParams();
    console.log(userId);

    useEffect(() => {
        fetch(`/user/${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json()).then(result => {
            setData(result.posts);
            setUser(result.user);
        })
    }, [])

    useEffect(() => {
        if (userdetails) {
            if (userdetails._id.toString() == state._id.toString()) {
                navigate('/profile');
            }
        }
    }, [userdetails])

    const likePost = (id) => {
        fetch('/like', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            const newData = data.map(item => {
                if (item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData);
        }).catch(err => {
            console.log(err);
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            const newData = data.map(item => {
                if (item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData);
        }).catch(err => {
            console.log(err);
        })
    }

    const commentPost = (text, postId) => {
        fetch('/comment', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => res.json()).then(result => {
            const newData = data.map(item => {
                if (item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData);
        }).catch(err => {
            console.log(err);
        })
    }

    const followUser = () => {
        fetch('/follow', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userId
            })
        }).then(res => res.json())
            .then(result => {
                dispatch({ type: "UPDATE", payload: { followers: result.followers, following: result.following } })
                localStorage.setItem('user', JSON.stringify(result));
                setUser((prevState) => {
                    return {
                        ...prevState,
                        followers: [...prevState.followers, result._id]
                    }
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        }).then(res => res.json())
            .then(result => {
                dispatch({ type: "UPDATE", payload: { followers: result.followers, following: result.following } })
                localStorage.setItem('user', JSON.stringify(result));
                const newFollowers = userdetails.followers.filter(item => item.toString() != state._id.toString())
                setUser((prevState) => {
                    return {
                        ...prevState,
                        followers: newFollowers
                    }
                })
            })
            .catch(err => {
                console.log(err);
            })
    }


    return (
        <>
            {userdetails ?
                <>
                    <div className="shadow-lg bg-white card mt-3 container px-0" style={{ border: "1px solid", width: "70%" }}>
                        <div className="card-header text-center my-0" style={{ border: "1px solid", backgroundColor: "#c7d7d8" }}>
                            <h2>{userdetails.name}</h2>
                        </div>
                        <div className="card-body row">
                            <h5 className="card-title col">
                                <img src={userdetails ? userdetails.pic : '...'} style={{ height: "100%", width: "60%" }} class="rounded float-left ml-3" alt="..."></img>
                            </h5>
                            <p className="card-text col">
                                <h4 className='justify-content-center mt-2'>Email:<span>{userdetails.email}</span></h4>
                                <div className="row justify-content-center mr-4">
                                    <div className="col">{userdetails.followers.length} followers</div>
                                    <div className="col">{userdetails.following.length} following</div>
                                    <div className="col">{data.length} Posts</div>
                                    {userdetails.followers.includes(state._id) ?
                                        <button type="button" className="btn btn-sm btn-primary py-0" onClick={unfollowUser}>Unfollow</button> :
                                        <button type="button" className="btn btn-sm btn-primary py-0" onClick={followUser}>Follow</button>}
                                </div>
                            </p>
                        </div>
                    </div>
                    <hr />
                    {
                        data.map((item, index) => {
                            return (
                                <div className="shadow-lg px-1 py-2 mb-4 bg-white rounded container" style={{ width: '60%' }} key={item._id}>
                                    <h3 className="container">{item.postedBy.name}</h3>
                                    <h5 className='container'>{item.title}</h5>
                                    <p className='container'>{item.body}</p>
                                    <img src={item.photo} alt="..." className='img-fluid container' style={{ height: "100%", width: "100%" }}></img>
                                    {item.likes.includes(state._id) ?
                                        <i className="fa-solid fa-thumbs-up my-2 mx-2" id={"thumb" + index} style={{ cursor: "pointer" }} onClick={() => {
                                            let elem = document.getElementById('thumb' + index);
                                            unlikePost(item._id)
                                            elem.classList.remove('fa-solid')
                                            elem.classList.add('fa-regular')
                                        }}></i>
                                        :
                                        <i className="fa-regular fa-thumbs-up my-2 mx-2" id={"thumb" + index} style={{ cursor: "pointer" }} onClick={() => {
                                            let elem = document.getElementById('thumb' + index);
                                            likePost(item._id)
                                            elem.classList.add('fa-solid')
                                            elem.classList.remove('fa-regular')
                                        }}></i>
                                    }
                                    <h5 className='container'>{item.likes.length}</h5>
                                    <form className="d-flex" onSubmit={(e) => {
                                        e.preventDefault()
                                        let txt = e.target[0].value
                                        if (txt) {
                                            commentPost(txt, item._id)
                                        }
                                        e.target[0].value = ""
                                    }}>
                                        <input className='container mx-2' placeholder='add a comment' />
                                        <button type="submit" className="btn btn-sm btn-primary">c</button>
                                    </form>
                                    <div class="accordion" id="accordionExample">
                                        <div class="card">
                                            <div class="card-header" id={"heading" + index}>
                                                <h5 class="mb-0">
                                                    <button class="btn btn-link" style={{ textDecoration: 'none' }} type="button" data-toggle="collapse" data-target={"#collapse" + index} aria-expanded="true" aria-controls={"collapse" + index}>
                                                        Comments
                                                    </button>
                                                </h5>
                                            </div>
                                            <div id={"collapse" + index} class="collapse" aria-labelledby={"heading" + index} data-parent="#accordionExample">
                                                <div class="card-body">
                                                    {
                                                        item.comments.map(record => {
                                                            return (
                                                                <div className='my-2 mx-2 p-2' style={{ border: "1px solid", borderRadius: "15px" }}>
                                                                    <h6><Link to={"/profile/" + record.commentedBy._id}>{record.commentedBy.name}</Link></h6>
                                                                    <p>{record.text}</p>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </>
                : <h1>loading...</h1>}
        </>
    )
}
