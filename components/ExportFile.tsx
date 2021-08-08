import { faDownload, faTable, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useState } from "react"
import PContext from "../services/context";
import Popup from "./Popup";

export default function ExportFile(){
    const {data} = useContext(PContext);
    const [showPopup,setShowPopup] = useState<boolean>(false);

    const setFile = () =>{
        setShowPopup(true);
    }

    return <div id="export">
        <button onClick={()=>setFile()} className="save-button">
            <FontAwesomeIcon
                className="save-icon"
                icon={faDownload}
            ></FontAwesomeIcon>
            Export
        </button>
        <Popup>
            <button className="x-button" onClick={()=>setShowPopup(false)}>
                <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </button>
        </Popup>
    </div>
}