import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import PContext from "../services/context";
import Popup from "./Popup";

// PROPS: Function() xFunction, Number currentDistrict, Function(Number) selectDistrict
export default function SwitchPopup(props){
    const {districts} = useContext(PContext);

    const renderDistricts = () =>{
        var arr = [];
        for(let i = 0;i<=districts.length;i++){
            arr.push(<li key={i}>
                <button className="select-district tb" onClick={()=>selectDistrict(i)}>
                    <span className="color-circle" style={{backgroundColor: i==0?"var(--grey-icon)":`var(--${districts[i-1]}-icon)`}}></span>
                    {i==0?"Unassign":`District ${i}`}
                </button>
            </li>)
        }
        return arr;
    }

    const selectDistrict = (districtNo:number)=>{
        if(!props.selectDistrict||typeof props.selectDistrict!="function") return;
        props.selectDistrict(districtNo);
        props.xFunction();
    }

    return <Popup>
        <div id="switch-popup">
            <button className="x-button" onClick={props.xFunction}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
            {props.currentDistrict?<p className="current-district">Current District: 
                <span className="color-circle" style={{backgroundColor: `var(--${districts[props.currentDistrict-1]}-icon)`}}></span>
                <span className="current-district">District {props.currentDistrict}</span>
            </p>:""}
            <h5>{props.currentDistrict==0||!props.currentDistrict?"Assign":"Switch"} District</h5>
            <ul id="switch-list">
               {renderDistricts()} 
            </ul>
        </div>
    </Popup>
}