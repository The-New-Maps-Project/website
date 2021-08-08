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
  const [nameInput, setNameInput] = useState(name);

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
          <a target="_blank" className="tb">Docs</a>
        </Link>
        <button className="menu-button">
          <FontAwesomeIcon className="icon" icon={faBars}></FontAwesomeIcon>
        </button>
      </div>

      
    </header>
  );
}
