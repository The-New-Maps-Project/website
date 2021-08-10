import { useContext } from "react";
import PContext from "../services/context";
import options from "../services/datastoreOptions"
import getSuggestedAlgoSettings from "../services/getSuggestedAlgoSettings";
import readFileText from "../services/readFileText";

export default function HomeOptions(){
    const {colors,setDistricts,setParameters,setData,setMapZoom,algoSettings,setAlgoSettings,setAlgoState} = useContext(PContext);

    const selectMap = async (fileName:string,zoom:object,runAlgo:boolean) => {
        //Step 1: set data
        var file = await fetch(`https://firebasestorage.googleapis.com/v0/b/weighty-forest-287112.appspot.com/o/allFiles%2F${fileName}?alt=media&token=6c22d4dd-b8c2-448f-b9ae-cba76098795e`);
        var text:string = await file.text();
        var dataObj:object = readFileText(text,colors,setDistricts,setParameters);
        setData(dataObj);
        
        //Step 2: zoom in
        setMapZoom(zoom);

        if(runAlgo){
            //Step 3: set suggested algorithm settings automatically
            setAlgoSettings(getSuggestedAlgoSettings(dataObj,algoSettings))

            //Step 4: Run the algorithm
            setAlgoState(1);
        }
    }

    return <div>
        <ul>
        {options.map(d=>{
            return <li className="map-option">
                <div className="map-name">{d.name}</div>
                <div className="map-districts">{d.districts}</div>
                <div className="buttons">
                    <button className="draw-district"
                        onClick={()=>selectMap(d.fileName,d.zoom,true)}
                    >Draw the Districts</button>
                    <button className="view-map"
                        onClick={()=>selectMap(d.fileName,d.zoom,false)}
                    >view the map</button>
                </div>
                <div className="map-info">{d.info}</div>
            </li>
        })}
        </ul>
    </div>
}