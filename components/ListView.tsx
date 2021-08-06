import { faCaretDown, faCaretUp, faEdit, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react"
import PContext from "../services/context"
import Algorithm from "./Algorithm";
import Popup from "./Popup";
import SwitchPopup from "./SwitchPopup";

export default function ListView(){
    const {districts,data,parameters,setData,setMapZoom,algoState} = useContext(PContext);
    const [switchPopup,setSwitchPopup] = useState(false);
    const [precinctToSwitch,setPrecinctToSwitch] = useState("");
    const [showParams,setShowParams] = useState({}); //[name]: boolean
    const [precinctList,setPrecinctList] = useState<string[]>([]); //set initially in "searchList()", and in the toggle show selected useEffect()
    const [searchInput,setSearchInput] = useState<string>("");
    const [searchQuery,setSearchQuery] = useState<string|null>(null);
    const [selected,setSelected] = useState({})//object [name]: boolean
    const [isEditing,setIsEditing] = useState(false);
    const [selectedNum,setSelectedNum] = useState<number>(0);
    const [deletePopup,setDeletePopup] = useState(false);
    const [switchSelectedPopup,setSwitchSelectedPopup] = useState(false);
    const [isShowingSelected,setIsShowingSelected] = useState(false);

    const renderParams = (precinctname: string) =>{
        var arr = [];
        var j = 0;
        for(var i = 4;i<data[precinctname].length;i++){
          if(j>=parameters.length) break;
          arr.push(<li className="param-data" key={parameters[j]}>
            <span className="param-name">{parameters[j]}:</span>
            <span className="param-value">{data[precinctname][i]}</span>
          </li>)
          j++;
        }
        return arr;
    }
    
    const changeDistrict = (district:number) =>{
        //Change district in "data"
        var newObj = {...data};
        newObj[precinctToSwitch][0] = district;
        console.log(newObj[precinctToSwitch]);
        setData(newObj);
        setSwitchPopup(false);
    }

    const sortPrecincts = (sortBy:string|number) =>{
        var arr = [...precinctList];
        switch(sortBy){
            case "az":
                arr.sort();
                break;
            case "za":
                arr.sort().reverse();
                break;
            case "district":
                arr.sort((a,b)=>{
                    //not assigned last
                    if(data[a][0]==0) return 1;
                    if(data[b][0]==0) return -1;
                    return data[a][0]-data[b][0]
                });
                break;
            case "population":
                arr.sort((a,b)=>data[b][1]-data[a][1]); //descending, greatest to least
                break;
            // case "selected":
            //     arr = arr.filter(a=>Boolean(selected[a]));
            //     break;
            default:
                if(!sortBy) break;
                else{
                    arr.sort((a,b)=>data[a][Number(sortBy)]-data[b][Number(sortBy)]);
                }

        }
        setPrecinctList(arr);
    }

    //for both search AND show selected
    const updateList = () =>{
        var arr = isShowingSelected?Object.keys(data).filter(a=>Boolean(selected[a])):Object.keys(data).sort();
        if(searchQuery==null||searchQuery.length==0) return setPrecinctList(arr);
        var arr = Object.keys(data).filter(p=>{
            let a = p.toLowerCase();
            let b = searchQuery.toLowerCase();
            return a.indexOf(b)>-1||(b).indexOf(a)>-1
        })
        setPrecinctList(arr);
        return setSearchInput("");
    }

    //update the CONTENTS of the list (NOT sort them a certain way)
    useEffect(updateList,[searchQuery,isShowingSelected,data]);

    useEffect(()=>{
        if(!isEditing) setSelected({});
    },[isEditing])

    useEffect(()=>{
        setSelectedNum(Object.keys(selected).filter(p=>Boolean(selected[p])).length);
    },[selected])

    const deleteSelected = () =>{
        let ps = Object.keys(selected).filter(p=>Boolean(selected[p]));
        var newObj = {...data};
        ps.forEach(p=>{
            delete newObj[p];
        })
        setData(newObj);
        setDeletePopup(false);
        setIsEditing(false); //do this because all selected precincts are deleted
    }

    const assignSelected = (num:number) =>{
        let ps:string[] = Object.keys(selected).filter(p=>Boolean(selected[p]));
        var newObj = {...data};
        ps.forEach(p=>{
            console.log(newObj[p]);
            if(!newObj[p]) return;
            newObj[p][0] = num;
        })
        setData(newObj);
        setSwitchSelectedPopup(false);
        //don't switch off editing, no need to, not deleting.
    }

    const selectAll = (select:boolean) =>{
        if(!select) setSelected({}); //UNselected all
        else{
            var newObj = {};
            Object.keys(data).forEach(p=>{
                newObj[p] = true;
            })
            setSelected(newObj);
        }   
    }

    return <div id="list-view">
        {algoState>0&&<Algorithm></Algorithm>}

        {isEditing&&<div >
            <div className="edit-row">
                <div className="num-selected" >{selectedNum} Selected</div>
                <button className="delete-selected" onClick={()=>setDeletePopup(true)}>Delete</button>
                <button className="switch-selected" onClick={()=>setSwitchSelectedPopup(true)}>Assign District</button>
                <button className="x-button" onClick={()=>setIsEditing(false)}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
            </div>
            <div className="select-row-two">
                <button onClick={()=>setIsShowingSelected(!isShowingSelected)}>{isShowingSelected?"Show All":"Show Selected"}</button>
                <button onClick={()=>selectAll(selectedNum==0)}>{selectedNum?"Unselect All":"Select All"}</button>
            </div>
            </div>}
        <div className="first-row">
            <div className="sort-by">
                Sort By 
                <select onChange={(e)=>sortPrecincts(e.target.value)}>
                    <option value="az">A to Z</option>
                    <option value="za">Z to A</option>
                    <option value="district">District</option>
                    <option value="population">Population</option>
                    {parameters.map(param=>{
                        return <option value={parameters.indexOf(param)}>{param}</option>
                    })}
                </select>
            </div>
            <div className="search row">
                <input
                    value={searchInput}
                    onChange={(e)=>setSearchInput(e.target.value)}
                    placeholder="Search"
                ></input>
                <button className="tb" onClick={()=>setSearchQuery(searchInput)}>
                    <FontAwesomeIcon className="si" icon={faSearch}></FontAwesomeIcon>
                </button>
            </div>
            {<div className="edit">
                <button className="tb" onClick={()=>setIsEditing(!isEditing)}>Edit<FontAwesomeIcon className="icon" icon={faEdit}></FontAwesomeIcon></button>
            </div>}
        </div>
        {searchQuery&&<div id="searchQuery">
            <span>{searchQuery}</span>
            <button onClick={()=>setSearchQuery(null)} className="x-button"><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
        </div>}
        {precinctList.length>100&&<p>Showing First 100 Precincts</p>}
        <ul id="precinct-list">
            {precinctList.slice(0,100).map(key=>{
                let precinct:string = key;
                if(!data[precinct]) return;
                return <li className="single-precinct" key={precinct}>
                        <div className="main-row">
                            {isEditing&&<input
                                type="checkbox"
                                checked={Boolean(selected[key])}
                                onChange={e=>{
                                    var newObj = {...selected};
                                    newObj[key] = !selected[key];
                                    setSelected(newObj);
                                }}
                            ></input>}
                            <button className="precinct-name tb" onClick={()=>{
                                let precData = data[precinct];
                                console.log(precData);
                                setMapZoom({
                                    lat: precData[2],
                                    lng: precData[3],
                                    zoom: 13
                                })
                            }}>{precinct}</button>
                            <div className="district">
                                
                                <button className="show-district" onClick={()=>{
                                    setPrecinctToSwitch(precinct)
                                    setSwitchPopup(true)
                                }}>
                                    {data[precinct]&&data[precinct][0]==0
                                ?"Unassigned":<div className="row"><span 
                                className="color-box" 
                                style={{backgroundColor: `var(--${districts[data[precinct][0]-1]}-icon)`}}
                                ></span>
                                District {data[precinct][0]} 
                                </div>}
                                    
                                </button>
                            </div>
                            <button className="tb info-button" onClick={()=>{
                                var newObj = {...showParams};
                                newObj[precinct] = !Boolean(showParams[precinct]);
                                setShowParams(newObj);
                            }}>
                                {showParams[precinct]?"Hide":"More"}
                                <FontAwesomeIcon className="icon" icon={showParams[precinct]?faCaretUp:faCaretDown}></FontAwesomeIcon>
                            </button>
                        </div>
                            
                        {showParams[precinct]&&<div className="params">
                            <ul>
                                <li className="param-data" key="population">
                                    <span className="param-name">Population:</span>
                                    <span className="param-value">{data[precinct][1]}</span>
                                </li>
                                {renderParams(precinct)}
                            </ul>
                        </div>}
                </li>
            })}
        </ul>


        {switchPopup&&<SwitchPopup
            xFunction={()=>setSwitchPopup(false)}
            selectDistrict={changeDistrict}
            currentDistrict={data[precinctToSwitch][0]}
        >
        </SwitchPopup>}

        {switchSelectedPopup&&<SwitchPopup
            xFunction={()=>setSwitchSelectedPopup(false)}
            selectDistrict={assignSelected}
            currentDistrict={0}
        >
        </SwitchPopup>}
            
        {deletePopup&&<Popup>
            <div className="delete-precincts">
                <p>Delete selected precints?</p>
                <div>
                    <button className="sb" onClick={deleteSelected}>Yes, Delete</button>
                    <button className='sb' onClick={()=>setDeletePopup(false)}>Cancel</button>
                </div>
            </div>
        </Popup>}
    </div>
}