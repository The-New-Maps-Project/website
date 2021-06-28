import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useRef,useEffect, useState,useContext } from 'react';
import {Loader} from '@googlemaps/js-api-loader';
import PContext from '../services/context';
import SwitchPopup from './SwitchPopup';
import {googleMapsPublicKey} from "../services/keys"


export default function Map(){
  
    const googlemap = useRef(null);
    const {data,parameters,districts,setData,mapZoom} = useContext(PContext);
    const [mapObj,setMapObj] = useState<any>(null);
    const [hovering,setHovering] = useState<string|null>(null);
    const [focusing,setFocusing] = useState<string|null>(null);
    const [markers,setMarkers] = useState({});//[precinctname]: markerObject
    const [switchPopup,setSwitchPopup] = useState<boolean>(false);
    const [mousePosX,setMousePosX] = useState<number>(0);
    const [mousePosY,setMousePosY] = useState<number>(0);

    //creat a map of [name]: districtNo. from "data"
    const createDistrictMapping = ():object =>{
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
      map = new google.maps.Map(googlemap.current, {
        center: {lat: 39.3433, lng: -95.4603},
        zoom: 4,
      });
      setMapObj(map);
    });
  },[]);


  const addAllMarkers = ()=>{
    //if(mapObj==null) return;
    var obj = {};
    Object.keys(data).forEach(key=>{
      let precinct = data[key];
      let color:string = data[key][0]==0?"grey":districts[data[key][0]-1];
      let marker = addMarker(key,color,{
        lat: Number(precinct[2]),
        lng: Number(precinct[3])
      })
      obj[key] = marker;
    })
    setMarkers({...markers,...obj})
  };

  const clearAllMarkers = () =>{
    Object.keys(markers).forEach(key=>{
      markers[key].setMap(null);
    })
    //setMarkers({});
  }

  //RETURNS the marker object
  const addMarker = (pname: string, color: string, latLng: object) =>{
    let name = pname
    
    let marker = new google.maps.Marker({
      position: latLng,
      icon: `images/${color}icon.PNG`,
      map: mapObj,
      clickable: true,
      optimized: true,
    });
    // marker.addListener("mouseover",()=>{
    //   setHovering(name);
    // })
    // marker.addListener("mouseout",()=>{
    //   setHovering(null);
    // })
    marker.addListener("click",()=>{
      setFocusing(name);
    })
    return marker;
  }

  const changeMarkerColor = (precinctname: string, toColor:string) =>{
    markers[precinctname].setIcon(`images/${toColor}icon.PNG`)
    //console.log(precinctname);
    //console.log(markers[precinctname]);
    // if(!markers[precinctname]) return;
    // const lat = markers[precinctname].getPosition().lat();
    // const lng = markers[precinctname].getPosition().lng();
    // console.log("Changing",precinctname);
    // markers[precinctname].setMap(null);//remove current marker;
    // var marker = addMarker(precinctname,toColor,{lat: lat, lng: lng});
    // var newObj = {...markers};
    // newObj[precinctname] = marker;
    // setMarkers(newObj);
  }

  //change the focused district
  const changeDistrict = (district:number) =>{
    //Change district in "data"
    var newObj = {...data};
    newObj[focusing][0] = district;
    setData(newObj);
    changeMarkerColor(focusing,districts[district-1]);
    setSwitchPopup(false);
  }

  //When the mapObj is not null
  useEffect(()=>{
    if(Object.keys(markers).length>0) clearAllMarkers();
    if(mapObj!=null) addAllMarkers();
  },[mapObj,districts])

  //re-zoom on map
  useEffect(()=>{
    if(mapObj==null) return;
    console.log(mapZoom);
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
    Object.keys(markers).forEach(precinct=>{
      if(!data[precinct]){
        deletedPrecincts.push(precinct);
      }else if(data[precinct][0]!=prevData.current[precinct]){
        changedPrecincts.push(precinct);
      }
    })
    Object.keys(data).forEach(precinct=>{
      if(!markers[precinct]||!markers[precinct].getMap()) addedPrecincts.push(precinct)
    })

    console.log("changed",changedPrecincts);

    //Change precincts
    changedPrecincts.forEach(precinct=>{
      let color = districts[data[precinct][0]-1] || "grey";
      changeMarkerColor(precinct,color);
    })

    //Delete Precincts
    deletedPrecincts.forEach(precinct=>{
      if(precinct==focusing) setFocusing(null);
      markers[precinct].setMap(null);
    })

    //Add Precincts
    addedPrecincts.forEach(precinct=>{
      let p = data[precinct].map(a=>Number(a));
      let color = districts[data[precinct][0]-1] || "grey";
      let marker = addMarker(precinct,color,{lat: p[2], lng: p[3]});
      let newObj = {...markers};
      markers[precinct] = marker;
      setMarkers(newObj);
    })

    //reset prevData;
    prevData.current = createDistrictMapping();
  },[data]);

  // useEffect(()=>{
  //   console.log("Changing PrevData",prevData);
  // },[prevData])

  const renderParams = (precinctname: string) =>{
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

  useEffect(()=>{
    //console.log(markers);
  },[markers])

  // const setMousePos = (e) =>{
  //   console.log(e);
  //   console.log(e.clientX)
  //   setMousePosX(e.clientX);
  //   setMousePosY(e.clientY);
  //   console.log(mousePosX,mousePosY);
  // }

  return (
    <div>
      {hovering&&<div id="map-hovering" style={{top: mousePosY+"px",left: mousePosX+"px"}}>{hovering}</div>}
      <div id="map" ref={googlemap}/>
      {focusing&&data[focusing]&&<div id="focused-precinct">
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
        selectDistrict={changeDistrict}
        currentDistrict={data[focusing][0]}
      >
      </SwitchPopup>}
    </div>
  );
}