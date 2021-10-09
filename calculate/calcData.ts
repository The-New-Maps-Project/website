import { allAsdpc } from "./asdpc";
import { mean, median, outliers, stddev, sum } from "./oneVarStats";
import { sumPopulation } from "./sumPopulation";
import Location from "./classes/Location";
/**
 * RETURN FORMAT:
 * {
 *      districts: [ {
 *          populations: number[]
 *          asdpc: number[]
 *      } ]
 *      params: [ {
 *          //Population: 
 *          pTotal: number
 *          pMean: number
 *          pStddev: number
 *          pMedian: number
 *          pOutliers: number[]
 *          pAllData: number[]
 * 
 *          cMean: number
 *          cStddev: number
 *          cOutliers: number[]
 *          cAllData: number[]  
 *          cMedian: number           
 * 
 *          majorityDistricts?: number (marjority districts)
 *          pValue?: number
 *      } ]
 *      precincts:{
 *          total: number, 
 *          mean: number,
 *          stddev: number,
 *          precinctDensity: number,
 *          populationDensity: number,
 *      }
 * }
 * 
 * 
 */
export default function calcData(data:object,districtsParam:string[],paramsParam:string[]){

    //STEP 1: Calculate District Data
    var districts = [];
    for(let i = 0;i<=districtsParam.length;i++){ // 1 more because of total
        let newObj = {};
        let newData = i==0?{...data}:filterData(data,i);
        newObj["populations"] = sumPopulation(newData,paramsParam);
        newObj["asdpc"] = allAsdpc(newData,paramsParam);
        districts.push(newObj);
    }


    //STEP 2: Calculate Parameter Data
    var paramsRes = [];
    const isPop:boolean = false;
    for(let i = 0;i<=paramsParam.length;i++){
        let newObj = {};

        //POPULATION DATA:
        let pAllData:number[] = [];
        for(let d = 0;d<districts.length;d++) {
            if(!districts[d]) return;
            pAllData.push(districts[d]["populations"][i]);
        }
        newObj["pAllData"] = pAllData;
        const pArr = [...pAllData];
        pArr.shift();
        newObj["pTotal"] = sum(pArr);
        newObj["pMean"] = mean(pArr);
        newObj["pStddev"] = stddev(pArr,isPop);
        newObj["pRSD"] = newObj["pStddev"]/newObj["pMean"]*100;
        console.log(newObj["pRSD"])
        newObj["pOutliers"] = outliers(pArr,isPop);
        newObj["pMedian"] = median(pArr);
        
        //COMPACTNESS DATA:
        let cAllData:number[] = [];
        for(let d = 0;d<districts.length;d++) {
            if(!districts[d]) return;
            cAllData.push(districts[d]["asdpc"][i]);
        }
        newObj["cAllData"] = cAllData;
        const cArr = [...cAllData];
        cArr.shift();
        newObj["cTotal"] = sum(cArr);
        newObj["cMean"] = mean(cArr);
        newObj["cStddev"] = stddev(cArr,isPop);
        newObj["cOutliers"] = outliers(cArr,isPop);
        newObj["cMedian"] = median(cArr);
        
        //STATISTICAL TESTS:
        let majorityDistricts = 0;
        let count = 0;
        districts.forEach(d=>{
            count++;
            if(count==1) return; //so the entire population is excluded
            let popsArr = d["populations"];
            if(popsArr[i]/popsArr[0]>0.5) majorityDistricts++;
        })
        newObj["majorityDistricts"] = majorityDistricts;
        paramsRes.push(newObj);
    }

    //STEP 3: Calculate Precinct Data
    var newObj2 = {};
    var minLat:number = Number.MAX_VALUE;
    var maxLat:number = -1*Number.MAX_VALUE;
    var minLng:number = Number.MAX_VALUE;
    var maxLng:number = -1*Number.MAX_VALUE;
    var keys = Object.keys(data);
    var arr = [];
    for(let i:number = 0;i<keys.length;i++){
        let p = data[keys[i]];
        let pop = p[1];
        let lat = p[2];
        let lng = p[3];
        if(lat<minLat) minLat = lat;
        if(lat>maxLat) maxLat = lat;
        if(lng<minLng) minLng = lng;
        if(lng>maxLng) maxLng = lng;
        arr.push(pop);
    }
    newObj2["total"] = arr.length;
    newObj2["mean"] = mean(arr)
    newObj2["stddev"] = stddev(arr,isPop);
    let latRange1 = (new Location(minLat,minLng)).distTo(new Location(maxLat,minLng))
    let latRange2 = (new Location(minLat,maxLng)).distTo(new Location(maxLat,maxLng))
    let latRange = (latRange1 + latRange2)/2
    let lngRange1 = (new Location(minLat,minLng)).distTo(new Location(minLat,maxLng))
    let lngRange2 = (new Location(maxLat,minLng)).distTo(new Location(maxLat,maxLng))
    let lngRange = (lngRange1 + lngRange2)/2;
    newObj2["precinctDensity"] = arr.length / (latRange * lngRange);
    newObj2["populationDensity"] = newObj2["precinctDensity"] * newObj2["mean"];
    newObj2["precinctDensity"] *= 100;

    return{
        districts: districts,
        params: paramsRes,
        precincts: newObj2,
    }
}

function filterData(data:object,district:number){
    var newObj = {};
    Object.keys(data).forEach(key=>{
        if(Number(data[key][0])==district) newObj[key] = data[key];
    })
    return newObj;
}