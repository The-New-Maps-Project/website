import { useContext } from "react"
import PContext from "../services/context"
import writeNum from "../services/writeNum";

export default function DistrictsList(){
    const {districts,districtPops,setViewAloneDistrict,viewAloneDistrict} = useContext(PContext);


    const renderDistricts = ():any[] => {
        var arr = [];
        for(let i:number = 0;i<districts.length;i++){
            arr.push(<li key={i} className={viewAloneDistrict==(i+1)?"selected":""}>
                <div className="district-name row"><span>District {i+1}</span><span style={{backgroundColor: `var(--${districts[i]}-icon)`}} className="color-box"></span></div>
                <div className="population">Population: {writeNum(districtPops[i])}</div>
                {viewAloneDistrict==(i+1)?<button className="unselect" onClick={()=>setViewAloneDistrict(-1)}>Unselect</button>:<button className="view-alone" onClick={()=>setViewAloneDistrict(i+1)}>View Alone</button>}
                <div className="buttons row">
                    <button className="pack mr15">Pack</button>
                    <button className='crack'>Crack</button>
                </div>
            </li>)
        }
        return arr;
    }

    return<div id="districts-list">
        <ul>
            {renderDistricts()}
        </ul>
    </div>
}