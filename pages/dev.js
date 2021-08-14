import { useEffect, useRef, useState } from "react"

export default function Dev(){
    const [text,setText] = useState(""); //actually the state number
    const [fileName,setFileName] = useState("nmpdata"+(new Date()).getTime());
    const [url,setUrl] = useState(null);
    const [numDistricts,setNumDistricts] = useState(8);
    const [resText,setResText] = useState([]);
    const [progress,setProgress] = useState("");
    const list = useRef([]);
    const [interval,setInterval1] = useState(500);
    const [googleApiKey,setGoogle] = useState("");
    const [censusApiKey,setCensus] = useState("");
    const [stateName,setStateName] = useState("");
    const [errorMessage,setErrorMessage] = useState("");
    const params = ["B01001_002E","B01001_026E","B01001A_001E","B01001B_001E","B01001C_001E","B01001D_001E","B01001E_001E","B01001I_001E","B06012_002E","B07009_005E"];
    const paramNames = ["% Male","% Female","% White","% Black","% Native American","% Asian","% Pacific Islander","% Hispanic or Latino","% in Poverty","% College Graduate"] //in ORDER

    const getData = async () => {
        try{
            var stateData = await fetch(`https://api.census.gov/data/2019/acs/acs5?get=NAME&for=state:${text}&key=${censusApiKey}`)
            stateData = await stateData.json();
            setStateName(stateData[1][0]);


        var strParams = "NAME,B01001_001E";
        params.forEach((p)=>strParams += ","+p);

        var res = await fetch(`https://api.census.gov/data/2019/acs/acs5?get=${strParams}&for=zip%20code%20tabulation%20area:*&in=state:${text}&key=${censusApiKey}`);
        console.log(res);
        try{
            var arr = await res.json();
        }catch(e){
            console.error(e)
        }
        console.log(arr);

        var order = arr.shift();
        console.log(order);
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
        console.log(objectsArr)

        var index = 0;
        var length = objectsArr.length;
        setInterval(async ()=>{
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
            var geocodingRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${thisObj["name"]}&key=${googleApiKey}`);
            var jsonRes = await geocodingRes.json();
            console.log(jsonRes);

            var data = jsonRes.results[0];
            if(!data) return;
            var name = data["address_components"][1]["long_name"] + " ("+ thisObj["name"]+")";
            var lat = data.geometry.location.lat;
            var lng = data.geometry.location.lng;
            console.log(name + ","+lat+","+lng);

            //Step 2: set the data
            var str = name + ",0,"+lat+","+lng+","+thisObj["population"]; 
            thisObj.params.forEach(p=>str += ","+p);
            list.current = ([...list.current,str]);
            var arr = []
            list.current.forEach(l=>arr.push(l));
            setResText(arr);
            setProgress(""+list.current.length + " / "+ length);



            index++;
        },interval)
        }catch(e){
            setErrorMessage(e.message);
        }
    }

    const getDataIteration = (index,lines) =>{
        setTimeout(async ()=>{
            if(index >= lines.length) return;
            var zc = lines[index];
            if(zc.length<5) return;

            //Step 1: get google data (geocoding lat and lng, and place name)
            var geocodingRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zc}&key=${googleApiKey}`);
            var jsonRes = await geocodingRes.json();
            console.log(jsonRes);

            var data = jsonRes.results[0];
            if(!data) return;
            var name = data["address_components"][1]["long_name"] + " ("+ zc+")";
            var lat = data.geometry.location.lat;
            var lng = data.geometry.location.lng;
            console.log(name + ","+lat+","+lng);

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

    useEffect(()=>{
        
    },[list.current])

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
        <h3>{progress}</h3>
        <p>State Name: {stateName}</p>
        <p style={{color: "red", fontWeight: "bold"}}>{errorMessage}</p>
        <a download={fileName+".txt"} href={url} className={url==null?"unready":"ready"}>Download File</a>
        <section>
            <ul>{resText.map(l=>{return<li>{l}</li>})}</ul>
        </section>
    </div>
}