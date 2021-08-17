import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react"
import PContext from "../services/context"
import writeNum from "../services/writeNum";
import Popup from "./Popup";

export default function DistrictsList(){
    const {districts,districtPops,setViewAloneDistrict,viewAloneDistrict,algoState,pcSettings,setPcSettings,setPcState,parameters,pcState} = useContext(PContext);
    const [showParamPopup,setShowParamPopup] = useState<boolean>(false);

    const renderDistricts = ():any[] => {
        var arr = [];
        for(let i:number = 0;i<districts.length;i++){
            arr.push(<li key={i} className={viewAloneDistrict==(i+1)?"selected":""}>
                <div className="district-name row"><span>District {i+1}</span><span style={{backgroundColor: `var(--${districts[i]}-icon)`}} className="color-box"></span></div>
                <div className="population">Population: {writeNum(districtPops[i])}</div>
                {viewAloneDistrict==(i+1)?<button className="unselect" onClick={()=>setViewAloneDistrict(-1)}>Unselect</button>:<button className="view-alone" onClick={()=>setViewAloneDistrict(i+1)}>View Alone</button>}
                {districtPops[i]>0&&(algoState<0||algoState>3)&&(pcState<0||pcState>2)&&<div className="buttons row">
                    <button className="pack mr15" onClick={()=>{
                        let newObj = {...pcSettings};
                        newObj["isPacking"] = true;
                        newObj["district"] = i +1;
                        setPcSettings(newObj);
                        setShowParamPopup(true)
                    }}>Pack</button>
                    <button className='crack' onClick={()=>{
                        let newObj = {...pcSettings};
                        newObj["isPacking"] = false;
                        newObj["district"] = i +1;
                        setPcSettings(newObj);
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
                    let newObj = {...pcSettings};
                    newObj["parameter"] = i;
                    setPcSettings(newObj);
                    setPcState(0);//begin algorithm
                }}>{parameters[i]}</button>
            </li>)
        }
        return arr;
    }

    const setSpecifiedPcSetting = (settings:string[],value:any)=>{
        let newObj = {...pcSettings};
        settings.forEach(setting=>{
            newObj[setting] = value;
        })
        setPcSettings(newObj);
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
                <h5>{`${pcSettings["isPacking"]?"Packing ":"Cracking "} District ${pcSettings["district"]}`}</h5>
                <p>Select a Parameter</p>
                <ul className="params">
                    {renderParameters()}
                </ul>
            </div>
        </Popup>}
    </div>
}