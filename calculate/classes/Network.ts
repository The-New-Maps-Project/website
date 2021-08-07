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

    constructor(townsParam: Town[], granularity:number){

        //Step 1: initialize graph, towns, and grid
        for(let i:number;i<townsParam.length;i++) this.graph.push([]);
        this.towns = townsParam; //pass by REFERENCE
        this.rows = granularity;
        this.cols = granularity;
        for(let i:number;i<this.rows*this.cols;i++) this.grid[i] = -1;

        //Step 2: set townIds
        for(let i:number;i<this.towns.length;i++) this.towns[i].id = i;
    

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

        //Step 5: fill in areas not within state boundaries with "-2".


        //Going up rows
        var leftMax:number = this.cols - 1;
        var rightMin:number = 0;
        for(let r:number = 0 ; r<this.rows;r++){
            //start from left
            var c:number = 0;
            while(this.grid[this.hash(r,c)]<0&&c<leftMax){
                this.grid[this.hash(r,c)] = -2;
                c++;
            }
            leftMax = c;

            //start from right
            c = this.cols -1;
            while(this.grid[this.hash(r,c)]<0&&c>rightMin){
                this.grid[this.hash(r,c)] = -2;
                c--;
            }
            rightMin = c;
        }

        leftMax = this.cols - 1;
        rightMin = 0;
        for(let r:number = this.rows -1; r>=0;r--){
            //start from left
            var c:number = 0;
            while(this.grid[this.hash(r,c)]<0&&c<leftMax){
                this.grid[this.hash(r,c)] = -2;
                c++;
            }
            leftMax = c;

            //start from right
            c = this.cols -1;
            while(this.grid[this.hash(r,c)]<0&&c>rightMin){
                this.grid[this.hash(r,c)] = -2;
                c--;
            }
            rightMin = c;
        }


        //Step 6: floodfill empty spaces
        var countEmpty:number = 0;
        do{
            countEmpty = 0;
            for(let i = 0;i<this.grid.length;i++){
                if(this.grid[i]==-2) continue;
                else if(this.grid[i]==-1) countEmpty++;
                else this.floodFill(i);
            }
            console.log(countEmpty);
        }while(countEmpty > 0);


        //Testing
        var index:number = 104;
        console.log(this.towns[index].name);
        console.log("Connected to:");
        console.log(this.graph.length);
        console.log(this.getAdjacents(index).length);
        this.getAdjacents(index).forEach(i=>{
            console.log(this.towns[i]);
        })
    }

    getAdjacents(townId:number):number[]{
        var res:number[] = [];
        if(townId<0||townId>=this.graph.length) return res;
        res = this.graph[townId];
        if(res.length==0) return res = this.graph[this.grid[this.toGridSpace(this.towns[townId])]];
        return res;
    }

    floodFill(hashedIndex:number):void{
        var townId:number = this.grid[hashedIndex];
        var adjGridspaces:number[] = this.adjacentSpaces(hashedIndex);
        adjGridspaces.forEach((i) =>{
            if(this.grid[i]==-1) this.grid[i] = townId;//fill if not filled
            else if(this.grid[i]==townId||this.grid[i]==-2) return; //same precinct, or out of bounds, return just this function, will loop to the next one.
            else{
                //filled by another precint
                //First check which one is closer
                var otherTownId:number = this.grid[i];
                var gridspaceCenter:Location = this.gridspaceCenter(i);
                var thisDist:number = gridspaceCenter.distTo(this.towns[townId].location);
                var thatDist:number = gridspaceCenter.distTo(this.towns[otherTownId].location);
                if(thisDist<thatDist){//switch to current precinct if it is closer
                    this.grid[i] = this.grid[hashedIndex];
                }

                //connect the two precincts if not already
                if(!this.isConnected(townId,otherTownId)) this.connect(townId,otherTownId);
            }
        })
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

    toGridSpaceLocation(lng:number,lat:number):number{
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
}