import Location from "./Location";
import Town from "./Town";

export default class Network{
    graph: number[][] = [];
    grid: number[] = [];
    rows:number;
    cols:number;
    minLat: number;
    minLng: number;
    incLat: number; //"inc" is short for "increment"
    incLng: number;
    towns: Town[];
    maxIterations: number; //for making connections
    isDoneConnected: boolean = false;

    constructor(townsParam: Town[], granularity:number){

        //Step 1: initialize graph, towns, and grid
        for(let i:number=0;i<townsParam.length;i++) this.graph.push([]);
        this.towns = townsParam; //pass by REFERENCE
        this.rows = Math.round(granularity);
        this.cols = Math.round(granularity);
        if(granularity<1) return;
        for(let i:number=0;i<this.rows*this.cols;i++) this.grid.push(-1);

        //Step 2: set townIds
        for(let i:number=0;i<this.towns.length;i++) this.towns[i].id = i;
    

        //Step 3: find min and max lat and lng and set the fields
        this.minLat = Number.MAX_VALUE;
        this.minLng = Number.MAX_VALUE;
        var maxLat:number = -1 * Number.MAX_VALUE;
        var maxLng:number = -1 * Number.MAX_VALUE;
        this.towns.forEach(t=>{
            let thisLat:number = t.location.lat;
            let thisLng:number = t.location.lng;
            if(thisLat < this.minLat) this.minLat = thisLat;
            if(thisLng < this.minLng) this.minLng = thisLng;
            if(thisLat > maxLat) maxLat = thisLat;
            if(thisLng > maxLng) maxLng = thisLng;
        })
        this.incLat = (maxLat - this.minLat) / this.rows;
        this.incLng = (maxLng - this.minLng) / this.cols;
      

        //Step 4: fill in every grid space with the townId closest to id
        this.towns.forEach(t=>{
           this.grid[this.toGridSpace(t)] = t.id;
        })

        //NEW Step 5: assign each town a closestTownDist to insure state boundaries
        this.towns.forEach(t=>{
            this.towns.forEach(otherTown=>{
                if(otherTown.id!=t.id&&t.distTo(otherTown)<t.closestTownDist&&t.distTo(otherTown)>0){
                    t.setClosestTownDist(otherTown);
                }
            })
        })

        //Step 5: fill in areas not within state boundaries with "-2".


        //Going up rows
        // var leftMax:number = this.cols - 1;
        // var rightMin:number = 0;
        // for(let r:number = 0 ; r<this.rows;r++){
        //     //start from left
        //     var c:number = 0;
        //     while(this.grid[this.hash(r,c)]<0&&c<leftMax){
        //         this.grid[this.hash(r,c)] = -2;
        //         c++;
        //     }
        //     leftMax = c;

        //     //start from right
        //     c = this.cols -1;
        //     while(this.grid[this.hash(r,c)]<0&&c>rightMin){
        //         this.grid[this.hash(r,c)] = -2;
        //         c--;
        //     }
        //     rightMin = c;
        // }

        // leftMax = this.cols - 1;
        // rightMin = 0;
        // for(let r:number = this.rows -1; r>=0;r--){
        //     //start from left
        //     var c:number = 0;
        //     while(this.grid[this.hash(r,c)]<0&&c<leftMax){
        //         this.grid[this.hash(r,c)] = -2;
        //         c++;
        //     }
        //     leftMax = c;

        //     //start from right
        //     c = this.cols -1;
        //     while(this.grid[this.hash(r,c)]<0&&c>rightMin){
        //         this.grid[this.hash(r,c)] = -2;
        //         c--;
        //     } 
        //     rightMin = c;
        // }


        //Step 6: floodfill empty spaces
        // var countChanged = 0; //counts how many gridspaces changed their adjacent districts
        // var count = 0;
        // do{
        //     countChanged = 0;
        //     for(let i = 0;i<this.grid.length;i++){
        //         if(this.grid[i]<=-1) continue;
        //         else {
        //             let isChanged:boolean = this.floodFill(i);
        //             if(isChanged) {
        //                 countChanged++;
        //             }
        //         }
        //     }
        //     console.log(countChanged);
        //     count++;
        // }while(countChanged > 0);
        // console.log(count);
    }

    test(){
        //Testing
        var count = 0;
        this.towns.forEach(t=>{
            var adj:number[] = this.graph[t.id];
            if(adj.length==0) count++;
            adj.forEach(otherT=>{
                if(!this.isConnected(otherT,t.id)) console.error("NOT CONNECTED: "+otherT+" , "+t);
                if(!this.graph[otherT].includes(t.id)){
                    console.error(this.towns[otherT].name+" Not connected back to "+this.towns[t.id].name);
                   ;
                }
            })
        })
    //     var index:number = 1393;
    //     //this.printGrid();
    //     console.log(this.towns[index].name);
    //     console.log("Connected to:");
    //     console.log(this.graph.length);
    //     console.log(this.getAdjacents(index).length);
    //     this.getAdjacents(index).forEach(i=>{
    //         console.log(this.towns[i].name);
    //     })

    //     index = 1638;
    //     //this.printGrid();
    //     console.log(this.towns[index].name);
    //     console.log("Connected to:");
    //     console.log(this.graph.length);
    //     console.log(this.getAdjacents(index).length);
    //     this.getAdjacents(index).forEach(i=>{
    //         console.log(this.towns[i].name);
    //     })
    }

