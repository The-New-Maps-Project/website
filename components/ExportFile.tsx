import { faDownload, faTable, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useState } from "react"
import PContext from "../services/context";
import Popup from "./Popup";

export default function ExportFile(){
    const {data,districts,parameters} = useContext(PContext);
    const [showPopup,setShowPopup] = useState<boolean>(false);
    const [filename,setFilename] = useState<string>("NMPMap");
    const [url,setUrl] = useState<string>("");

    const setFile = () =>{
        setShowPopup(true);
        var text:string = "";

        //Step 1: add the first line: district, param1, param2 ...
        text += String(districts.length);
        for(let i:number = 0;i<parameters.length;i++) text += "," + parameters[i];
        text += "\n";

        //Step 2: add all the precincts
        Object.keys(data).forEach(key=>{
            let thisLine:string = "";
            let thisValues:number[] = data[key];
            if(!thisValues||thisValues.length==0) return;
            //Precinct Name first
            thisLine += key + ",";

            //Then assigned district
            thisLine += thisValues[0] + ",";

            //Then lat and lng
            thisLine += thisValues[2] + ",";
            thisLine += thisValues[3] + ",";

            //Then population
            thisLine += thisValues[1] + ",";

            //Then all parameters in order, startin at index 4 (5th number in list)
            for(let i:number = 4; i<thisValues.length;i++){
                thisLine += thisValues[i] + ",";
            }

            //Remove last comma
            thisLine = thisLine.substring(0,thisLine.length-1);

            //Finally add to full text, and break to next line
            text += thisLine + "\n";
        })

        var blob:Blob = new Blob([text], {type: 'text/plain'});
        var url = window.URL.createObjectURL(blob);
        setUrl(url);
    }

    return <div id="export">
        <button onClick={()=>setFile()} className="export-button">
            <FontAwesomeIcon
                className="save-icon"
                icon={faDownload}
            ></FontAwesomeIcon>
            Export
        </button>
        {showPopup&&<Popup>
            <div className="export-popup">
                <button className="x-button" onClick={()=>setShowPopup(false)}>
                    <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                </button>  
                <section>
                <h5>Export to a File</h5>
                <p>Download a file with all the data to save changes and import next time</p>
                <p className="file-format"><span>FILE FORMAT</span> Plain text file (.txt), each line with comma separated values (CSV). For the first line, the order is: amount of districts, followed by all precincts listed in order.
                For subsequent lines, the order is: precinct name, then assigned district, then latitude, then longitude, then population, followed by all parameter values IN ORDER.</p>
                <div className="line-example"><span>EXAMPLE</span>Springfield,3451,40.1243,-78.5478,0.54,0.23,0.67 (last three are parameter values)</div>
                <div className="example-files">
                    <p>This is the same file format as the imported files. You can import this file next time to save your data
                    </p>
                </div>
                    {url&&<a id="download-link" href={url} download={filename}>Download File (plain text)</a>}
                </section>
            </div>
        </Popup>}
    </div>
}