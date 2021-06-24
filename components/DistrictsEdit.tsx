import { faCog, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import PContext from "../services/context";
import Popup from "./Popup";

export default function DistrictsEdit(){
    const {districts,setDistricts,colors} = useContext(PContext);
    const [newDistricts,setNewDistricts] = useState(districts);
    const [showPopup,setShowPopup] = useState(false);
    const [addNum,setAddNum] = useState<number>(1);

    const addNDistricts = () =>{
        var arr = [];
        for(var i = 0;i<addNum;i++) arr.push(colors[i%colors.length]);
        setNewDistricts([...newDistricts,...arr]);
        setAddNum(1);
    }

    const renderDistricts = () =>{
        var arr = [];
        for(let i = 0;i<newDistricts.length;i++){
            arr.push(<li key={i} className="single-district">
                <div className="district-no">District {i+1}</div>
                <div className="color-box" style={{backgroundColor: `var(--${newDistricts[i]}-icon)`}}></div>
                <select 
                    value={newDistricts[i]}
                    onChange={(e)=>{
                        var nd = [...newDistricts];
                        nd[i] = e.target.value;
                        setNewDistricts(nd);
                    }}
                >
                    {colors.map(color=><option value={color}>{color}</option>)}
                </select>
                <button className="delete-district" onClick={()=>{
                    var nd = [...newDistricts];
                    nd.splice(i,1);
                    setNewDistricts(nd);
                }}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
            </li>)
        }
        return arr;
    }

    const saveChanges = () => {
        setDistricts(newDistricts);
        setShowPopup(false);
    }

    return <div>
        <button className="districts-button" onClick={()=>setShowPopup(true)}>{districts.length} Districts<FontAwesomeIcon icon={faCog}></FontAwesomeIcon></button>
        
        {showPopup&&<Popup>
            <div id="districts-popup">
                <button className="x-button" onClick={()=>setShowPopup(false)}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
                <div className="first-row">
                    <span>Add<input 
                            type="number"
                            value={addNum}
                            onChange={(e)=>setAddNum(Number(e.target.value))}
                            placeholder="#"
                        ></input>Districts
                    </span>
                    <button className="sb" onClick={addNDistricts}>Add</button>
                </div>
                <ul id="districts-list">
                    {renderDistricts()}
                </ul>
                <button className="sb" onClick={saveChanges}>Save Changes</button>
            </div>
        </Popup>}
    </div>
}