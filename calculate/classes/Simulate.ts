import Network from "./Network";
import Town from "./Town";
import Location from "./Location"


export default class Simulate{
    towns: Town[];
    shuffledTowns: Town[];
    network: Network;
    districts: number;
    totalStatePop: number = 0;
    av:number;
    districtPops: number[] = [];
    data: object;
    connectingData: number[] = [];
    round1Data: number[] = [];
    round2Data:number[] = [];
    setData: (a) => void;
    setConnectingData: (a:number[]) => {}; 
    setRound1Data: (a) => void;
    setRound2Data: (a) => void;
    setAlgoState: (a:number) => void;
    setAlgoFocus: (a:number) => void;


    //settings
    intervalConnecting = 300;
    interval1:number = 10; //round one
    useSubiterations:boolean = true; //for round one only
    interval2:number = 20;//round two
    maxConnectingIterations = 1000;
    maxIterations1:number = Number.MAX_VALUE;
    maxIterations2:number = Number.MAX_VALUE;
    gridGranularity:number = 200;
    type:number = 0;
    district:number = 1;
    parameter:number = 0;

    //for packing/cracking only:
    onBorder:number[] = [];
    bordering:number[] = [];
    paramPop:number = 0;


    //Miscellaneous
    isTerminated:boolean = false;
    timeMarker: number;

    constructor(data: object, numDistricts: number, setData, setConnectingData, setRound1Data, setRound2Data,setAlgoState, setAlgoFocus,settings:object){
        //Step 1: set fields
        this.districts = numDistricts;
        for(let i:number = 0;i<this.districts;i++) this.districtPops.push(0);
        this.data = data;
        this.setData = setData;
        this.setConnectingData = setConnectingData;
        this.setRound1Data = setRound1Data;
        this.setRound2Data = setRound2Data;
        this.setAlgoState = setAlgoState;
        this.setAlgoFocus = setAlgoFocus;
        this.intervalConnecting = Number(settings["intervalConnecting"]) || 300;
        this.interval1 = Number(settings["interval1"]) || 10;
        this.interval2 = Number(settings["interval2"]) || 20;
        this.useSubiterations = Boolean(settings["useSubiterations"]) || false;

        this.maxConnectingIterations = Number(settings["maxConnectingIterations"]) || this.maxConnectingIterations;
        this.maxIterations1 = Number(settings["maxIterations1"]) || this.maxIterations1;
        this.maxIterations2 = Number(settings["maxIterations2"]) || this.maxIterations2;
        this.gridGranularity = Number(settings["gridGranularity"]) || this.gridGranularity;

        //for type and pack/crack:
        
        this.type = Number(settings["type"]) || this.type;
        this.district = Number(settings["district"]) || this.district;
        this.parameter = Number(settings["parameter"]) || this.parameter;

        //Step 2: set the towns (+ totalStatePop and av)
        this.towns = Object.keys(data).map(key=>{
            let p:number[] = data[key].map(n=>Number(n));
            this.totalStatePop += p[1];
            let t:Town = new Town(key,p[1],p[2],p[3]);
            if(p[0]>0&&p[0]<=this.districts) { //if already assigNED a district
                t.district = p[0]; //assign it to the Town instance
                this.districtPops[t.district-1] += t.population; //and add it to districtPops
                
                //set param pop
                if(this.type!=0){
                    t.parameter = p.slice(4)[this.parameter]; //get index 4 and after for parameters, THEN get parameter in focus
                    if(t.district==this.district) this.paramPop += t.population * t.parameter;
                }
            }
            return t;
        });
        this.av = this.totalStatePop /this.districts;
        this.shuffledTowns = [...this.towns];
        this.shuffle(this.shuffledTowns);

        //Step 3: create the network
        this.network = new Network(this.towns,this.gridGranularity);
    }

    /* START AND PRECINCT CONNECTING ROUND METHODS BELOW */

    start():void{
        if(this.isTerminated) return;
        if(this.districts==0||Object.keys(this.data).length==0) return;

        this.connectingRoundIteration(this.connectingData);
        this.timeMarker = (new Date()).getTime();
        //and set algoState and algoFocus
        this.setAlgoFocus(0);
        this.setAlgoState(0);
    }

