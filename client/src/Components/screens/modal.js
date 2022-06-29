import React,{useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageContext,FlagContext } from '../../App';

export default function Modal({path}) {
    const navigate=useNavigate();
    const { flag, setFlag } = useContext(FlagContext);
    const {message,setMessage}=useContext(MessageContext);
    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{message}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=>{
                            if(flag){
                                navigate(path);
                                setFlag({type:"change",newflag:false});
                            }
                            setMessage({type:"change",newValue:""});
                            }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
