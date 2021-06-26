import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from "./Popup";
import Loading from "./Loading";
import PContext from "../services/context";

export default function SaveImport(){
    const {setData,data,parameters} = useContext(PContext);
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
                obj[precinctName] = [...elements].map(a=>Number(a));

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
                <p className="file-format"><span>FILE FORMAT</span> Plain text file (.txt), each line with comma separated values (CSV). 
                The order is: precinct name, then population, then latitude, then longitude, followed by all parameter values IN ORDER.</p>
                <div className="line-example"><span>EXAMPLE</span>Springfield,3451,40.1243,-78.5478,0.54,0.23,0.67 (last three are parameter values)</div>
                <div className="example-files">
                    <p>This is the same file format as the NMP Algorithm input. Find example files on the New Maps Project Website. Please note that 
                        these are just sample files and do NOT have up to date data. These files also don't have any parameter values. It is 
                        recommended that you import your own data.
                    </p>
                    <div><a target="_blank" className="sample-files-link" href="https://thenewmapsproject.org/datastore">Sample Files</a> Look under "Sample Input Files" for the algorithm.</div>
                </div>
                {parameters.length>1&&<div className="order-box">
                    <p>Param Order:</p>
                    <ol>
                        {parameters.map(p=><li>{p}</li>)}
                    </ol>
                </div>}
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