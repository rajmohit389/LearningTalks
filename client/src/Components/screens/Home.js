import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

export default function Home() {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch('/allposts', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    }).then(res => res.json()).then(result => {
      setData(result.posts);
    })
  }, [])

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

  return (
    <div className='mt-3'>
      {
        data.map((item, index) => {
          return (
            <div className="shadow-lg px-1 py-2 mb-4 bg-white rounded container" style={{ width: '70%' }} key={item._id}>
              <h3 className="container"><Link to={"/profile/" + item.postedBy._id}>{item.postedBy.name}</Link></h3>
              <h5 className='container'>{item.title}</h5>
              <p className='container'>{item.body}</p>
              <img src={item.photo} alt="..." className='img-fluid container' style={{ height: "100%",width:"100%" }}></img>
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
                elem.classList.remove('fa-regular')
                elem.classList.add('fa-solid')
              }}></i>
              }
              <h5 className='container'>{item.likes.length}</h5>
              <form className="d-flex" onSubmit={(e) => {
                e.preventDefault()
                let txt=e.target[0].value
                if(txt){
                  commentPost(txt, item._id)
                }
                e.target[0].value = ""
              }}>
                <input className='container mx-2' placeholder='add a comment' />
                <button type="submit" className="btn btn-sm btn-primary">c</button>
              </form>
              <div className="accordion" id="accordionExample">
                <div className="card">
                  <div className="card-header" id={"heading" + index}>
                    <h5 className="mb-0">
                      <button className="btn btn-link" style={{ textDecoration: 'none' }} type="button" data-toggle="collapse" data-target={"#collapse" + index} aria-expanded="true" aria-controls={"collapse" + index}>
                        Comments
                      </button>
                    </h5>
                  </div>
                  <div id={"collapse" + index} className="collapse" aria-labelledby={"heading" + index} data-parent="#accordionExample">
                    <div className="card-body">
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
    </div>
  )
}