    connectingRoundIteration(prevData:number[]){
        if(this.isTerminated) return;
        var thisData = this.network.makeAllConnections(prevData)
        this.setConnectingData(thisData);
        if(thisData.length>this.maxConnectingIterations||thisData[thisData.length-1]==0){
            if(this.type==0) {
                this.startRounds();
            }else{
                this.pcStartRound();
            }
        }else{
            setTimeout(()=>{
                this.connectingRoundIteration(thisData);
            },this.intervalConnecting)
        }
    }

    /*MAIN ALGORITHM METHODS BELOW*/

    //AFTER precinct connections have been made in Network
    startRounds(): void{
        if(this.isTerminated) return;
        if(this.type!=0){
            this.pcStartRound();
            return;
        }
        this.network.test();
        this.network.connectAllOverlapping();
        this.network.test();
        if(this.districts==0||Object.keys(this.data).length==0) return;
        
        if(this.useSubiterations) {
            this.randomAssignmentIteration(0);
        }else{ 
            this.randomAssignment();
        }
        this.setAlgoFocus(1);
        this.setAlgoState(1);
    }

    randomAssignment(){
        if(this.isTerminated) return;
        var count:number = 0;
        this.shuffledTowns.forEach(t=>{
            var district:number = (count % this.districts) + 1;
            if(t.district<=0||t.district>this.districts){
                this.assign(t,district);
            }
            count++;
        })
        this.setData({...this.data});
        this.roundOneIteration(0,0);
    }

    randomAssignmentIteration(townIndex:number): void{
        if(this.isTerminated) return;
        //Step 1: assign to a distict
        var district:number = (townIndex % this.districts) + 1;
        var t:Town = this.shuffledTowns[townIndex];
        if(t.district<=0||t.district>this.districts){
            this.assignData(t,district);
        }

        //Step 2: increment townIndex
        townIndex++;

            
        setTimeout(()=>{
            //Step 3: check if all precincts have been randomly assigned and move onto round one.
            if(townIndex>=this.towns.length){
                this.roundOneSubiteration(0,0,0,0);
            }else{
                this.randomAssignmentIteration(townIndex);
            }
        },this.interval1)
    }

    roundOneIteration(prevPU:number, secondPrevPU):void{
        if(this.isTerminated) return;
        var unchangedCount:number = 0;
        this.towns.forEach(t=>{
            //Step 1: find closest district
            let minDist:number = Number.MAX_VALUE;
            let closestDistrictIndex:number = 0;
            //A: get the centers of each district
            let centers: Location[] = this.getDistrictCenters();
            //B: loop through them to see which one is closest
            for(let i:number = 0;i<centers.length;i++){
                if(centers[i]==null) continue;
                let dist:number = t.location.distTo(centers[i]) * this.districtPops[i];
                if(dist<minDist){
                    minDist = dist;
                    closestDistrictIndex = i;
                }
            }

            //Step 2: assign to that district or increment unchangedCount
            if(closestDistrictIndex + 1 == t.district){
                unchangedCount += 1;
            }else{
                this.assign(t,closestDistrictIndex + 1);
            }
        })

        //Step 3: calculate pu and see if you need to terminate
        var pu:number = unchangedCount / this.towns.length;
        var prevRound1Data = [...this.round1Data];
        this.round1Data = [...this.round1Data,pu];
        this.setRound1Data(this.round1Data);
        this.setData({...this.data}); //also update the map data
        
        setTimeout(()=>{
            if(prevRound1Data.includes(pu)||pu==1||this.round1Data.length > this.maxIterations1){ //if already had this pu value, then terminate
                this.roundTwoIteration(Number.MAX_VALUE);
                this.setAlgoFocus(2);
                this.setAlgoState(2);
                return;
            }else{
                secondPrevPU = prevPU;
                prevPU = pu;
                //Step 4: recurse
                this.roundOneIteration(prevPU,secondPrevPU);
            } 
        },this.interval1);
    }

