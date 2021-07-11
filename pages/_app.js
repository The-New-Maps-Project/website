import '../styles/globals.scss'
import '../styles/docs.scss'

import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomHead from "../components/CustomHead"
import PContext from '../services/context';
import {useEffect, useState, useRef} from "react";
import { pAuth, pDatabase } from '../services/config';
import Loading from "../components/Loading"
import Popup from "../components/Popup"

function MyApp({ Component, pageProps }) {
  const batchSize = 10;
  const [data,setData] = useState({});
  const [isAuth,setIsAuth] = useState(false);
  const [name,setName] = useState(""); //Name of the document
  const [parameters,setParameters] = useState([]);
  const [districts,setDistricts] = useState([]);
  const [docId,setDocId] = useState(null);
  const [docs,setDocs] = useState([]);
  const [lastDoc,setLastDoc] = useState(-1);
  const [appLoading,setAppLoading] = useState(false);
  const [needSave,setNeedSave] = useState(false);
  const saveTimes = useRef(0);
  const [mapZoom,setMapZoom] = useState({
    lat: 39.3433, 
    lng: -95.4603,
    zoom: 4,
  })
  const colors = ["red","green","blue","yellow","orange","purple","pink","turquoise","black","white",]

  pAuth.onAuthStateChanged((user)=>{
    if(user){
      setIsAuth(true);
    }
    else setIsAuth(false);
  })

  useEffect(()=>{
    console.log(data);
  },[data])

  const getDocs = async (isRefresh) =>{
    if(!pAuth.currentUser) return;
    if(lastDoc==null&&!isRefresh) return;
    try{
      var query = pDatabase.collection("users").doc(pAuth.currentUser.uid).collection("maps").orderBy("date","desc").limit(batchSize);
      if(lastDoc!=-1&&lastDoc!=null&&!isRefresh) query = query.startAfter(lastDoc);
      var res = await query.get();
      var arr = res.docs.map(doc=>({...doc.data(),id:doc.id}));
      if(!isRefresh) arr = [...docs,...arr];
      setLastDoc(res.docs.length<batchSize?null:res.docs[res.docs.length-1])
      setDocs(arr);
    }catch(e){
      console.error(e);
    }
  }

  const save = async () =>{
    if(!pAuth.currentUser||!docId) return;
    setAppLoading(true);
    try{
      var res = await pDatabase.collection("users").doc(pAuth.currentUser.uid).collection("maps").doc(docId).update({
        data: data,
        name: name,
        parameters: parameters,
        date: (new Date()).getTime(),
        districts: districts
      })
    }catch(e){
      console.error(e);
    }
    setAppLoading(false);
    setNeedSave(false);
  }

  useEffect(()=>{
    if(saveTimes.current>0) setNeedSave(true);
    saveTimes.current = saveTimes.current+1;
  },[data,districts,parameters,name])


  const contextValue = {
    data,
    setData,
    isAuth,
    name,
    setName, 
    parameters,
    setParameters,
    docs,
    setDocs,
    lastDoc,
    setLastDoc,
    docId,
    setDocId,
    getDocs,
    save,
    districts,
    setDistricts,
    colors,
    mapZoom,
    setMapZoom,
    needSave,
    setNeedSave,
    saveTimes,
  }

  return <PContext.Provider value={contextValue}>
    <CustomHead/>
    <Header></Header>
    <main>
      <Component {...pageProps} />
    </main>
    <Footer></Footer>

    {appLoading&&<Popup><Loading></Loading></Popup>}

    </PContext.Provider>
}

export default MyApp
