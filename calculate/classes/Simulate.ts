import Network from "./Network";
import Town from "./Town";
import Location from "./Location"
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";

export default class Simulate{
    towns: Town[];
    network: Network;
    districts: number;
    totalStatePop: number = 0;
    av:number;
    districtPops: number[] = [];
    interval: number = 10;//time between iterations in milliseconds
    data: object;
    round1Data: number[] = [];
    round2Data:number[] = [];
    
    setData: (a) => void;
    setRound1Data: (a) => void;
    setRound2Data: (a) => void;
    setAlgoState: (a:number) => void;
    setAlgoFocus: (a:number) => void;

    constructor(data: object, numDistricts: number, setData, setRound1Data, setRound2Data,setAlgoState, setAlgoFocus){
        //Step 1: set fields
        this.districts = numDistricts;
        for(let i:number = 0;i<this.districts;i++) this.districtPops.push(0);
        this.data = data;
        this.setData = setData;
        this.setRound1Data = setRound1Data;
        this.setRound2Data = setRound2Data;
        this.setAlgoState = setAlgoState;
        this.setAlgoFocus = setAlgoFocus;
        

        //Step 2: set the towns (+ totalStatePop and av)
        this.towns = Object.keys(data).map(key=>{
            let p:number[] = data[key].map(n=>Number(n));
            this.totalStatePop += p[1];
            let t:Town = new Town(key,p[1],p[2],p[3]);
            if(p[0]>0) { //if already assing a district
                t.district = p[0]; //assign it to the Town instance
                this.districtPops[t.district-1] += t.population; //and add it to districtPops
            }
            return t;
        });
        this.av = this.totalStatePop /this.districts;

        //Step 3: create the network
        this.network = new Network(this.towns,2000);
    }

    start(): void{
        this.randomAssignmentIteration(0);
        if(this.districts==0||Object.keys(this.data).length==0) return;
        this.setAlgoFocus(1);
        this.setAlgoState(1);
    }

    randomAssignmentIteration(townIndex:number): void{
        setTimeout(()=>{
            //Step 1: assign to a distict
            var district:number = Math.floor(Math.random()*this.districts)+1;// (townIndex % this.districts) + 1;
            if(this.towns[townIndex].district<=0) this.assignData(this.towns[townIndex],district);
            //console.log(townIndex);

            //Step 2: increment townIndex
            townIndex++;

            //Step 3: check if all precincts have been randomly assigned and move onto round one.
            if(townIndex>=this.towns.length){
                this.roundOneSubiteration(0,0,0,0);
            }else{
                this.randomAssignmentIteration(townIndex);
            }
        },this.interval)
        
    }

