import { allAsdpc } from "./asdpc";
import { mean, median, outliers, stddev, sum } from "./oneVarStats";
import { sumPopulation } from "./sumPopulation";
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
 * }
 * 
 * 
 */
export default function calcData(data:object,districtsParam:string[],paramsParam:string[]){
    var districts = [];
    for(let i = 0;i<=districtsParam.length;i++){ // 1 more because of total
        let newObj = {};
        let newData = i==0?{...data}:filterData(data,i);
        newObj["populations"] = sumPopulation(newData,paramsParam);
        newObj["asdpc"] = allAsdpc(newData,paramsParam);
        districts.push(newObj);
    }

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
        districts.forEach(d=>{
            let popsArr = d["populations"];
            if(popsArr[i]/popsArr[0]>0.5) majorityDistricts++;
        })
        newObj["majorityDistricts"] = majorityDistricts;
        paramsRes.push(newObj);
    }


    return{
        districts: districts,
        params: paramsRes
    }
}

function filterData(data:object,district:number){
    var newObj = {};
    Object.keys(data).forEach(key=>{
        if(Number(data[key][0])==district) newObj[key] = data[key];
    })
    return newObj;
}