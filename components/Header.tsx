import { useContext, useState } from "react";
import PContext from "../services/context";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
            <div id="small-header">The New Maps Project</div>
            <div id="main-header">Map Analysis</div>
          </h1>
        </a>
      </Link>
      {docId && (
        <h2 id="map-title">
          {name}
          <button className="tb" onClick={() => setChangeNamePopup(true)}>
            <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
          </button>
        </h2>
      )}
      {docId && (
        <div>
          <button className="tb" onClick={() => setDocId(null)}>
            Switch Map
          </button>
        </div>
      )}
      <Link href="/documentation">
        <a target="_blank" className="tb">Docs</a>
      </Link>
      {isAuth && (
        <div id="account-header">
          <Link href="/account">
            <a className="account-button">
              <FontAwesomeIcon
                className="user-icon"
                icon={faUserCircle}
              ></FontAwesomeIcon>
              Account
            </a>
          </Link>
        </div>
      )}
        {/* <div id="save-and-import">
          <button onClick={() => save()} className="save-button">
            <FontAwesomeIcon
              className="save-icon"
              icon={faDownload}
            ></FontAwesomeIcon>
            Export
          </button>
        </div> */}

      {changeNamePopup && (
        <Popup>
          <div className="change-name-popup">
            <h4>Change Name</h4>
            <button
              className="x-button"
              onClick={() => setChangeNamePopup(false)}
            >
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </button>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Name"
            ></input>
            <button className="sb ml5" onClick={() => changeName()}>
              Change
            </button>
          </div>
        </Popup>
      )}
    </header>
  );
}
