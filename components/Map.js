import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useRef,useEffect, useState,useContext } from 'react';
import {Loader} from '@googlemaps/js-api-loader';
import PContext from '../services/context';
import SwitchPopup from './SwitchPopup';
import {googleMapsPublicKey} from "../services/keys"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


export default function Map(){
    const googlemap = useRef(null);
    const {data,parameters,districts,setData,mapZoom,setDistrictPops,viewAloneDistrict} = useContext(PContext);
    const [mapObj,setMapObj] = useState(null);
    const [hovering,setHovering] = useState(null);
    const [focusing,setFocusing] = useState(null);
    const markers = useRef({});//[precinctname]: markerObject
    const [switchPopup,setSwitchPopup] = useState(false);
    // const [mousePosX,setMousePosX] = useState(0);
    // const [mousePosY,setMousePosY] = useState(0);
    const [batchAssignDistrict,setBatchAssignDistrict] = useState(-1);
    const [batchAssignPopup,setBatchAssignPopup] = useState(false);
    const baDistrictRef = useRef(batchAssignDistrict);

    //creat a map of [name]: districtNo. from "data"
    const createDistrictMapping = () =>{
      var obj = {};
      Object.keys(data).forEach(key=>{
        obj[key] = Number(data[key][0]);
      })
      return obj;
    }

    const prevData = useRef(createDistrictMapping());

  useEffect(() => {
    //First Load Map
    const loader = new Loader({
      apiKey: googleMapsPublicKey,
      version: 'weekly',
    });
    let map;
    
    loader.load().then(() => {
        let google = window.google;
        map = new google.maps.Map(googlemap.current, {
        center: {lat: 39.3433, lng: -95.4603},
        zoom: 4,
      });
      setMapObj(map);
    });
  },[]);

  useEffect(()=>{
    baDistrictRef.current = batchAssignDistrict;
  },[batchAssignDistrict])


  const addAllMarkers = ()=>{
    //if(mapObj==null) return;
    Object.keys(data).forEach(key=>{
      let precinct = data[key];
      let color = data[key][0]==0?"grey":districts[data[key][0]-1];
      let marker = addMarker(key,color,{
        lat: Number(precinct[2]),
        lng: Number(precinct[3])
      })
      if(showDistrict(data[key][0])){
        marker.setVisible(true);
      }else{
        marker.setVisible(false);
      }
      markers.current[key] = marker;
    })
  };

  const clearAllMarkers = () =>{
    Object.keys(markers.current).forEach(key=>{
      markers.current[key].setMap(null);
    })
    //setMarkers({});
  }

  //RETURNS the marker object
  const addMarker = (pname, color, latLng) =>{
    let name = pname
    let google = window.google;
    let marker = new google.maps.Marker({
      position: latLng,
      icon: `images/${color}icon.png`,
      map: mapObj,
      clickable: true,
      optimized: true,
    });
    // if(name=="Aspen (81612)"){
    //   console.log(marker);
    //   console.log(name,color);
    //   console.log(marker.getMap());
    // }
    marker.addListener("mouseover",()=>{
      setHovering(name);
    })
    // marker.addListener("mouseout",()=>{
    //   setHovering(null);
    // })
    marker.addListener("click",()=>{
      setFocusing(name);
      if(baDistrictRef.current>=0){
        changeDistrict(name,baDistrictRef.current);
      }
    })
    return marker;
  }

  const changeMarkerColor = (precinctname, toColor) =>{
    if(!markers.current[precinctname]) return;
    markers.current[precinctname].setIcon(`images/${toColor}icon.png`)
  }

  //change the district of the precinct in focus
  const changeDistrict = (precinctName,district) =>{
    //Change district in "data"
    var newObj = {...data};
    newObj[precinctName][0] = district;
    setData(newObj);
    changeMarkerColor(precinctName,districts[district-1]);
    setSwitchPopup(false);
  }

  const changeFocusingDistrict = (district) => {
    changeDistrict(focusing,district);
  }

  //When the mapObj is not null
  useEffect(()=>{
    if(Object.keys(markers.current).length>0) clearAllMarkers();
    if(mapObj!=null) addAllMarkers();
  },[mapObj,districts,viewAloneDistrict])

  //re-zoom on map
  useEffect(()=>{
    if(mapObj==null) return;
    mapObj.setCenter({lat: Number(mapZoom.lat), lng: Number(mapZoom.lng)});
    mapObj.setZoom(Number(mapZoom.zoom));
  },[mapObj,mapZoom])

  //Update marker colors function
  useEffect(()=>{
    if(!mapObj) return;
    var changedPrecincts = [];
    var deletedPrecincts = [];
    var addedPrecincts = [];

    //Fill out all three arrays, loop over markers[] for changed and deleted, and data[] for added
    Object.keys(markers.current).forEach(precinct=>{
      if(!data[precinct]){
        deletedPrecincts.push(precinct);
      }else if(data[precinct][0]!=prevData.current[precinct]){
        changedPrecincts.push(precinct);
      }
    })
    var thisDistrictPops = [];
    districts.forEach(()=>thisDistrictPops.push(0));
    Object.keys(data).forEach(precinct=>{
      thisDistrictPops[data[precinct][0]-1] += Number(data[precinct][1]);
      if(!markers.current[precinct]||!markers.current[precinct].getMap()) addedPrecincts.push(precinct);
      // if(precinct=="Aspen (81612)"){
      //   console.log(precinct,markers[precinct]);
      //   if(markers[precinct]) console.log(markers[precinct].getMap())
      // }
    })
    setDistrictPops(thisDistrictPops);


    // console.log("Changed: "+changedPrecincts);
    // console.log("Deleted: "+deletedPrecincts);
    // console.log("Added: "+addedPrecincts);

    // console.log(markers);



    //Change precincts
    changedPrecincts.forEach(precinct=>{
      let color = districts[data[precinct][0]-1] || "grey";
      changeMarkerColor(precinct,color);
      if(showDistrict(data[precinct][0])){
        markers.current[precinct].setVisible(true)
      }else{
        markers.current[precinct].setVisible(false);
      }
    })

    //Delete Precincts
    deletedPrecincts.forEach(precinct=>{
      if(precinct==focusing) setFocusing(null);
      markers.current[precinct].setMap(null);
    })

    //Add Precincts
    addedPrecincts.forEach(precinct=>{
      let p = data[precinct].map(a=>Number(a));
      let color = districts[data[precinct][0]-1] || "grey";
      let marker = addMarker(precinct,color,{lat: p[2], lng: p[3]});
      if(showDistrict(data[precinct][0])){
        marker.setVisible(true)
      }else{
        marker.setVisible(false);
      }
      markers.current[precinct] = marker;
    })

    //reset prevData;
    prevData.current = createDistrictMapping();
  },[data]);

  const renderParams = (precinctname) =>{
    var arr = [];
    var j = 0;
    for(var i = 4;i<data[precinctname].length;i++){
      if(j>=parameters.length) break;
      arr.push(<li className="param-data" key={parameters[j]}>
        <span className="param-name">{parameters[j]}:</span>
        <span className="param-value">{data[precinctname][i]}</span>
      </li>)
      j++;
    }
    return arr;
  }

  const showDistrict = (districtNum) =>{
    return (viewAloneDistrict==-1) || (viewAloneDistrict==districtNum)
  }

  return (
    <div>
      {/* {hovering&&<div id="map-hovering" style={{top: mousePosY+"px",left: mousePosX+"px"}}>{hovering}</div>} */}
    
      <div id="batch-assign">{batchAssignDistrict==-1?<button onClick={()=>{setBatchAssignPopup(true)}} className="baButton">Batch Assign</button>:<div className="row baRow">
        <div className="row">
        {batchAssignDistrict==0
          ?"Batch Unassign":
          <div className="row">
            {`Batch Assign District ${batchAssignDistrict}`}
            <div className="color-circle " style={{backgroundColor: `var(--${districts[batchAssignDistrict-1]}-icon)`}}>
            </div>
          </div>}
        </div>
        {hovering&&<div>{hovering}</div>}
        <button onClick={()=>setBatchAssignDistrict(-1)}>Close</button>
      </div>}</div>
      <div id="map" ref={googlemap}/>
      
      {focusing&&data[focusing]&&<div id="focused-precinct">
        <button className="x-icon" onClick={()=>setFocusing(null)}>
          <FontAwesomeIcon className="sir" icon={faTimes}></FontAwesomeIcon>
        </button>
        <div className="precinct-name">{focusing}</div>
        <div className="district">
          {data[focusing][0]==0
          ?"Unassigned":
          <span className="show-district">
            <span 
              className="color-box" 
              style={{backgroundColor: `var(--${districts[data[focusing][0]-1]}-icon)`}}
            ></span>
            District {data[focusing][0]} 
          </span>}
          <button className="switch-button" onClick={()=>setSwitchPopup(true)}>{data[focusing][0]==0?"Assign":"Switch"}</button>
        </div>
        <p className="population">Population: <span>{data[focusing][1]}</span></p>
        <div className="params">
          <ul>{renderParams(focusing)}</ul>
        </div>
      </div>}

      {switchPopup&&<SwitchPopup
        xFunction={()=>setSwitchPopup(false)}
        selectDistrict={changeFocusingDistrict}
        currentDistrict={data[focusing][0]}
      >
      </SwitchPopup>}

      {batchAssignPopup&&<SwitchPopup
        xFunction={()=>setBatchAssignPopup(false)}
        selectDistrict={setBatchAssignDistrict}
        currentDistrict={null}
      >
        </SwitchPopup>}
    </div>
  );
}