    makeAllConnections(data:number[]):number[]{
        //Step 1: check every gridspace to floodfill
        var countChanged = 0; //counts how many gridspaces changed their adjacent districts
        for(let i = 0;i<this.grid.length;i++){
            if(this.grid[i]<=-1) continue;
            else {
                let isChanged:boolean = this.floodFill(i);
                if(isChanged) {
                    countChanged++;
                }
            }
        }
        

        return [...data,countChanged];
    }

    //makes connections for all the precincts that have length zero
    connectAllOverlapping(){
        this.towns.forEach(t=>{
            let adj:number[] = this.graph[t.id];
            if(adj.length==0){
                let otherTownId = this.grid[this.toGridSpace(this.towns[t.id])];
                adj = this.graph[otherTownId];
                adj.forEach(a=>{
                    this.connect(a,t.id);
                })

                //ALWAYS connect to the town it overlaps
                this.connect(t.id,otherTownId);
            }
        })
    }

    getAdjacents(townId:number):number[]{
        var res:number[] = [];
        if(townId<0||townId>=this.graph.length) return res;
        res = this.graph[townId];
        if(res.length==0){
            res = this.graph[this.grid[this.toGridSpace(this.towns[townId])]];
            return res;
        }
        return res;
    }

    //returns boolean, whether it changed any gridspaces
    floodFill(hashedIndex:number):boolean{
        var townId:number = this.grid[hashedIndex];
        if(townId<0) return false; //cannot change anything if empty
        var thisTown:Town = this.towns[townId];
        var adjGridspaces:number[] = this.adjacentSpaces(hashedIndex);
        var isChanged:boolean = false; //set to true by either filling a -1 or -3, or swapping a gridspace because it is closer.
        adjGridspaces.forEach((i) =>{
            //For each adjacent gridspace
            var gridspaceCenter:Location = this.gridspaceCenter(i);

            //First, check if too far away
            if(gridspaceCenter.distTo(thisTown.location)>thisTown.closestTownDist&&this.grid[i]<0){
                if(this.grid[i]!=-3){
                    //console.log(`${this.grid[i]} Changed unreachable`)
                    this.grid[i] = -3; //not filled, but also not needed to be checked
                    isChanged = true;
                }   
            }else if(this.grid[i]==-1||this.grid[i]==-3) {//fill if not filled, -1 is not checked
                this.grid[i] = townId;
                isChanged = true;
                //console.log(townId+" Changed empty")
                return;
            }else if(this.grid[i]==townId||this.grid[i]==-2) return; //same precinct, or out of bounds, return just this function, will loop to the next one.
            else{
                //filled by another precint
                //First check which one is closer
                var otherTownId:number = this.grid[i];
                var thisDist:number = gridspaceCenter.distTo(thisTown.location);
                var thatDist:number = gridspaceCenter.distTo(this.towns[otherTownId].location);
                if(thisDist<thatDist){//switch to current precinct if it is closer
                    this.grid[i] = this.grid[hashedIndex];
                    isChanged = true;
                    //console.log("Changed switch")
                }

                //connect the two precincts if not already
                if(!this.isConnected(townId,otherTownId)) {
                    this.connect(townId,otherTownId);
                }
            }
        })
        return isChanged;
    }

    connect(a:number,b:number):void{
        if(a<0||a>=this.graph.length||b<0||b>=this.graph.length) return;
        if(this.isConnected(a,b)) return;
        this.graph[a].push(b);
        this.graph[b].push(a);
    }

    isConnected(a:number,b:number):boolean{
        if(a<0||a>=this.graph.length||b<0||b>=this.graph.length) return false;
        return (this.graph[a]!=null&&this.graph[a].includes(b)) || (this.graph[b]!=null&&this.graph[b].includes(a));
    }



    toGridSpace(t:Town):number{
        return this.toGridSpaceLocation(t.location.lat,t.location.lng); 
    }

    toGridSpaceLocation(lat:number,lng:number):number{
        var rowNum:number = Math.floor((lat - this.minLat) / this.incLat);
        var colNum:number = Math.floor((lng - this.minLng) / this.incLng);
        if(rowNum == this.rows) rowNum--;
        if(colNum == this.cols) colNum--;
        return this.hash(rowNum,colNum); //rowNum and colNum range from 0 to rows/cols -1
    }

    hash(r:number,c:number):number{
        return r * this.cols + c;
    }

    gridspaceCenter(hashedIndex:number):Location{
        var r:number = Math.floor(hashedIndex / this.cols);
        var c:number = hashedIndex % this.cols;
        return new Location(this.minLat + (r+0.5) * this.incLat, this.minLng + (c+0.5) * this.incLng);
    }

    adjacentSpaces(hashedIndex:number):number[]{
        var res:number[] = [];
        if(hashedIndex%this.cols!=0) res.push(hashedIndex-1); //left
        if(hashedIndex%this.cols!=this.cols-1) res.push(hashedIndex+1); //right
        if(hashedIndex>=this.cols) res.push(hashedIndex-this.cols); //prev row
        if(hashedIndex<(this.cols-1)*this.rows) res.push(hashedIndex + this.cols); //next row
        return res;
    }

    printGrid():void{
        var str:string = ""
        for(let i:number=0;i<this.grid.length;i++){
            if(i%this.rows==0){
                str = "";
            }
            str += String(this.grid[i]) + " , ";
        }
    }
}