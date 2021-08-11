import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import PContext from "../services/context";
import options from "../services/datastoreOptions"
import getSuggestedAlgoSettings from "../services/getSuggestedAlgoSettings";
import readFileText from "../services/readFileText";
import Loading from "./Loading";
import Popup from "./Popup";

export default function HomeOptions({xFunction}){
    const {colors,setDistricts,setParameters,setData,setMapZoom,algoSettings,setAlgoSettings,setAlgoState} = useContext(PContext);
    const [isLoading,setIsLoading] = useState(false);

    const selectMap = async (fileName:string,zoom:object,runAlgo:boolean) => {
        setIsLoading(true);
        try{
             //Step 1: zoom in
             setMapZoom(zoom);

            //Step 2: set data
            try{
                var file = await fetch(`https://firebasestorage.googleapis.com/v0/b/weighty-forest-287112.appspot.com/o/allFiles%2F${fileName}?alt=media&token=6c22d4dd-b8c2-448f-b9ae-cba76098795e`);
            }catch(e){
                console.error(e);
               
            }
            if(file.status!=200) {
                setIsLoading(false);
                xFunction();
                return;
            }
            var text:string = await file.text();
            var dataObj:object = readFileText(text,colors,setDistricts,setParameters);
            setData(dataObj);
        

            if(runAlgo){
                //Step 3: set suggested algorithm settings automatically
                setAlgoSettings(getSuggestedAlgoSettings(dataObj,algoSettings))

                //Step 4: Run the algorithm
                setAlgoState(1);
            }
        }catch(e){
            console.error(e);
        }

        setIsLoading(false);

        xFunction();
    }

    return <div className="gob">
        {isLoading?<div className="popup">Loading...</div>:<div id="home-popup">
        
        <button className="x-button" onClick={()=>xFunction()}><FontAwesomeIcon icon={faTimes} className="sir"></FontAwesomeIcon></button>
        <div className="top-section">
            <h3>Choose a Map to Get Started</h3>
            <p>Example data to show how The New Maps Project's website works</p>
        </div>
        <div className="home-options-container">
            <ul>
                {options.map(d=>{
                    return <li className="map-option">
                        <div className="map-name">{d.name}</div>
                        <div className="map-districts">{d.districts}</div>
                        <div className="buttons">
                            <button className="draw-district sb"
                                onClick={()=>selectMap(d.fileName,d.zoom,true)}
                            >Draw the Districts</button>
                            <button className="view-map tb"
                                onClick={()=>selectMap(d.fileName,d.zoom,false)}
                            >view the map</button>
                        </div>
                        <div className="map-info">{d.info}</div>
                    </li>
                })}
            </ul>
        </div>
    </div>
        }
        

    </div>
    
    
}