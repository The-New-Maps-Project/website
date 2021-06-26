import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext, useState } from "react";
import { nmpAlgorithm } from "../calculate/algorithm/StatCalculate";
import PContext from "../services/context";
import Popup from "./Popup";

export default function RunAlgorithm(){
    const {districts,data,setData} = useContext(PContext); 
    const [showPopup,setShowPopup] = useState(false);
    const [tInput,setTInput] = useState<number>(95);

    const runAlgorithm = () =>{
        var n = districts.length;
        var newObj = {...nmpAlgorithm(data,n,tInput/100)};
        setData(newObj);
        setShowPopup(false);
    }

    return <div>
        <button className="algorithm-button" onClick={()=>setShowPopup(true)}>
            NMP Algorithm
        </button>
        
        {showPopup&&<Popup>
            <div id="algorithm-popup">
                <button className="x-button" onClick={()=>setShowPopup(false)}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
                <h5>Run NMP Algorithm</h5>
                <p>The New Maps Project Algorithm - A good way to get started with creating a map</p>
                <p className="disclaimer"><span>Disclaimer:</span> The purpose of New Maps Project Algorithm is not to guarantee perfect maps
                    or optimize all possible statitics, rather it is a flexible tool to quickly draw first draft maps. Final maps should be edited to be 
                    optimized for each different scenario.
                </p>
                <p className="learn-more">Learn More: <a className="link" target="_blank" href="https://thenewmapsproject.org/docs">The New Maps Project Website</a></p>
                <div className="algo-area">
                    {!(districts.length<2)&&<p className="threshold"><input
                        type="number"
                        min={0}
                        max={100}
                        value={tInput}
                        onChange={e=>setTInput(Number(e.target.value))}
                    ></input>% Threshold</p>}
                    <p>{districts.length} districts created</p>
                    {districts.length<2?
                        <p>Must have 2 or more districts to run algorithm</p>:
                        <button className="sb" onClick={runAlgorithm}>Run Algorithm</button>
                    }
                </div>
                
            </div>
        </Popup>}

    </div>
}