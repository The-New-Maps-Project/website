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
    round1Data: number[];
    round2Data:number[];
    
    setData: (a) => void;
    setRound1Data: (a) => void;
    setRound2Data: (a) => void;
    setAlgoState: (a:number) => void;
    setAlgoFocus: (a:number) => void;

    constructor(data: object, numDistricts: number, setData, setRound1Data, setRound2Data,setAlgoState, setAlgoFocus){
        //Step 1: set fields
        this.districts = numDistricts;
        this.data = data;
        this.setData = setData;
        this.setRound1Data = setRound1Data;
        this.setRound2Data = setRound2Data;
        this.setAlgoState = setAlgoState;
        this.setAlgoFocus = setAlgoFocus;

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
        this.randomAssignmentIteration(0);
        this.setAlgoFocus(1);
        this.setAlgoState(1);
    }

    randomAssignmentIteration(townIndex:number): void{

        //Step 1: assing to a distict
        var district:number = (townIndex % this.districts) + 1;
        this.assignData(this.towns[townIndex],district);

        //Step 2: increment townIndex
        townIndex++;

        //Step 3: check if all precincts have been randomly assigned and move onto round one.
        if(townIndex>=this.towns.length){
            this.roundOneSubiteration(0,0,0,0);
        }else{
            this.randomAssignmentIteration(townIndex);
        }
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

            //Step 3: increment townIndex
            townIndex++;

            //Step 4: check if one whole iteration is over and see if you need to keep going
            if(townIndex>=this.towns.length){
                let pu:number = unchangedCount/this.towns.length;
                if(pu==secondPrevPU){
                    //if alternating, STOP ROUND ONE, and go onto second round
                    this.roundTwoIteration(this.stddev(),0);
                    this.setAlgoFocus(2);
                    this.setAlgoState(2);
                    return;
                }else{
                    this.round1Data = [...this.round1Data,pu];
                    this.setRound1Data(this.round1Data);
                    secondPrevPU = prevPU;
                    prevPU = pu;
                    townIndex = -1; //so it's zero on next subiteration, to start a new full iteration.
                }
            }

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
        this.districtPops.forEach(d => res += Math.pow(d-av,2));
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
            res[districtIndex].lng += t.location.lng;
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