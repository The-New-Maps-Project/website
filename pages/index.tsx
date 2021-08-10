import Head from 'next/head'
import Image from 'next/image'
import { useContext,useState } from 'react'
import Scaffold from "../components/Scaffold"
import PContext from '../services/context'
import ReactMarkdown from 'react-markdown'
import HomeOptions from '../components/HomeOptions'


export default function Home() {
  const {docId,isAuth} = useContext(PContext);
  const [showFirstPopup,setShowFirstPopup] = useState(true);

  return (
    <div>
      <Scaffold></Scaffold>
      {showFirstPopup&&<HomeOptions xFunction={()=>{setShowFirstPopup(false)}}></HomeOptions>}
    </div>
  )
}
