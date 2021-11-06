import { faArrowAltCircleLeft, faArrowAltCircleRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import PContext from "../services/context";
import options from "../services/datastoreOptions"
import getSuggestedAlgoSettings from "../services/getSuggestedAlgoSettings";
import readFileText from "../services/readFileText";
import Loading from "./Loading";
import Popup from "./Popup";

export default function HomeOptions({xFunction,isPopup,urlParams,showComponent}){
    const {colors,setDistricts,setParameters,setData,setMapZoom,algoSettings,setAlgoSettings,setAlgoState} = useContext(PContext);
    const [isLoading,setIsLoading] = useState(false);
    const [mouseX,setMouseX] = useState(0);
    const [mouseY,setMouseY] = useState(0);
    const [offsetX,setOffsetX] = useState(0);
    const [offsetY,setOffsetY] = useState(0);
    const [scrollOptions,setScrollOptions] = useState(0);
    const router = useRouter();
    const componentRef = useRef(null);

    //IF URL params are existent, then upload the data and run the algorithm (if specified)
    useEffect(()=>{
        console.log(urlParams)
        if(urlParams.map){
            var d = options[Number(urlParams.map)]
            selectMap(d.fileName,d.zoom,Boolean(urlParams.drawDistricts))
        }
    },[])

    useEffect(()=>{
        if(isPopup){
            setOffsetX(0);
            setOffsetY(0);
        }else if(componentRef){
            var rect = componentRef.current.getBoundingClientRect();
            console.log(rect);
            setOffsetX(rect.x);
            setOffsetY(rect.y);
        }

    },[isPopup,componentRef])

    const selectMap = async (fileName:string,zoom:object,runAlgo:boolean) => {
        //if clicked on a map on the homepage, then just redirect to editing suite
        if(!isPopup){
            //find index of the map in "options" array
            var num = 0;
            for(let i:number = 0;i<options.length;i++) if(options[i].fileName==fileName) num = i;

            router.push(`/editingsuite?map=${num}${runAlgo?"&drawDistricts=true":""}`)
            return;
        }

        //ELSE, load the file and run the algorithm
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
                setAlgoSettings(getSuggestedAlgoSettings(dataObj,algoSettings,0,0))

                //Step 4: Run the algorithm
                setAlgoState(0);
            }
        }catch(e){
            console.error(e);
        }

        setIsLoading(false);

        xFunction();
    }


    if(!showComponent) return <div>{isLoading&&<Popup>Loading...</Popup>}</div>;
    return <div className={`${isPopup?"gob":"homeOptions-container"}`} ref={componentRef}>
        {isLoading?<div className={`${isPopup?"popup":""}`}>Loading...</div>:<div id="home-popup" className={isPopup?"":"onHomepage"} >
        
        {isPopup
            ?<button className="x-button" onClick={()=>xFunction()}><FontAwesomeIcon icon={faTimes} className="sir"></FontAwesomeIcon></button>:<div
                className="arrows"
            >
                <button style={{opacity: scrollOptions==0?"0.5":"1"}} onClick={()=>{
                    if(scrollOptions>0) setScrollOptions(scrollOptions-1)
                }}>
                    <FontAwesomeIcon className="icon" icon={faArrowAltCircleLeft}></FontAwesomeIcon>
                </button> 
                <button style={{opacity: scrollOptions==options.length?"0.5":"1"}} onClick={()=>{
                    if(scrollOptions<options.length) setScrollOptions(scrollOptions+1)
                }}>
                    <FontAwesomeIcon className="icon" icon={faArrowAltCircleRight}></FontAwesomeIcon>
                </button>    
            </div>}
        <div className="top-section">
            <h3>Choose a Map to Get Started</h3>
            <p>Example data to show how The New Maps Project's website works (districts drawn using default settings)</p>
        </div>
        <div className="home-options-container">
            <ul style={!isPopup?{transform: `translateX(-${400*scrollOptions}px)`}:{}}>
                {options.map(d=>{
                    return <li className="map-option">
                        <div className="map-name">{d.name}</div>
                        <div className="map-districts">{d.districts}</div>
                        <div className="buttons">
                            <button className="draw-district sb" onMouseMove={(e)=>{
                                console.log(offsetY);
                                setMouseX(e.clientX+offsetX);
                                setMouseY(e.clientY+offsetY);
                            }}
                                onClick={()=>selectMap(d.fileName,d.zoom,true)}
                            >Draw the Districts
                                {isPopup&&<div style={{top: mouseY,left:mouseX}} className="hover-box">{d.runAlgoNotes||"Run Algorithm"}</div>}
                            </button>
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
