import '../styles/globals.scss'
import '../styles/docs.scss'

import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomHead from "../components/CustomHead"
import PContext from '../services/context';
import {useEffect, useState, useRef} from "react";
import Loading from "../components/Loading"
import Popup from "../components/Popup"

function MyApp({ Component, pageProps }) {
  const batchSize = 10;
  //data: {[precinctName]: [district,lat,lng,param1,param2...]}
  const [data,setData] = useState({});
  const [isAuth,setIsAuth] = useState(false);
  const [name,setName] = useState(""); //Name of the document
  const [parameters,setParameters] = useState([]);
  const [districts,setDistricts] = useState([]);
  const [docId,setDocId] = useState(null);
  const [docs,setDocs] = useState([]);
  const [lastDoc,setLastDoc] = useState(-1);
  const [appLoading,setAppLoading] = useState(false);

  //For algorithm running
  const [algoState,setAlgoState] = useState(0); // -1: not running, 1: round 1, 2: round 2, 3: done
  const [algoFocus,setAlgoFocus] = useState(0);//same values as algoState, but the current round opened in the popup viewing the data and graphs
  const [round1Data,setRound1Data] = useState([]); //bar graph, length of array is how many iterations, each element is the percent unchanged per iteration
  const [round2Data,setRound2Data] = useState([]); //bar graph, length of array is how many iterations % 10 (or some number), each element is the RSD
  const [districtPops,setDistrictPops] = useState([]);
  const [algoSettings,setAlgoSettings] = useState({
    useSubiterations: true,
    interval1: 10,
    interval2: 20,
    maxIterations1: 100,
    maxIterations2: 2000,
    graphInterval1: 1,
    graphInterval2: 1,
    gridGranularity: 2000,
  });



  const saveTimes = useRef(0);
  const [mapZoom,setMapZoom] = useState({
    lat: 39.3433, 
    lng: -95.4603,
    zoom: 4,
  })
  const colors = ["red","green","blue","yellow","orange","purple","pink","turquoise","black","white",]

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
    districts,
    setDistricts,
    colors,
    mapZoom,
    setMapZoom,
    saveTimes,
    algoState,
    setAlgoState,
    round1Data,
    setRound1Data,
    round2Data,
    setRound2Data,
    algoSettings,
    setAlgoSettings,
    algoFocus,
    setAlgoFocus,
    districtPops,
    setDistrictPops,
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
