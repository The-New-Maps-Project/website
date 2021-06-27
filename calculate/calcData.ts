import { allAsdpc } from "./asdpc";
import { sumPopulation } from "./sumPopulation";
/**
 * RETURN FORMAT:
 * {
 *      districts: [ {
 *          populations: number[]
 *          asdpc: number[]
 *      } ]
 *      params: [ {
 *          population: number
 *          mean: number
 *          stddev: number
 *          outliers: number[]
 *          asdpcMean: number
 *          asdpcStddev: number
 *          asdpcOutliers: number
 *          
 *          percent?: number
 *          percentMD?: number (marjority districts)
 *          pValue?: number
 *      } ]
 * }
 * 
 * 
 */
export default function calcData(data:object,districts:string[],params:string[]){
    var districtsRes = [];
    for(let i = 0;i<=districts.length;i++){ // 1 more because of total
        let newObj = {};
        let newData = i==0?{...data}:filterData(data,i);
        newObj["populations"] = sumPopulation(newData,params);
        newObj["asdpc"] = allAsdpc(newData,params);
        districtsRes.push(newObj);
    }
    return{
        districts: districtsRes
    }
}

function filterData(data:object,district:number){
    var newObj = {};
    Object.keys(data).forEach(key=>{
        if(Number(data[key][0])==district) newObj[key] = data[key];
    })
    return newObj;
}