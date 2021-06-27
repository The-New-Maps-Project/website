import { useContext, useEffect, useState } from "react"
import calcData from "../calculate/calcData";
import PContext from "../services/context";

export default function Analysis(){
    const {data,districts,parameters} = useContext(PContext);
    const [needRecalculate,setNeedRecalculate] = useState(true);
    const [loading,setLoading] = useState(false);
    const [showInfo,setShowInfo] = useState<boolean[]>([]);
    const [res,setRes] = useState<object>({});

    useEffect(()=>{
        setNeedRecalculate(true)
    },[data])

    const reCaculate = () =>{
        setLoading(true);
        var r = calcData(data,districts,parameters);
        setRes(r);
        setLoading(false);
        setNeedRecalculate(false);
    }

    const renderDistricts = () =>{
        if(!res["districts"]) return;
        var arr = [];
        for(let i = 0;i<=districts.length;i++){
            arr.push(<li key={i} className="single-district">
                <div className="main-row">
                    <div className="district-name">
                        {i>0&&<div className="color-box" style={{backgroundColor: `var(--${districts[i-1]}-icon)`}}></div>}
                        {i==0?"Total Population":`District ${i}`}
                    </div>
                    <button className="tb" onClick={()=>{
                        let a = [...showInfo];
                        a[i] = !showInfo[i];
                        setShowInfo(a);
                    }}>{showInfo[i]?"Hide":"More"}</button>
                </div>
                {showInfo[i]&&<div className="info">
                    <ul className="table">
                        <li className="top-row">
                            <div></div>
                            <div>Pop.</div>
                            <div>ASDPC (km)</div>
                        </li>
                        {renderParamInfo(res["districts"][i])}
                    </ul>
                </div>}
            </li>)
        }
        return arr;
    }

    const renderParamInfo = (districtData:object) =>{
        var arr = [];
        for(let i = 0;i<=parameters.length;i++){
            arr.push(<li className="row">
                <div className="p-name">{i-1>=0?parameters[i-1]:"Total"}</div>
                <div>{districtData["populations"][i]}</div>
                <div>{districtData["asdpc"][i].toFixed(1)}</div>
            </li>)
        }
        return arr;
    }

    return <div id="analysis-container">
        <div id="analysis-heading">
            <h3>Statistical Analysis</h3>
            {needRecalculate&&<button className="recalc-button" onClick={reCaculate}>Recalculate</button>}
        </div>
        <div id="analysis-main">
            <section id="param-analysis"></section>
            <section id="district-analysis">
                <ul id="districts-list">
                    {renderDistricts()}
                </ul>
            </section>
        </div>
        
    </div>
}