    roundOneSubiteration(townIndex: number, unchangedCount: number, prevPU: number, secondPrevPU: number): void{
        if(this.isTerminated) return;

        let t:Town = this.towns[townIndex];

        //Step 1: find closest district
        let minDist:number = Number.MAX_VALUE;
        let closestDistrictIndex:number = 0;
        //A: get the centers of each district
        let centers: Location[] = this.getDistrictCenters();
        //B: loop through them to see which one is closest
        for(let i:number = 0;i<centers.length;i++){
            if(centers[i]==null) continue;
            let dist:number = t.location.distTo(centers[i]) * this.districtPops[i];
            if(dist<minDist){
                minDist = dist;
                closestDistrictIndex = i;
            }
        }

        //Step 2: assign to that district or increment unchangedCount
        var isUnchanged:boolean = closestDistrictIndex + 1 == t.district
        if(isUnchanged){
            unchangedCount += 1;
        }else{
            this.assignData(t,closestDistrictIndex + 1);
        }

        //Step 3: increment townIndex
        townIndex++;

        //Step 4: check if one whole iteration is over and see if you need to keep going
        if(townIndex>=this.towns.length){
            let pu:number = unchangedCount/this.towns.length;
            var prevRound1Data = [...this.round1Data];
            this.round1Data = [...this.round1Data,pu];
            this.setRound1Data(this.round1Data);
            if(prevRound1Data.includes(pu)||pu==1||this.round1Data.length > this.maxIterations1){
                //if alternating, STOP ROUND ONE, and go onto second round
                this.roundTwoIteration(Number.MAX_VALUE);
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

        setTimeout(()=>{
            //Step 5: recurse and redo
            this.roundOneSubiteration(townIndex, unchangedCount,prevPU,secondPrevPU);
        },isUnchanged?0:this.interval1); //no interval if not changed.
    }

    roundTwoIteration(prevRSD:number):void{
        if(this.isTerminated) return;

        var centers:Location[] = this.getDistrictCenters();

        var hashedNum:number = 0;
        var maxPopDiff:number = Number.MAX_VALUE;

        var dTown:Town;

        //Step 1: find the two connected distrits with the biggest population difference
        this.towns.forEach(t=>{
            let secondDistrict:number = this.findClosestDistrictBorder(t);
            if(secondDistrict==-1) return; //if not on the border
            let diff:number = this.getDiff(t);
            if(diff > 1) diff = 1/diff; //just trying to find the pair of districts, so either order is fine;
            if(diff < maxPopDiff){
                maxPopDiff = diff;
                hashedNum = this.districtsHash(t);
                dTown = t;
            }
        })

        //Step 2: find the town in the bigger district closest to the smaller district
        var minDist:number = Number.MAX_VALUE;
        var biggerDistrict:number = this.unHash(hashedNum)[1];
        var smallerDistrict:number = this.unHash(hashedNum)[0];
        var res:Town = null;
        this.towns.forEach(t=>{
            if(t.district!=biggerDistrict||!this.isBordering(t.id,smallerDistrict)) return; //must be in the bigger district and bordering the smaller one
            var thisDist:number = t.location.distTo(centers[smallerDistrict -1 ]);
            if(thisDist < minDist){
                minDist = thisDist;
                res = t;
            }
        })
        if(res==null){
            this.network.test();
            return;
        }
        this.assignData(res,smallerDistrict);
        
        //Step 3: recalculate rsd
        var thisRSD:number = Number((this.stddev() / this.av).toFixed(5));
        this.round2Data = [...this.round2Data,thisRSD];
        this.setRound2Data(this.round2Data);

        

        setTimeout(()=>{
            //Step 4: determine whether to end or keep recursing
            let indexOfValue:number = this.round2Data.indexOf(thisRSD);
            //if is already in array and is not just the last or second last value
            // if(indexOfValue<this.round2Data.length-2){
            //     console.log("Cycling?: "+res.name+ ", "+biggerDistrict+" -> "+smallerDistrict);
            // }
            if((indexOfValue<this.round2Data.length-2&&this.round2Data[this.round2Data.length-2]!=thisRSD)||this.round2Data.length>this.maxIterations2){
                
                
                //end round 2
                this.setAlgoState(4);
                this.setAlgoFocus(3);
            }else{
                prevRSD = thisRSD;
                this.roundTwoIteration(prevRSD);
            }
        },this.interval2)
    }

    /* PACK AND CRACK METHODS BELOW */

    pcStartRound(){
        if(this.isTerminated) return;
        if(this.type==0){
            this.startRounds();
            return;
        }

        //Step 1: fill out bordering and onBorder towns
        this.towns.forEach(town=>{
            //first check to fill out 


            let adjs:number[] = this.network.getAdjacents(town.id);
            let isBordering:boolean = false;
            let isOnBorder:boolean = false;
            adjs.forEach(t=>{
                let otherTown:Town = this.towns[t];
                if(town.district==this.district&&otherTown.district!=this.district){
                    isOnBorder = true; //town is inside, but adjacent to a town in another district
                }
                if(town.district!=this.district&&otherTown.district==this.district){
                    isBordering = true; //town is NOT in this district, but is adjacent to a town in the district
                }
            })

            //If either bordering or onBorder, add to the arrays
            if(isOnBorder&&!this.onBorder.includes(town.id)) this.onBorder.push(town.id);
            else if(isBordering&&!this.bordering.includes(town.id)) this.bordering.push(town.id);
        })

        //Step 2: start iterating
        this.setAlgoFocus(1);
        this.setAlgoState(1); 
        this.pcIterate([]);
    }

    pcIterate(prevData:number[]){
        if(this.isTerminated) return;;
        this.setRound1Data(prevData);
        let districtAvParam = (this.paramPop/this.districtPops[this.district-1]);
        if(this.districtPops[this.district-1]>this.av){//greater than average, need to LOSE
            let t:Town|null = null;

            //Step A: Sort by distance to this district's center, descending, furthest out first.
            let districtCenter:Location = this.getDistrictCenters()[this.district-1]; //get the element in the array that is the location of the focused district.
            this.onBorder.sort((a,b)=>this.towns[b].location.distTo(districtCenter) - this.towns[a].location.distTo(districtCenter));



            //Step B: find the furthest precinct on the border that satisfies the criteria.
            for(let i:number = 0;i<this.onBorder.length;i++){
                let town:Town = this.towns[this.onBorder[i]];

                //Criteria 1: check that it has a bordering district that is less populous than the current district
                let borderingDistrictsPops:number[] = this.network.getAdjacents(this.onBorder[i]).filter(dN=>dN!=this.district).map(aId=>this.districtPops[this.towns[aId].district-1]);
                borderingDistrictsPops.sort((a,b)=>a-b);
                if(borderingDistrictsPops[0]>this.districtPops[this.district-1]) continue;

                //Criteria 2: check that it is higher/lower in a certain parameter
                if((this.type==1&&town.parameter<=districtAvParam)||(!(this.type==1)&&town.parameter>=districtAvParam)){
                    t = town;
                    break;
                }
            }

            //Step C: if will not actually increase/decrease parameter, then end all iterations. Otherise, lose the precinct.
            if(t==null){
     
                this.setAlgoFocus(3);
                this.setAlgoState(4);
  
                return;
            }else{
           
                let canLose = this.loseTown(t); //always keep iterating on a LOSE, unless t is null
        
                if(!canLose){
                    this.setAlgoFocus(3);
                    this.setAlgoState(4);
                    return;
                }
            }
        }else{//lesser than average, need to GAIN
            let t:Town|null = null;

            //Step A: Sort by distance to district center, ascending, closest first
            let districtCenter:Location = this.getDistrictCenters()[this.district-1]; //get the element in the array that is the location of the focused district.
            this.bordering.sort((a,b)=>this.towns[a].location.distTo(districtCenter) - this.towns[b].location.distTo(districtCenter));

            //Step B: find the closest precinct that satisfies the criteria
            for(let i:number = 0;i<this.bordering.length;i++){
                let town:Town = this.towns[this.bordering[i]];

                //Criteria 1: the district it is in must have a higher population than the current district, else continue
                if(this.districtPops[town.district-1]<this.districtPops[this.district-1]) continue;
              
                //Criteria 2: check that it is higher/lower in a certain parameter
                if((this.type==1&&town.parameter>=districtAvParam)||(!(this.type==1)&&town.parameter<=districtAvParam)){
                    t = town;
                    break;
                }
            }

            //Step C: if it will not help pack/crack, stop algorithm, else gain the precinct.
            if(t==null){
                this.setAlgoFocus(3);
                this.setAlgoState(4);
                return;
            }else{
                this.gainTown(t);
               
            }
        }
        
        setTimeout(()=>{
            if(prevData.length>this.maxIterations1){
                this.setAlgoFocus(3);
                this.setAlgoState(4);
                return;
            }else{
                this.pcIterate([...prevData,districtAvParam])
            }
        },this.interval1)
    }

   //returns if can successfully lose the town.
    loseTown(t:Town):boolean{
        if(t.district!=this.district) return; //MUST lose from district in focus

        //Step 1: find the district to lose to (least populous bording district)
        
        var adjs:number[] = this.network.getAdjacents(t.id);
        var toDistrict:number = -1;
        var minPop:number = Number.MAX_VALUE;
        adjs.forEach(t=>{
            if(this.towns[t].district!=this.district&&this.districtPops[this.towns[t].district-1]<minPop){
                toDistrict = this.towns[t].district;
                minPop = this.districtPops[this.towns[t].district-1];
            }
        })
        if(toDistrict==-1) return false;//no adjacents
        else{
            this.assignData(t,toDistrict);
        }
        //Step 2: remove from onBorder, add to bordering
        var tIndex = this.onBorder.indexOf(t.id);
        this.onBorder.splice(tIndex,1); //remove from onBorder
        this.bordering.push(t.id);

        //Step 3: Find new precincts onBorder,and remove precincts from "bordering" that are no longer bordering because of this removal
        //only the adjacents of the removed town could be new onBorders (only check if in the focused district, because they border the removed district, which is NOT in the focused district anymore)
        this.network.getAdjacents(t.id).forEach(adjId=>{
            let otherTown:Town = this.towns[adjId];
            if(otherTown.district==this.district&&!this.onBorder.includes(adjId)) this.onBorder.push(adjId); //add to onBorder
            if(otherTown.district!=this.district&&this.bordering.includes(adjId)&&this.checkIsBordering(otherTown)){
                let index = this.bordering.indexOf(adjId);
                this.bordering.splice(index,1);
            }
        })
        return true;
    }

    gainTown(t:Town){
        if(t.district==this.district) return; //MUST be bordering, NOT in the district

        //Step 1: assign the precinct to the focus district
        this.assignData(t,this.district);

        //Step 2: remove from bordering, add to onBorder
        var tIndex = this.bordering.indexOf(t.id);
        this.bordering.splice(tIndex,1);
        this.onBorder.push(t.id);

        //Step 3: remove precincts that are no longer onBorder because this is added, and add new precincts to "bordering" because this is added
        this.network.getAdjacents(t.id).forEach(adjId=>{
            let otherTown:Town = this.towns[adjId];
            if(otherTown.district==this.district&&this.onBorder.includes(adjId)&&!this.checkIsOnBorder(otherTown)){
                let index = this.onBorder.indexOf(adjId);
                this.onBorder.splice(index,1);
            }
            if(otherTown.district!=this.district&&!this.bordering.includes(adjId)) this.bordering.push(adjId);
        })
    }

    checkIsBordering(t:Town){
        var isBordering:boolean = false;
        this.network.getAdjacents(t.id).forEach(adjId=>{
            if(this.towns[adjId].district==this.district) isBordering = true;
        })
        return t.district !== this.district && isBordering; //need to also make sure it's NOT in this district
    }

    checkIsOnBorder(t:Town){
        var isOnBorder:boolean = false;
        this.network.getAdjacents(t.id).forEach(adjId=>{
            if(this.towns[adjId].district!=this.district) isOnBorder = true;
        })
        return t.district == this.district && isOnBorder; //need to also make sure it's actually in the district
    }



    /*HELPER METHODS BELOW */

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
                district = borderingTown.district;
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
        this.districtPops.forEach(d => res += Math.pow((d-this.av),2));
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

    shuffle(arr:any[]):void{
        arr.sort(()=>Math.random()-0.5);
    }


    assign(t:Town,district:number):void{
        if(t.district!=null&&t.district>0) this.districtPops[t.district - 1] -= t.population;
        if(this.type!=0&&t.district==this.district) this.paramPop -= t.population * t.parameter;
        t.district = district;
        this.districtPops[t.district - 1] += t.population;
        if(this.type!=0&&district==this.district) this.paramPop += t.population * t.parameter;
        this.data[t.name][0] = district;
    }

    assignData(t:Town,district:number):void{
        this.assign(t,district); //first assign
        this.setData({...this.data}); //then set data;
    }

    terminate(){
        this.isTerminated = true;
    }
}