import District from "./District";
import Town from "./Town";
import Location from "./Location";

export default class Calculate{
  districts: District[];
  allTownsFinal: Town[];
  allTowns: Town[];
  outputData: object; //[name]: districtNo.


  //pass in the data as an array, with each line (town) as a separate element
  constructor(data:object,districts:number,pThreshold:number){
    var totalStatePop = 0;
    this.districts = [];
    var totalStatePop = 0;
    this.allTownsFinal = Object.keys(data).map(key=>{
      var p:number[] = data[key].map(n=>Number(n));
      totalStatePop += p[1];
      return new Town(key,p[1],p[2],p[3]);
    });
    this.allTowns = [...this.allTownsFinal]; // a clone of the data array to delete already counted towns

    var threshold = pThreshold*totalStatePop/districts;
    var districtNo =1;
    while(districtNo<=districts){
      this.districts.push(this.createDistrict(threshold,districtNo));
      districtNo++;
    }


    //remaining towns, assign them to closest district
    while(this.allTowns.length>0){
      var currentTown = this.allTowns[0];
      var index = this.findClosestTownWithDistrict(currentTown)-1;
      this.districts[index].addTown(currentTown);
      this.allTowns.splice(0,1);
    }

    this.outputData = {};
    this.districts.forEach((d)=>{
      d.towns.forEach((t)=>{
        this.outputData[t.name] = t.district;
      })
    })
  }



  //creates a district around the most populous town available, deleting added towns along the way. 
  //pass in a threshold (the actual population number, NOT a percent of decimal), and the number district (ex: 1)
  createDistrict(threshold,num){
    if(this.allTowns.length<1) return new District(num);
    var d = new District(num);
    var mpIndex = this.findMostPopulous();
    d.addTown(this.allTowns[mpIndex]);
    this.allTowns.splice(mpIndex,1);
    //then keep adding nearest town until passed the threshold
    while(d.totalPop<threshold&&this.allTowns.length>0){
      var index = this.findClosest(d);
      d.addTown(this.allTowns[index]);
      this.allTowns.splice(index,1);//removes the town from allTowns
    }
    return d;
  }

  //finds closest town to a district. returns an index of allTowns.
  findClosest(district){
    var index = 0;
    var minDist =Number.POSITIVE_INFINITY;
    for(var i =0;i<this.allTowns.length;i++){
      var distance = district.distTo(this.allTowns[i])
      if(distance<minDist){
        index =i;
        minDist = distance;
      }
    }
    return index;
  }


  //use at the end, return the district NUMBER (starting at 1) of the district of the closest town with a district.
  findClosestTownWithDistrict(town){
    var index =1;
    var minDist = Number.POSITIVE_INFINITY;
    for(var i =0;i<this.allTownsFinal.length;i++){
      var districtNo = this.allTownsFinal[i].district;
      if(districtNo>-1&&this.districts[districtNo-1].distTo(town)<minDist&&town!=this.allTownsFinal[i]){
        minDist = this.districts[districtNo-1].distTo(town);
        index = districtNo;
      }
    }  
    return index;
  }

  //finds closest district index to a town, only use at end.
  findClosestDistrict(town){
    var index = 0;
    var minDist = Number.POSITIVE_INFINITY;
    for(var i =0;i<this.districts.length;i++){
      if(this.districts[i].distTo(town)<minDist){
        index =i;
        minDist = this.districts[i].distTo(town)
      }
    }
    return index;
  }

  //returns index of the most populous town in allTowns, so NOT allTownsFinal
  findMostPopulous(){
    var index = 0;
    var maxPop = 0;
    for(var i =0;i<this.allTowns.length;i++){
      if(this.allTowns[i].population>maxPop){
        index = i;
        maxPop = this.allTowns[i].population;
      }
    }
    return index;
  }
}
