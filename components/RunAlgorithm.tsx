import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import algorithm from "../calculate/algorithm";
import PContext from "../services/context";
import getSuggestedAlgoSettings from "../services/getSuggestedAlgoSettings";
import Popup from "./Popup";

export default function RunAlgorithm(){
    const {districts,data,setData,setAlgoState,algoSettings,setAlgoSettings} = useContext(PContext); 
    const [showPopup,setShowPopup] = useState(false);
    const [tInput,setTInput] = useState<number>(95);

    useEffect(()=>{
        setAlgoSettings(getSuggestedAlgoSettings(data,algoSettings));
    },[data])

    const runAlgorithm = () =>{
        var n = districts.length;
        //var newObj = {...algorithm(data,n,tInput/100)};
        //setData(newObj);
        setAlgoState(1);
        setShowPopup(false);
    }

    const setSingleAlgoSetting = (algoSetting:string,val:any)=>{
        var res:object = {...algoSettings};
        res[algoSetting] = val;
        setAlgoSettings(res);

    }

    return <div>
        <button className="algorithm-button" onClick={()=>setShowPopup(true)}>
            Run Algorithm
        </button>
        
        {showPopup&&<Popup>
            <div id="algorithm-popup">
                <button className="x-button" onClick={()=>setShowPopup(false)}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
                <h5>Run Algorithm</h5>
                <p>The New Maps Project Algorithm - A good way to get started with creating a map</p>
                <p className="disclaimer"><span>Disclaimers:</span> The purpose of New Maps Project Algorithm is not to guarantee perfect maps
                    or optimize all possible statitics, rather it is a flexible tool to quickly draw first draft maps. Final maps should be edited to be 
                    optimized for each different scenario.
                </p>
                <p className="learn-more">Learn More: <a className="link" target="_blank" href="https://thenewmapsproject.org/docs">The New Maps Project Website</a></p>
                <div className="algo-area">


                    {!(districts.length<2)&&
                        <section id="algo-settings">
                            <h6>Config</h6>
                            <p className="description-note">Suggested values filled in</p>
                            <p className="numberInputArea">
                                <input
                                    type="number"
                                    value={algoSettings["interval1"]}
                                    onChange={e=>setSingleAlgoSetting("interval1",Number(e.target.value))}
                                ></input>ms between Round One {algoSettings["useSubiterations"]?"subiterations":"iterations"}
                            </p>
                            <div className="toggle-buttons">
                                <button onClick={e=>setSingleAlgoSetting("useSubiterations",true)} className={algoSettings["useSubiterations"]?"focus":""}>
                                    Subiterations
                                </button>
                                <button onClick={e=>setSingleAlgoSetting("useSubiterations",false)} className={algoSettings["useSubiterations"]?"":"focus"}>
                                    Full Iterations
                                </button>
                            </div>
                            <p className="description-note">
                                {algoSettings["useSubiterations"]?"Using subiterations for Round One, assigning one precinct at a time. NOT recommended for large amounts of data":"Using full iterations for Round One, assigning batches of precincts. Recommended for large amounts of data"}
                            </p>
                            <p className="numberInputArea">
                                <input
                                    type="number"
                                    value={algoSettings["interval2"]}
                                    onChange={e=>e=>setSingleAlgoSetting("interval2",Number(e.target.value))}
                                ></input>ms between Round Two iterations
                            </p>
                            <p className="numberInputArea">
                                Grid Granularity: 
                                <input
                                    type="number"
                                    className="ml15"
                                    value={algoSettings["gridGranularity"]}
                                    onChange={e=>setSingleAlgoSetting("gridGranularity",Number(e.target.value))}
                                ></input>
                            </p>
                            <p className="numberInputArea">
                                Round One: Graph every
                                <input
                                    type="number"
                                    className="mr15 ml15"
                                    value={algoSettings["graphInterval1"]}
                                    onChange={e=>setSingleAlgoSetting("graphInterval1",Number(e.target.value))}
                                ></input> iterations
                            </p>
                            <p className="numberInputArea">
                                Round Two: Graph every
                                <input
                                    type="number"
                                    className="mr15 ml15"
                                    value={algoSettings["graphInterval2"]}
                                    onChange={e=>setSingleAlgoSetting("graphInterval2",Number(e.target.value))}
                                ></input> iterations
                            </p>
                        </section>
                    }
                    
                    
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