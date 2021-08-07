import { faCheckCircle, faCircle, faEllipsisH } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useRef, useState } from "react"
import { Line } from "react-chartjs-2"
import Simulate from "../calculate/classes/Simulate"
import PContext from "../services/context"

export default function Algorithm(){
    const {algoState,algoFocus,round1Data,round2Data,setAlgoState,setRound1Data,setRound2Data,algoSettings,data,districts,setData,setAlgoFocus} = useContext(PContext)
    const [round1Graph,setRound1Graph] = useState<any>(null);
    const [round2Graph,setRound2Graph] = useState<any>(null);
    const simulate = useRef<Simulate|null>(null);

    useEffect(()=>{

        //clean up all data
        setRound1Data([]);
        setRound2Data([]);

        //then start the simulation
        simulate.current = new Simulate(data,districts.length,setData,setRound1Data,setRound2Data,setAlgoState,setAlgoFocus,algoSettings);
        simulate.current.start();
    },[])//IMPORTANT that it is an empty array, must only run this ONCE, and NOT on every re-render


    useEffect(()=>{
        setRound1Graph(renderLineGraph(round1Data));
    },[round1Data])
 
    useEffect(()=>{
        setRound2Graph(renderLineGraph(round2Data))
    },[round2Data]);

    const renderRoundStateIcon = (round:number) => {
        if(round < algoState) return <FontAwesomeIcon className="roundStateIcon green" icon={faCheckCircle}></FontAwesomeIcon>
        if(round == algoState) return <FontAwesomeIcon className="roundStateIcon black" icon={faEllipsisH}></FontAwesomeIcon>
        return <FontAwesomeIcon className="roundStateIcon grey" icon={faCircle}></FontAwesomeIcon>
    }

    const renderLineGraph = (data:number[]) => {
        if(data.length==0) return;
        let numbers:string[] = [];
        for(let i:number=0;i<data.length;i++) numbers[i] = String(i+1);
        let chartData = {
            labels: numbers,
            datasets: [{
                data: data,
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

    const setAlgoFocusIfNotSet = (n:number) => {
        if(algoFocus!=n) setAlgoFocus(n);
    }

    return  <div id="algorithm-container">
        <section id="roundone" className={algoFocus==1?"focused":"clickable"} onClick={()=>setAlgoFocusIfNotSet(1)}>
            <div className="round-header">
                <h5>Round One</h5>
                {renderRoundStateIcon(1)}
            </div>
            {algoFocus!==1?<div className="round-subheader">
                <span>Iterations: {round1Data.length}</span>
                <span>Percent Unchanged: {round1Data.length==0?0:(round1Data[round1Data.length-1]*100).toFixed(2)} </span>
            </div>:<div className="round-body">
                {round1Graph}
                <div className="round-footer">
                    <span className="iterations">Iterations: {round1Data.length}</span>
                    <span className="main-value">% Unchanged: {round1Data.length==0?0:(round1Data[round1Data.length-1]*100).toFixed(2)} </span>
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
                <span>RSD: {round2Data.length==0?"N/A":(round2Data[round2Data.length-1]*100).toFixed(2)} </span>
            </div>:<div className="round-body">
                {round2Graph}
                <div className="round-footer">
                    <span className="iterations">Iterations: {round2Data.length}</span>
                    <span className="main-value">RSD: {round2Data.length==0?"N/A":(round2Data[round2Data.length-1]*100).toFixed(2)} </span>
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
        <button onClick={()=>{
            simulate.current.terminate();
            simulate.current = null;
            setAlgoState(0)
        }}>Terminate</button>
    </div>
}