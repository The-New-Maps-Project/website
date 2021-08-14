import { useContext, useState } from "react";
import PContext from "../services/context";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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

  const changeName = () => {
    setName(nameInput);
    setChangeNamePopup(false);
  };

  return (
    <header>
      <Link href="/">
        <a>
          <h1>
            The New Maps Project
          </h1>
        </a>
      </Link>

      <div id="header-links">
        <Link href="/documentation">
          <a target="_blank" className="tb docs-button">Docs</a>
        </Link>
        <button className="menu-button" onClick={()=>setShowMenu(!showMenu)}>
          <FontAwesomeIcon className="icon" icon={faBars}></FontAwesomeIcon>
        </button>
      </div>

      {<div id="side-menu" className={showMenu?"shown":"hidden"}>
        <div className="menu-header">
          <h6><FontAwesomeIcon className="icon" icon={faBars}></FontAwesomeIcon>Menu</h6>
          <button className="x-menu-button" onClick={()=>{setShowMenu(false)}}><FontAwesomeIcon className="icon" icon={faTimes}></FontAwesomeIcon></button>
        </div>
        <ul>
          {links.map(l=>{
            return <li>
              <Link href={l.path}><a className="single-link" target="_blank">{l.name}</a></Link>
            </li>
          })}
        </ul>
      </div>}

    </header>
  );
}
