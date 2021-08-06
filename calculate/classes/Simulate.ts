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

    constructor(data: object, numDistricts: number){
        //Step 1: set districts
        this.districts = numDistricts;

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
        this.roundOneSubiteration(0,0,0);
    }

    roundOneSubiteration(townIndex: number, unchangedCount: number, prevPercentUnchanged: number): void{
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

            }

            //Step 3: check if one whole iteration is over and see if you need to keep going
            if(townIndex>=this.towns.length){

            }

            //Step 4: increment townIndex
            townIndex++;

            //Step 5: recurse and redo

            
        },this.interval);
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
    }

    assignData(t:Town,district:number):void{

    }
}