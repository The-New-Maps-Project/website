import Scaffold from "../components/Scaffold";
import { useContext,useState } from "react";
import PContext from "../services/context";
import HomeOptions from "../components/HomeOptions";
import { useRouter } from "next/router";

export default function EditingSuite(){
    const {docId,isAuth} = useContext(PContext);
  const [showFirstPopup,setShowFirstPopup] = useState(false);
  const {query} = useRouter();

  console.log(query);

  return (
    <div>
      <section id="home-section">
        <p>Editing Suite</p>
      </section>
      <Scaffold urlParams={query}></Scaffold>
    </div>
  )
}