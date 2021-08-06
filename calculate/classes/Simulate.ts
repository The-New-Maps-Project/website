import Network from "./Network";
import Town from "./Town";
import Location from "./Location"

export default class Simulate{
    towns: Town[];
    network: Network;
    districts: number;
    totalStatePop: number;
    districtPops: number[];
    interval: number = 10;//time between iterations in milliseconds
    data: object;
    setData: (a) => void;
    setRound1Graph: (a) => void;
    setRound2Graph: (a) => void;
    setAlgoState: (a:number) => void;

    constructor(data: object, numDistricts: number, setData, setRound1Graph, setRound2Graph,setAlgoState){
        //Step 1: set fields
        this.districts = numDistricts;
        this.data = data;
        this.setData = setData;
        this.setRound1Graph = setRound1Graph;
        this.setRound2Graph = setRound2Graph;
        this.setAlgoState = setAlgoState;

        //Step 2: set the towns
        var totalStatePop = 0;
        var totalStatePop = 0;
        this.towns = Object.keys(data).map(key=>{
            var p:number[] = data[key].map(n=>Number(n));
            totalStatePop += p[1];
            return new Town(key,p[1],p[2],p[3]);
        });
    }

    start(): void{
        this.roundOneSubiteration(0,0,0,0);
    }

    roundOneSubiteration(townIndex: number, unchangedCount: number, prevPU: number, secondPrevPU: number): void{
        setTimeout(()=>{
            let t:Town = this.towns[townIndex];

            //Step 1: find closest district
            let minDist:number = Number.MAX_VALUE;
            let closestDistrictIndex:number = 0;
            //A: get the centers of each district
            let centers: Location[] = this.getDistrictCenters();
            //B: loop through them to see which one is closest
            for(let i:number = 0;i<centers.length;i++){
                if(centers[i]==null) continue;
                let dist:number = t.location.distTo(centers[i]);
                if(dist<minDist){
                    minDist = dist;
                    closestDistrictIndex = i;
                }
            }

            //Step 2: assign to that district or increment unchangedCount
            if(closestDistrictIndex + 1 == t.district){
                unchangedCount += 1;
            }else{
                this.assignData(t,closestDistrictIndex + 1);
            }

            //Step 3: check if one whole iteration is over and see if you need to keep going
            if(townIndex>=this.towns.length){
                let pu:number = unchangedCount/this.towns.length;
                if(pu==secondPrevPU){
                    //if alternating, STOP ROUND ONE, and go onto second round
                    this.roundTwoIteration(this.stddev(),0);
                    return;
                }else{
                    secondPrevPU = prevPU;
                    prevPU = pu;
                    townIndex = -1; //so it's zero on next subiteration, to start a new full iteration.
                }
            }

            //Step 4: increment townIndex
            townIndex++;

            //Step 5: recurse and redo
            this.roundOneSubiteration(townIndex, unchangedCount,prevPU,secondPrevPU);
            
        },this.interval);
    }

    roundTwoIteration(prevRSD:number, secondPrevRSD:number):void{
        
    }

    //use districtPops
    stddev():number{
        let av:number = this.totalStatePop / this.districts;
        let res:number = 0;
        this.districtPops.forEach(d => res += Math.pow(d,2));
        res /= this.districts;
        res = Math.sqrt(res);
        return res;
    }

    getDistrictCenters(): Location[]{

        //Step 1: fill in res (populations) and counts (# of precincts) with all zeroes for the number of districts
        var res:Location[] = [];
        var counts:number[] = [];
        for(let i = 0;i<this.districts;i++){
            res.push(new Location(0,0)); //must be all zeroes at first because you add all lats and lngs and then divide
            counts.push(0);
        }

        //Step 2: loop through all towns and add the new lat and lng
        this.towns.forEach(t => {
            let districtIndex:number = t.district - 1;
            res[districtIndex].lat += t.location.lat;
            res[defaultStatus].lng += t.location.lng;
            counts[districtIndex] += 1;
        })

        //Step 3: divide by counts for every district lat and lng
        for(let i:number = 0;i<res.length;i++){
            res[i].lat /= counts[i];
            res[i].lng /= counts[i];
        }

        return res;
    }

    assign(t:Town,district:number):void{
        t.district = district;
        this.data[t.name][0] = district;
    }

    assignData(t:Town,district:number):void{
        this.assign(t,district); //first assign
        this.setData(this.data); //then set data;
    }
}