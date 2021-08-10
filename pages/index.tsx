import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import Scaffold from "../components/Scaffold"
import PContext from '../services/context'
import Auth from "../components/Auth"
import docsOverview from "../docs/docs0.md";
import ReactMarkdown from 'react-markdown'


export default function Home() {
  const {docId,isAuth} = useContext(PContext);

  return (
    <div>
      <Scaffold></Scaffold>
    </div>
  )
}
