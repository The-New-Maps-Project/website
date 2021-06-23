import '../styles/globals.scss'
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomHead from "../components/CustomHead"
import PContext from '../services/context';
import {useEffect, useState} from "react";
import { pAuth, pDatabase } from '../services/config';
import Loading from "../components/Loading"
import Popup from "../components/Popup"

function MyApp({ Component, pageProps }) {
  const batchSize = 10;
  const [data,setData] = useState({});
  const [isAuth,setIsAuth] = useState(false);
  const [name,setName] = useState(""); //Name of the document
  const [parameters,setParameters] = useState(['a','b','c','d']);
  const [docId,setDocId] = useState(null);
  const [docs,setDocs] = useState([]);
  const [lastDoc,setLastDoc] = useState(-1);
  const [appLoading,setAppLoading] = useState(false);

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
    try{
      var query = pDatabase.collection("users").doc(pAuth.currentUser.uid).collection("maps").orderBy("date","desc").limit(10);
      if(lastDoc!=-1&&lastDoc!=null&&!isRefresh) query = query.startAfter(lastDoc);
      var res = await query.get();
      var arr = res.docs.map(doc=>({...doc.data(),id:doc.id}));
      if(!isRefresh) arr = [...docs,...arr];
      setLastDoc(res.docs[res.docs.length-1])
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
      })
    }catch(e){
      console.error(e);
    }
    setAppLoading(false);
  }


  const contextValue = {
    data,setData,isAuth,name,setName, parameters,setParameters,docs,setDocs,lastDoc,setLastDoc,docId,setDocId,getDocs,save
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
