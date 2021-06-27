import { useState } from "react"

export default function Analysis(){
    const [needRecalculate,setNeedRecalculate] = useState(false);


    return <div id="analysis-container">
        <div id="analysis-heading">
            <h3>Statistical Analysis</h3>
            {needRecalculate&&<button className="recalc-button">Recalculate</button>}
        </div>
        <div id="analysis-main">
            <section id="param-analysis"></section>
            <section id="district-analysis">
                
            </section>
        </div>
        
    </div>
}