import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown'
import Link from "next/link";
import PContext from "../../services/context";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faArrowDown, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

/*
MARKDOWN FILES IMPORTED

File Naming convention: docs{number}

*/

interface DocOption {
  url: string;
  name: string;
  isPrimary: boolean;
  num: number;
}

export default function DocsRoot() {
    var {query:{id}} = useRouter();
    id = "/" + id;
  const {setDocId} = useContext(PContext);
  setDocId(null);//exit out of edit map mode when on the docs page.
  const [showMenu,setShowMenu] = useState<boolean>(true);

  //when window loads
  useEffect(()=>{
    if(window.innerWidth<1000) setShowMenu(false);
  },[])

  //In order ("num" property  not actually used, just so you know what index it is")
  const docOptions: DocOption[] = [
    { url: "/", name: "Overview", isPrimary: true, num: 0 },
    { url: "/sitelayout", name: "Site Layout", isPrimary: false, num: 1 },
    { url: "/maps", name: "Map Content & Files", isPrimary: false, num: 2 },
    { url: "/editing", name: "Editing Suite", isPrimary: true, num: 3 },
    { url: "/browseralgorithm", name: "Browser Algorithm", isPrimary: false, num: 4 },
    { url: "/packandcrack", name: "Browser Pack & Crack", isPrimary: false, num: 5 },
    { url: "/datastore", name: "Premade Options", isPrimary: true, num: 6 },
    { url: "/algorithm", name: "Algorithm", isPrimary: true, num: 7 },
    { url: "/connectingprecincts", name: "Connecting Precincts", isPrimary: false, num: 8 },
  ];

  let n = 0;
  for (let i = 0; i < docOptions.length; i++) {
    if (docOptions[i].url == id) n = i;
  }
  const num = n;
//   setTitle(
//     `${docOptions[num].name} - Translationeer Documentation`
//   );
  let text = ""
  try{
    text = require(`../../docs/docs${num}.md`).default;
  }catch(e){
    text = "### Error!"
  }
  //Set button option
  var optionsArr = [];
  for (var i = 0; i < docOptions.length; i++) {
    var classList = docOptions[i].isPrimary
      ? "docs-option-primary"
      : "docs-option-secondary";
    if (num == i) {
      classList += " focused";
    }
    classList += " tb";
    optionsArr.push(
      <li>
        <Link href={`/documentation${docOptions[i].url}`}>
          <a className={classList}>{docOptions[i].name}</a>
        </Link>
      </li>
    );
  }

  return (
    <div id="documentation">
      <div className="page-header">
        <h2>Documentation</h2>
        <p>The New Maps Project Documentation</p>
        <div className="background" style={{backgroundImage: 'url("/images/docs.jpg")'}}></div>

      </div>
      <div id="docs-container">
        <div className="docs-col1">
          <button onClick={()=>setShowMenu(!showMenu)}className="menu-button">Documentation Menu <FontAwesomeIcon className="icon" icon={showMenu?faAngleUp:faAngleDown}></FontAwesomeIcon></button>
          {showMenu&&<ul className="docs-options">{optionsArr}</ul>}
        </div>
        <div className="docs-col2">
          <section id="docs-body"><ReactMarkdown>{text}</ReactMarkdown></section>
        </div>
      </div>
    </div>
  );
}
