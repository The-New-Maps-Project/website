import { useState } from "react"
import ListView from "./ListView";
import StatsView from "./Analysis";

export default function ViewContainer(){
    const [view,setView] = useState(0);

    return <div id="view-container">
        <div id="menu">
            <button onClick={()=>setView(0)} className={`menu-item${view==0?" focused":""}`}>
                <h6>List View</h6>
                <p></p>
            </button>
            <button onClick={()=>setView(1)} className={`menu-item${view==0?"":" focused"}`}>
                <h6>Analysis View</h6>
                <p></p>
            </button>
        </div>
        <div id="view-body">
            {view==0?<ListView></ListView>:<StatsView></StatsView>}
        </div>
    </div>
}