    roundOneSubiteration(townIndex: number, unchangedCount: number, prevPU: number, secondPrevPU: number): void{
        setTimeout(()=>{
            let t:Town = this.towns[townIndex];
            //console.log(t.name);

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
                this.round1Data = [...this.round1Data,pu];
                this.setRound1Data(this.round1Data);
                if(pu==secondPrevPU||pu==1){
                    //if alternating, STOP ROUND ONE, and go onto second round
                    this.roundTwoIteration(this.stddev(),0);
                    this.setAlgoFocus(2);
                    this.setAlgoState(2);
                    return;
                }else{
                    secondPrevPU = prevPU;
                    prevPU = pu;
                    townIndex = 0; //zero on next subiteration, to start a new full iteration.
                    unchangedCount = 0;
                }
            }

            //Step 5: recurse and redo
            this.roundOneSubiteration(townIndex, unchangedCount,prevPU,secondPrevPU);
            
        },this.interval);
    }

    roundTwoIteration(prevRSD:number, secondPrevRSD:number):void{
        setTimeout(()=>{
            var centers:Location[] = this.getDistrictCenters();

            var hashedNum:number = 0;
            var maxPopDiff:number = Number.MAX_VALUE;
    
            //Step 1: find the two connected distrits with the biggest population difference
            this.towns.forEach(t=>{
                let secondDistrict:number = this.findClosestDistrictBorder(t);
                if(secondDistrict==-1) return; //if not on the border
                let diff:number = this.getDiff(t);
                if(diff > 1) diff = 1/diff; //just trying to find the pair of districts, so either order is fine;
                if(diff < maxPopDiff){
                    maxPopDiff = diff;
                    hashedNum = this.districtsHash(t);
                }
            })
    
            //Step 2: find the town in the bigger district closest to the smaller district
            var minDist:number = Number.MAX_VALUE;
            var biggerDistrict:number = this.unHash(hashedNum)[1];
            var smallerDistrict:number = this.unHash(hashedNum)[0];
            var res:Town = this.towns[0];
            this.towns.forEach(t=>{
                if(t.district!=biggerDistrict||!this.isBordering(t.id,smallerDistrict)) return; //must be in the bigger district and bordering the smaller one
                var thisDist:number = t.location.distTo(centers[smallerDistrict -1 ]);
                if(thisDist < minDist){
                    minDist = thisDist;
                    res = t;
                }
            })
            console.log(res.name + ": "+biggerDistrict+" --> " +smallerDistrict);
            this.assignData(res,smallerDistrict);
            
            //Step 3: recalculate rsd
            var thisRSD:number = this.stddev() / this.av;
            console.log(thisRSD);
            this.round2Data = [...this.round2Data,thisRSD];
            this.setRound2Data(this.round2Data);

            //Step 4: determine whether to end or keep recursing
            if(thisRSD==secondPrevRSD){
                //end round 2
                this.setAlgoState(3);
                this.setAlgoFocus(3);
            }else{
                secondPrevRSD = prevRSD;
                prevRSD = thisRSD;
                this.roundTwoIteration(prevRSD,secondPrevRSD);
            }

        },this.interval)
    }

    getDiff(t:Town):number{
        return this.districtPops[t.secondDistrict - 1] / this.districtPops[t.district - 1];
    }

    //also sets it as secondDistrict of the town
    findClosestDistrictBorder(t:Town):number{
        var adj:number[] = this.network.getAdjacents(t.id);
        var minDist:number = Number.MAX_VALUE;
        var district:number = -1;
        adj.forEach(i=>{
            var borderingTown:Town = this.towns[i];
            if(t.distTo(borderingTown)<minDist&&t.district!=borderingTown.district){
                district = this.towns[i].district;
                minDist = t.distTo(borderingTown);
            }
        })
        t.secondDistrict = district;
        return district;
    }

    districtsHash(t:Town){
        return (Math.max(t.district,t.secondDistrict)-1) * this.districts + Math.min(t.district,t.secondDistrict) - 1;
    }

    //use districtPops
    stddev():number{
        let res:number = 0;
        console.log(this.av);
        this.districtPops.forEach(d => res += Math.pow((d-this.av),2));
        res /= this.districts;
        res = Math.sqrt(res);
        console.log(this.districtPops);
        console.log(res);
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
            if(districtIndex<0||districtIndex>=this.districts) return;
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

    isBordering(townId:number,district:number):boolean{
        var adj:number[] = this.network.getAdjacents(townId);
        for(let i:number = 0;i<adj.length;i++){
            var d:number = adj[i];
            if(this.towns[d].district == district) return true;
        }
        return false;
    }

    //outputs two district number, always smaller first, bigger second (in terms of population)
    unHash(hashNumber:number):number[]{
        var a:number = Math.floor(hashNumber / this.districts) + 1
        var b:number = (hashNumber % this.districts) + 1;
        if(this.districtPops[a-1] > this.districtPops[b-1]) return [b,a];
        return [a,b]
    }


    assign(t:Town,district:number):void{
        if(t.district!=null&&t.district>0) this.districtPops[t.district - 1] -= t.population;
        t.district = district;
        this.districtPops[t.district - 1] += t.population;
        this.data[t.name][0] = district;
    }

    assignData(t:Town,district:number):void{
        this.assign(t,district); //first assign
        this.setData({...this.data}); //then set data;
    }
}