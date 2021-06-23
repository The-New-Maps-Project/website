import { useContext } from "react"
import PContext from "../services/context"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function Header(){
    const {isAuth,docId,setDocId,name,save} = useContext(PContext);


    return <header>
        <h1>
            <div id="small-header">The New Maps Project</div>
            <div id="main-header">Map Analysis</div>
        </h1>
        {docId&&<h2 id="map-title">
            {name}
        </h2>}
        {docId&&<div>
            <button className="tb" onClick={()=>setDocId(null)}>Switch Document</button>
        </div>}
        {isAuth&&<div id="account-header">
            <Link href="/account"><a className="account-button"><FontAwesomeIcon className="user-icon" icon={faUserCircle}></FontAwesomeIcon>Account</a></Link>
        </div>}
        {docId&&<div id="save-and-import">
            <button onClick={()=>save()}className="save-button"><FontAwesomeIcon className="save-icon" icon={faSave}></FontAwesomeIcon>Save</button>
        </div>}
        
    </header>
}