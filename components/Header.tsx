import { useContext, useState } from "react";
import PContext from "../services/context";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBars,
  faDownload,
  faPen,
  faSave,
  faTimes,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import Popup from "./Popup";

export default function Header() {
  const { isAuth, docId, setDocId, name, save, setName } = useContext(PContext);
  const [changeNamePopup, setChangeNamePopup] = useState(false);
  const [nameInput, setNameInput] = useState<boolean>(name);
  const [showMenu,setShowMenu] = useState<boolean>(false);
  const links = [{
    name: "Editing Suite",
    path: "/editingsuite",
    description: "Draw, analyze, and interactively edit your own legislative district maps. Visualize the algorithm in real time on the map."
  },{
    name: "Submitted Maps",
    path: "/submitted",
    description: "Maps submitted directly to state redistricting commissions or published to the public by The New Maps Project"
  },{
    name: "About",
    path: "/about",
    description: "Learn about what The New Maps Project is and the purpose it serves"
  },{
    name: "Algorithm",
    path: "/documentation/algorithm",
    description: "Learn how The New Maps Project's algorithm works"
  },{
    name: "Documentation",
    path: "/documentation",
    description: "Full length documentation for The New Maps Project's resources"
  },{
    name: "Datastore",
    path: "/datastore",
    description: "Example data to use with The New Maps Project's resources"
  },{
    name: "Contact",
    path: "/contact",
    description: "Contact the people working on The New Maps Project"
  
  }]

  return (
    <header>
      <Link href="/">
        <a target="_blank">
          <h1>
            The New Maps Project
          </h1>
        </a>
      </Link>
      <div id="logo"></div>

      <div id="header-links">
        <Link href="/about">
          <a target="_blank" className="tb header-link">About</a>
        </Link>
        <Link href="/submitted">
          <a target="_blank" className="tb header-link">Submitted Maps</a>
        </Link>
        <Link href="/editingsuite">
          <a target="_blank" className="tb header-link">Editing Suite</a>
        </Link>
        <Link href="/documentation">
          <a target="_blank" className="tb header-link">Docs</a>
        </Link>
        <button className="menu-button" onClick={()=>setShowMenu(!showMenu)}>
          <span>Menu</span>
          <FontAwesomeIcon className="icon" icon={faBars}></FontAwesomeIcon>
          
        </button>
      </div>

      {<div id="side-menu" className={showMenu?"shown":"hidden"}>
        <div className="menu-header">
          <h6><FontAwesomeIcon className="icon" icon={faBars}></FontAwesomeIcon>Menu</h6>
          <button className="x-menu-button" onClick={()=>{setShowMenu(false)}}><FontAwesomeIcon className="icon" icon={faTimes}></FontAwesomeIcon></button>
        </div>
        <div className="menu-background"></div>
        <ul>
          {links.map(l=>{
            return <li>
              <Link href={l.path}><a className="single-link" target="_blank">{l.name}
                <FontAwesomeIcon className="icon" icon={faArrowRight}></FontAwesomeIcon>
              </a></Link>
            </li>
          })}
        </ul>
      </div>}

    </header>
  );
}
