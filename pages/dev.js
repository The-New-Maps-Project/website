import { useEffect, useRef, useState } from "react"

export default function Dev(){
    const [text,setText] = useState(""); //actually the state number
    const [fileName,setFileName] = useState("nmpdata"+(new Date()).getTime());
    const [url,setUrl] = useState(null);
    const [numDistricts,setNumDistricts] = useState(8);
    const [resText,setResText] = useState([]);
    const [progress,setProgress] = useState("");
    const list = useRef([]);
    const [interval,setInterval1] = useState(100);
    const [googleApiKey,setGoogle] = useState("");
    const [censusApiKey,setCensus] = useState("");
    const [stateName,setStateName] = useState("");
    const [errorMessage,setErrorMessage] = useState("");
    const params = ["B01001_002E","B01001_026E","B01001A_001E","B01001B_001E","B01001C_001E","B01001D_001E","B01001E_001E","B01001I_001E","B06012_002E","B07009_005E"];
    const paramNames = ["% Male","% Female","% White","% Black","% Native American","% Asian","% Pacific Islander","% Hispanic or Latino","% Below Poverty Line","% With Bachelors Degree"] //in ORDER

    const getData = async () => {
        try{
            var stateData = await fetch(`https://api.census.gov/data/2019/acs/acs5?get=NAME&for=state:${text}&key=${censusApiKey}`)
            stateData = await stateData.json();
            setStateName(stateData[1][0]);


        var strParams = "NAME,B01001_001E";
        params.forEach((p)=>strParams += ","+p);

        var res = await fetch(`https://api.census.gov/data/2019/acs/acs5?get=${strParams}&for=zip%20code%20tabulation%20area:*&in=state:${text}&key=${censusApiKey}`);
    
        try{
            var arr = await res.json();
        }catch(e){
            console.error(e)
        }


        var order = arr.shift();
        var objectsArr = [];
        arr.forEach(a=>{
            var obj = {};
            for(let i= 0;i<order.length;i++){
                obj[order[i]] = a[i];
            }

            var pop = Number(obj["B01001_001E"]);
            if(pop == 0){
                pop = objectsArr.push({
                    name: obj["zip code tabulation area"],
                    params: params.map(p=>0),
                    population: 0,
                })
            }else{
                objectsArr.push({
                    name: obj["zip code tabulation area"],
                    params: params.map(p=>(Number(obj[p])/pop).toFixed(4)),
                    population: pop,
                })
            }
        })
  
        for(let i=0;i<objectsArr.length;i++){
            for(let j=i+1;j<objectsArr.length;j++){
                if(objectsArr[i].name == objectsArr[j].name){
                    objectsArr.splice(j,1);
                    j--;
                }
            }
        }

        var index = 0;
        var length = objectsArr.length;
        iterate(0,length,objectsArr);
        
        }catch(e){
            setErrorMessage(e.message);
        }
    }

    const iterate = async (index,length,objectsArr) =>{
        if(index > length) return;
        if(index == length){
            //download
            

            //first create the text
            var blobText = ""+numDistricts;
            paramNames.forEach(pn=>blobText+=","+pn);
            list.current.forEach(l=>{
                blobText += "\n"+l;
            })


            //create the blob and setUrl
            var blob = new Blob([blobText], {type: 'text/plain'});
            var url = window.URL.createObjectURL(blob);
            setUrl(url);
            return;
        }
        var thisObj = objectsArr[index];
        if(!thisObj) return;

        //Step 1: get the data from google
        var geocodingRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${`US Zip Code ${thisObj["name"]}`}&key=${googleApiKey}`);
        var jsonRes = await geocodingRes.json();
 

        var data = jsonRes.results[0];
        if(!data) return;
        var name = data["address_components"][1]["long_name"] + " ("+ thisObj["name"]+")";
        var lat = data.geometry.location.lat;
        var lng = data.geometry.location.lng;


        //Step 2: set the data
        var str = name + ",0,"+lat+","+lng+","+thisObj["population"]; 
        thisObj.params.forEach(p=>str += ","+p);
        list.current = ([...list.current,str]);
        var arr = []
        list.current.forEach(l=>arr.push(l));
        setResText(arr);
        setProgress(""+index + " / "+ length);
        index++;
        setTimeout(()=>{
            iterate(index,length,objectsArr);
        },interval)
    }

    const getDataIteration = (index,lines) =>{
        setTimeout(async ()=>{
            if(index >= lines.length) return;
            var zc = lines[index];
            if(zc.length<5) return;

            //Step 1: get google data (geocoding lat and lng, and place name)
            var geocodingRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zc}&key=${googleApiKey}`);
            var jsonRes = await geocodingRes.json();
           

            var data = jsonRes.results[0];
            if(!data) return;
            var name = data["address_components"][1]["long_name"] + " ("+ zc+")";
            var lat = data.geometry.location.lat;
            var lng = data.geometry.location.lng;
        

            //Step 2: get census data (total population and parameters)




            //Step 3: setData and reiterate

            list.current = ([...list.current,(name + ","+lat+","+lng)]);
            var arr = []
            list.current.forEach(l=>arr.push(l));
            setResText(arr);
            setProgress(""+list.current.length + " / "+lines.length);

            index++;
            getDataIteration(index,lines);
        },interval)
    }

    const getDataIteration2 = async (index,lines,obj) =>{
        if(index>=lines.length||lines[index].length<1){
         
            var blobText = numDistricts +","+paramNames.reduce((p,c)=>p+","+c) +"\n"+list.current.reduce((p,c)=>p+"\n"+c);

            var blob = new Blob([blobText], {type: 'text/plain'});
            var url = window.URL.createObjectURL(blob);
            setUrl(url);
            return;
        }
        setProgress((index+1)+"/"+lines.length);
        var thisLine = lines[index];
        var elements = thisLine.split("\t");

        //Step 2: set the geoID and get it's components
        var geoid = elements[1];
        var stateid = geoid.substring(0,2);
        var countyid = geoid.substring(2,5);
        var tractid = geoid.substring(5);

        var lat = (elements[elements.length-2].replace(/ /gi,""));
        var lng = (elements[elements.length-1].replace(/ /gi,""));

        var strParams = "NAME,B01001_001E";
        params.forEach((p)=>strParams += ","+p);
        try{
            var arr = obj[tractid];
            var str = tractid+",0,"+lat+","+lng;
            for(var i = 1;i<=params.length+1;i++){ //start from 1 because you want to start with population, and end at params + 1 because you want to get params plus the population.
                str += ","
                if(i>1) str += arr[1]==0?0:Number(arr[i]/arr[1]).toFixed(4);
                else str += arr[i]; //arr[1], population
            }
            list.current = [...list.current,str]
            setResText(list.current);
        }catch(e){
            console.error(e)
        }
        setTimeout(()=>{
            getDataIteration2(index+1,lines,obj);
        },interval)
    }

    useEffect(()=>{
        
    },[list.current])

    const uploadFile= (file) =>{
        

        const fr = new FileReader();
        fr.onload = async function(){
            let fileContents = fr.result.toString().split("\n");
            fileContents.shift(); //remove first line
            var stateId = fileContents[0].split("\t")[1].substring(0,2);
            var strParams = "NAME,B01001_001E";
            params.forEach((p)=>strParams += ","+p);
            try{
                var reqStr = `https://api.census.gov/data/2019/acs/acs5?get=${strParams}&for=tract:*&in=state:${stateId}&key=${censusApiKey}`;
                var data1 = await fetch(reqStr);
                var dataRes = await data1.json();
                dataRes.shift(); //the first array is just the order
                var obj = {};
                dataRes.forEach(d=>{
                    obj[d[d.length-1]] = [...d];
                })
                getDataIteration2(0,fileContents,obj)
            }catch(e){
                console.error(e);
            }
        }

        fr.readAsText(file)
    }

    return <div id="dev">
        <section>
            <input
                onChange={(e)=>setText(e.target.value)}
                value={text}
                placeholder="State Number"
                className="zcs"
            ></input>
            <button className="sb" onClick={()=>getData()}>Get Data</button>
            <input 
                onChange={(e)=>setFileName(e.target.value)}
                value={fileName}
                placeholder="File Name"
                className="zcs"
            ></input>
            <input
                onChange={(e)=>setNumDistricts(e.target.value)}
                value={numDistricts}
                type="number"
                placeholder="# of Districts"
                className="zcs"
            ></input>
            <input 
                onChange={(e)=>setCensus(e.target.value)}
                value={censusApiKey}
                placeholder="Census API Key"
                type="password"
                className="zcs"
            ></input>
            <input
                onChange={(e)=>setGoogle(e.target.value)}
                value={googleApiKey}
                type="password"
                placeholder="Google Cloud API Key"
                className="zcs"
            ></input>
            <input
                onChange={(e)=>setInterval1(e.target.value)}
                value={interval}
                placeholder="Time between calls"
                className="zcs"
            ></input>
        </section>
        <section>
            <input type="file" id="fileInput" onChange={(e)=>{uploadFile(e.target.files[0])}}></input>
        </section>
        <h3>{progress}</h3>
        <p>State Name: {stateName}</p>
        <p style={{color: "red", fontWeight: "bold"}}>{errorMessage}</p>
        <a download={fileName+".txt"} href={url} className={url==null?"unready":"ready"}>Download File</a>
        <section>
            <ul>{resText.map(l=>{return<li>{l}</li>})}</ul>
        </section>

    </div>
}