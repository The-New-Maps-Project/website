import { faCheckCircle, faCircle, faEllipsisH, faMapMarkedAlt, faMapMarker, faMapSigns, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useContext, useRef, useState,useEffect } from "react"
import PContext from "../services/context";
import { Bar, Line } from "react-chartjs-2"
import PackandCrack from "../calculate/classes/PackandCrack";

export default function PackCrack(){
    const [dragStyles,setDragStyles] = useState({});
    const {pcData,setPcData,pcSettings,pcState,setPcState,pcFocus,setPcFocus,connectingData,setConnectingData,data,districts,setData} = useContext(PContext);
    const [diffX,setDiffX] = useState<number>(0);
    const [diffY,setDiffY] = useState<number>(0);
    const [isDragging,setIsDragging] = useState<boolean>(false);
    const [connectingRoundGraph,setConnectingRoundGraph] = useState<any>(null);
    const [pcGraph,setPcGraph] = useState<any>(null);
    const packandcrack = useRef<PackandCrack|null>(null);

    const dragStart = (e) =>{
        setDiffX(e.pageX - e.target.getBoundingClientRect().left)
        setDiffY(e.pageY - e.target.getBoundingClientRect().top)
        setIsDragging(true);
    }

    useEffect(()=>{

        //clean up all data
        setPcData([]);
        setConnectingData([]);

        //then start the simulation
        packandcrack.current = new PackandCrack(data,districts.length,setData,setConnectingData,setPcData,setPcState,setPcFocus,pcSettings);
        packandcrack.current.start();
    },[])//IMPORTANT that it is an empty array, must only run this ONCE, and NOT on every re-render


    useEffect(()=>{
        window.onmouseup = ()=>{
            setIsDragging(false);
        }
    },[])

    const dragging = (e) => {
        if(!isDragging) return;
        var left = window.scrollX + e.pageX - diffX;
        var top = window.scrollY + e.pageY - diffY;

        setDragStyles({
            top: top,
            left: left,
        })
    }

    const dragEnd = () => {
        setIsDragging(false);
    }

    const terminate = ()=>{
        packandcrack.current.terminate();
        packandcrack.current = null;
        setPcState(-1);
    }

    const renderRoundStateIcon = (round:number) => {
        if(round < pcState) return <FontAwesomeIcon className="roundStateIcon green" icon={faCheckCircle}></FontAwesomeIcon>
        if(round == pcState) return <FontAwesomeIcon className="roundStateIcon black" icon={faEllipsisH}></FontAwesomeIcon>
        return <FontAwesomeIcon className="roundStateIcon grey" icon={faCircle}></FontAwesomeIcon>
    }

    const setPcFocusIfNotSet = (n:number) => {
        if(pcFocus!=n) setPcFocus(n);
    }


    return <div id="packcrack-container"  style={dragStyles} >
        <div id="algorithm-header" onMouseDown={dragStart} onMouseMove={dragging} onMouseUp={dragEnd}>
            <h4><FontAwesomeIcon icon={pcSettings["isPacking"]?faMapMarker:faMapSigns} className="icon"></FontAwesomeIcon>{`${pcSettings["isPacking"]?"Pack ":"Crack "}District ${pcSettings["district"]}`}<Link href="/documentation/packandcrack"><a className="link" target="_blank">how it works</a></Link></h4>
            <button className="terminate-button" onClick={terminate}>{pcState>=3?<FontAwesomeIcon icon={faTimes} className="sir"></FontAwesomeIcon>:"Terminate"}</button>
        </div>
        <section id="connectinground" className={pcFocus==0?"focused":"clickable"} onClick={()=>setPcFocusIfNotSet(0)}>
            <div className="round-header">
                <h5>Connecting Precincts</h5>
                {renderRoundStateIcon(0)}
            </div>
            {pcFocus!==0?<div className="round-subheader">
                <span>Iterations: {connectingData.length}</span>
                <span>Changed: {connectingData.length==0?0:(connectingData[connectingData.length-1]).toFixed(0)}</span>
            </div>:<div className="round-body">
                {connectingRoundGraph}
                <div className="round-footer">
                    <span className="iterations">Iterations: {connectingData.length}</span>
                    <span className="main-value">Changed: {connectingData.length==0?0:(connectingData[connectingData.length-1]).toFixed(0)}</span>
                </div>
            </div>}
        </section>
        <hr></hr>
        <section id="connectinground" className={pcFocus==0?"focused":"clickable"} onClick={()=>setPcFocusIfNotSet(0)}>
            <div className="round-header">
                <h5>{`${pcSettings["isPacking"]?"Pack ":"Crack "} District ${pcSettings["district"]}`}</h5>
                {renderRoundStateIcon(0)}
            </div>
            {pcFocus!==0?<div className="round-subheader">
                <span>Iterations: {pcData.length}</span>
                <span>Changed: {pcData.length==0?0:(pcData[pcData.length-1]).toFixed(0)}</span>
            </div>:<div className="round-body">
                {pcGraph}
                <div className="round-footer">
                    <span className="iterations">Iterations: {pcData.length}</span>
                    <span className="main-value">Changed: {pcData.length==0?0:(pcData[pcData.length-1]).toFixed(0)}</span>
                </div>
            </div>}
        </section>
        <hr></hr>
        <section id="roundthree" className={pcFocus==3?"focused":"clickable"} onClick={()=>setPcFocusIfNotSet(2)}>
            <div className="round-header">
                <h5>Finished</h5>
                {renderRoundStateIcon(3)}
            </div>
            {pcFocus==2&&<div>
                {pcState>=2?<div>
                    <p>The algorithm has finished running! Here are some next steps:</p>
                    <ol>
                        <li>Click on the rounds to view data and graphs from</li>
                        <li>Click "Calculate Stats" below to see data on population distribution, representation, and compactness of this map</li>
                        <li>Interact with the map and change district assignments for precincts. Click on a precinct on the map, or search the righthand list. Edit the map until you are satified with the outcome</li>
                        <li>Export the data to a file so you can import this exact map next time</li>
                    </ol>
                    <button className="sb" onClick={terminate}>Done</button>
                </div>:<div>The algorithm is still in progress</div>}
            </div>}
        </section>
    </div>
}