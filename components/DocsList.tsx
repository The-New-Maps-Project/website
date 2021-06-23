import { useContext, useEffect, useState } from "react"
import PContext from "../services/context"
import convertTime from "../services/convertTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { pAuth, pDatabase } from "../services/config";
import Popup from "../components/Popup";
import Loading from "../components/Loading"

export default function DocsList(){
    const {docs,setDocId,setData,setName,getDocs, lastDoc,setParameters} = useContext(PContext);
    const [loading,setLoading]  = useState<boolean>(false);
    const [nameInput,setNameInput] = useState<string>("");
    const [createPopup,setCreatePopup] = useState<boolean>(false);
    
    useEffect(()=>{
        getDocs();
    },[])


    const createNew = async () =>{
        setLoading(true);
        try{
            const mapObj = {
                name: nameInput,
                data: {},
                date: (new Date()).getTime(),
                parameters: [],
            }
            var res = await pDatabase.collection("users").doc(pAuth.currentUser.uid).collection("maps").add(mapObj);
            setLoading(false);
            setDocId(res.id);
        }catch(e){
            console.error(e);
            setLoading(false);
        }
    }

    return <div>
        <h3>Open a Map</h3>
        <div>
            <button className="sb" onClick={()=>setCreatePopup(true)}><FontAwesomeIcon className="plus-icon" icon={faPlusCircle}></FontAwesomeIcon>New Map</button>
        </div>
        <ul id="docs-list">
            {docs.map(doc=>{
                return <li className="single-doc" key={doc.id}>
                    <h5>{doc.name}</h5>
                    <p>Last Modified {convertTime(doc.date)}</p>
                    <button className="sb" onClick={()=>{
                        setData(doc.data);
                        setName(doc.name);
                        setParameters(doc.parameters)
                        setDocId(doc.id);
                    }}>Open</button>
                </li>
            })}
            {lastDoc!=null&&<li key="add">
                <button className="more-docs sb">
                    <FontAwesomeIcon className="plus-icon" icon={faPlusCircle}></FontAwesomeIcon>
                    More Docs
                </button>
            </li>}
        </ul>

        {createPopup&&<Popup>
            <button className="x-button"><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></button>
            <div className="create-map">
                <h5>New Map</h5>
                <input
                    onChange={(e)=>setNameInput(e.target.value)}
                    value={nameInput}
                    placeholder="Map Name"
                ></input>
                {loading&&<Loading></Loading>}
                <button className="sb" onClick={()=>createNew()}>Create</button>
            </div>
        </Popup>}
    </div>
}