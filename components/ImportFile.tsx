import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from "./Popup";
import Loading from "./Loading";
import PContext from "../services/context";

export default function SaveImport(){
    const {setData,data,parameters,colors,setParameters,setDistricts} = useContext(PContext);
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
            var count:number = 0;
            lines.forEach(line=>{
                count++;
                line.replace("\r","");
                let elements: any[] = line.split(",");
                if(elements.length==0) return;

                if(count==1){
                    let d:string[] = [];
                    let n:number = Math.round(Number(elements.shift()));
                    for(let i:number=0;i<n;i++) d.push(colors[i%colors.length]);
                    setDistricts(d);
                    setParameters(elements);
                }else{
                    let precinctName = elements.shift();//remove the precinct name
                    // next, move the population to index 1 from index 3 (how it used to be when input files were inserted)
                    let population = elements.splice(3,1);
                    elements.splice(1,0,population);
                    obj[precinctName] = [...elements].map(a=>Number(a));//then add the entire array
                }
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
                <p className="file-format"><span>FILE FORMAT</span> Plain text file (.txt), each line with comma separated values (CSV). For the first line, the order is: amount of districts, followed by all precincts listed in order.
                For subsequent lines, the order is: precinct name, then assigned district, then latitude, then longitude, then population, followed by all parameter values IN ORDER.</p>
                <div className="line-example"><span>EXAMPLE</span>Springfield,3451,40.1243,-78.5478,0.54,0.23,0.67 (last three are parameter values)</div>
                <div className="example-files">
                    <p>This is the same file format as the exported files. Find example files in The New Maps Project's Datastore. Please note that these files are purely for demonstrative purposes that the accuracy of the information cannot be guaranteed.
                    </p>
                    <div><a target="_blank" className="sample-files-link" href="/datastore">Datastore - Sample Files</a></div>
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