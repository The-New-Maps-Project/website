import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react"
import PContext from "../services/context"
import writeNum from "../services/writeNum";
import Popup from "./Popup";

export default function DistrictsList(){
    const {districts,districtPops,setViewAloneDistrict,viewAloneDistrict,algoState,algoSettings,setAlgoSettings,setPcState,parameters} = useContext(PContext);
    const [showParamPopup,setShowParamPopup] = useState<boolean>(false);

    const renderDistricts = ():any[] => {
        var arr = [];
        for(let i:number = 0;i<districts.length;i++){
            arr.push(<li key={i} className={viewAloneDistrict==(i+1)?"selected":""}>
                <div className="district-name row"><span>District {i+1}</span><span style={{backgroundColor: `var(--${districts[i]}-icon)`}} className="color-box"></span></div>
                <div className="population">Population: {writeNum(districtPops[i])}</div>
                {viewAloneDistrict==(i+1)?<button className="unselect" onClick={()=>setViewAloneDistrict(-1)}>Unselect</button>:<button className="view-alone" onClick={()=>setViewAloneDistrict(i+1)}>View Alone</button>}
                {districtPops[i]>0&&(algoState<0)&&<div className="buttons row">
                    <button className="pack mr15" onClick={()=>{
                        let newObj = {...algoSettings};
                        newObj["type"] = 1;
                        newObj["district"] = i +1;
                        setAlgoSettings(newObj);
                        setShowParamPopup(true)
                    }}>Pack</button>
                    <button className='crack' onClick={()=>{
                        let newObj = {...algoSettings};
                        newObj["type"] = 2;
                        newObj["district"] = i +1;
                        setAlgoSettings(newObj);
                        setShowParamPopup(true)
                    }}>Crack</button>
                </div>}
            </li>)
        }
        return arr;
    }

    const renderParameters = ():any[] => {
        var arr = [];
        for(let i:number = 0;i<parameters.length;i++){
            arr.push(<li key={i}>
                <button onClick={()=>{
                    setShowParamPopup(false);
                    setSingleAlgoSetting("parameter",i);
                    setPcState(0);//begin algorithm
                }}>{parameters[i]}</button>
            </li>)
        }
        return arr;
    }

    const setSingleAlgoSetting = (setting:string,value:any) => {
        let newObj = {...algoSettings};
        newObj[setting] = value;
        setAlgoSettings(newObj);
    }

    return<div id="districts-list1">
        <ul id="dl-ul">
            {renderDistricts()}
        </ul>

        {showParamPopup&&<Popup>
            <button className="x-button" onClick={()=>setShowParamPopup(false)}>
                <FontAwesomeIcon icon={faTimes} className="sir"></FontAwesomeIcon>
            </button>
            <div id="pc-select-param">
                <h5>{`${algoSettings["type"]==1?"Packing ":"Cracking "} District ${algoSettings["district"]}`}</h5>
                <ul className="algoSettings">
                    <li>
                        <input
                            onChange={(e)=>setSingleAlgoSetting("intervalConnecting",Number(e.target.value))}
                            type="number"
                            value={algoSettings["intervalConnecting"]}
                        ></input>ms between Precinct Connecting Round iterations
                    </li>
                    <li>
                        <input
                            onChange={(e)=>setSingleAlgoSetting("interval1",Number(e.target.value))}
                            type="number"
                            value={algoSettings["interval1"]}
                        ></input>ms between packing/cracking iterations
                    </li>
                </ul>
                <p>Select a Parameter</p>
                <ul className="params">
                    {renderParameters()}
                </ul>
            </div>
        </Popup>}
    </div>
}