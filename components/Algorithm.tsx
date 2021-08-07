import { faCheckCircle, faCircle, faEllipsisH, faMapMarkedAlt, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useContext, useEffect, useRef, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import Simulate from "../calculate/classes/Simulate"
import PContext from "../services/context"

export default function Algorithm(){
    const {algoState,algoFocus,round1Data,round2Data,setAlgoState,setRound1Data,setRound2Data,districtPops,algoSettings,data,districts,setData,setAlgoFocus,setDistrictPops} = useContext(PContext)
    const [round1Graph,setRound1Graph] = useState<any>(null);
    const [round2Graph,setRound2Graph] = useState<any>(null);
    const [barGraph,setBarGraph] = useState<any>(null);
    const simulate = useRef<Simulate|null>(null);

    const [diffX,setDiffX] = useState<number>(0);
    const [diffY,setDiffY] = useState<number>(0);
    const [isDragging,setIsDragging] = useState<boolean>(false);
    const [dragStyles,setDragStyles] = useState<object>({})

    useEffect(()=>{

        //clean up all data
        setRound1Data([]);
        setRound2Data([]);

        //then start the simulation
        simulate.current = new Simulate(data,districts.length,setData,setRound1Data,setRound2Data,setAlgoState,setAlgoFocus,setDistrictPops,algoSettings);
        simulate.current.start();
    },[])//IMPORTANT that it is an empty array, must only run this ONCE, and NOT on every re-render


    useEffect(()=>{
        var data:number[] = []; 
        setRound1Graph(renderLineGraph(round1Data,algoSettings["graphInterval1"]));
    },[round1Data])
 
    useEffect(()=>{
        setRound2Graph(renderLineGraph(round2Data,algoSettings["graphInterval2"]))
    },[round2Data]);

    useEffect(()=>{
        setBarGraph(renderBarGraph(districtPops));
    },[districtPops])

    const renderRoundStateIcon = (round:number) => {
        if(round < algoState) return <FontAwesomeIcon className="roundStateIcon green" icon={faCheckCircle}></FontAwesomeIcon>
        if(round == algoState) return <FontAwesomeIcon className="roundStateIcon black" icon={faEllipsisH}></FontAwesomeIcon>
        return <FontAwesomeIcon className="roundStateIcon grey" icon={faCircle}></FontAwesomeIcon>
    }

    const renderLineGraph = (data:number[],interval:number) => {
        if(data.length==0) return;
        let numbers:string[] = [];
        let res:number[] = [];
        let lastNum:number = 0;
        for(let i:number=0;i<data.length;i+=interval){
            numbers.push(String(i+1));
            res.push(data[i]);
            lastNum = i;
        }
        if(lastNum <data.length-1){
            numbers.push(String(data.length));
            res.push(data[data.length-1]);
        }

        let chartData = {
            labels: numbers,
            datasets: [{
                data: res,
                backgroundColor: "#949010",
                borderColor: "#000000"
            }],
        }
        const options = {
            indexAxis: "x",
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
            elements: {
                bar: {
                },
            },
            responsive: false,
            plugins: {
                legend: {
                position: "top",
                },
                title: {
                display: false,
                },
            },
            
                animation: {
                    duration: 0
                }
            
        }
        return <Line
            type="line"
            className="linegraph"
            data={chartData}
            options={options}
        ></Line>
    }

    const renderBarGraph = (data:number[]) => {
        if(data.length==0) return;
        let labels:string[] = [];
        //start at 1
        for(let i:number=1;i<=data.length;i++) labels.push("District "+String((i)));

        let chartData = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: "#949010",
                borderColor: "#000000"
            }],
        }
        const options = {
            indexAxis: "x",
            animation: {
                duration: 0
            }
        }
        return <Bar
            type="bar"
            className="linegraph"
            data={chartData}
            options={options}
        ></Bar>
    }

    const setAlgoFocusIfNotSet = (n:number) => {
        if(algoFocus!=n) setAlgoFocus(n);
    }

    const dragStart = (e) =>{
        setDiffX(e.screenX - e.target.getBoundingClientRect().left)
        setDiffY(e.screenY - e.target.getBoundingClientRect().top)
        setIsDragging(true);
    }

    const dragging = (e) => {
        if(!isDragging) return;
        var left = e.screenX - diffX;
        var top = e.screenY - diffY;

        setDragStyles({
            top: top,
            left: left,
        })
    }

    const dragEnd = () => {
        setIsDragging(false);
    }

    return  <div id="algorithm-container"  style={dragStyles}>
        <div id="algorithm-header" onMouseDown={dragStart} onMouseMove={dragging} onMouseUp={dragEnd}>
            <h4><FontAwesomeIcon icon={faMapMarkedAlt} className="icon"></FontAwesomeIcon>Algorithm <Link href="/documentation/algorithm"><a className="link" target="_blank">how it works</a></Link></h4>
            <button className="terminate-button" onClick={()=>{
                simulate.current.terminate();
                simulate.current = null;
                setAlgoState(0)
            }}>{algoState>=3?<FontAwesomeIcon icon={faTimes} className="sir"></FontAwesomeIcon>:"Terminate"}</button>
        </div>
        <section id="roundone" className={algoFocus==1?"focused":"clickable"} onClick={()=>setAlgoFocusIfNotSet(1)}>
            <div className="round-header">
                <h5>Round One</h5>
                {renderRoundStateIcon(1)}
            </div>
            {algoFocus!==1?<div className="round-subheader">
                <span>Iterations: {round1Data.length}</span>
                <span>% Unchanged: {round1Data.length==0?0:(round1Data[round1Data.length-1]*100).toFixed(2)}% </span>
            </div>:<div className="round-body">
                {round1Graph}
                <div className="round-footer">
                    <span className="iterations">Iterations: {round1Data.length}</span>
                    <span className="main-value">% Unchanged: {round1Data.length==0?0:(round1Data[round1Data.length-1]*100).toFixed(2)}%</span>
                </div>
            </div>}
        </section>
        <hr></hr>
        <section id="roundtwo" className={algoFocus==2?"focused":"clickable"} onClick={()=>setAlgoFocusIfNotSet(2)}>
            <div className="round-header">
                <h5>Round Two</h5>
                {renderRoundStateIcon(2)}
            </div>
            {algoFocus!==2?<div className="round-subheader">
                <span>Iterations: {round2Data.length}</span>
                <span>RSD: {round2Data.length==0?"N/A":(round2Data[round2Data.length-1]*100).toFixed(2)+"%"} </span>
            </div>:<div className="round-body">
                {round2Graph}
                {barGraph}
                <div className="round-footer">
                    <span className="iterations">Iterations: {round2Data.length}</span>
                    <span className="main-value">RSD: {round2Data.length==0?"N/A":(round2Data[round2Data.length-1]*100).toFixed(2)+"%"} </span>
                </div>
            </div>}
        </section>
        <hr></hr>
        <section id="roundthree" className={algoFocus==3?"focused":"clickable"} onClick={()=>setAlgoFocusIfNotSet(3)}>
            <div className="round-header">
                <h5>Finished</h5>
                {renderRoundStateIcon(3)}
            </div>
        </section>
    </div>
}