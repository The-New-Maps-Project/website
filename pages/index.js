import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import Scaffold from "../components/Scaffold"
import PContext from '../services/context'
import DocsList from "../components/DocsList"
import Auth from "../components/Auth"

export default function Home() {
  const {docId,isAuth} = useContext(PContext);

  return (
    <div>
      {isAuth?<div>
        {!docId?<DocsList></DocsList>:<Scaffold></Scaffold>}
      </div>:<div id="default-frontpage">
        <Auth/>
      </div>}
      
    </div>
  )
}
