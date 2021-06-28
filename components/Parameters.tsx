import { useContext, useState } from "react"
import PContext from "../services/context"
import { faTimes, faPlusCircle, faCogs, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Popup from "./Popup";

export default function Parameters(){
    const {parameters,setParameters} = useContext(PContext);
    const [addPopup,setAddPopup] = useState(false);
    const [newInput,setNewInput] = useState("");

    const addParam = () =>{
        setParameters([...parameters,newInput]);
        setAddPopup(false);
        setNewInput("");
    }

    return <div id="parameters">
        <div className="first-row"><h4>Parameters</h4><button className="plus-button" onClick={()=>setAddPopup(true)}><FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon></button></div>
        <ul id="p-list">
            {parameters.map(p=>{
                return <li className="param" key={p}>
                    {p}
                    <div className="p-settings">
                        <FontAwesomeIcon className="cogs" icon={faCogs}></FontAwesomeIcon>
                        <div className="p-settings-display">
                            <button className="x-button" onClick={()=>{
                                var newParams = [...parameters].filter(a=>a!=p);
                                setParameters(newParams);
                            }}>
                                <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                            </button>
                            <button className="l-arrow" onClick={()=>{
                                var i = parameters.indexOf(p);
                                if(i>=1) {
                                    console.log(i);
                                    var arr =[...parameters]
                                    arr.splice(i-1,2,parameters[i],parameters[i-1]);
                                    console.log(arr);
                                    setParameters(arr);
                                }
                                
                            }}><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon></button>
                            <button className="-arrow" onClick={()=>{
                                var i = parameters.indexOf(p);
                                if(i<parameters.length-1) {
                                    var arr = [...parameters]
                                    arr.splice(i,2,parameters[i+1],parameters[i]);
                                    console.log(arr);
                                    setParameters(arr);
                                }
                            }}><FontAwesomeIcon icon={faCaretRight}></FontAwesomeIcon></button>
                        </div>
                    </div>
                    </li>
            })}
        </ul>

        {addPopup&&<Popup><div className="new-param">
            <button className="x-button" onClick={()=>setAddPopup(false)}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
            <h4>Add a Parameter</h4>
            <p>Program parameters are demographic characteristics of a precinct. Parameters MUST
                be proportion values, represented as a decimal {"(0 < P < 1)"}.
            </p>
            <input
                onChange={(e)=>setNewInput(e.target.value)}
                value={newInput}
                placeholder="New Parameter"
                className="new-param-input" 
            ></input>
            <button className="sb" onClick={addParam}>Add Parameter</button>
        </div></Popup>}
    </div>
}