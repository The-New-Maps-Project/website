import Network from "./Network";
import Town from "./Town";

export default class PackandCrack{
    network:Network;
    data: object;
    towns: Town[];
    av: number;
    numDistricts: number;
    districtPops: number[];
    paramPop:number; //JUST in the focused district

    pcData:number[];
    setPcData:(a:number[])=>{};
    setData:(a)=>{}
    setConnectingData:(a:number[])=>{};
    setPcState: (a:number)=>{};
    setPcFocus: (a)=>{};
    isTerminated:boolean =false;
    bordering: number[] = []; //NOT in the district, but bordering it. townIds
    onBorder: number[] = []; //IN the district, on it's border. townIds

    //settings
    isPacking:boolean;
    parameter:number;
    district:number;
    intervalConnecting:number;
    interval: number;
    maxConnectingIterations: number;
    maxIterations:number;
    gridGranularity:number;
    

    constructor(data:object,numDistricts:number,setData,setConnectingData,setPcData,setPcState,setPcFocus,pcSettings:object){
        this.isPacking = pcSettings["isPacking"];
        this.parameter = pcSettings["parameter"];
        this.district = pcSettings["district"]; 
        this.intervalConnecting = pcSettings["intervalConnecting"]
        this.interval = pcSettings['interval']
        this.gridGranularity = pcSettings['gridGranularity'] || 200;
        this.numDistricts = numDistricts;

        this.data = data;
        this.setData = setData;
        this.setConnectingData = setConnectingData;
        this.setPcData = setPcData;
        this.setPcState = setPcState;
        this.setPcFocus = setPcFocus;

        this.districtPops = [];
        for(let i:number = 0;i<this.numDistricts;i++) this.districtPops.push(0);

        //Step 2: set the towns and find av
        var totalStatePop = 0;
        this.towns = Object.keys(data).map(key=>{
            let p:number[] = data[key].map(n=>Number(n));
            totalStatePop += p[1];
            let t:Town = new Town(key,p[1],p[2],p[3]);
            if(p[0]>0&&p[0]<=this.numDistricts) { //if already assing a district
                t.district = p[0]; //assign it to the Town instance
                t.parameter = p.slice(4)[this.parameter]; //get index 4 and after for parameters, THEN get parameter in focus
                this.districtPops[p[0]-1] += p[1]; //add to district population
                if(t.district==this.district) this.paramPop += p[1] * t.parameter;
            }
            return t;
        });
        this.av = totalStatePop /this.numDistricts;
        console.log("District Pops: "+this.districtPops)

        //Step 3: create the network
        this.network = new Network(this.towns,this.gridGranularity);
    }

    start(){
        this.connectingRoundIteration([]);
    }

    connectingRoundIteration(prevData:number[]){
        var thisData = this.network.makeAllConnections(prevData)
        this.setConnectingData(thisData);
        if(thisData.length>this.maxConnectingIterations||thisData[thisData.length-1]==0){
            this.startRound();
        }else{
            setTimeout(()=>{
                this.connectingRoundIteration(thisData);
            },this.intervalConnecting)
        }
    }

    startRound(){
        //Step 1: fill out bordering and onBorder towns
        this.towns.forEach(town=>{
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
        this.iterate([])
    }

    iterate(prevData:number[]){
        if(this.isTerminated) return;
        this.setPcData(prevData);

        let districtAvParam = (this.paramPop/this.districtPops[this.district-1]);
        if(this.districtPops[this.district-1]>this.av){//greater than average, need to LOSE
            let t:Town|null = null;
            let p:number = (this.isPacking?1:-1) * Number.MAX_VALUE; //find minimum to lose if packing, maximum to lose if cracking
            this.onBorder.forEach(tId=>{
                let town:Town = this.towns[tId];
                //find minimum to lose if packing,   or  maximum to lose if cracking
                if((this.isPacking&&town.parameter<p)||(!this.isPacking&&town.parameter>p)){
                    p = town.parameter
                    t = town;
                }
            })
            if(t==null){
                this.setPcFocus(2);
                this.setPcState(3);
                return;
            }else{
                this.loseTown(t); //always keep iterating on a LOSE, unless t is null
            }
        }else{//lesser than average, need to GAIN
            let t:Town|null = null;
            let p:number =  (this.isPacking?-1:1) * Number.MAX_VALUE; //find maximum to gain if packing, minimum to gain if cracking
            this.bordering.forEach(tId=>{
                let town:Town = this.towns[tId];
                if((this.isPacking&&town.parameter>p)||(!this.isPacking&&town.parameter<p)){
                    p = town.parameter;
                    t = town;
                }
                
            })
            if(t==null||(this.isPacking&&p<=districtAvParam)||(!this.isPacking&&p>=districtAvParam)){
                console.log("PRECINT PARAM: "+p);
                this.setPcFocus(2);
                this.setPcState(3);
                return;
            }else{
                this.gainTown(t);
            }
        }
        setInterval(()=>{
            if(prevData.length>this.maxIterations){
                this.setPcState(3);
                this.setPcFocus(2);
                return;
            }else{
                this.iterate([...prevData,districtAvParam])
            }
        },this.interval)
    }

    loseTown(t:Town){
        if(t.district!=this.district) return; //MUST lose from district in focus

        //Step 1: find the district to lose to (least populous bording district)
        var adjs:number[] = this.network.getAdjacents(t.id);
        var toDistrict:number = -1;
        var minPop:number = Number.MAX_VALUE;
        adjs.forEach(t=>{
            if(this.districtPops[this.towns[t].district-1]<minPop){
                toDistrict = this.towns[t].district;
                minPop = this.districtPops[this.towns[t].district-1];
            }
        })
        if(toDistrict==-1) return;//no adjacents
        else{
            this.assign(t,toDistrict);
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
    }

    gainTown(t:Town){
        if(t.district==this.district) return; //MUST be bordering, NOT in the district

        //Step 1: assign the precinct to the focus district
        this.assign(t,this.district);

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

    assign(t:Town,district:number):void{
        if(t.district!=null&&t.district>0) this.districtPops[t.district - 1] -= t.population;
        if(t.district==this.district) this.paramPop -= t.population * t.parameter;
        t.district = district;
        this.districtPops[district - 1] += t.population;
        if(district==this.district) this.paramPop += t.population * t.parameter;
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