import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from "./Popup";
import Loading from "./Loading";
import PContext from "../services/context";

export default function SaveImport(){
    const {setData,data} = useContext(PContext);
    const [showPopup,setShowPopup] = useState<boolean>(false);
    const [isImporting,setIsImporting] = useState<boolean>(false);
    //const [fileReader,setFileReader] = useState<FileReader>(null);

    const setupFileRead = (e) =>{
        if(!e.target||!e.target.files||!e.target.files[0]) return;
        //Set the "file" variable
        const file = e.target.files[0];
        setIsImporting(true);

        //Set up the file reader
        const fr = new FileReader();
        // setFileReader(fr);
        fr.readAsText(file);


        //Declare functions inside this function, so fr exists

        const readFile = () =>{
            var obj = {};
            var lines:string[] = String(fr.result).split("\n");
            lines.forEach(line=>{
                line.replace("\r","");
                let elements: any[] = line.split(",");
                let precinctName = elements[0];
                elements[0] = 0;
                obj[precinctName] = [...elements];

            })
            setData({...data,...obj});
            setIsImporting(false);
            setShowPopup(false);
        }

        const fileReadError = () =>{
            setIsImporting(false);
        }

        //Then, set the functions for onload and onerror
        fr.onload = readFile;
        fr.onerror = fileReadError;
    }

    

    return <div>
        <button onClick={()=>setShowPopup(true)}className="import-button">
            Import Data
            <FontAwesomeIcon className="plus-icon" icon={faPlus}></FontAwesomeIcon>
        </button>

        {showPopup&&<Popup>
            <div id="import-popup">
                <button className="x-button" onClick={()=>setShowPopup(false)}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
                <h5>Import A File</h5>
                <div>
                    <input
                        type="file"
                        onChange={setupFileRead}
                    ></input>
                </div>
                {isImporting&&<Loading></Loading>}
            </div>
        </Popup>}
    </div>
}