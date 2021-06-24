import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import PContext from "../services/context";
import Popup from "./Popup";

export default function SwitchPopup(props){
    const {districts} = useContext(PContext);

    const renderDistricts = () =>{
        var arr = [];
        for(let i = 0;i<districts.length;i++){
            arr.push(<li key={i}>
                <button className="select-district tb" onClick={()=>selectDistrict(i+1)}>
                    <span className="color-circle" style={{backgroundColor: `var(--${districts[i]}-icon)`}}></span>
                    District {i+1}
                </button>
            </li>)
        }
        return arr;
    }

    const selectDistrict = (districtNo:number)=>{
        if(!props.selectDistrict||typeof props.selectDistrict!="function") return;
        console.log("is a function");
        props.selectDistrict(districtNo);
    }

    return <Popup>
        <div id="switch-popup">
            <button className="x-button" onClick={props.xFunction}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
            {props.currentDistrict?<p className="current-district">Current District: 
                <span className="color-circle" style={{backgroundColor: `var(--${districts[props.currentDistrict-1]}-icon)`}}></span>
                <span className="current-district">District {props.currentDistrict}</span>
            </p>:""}
            <h5>{props.currentDistrict==0?"Assign":"Switch"} District</h5>
            <ul id="switch-list">
               {renderDistricts()} 
            </ul>
        </div>
    </Popup>
}