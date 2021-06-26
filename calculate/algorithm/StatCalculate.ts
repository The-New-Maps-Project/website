class Location{
  lat: number;
  lng: number;

    constructor(lat,lng){
        this.lat = lat;
        this.lng = lng;
    }

    distTo(that: Location){

        const lat1 = this.lat*Math.PI/180;
        const lng1 = this.lng*Math.PI/180;
        const lat2 = that.lat*Math.PI/180;
        const lng2 = that.lng*Math.PI/180;
        const r = 6371 //radius of earth in km;
        return  2*r*Math.asin(Math.sqrt(Math.pow(Math.sin((lat2-lat1)/2.0),2)+Math.cos(lat1)*Math.cos(lat2)*Math.pow(Math.sin((lng2-lng1)/2.0),2)));
    }
}

class Town{
  name: string;
  population: number;
  location: Location;
  district: number;

    constructor(name:string,population:number,lat:number,lng:number){
        this.name = name;
        this.population = population;
        this.location = new Location(lat,lng)
        this.district = -1;
    }

    setDistrict(district: number):void {
      this.district = district;
    }

    toString(): string{
      return this.name + ","+this.district+","+this.location.lat+","+this.location.lng+","+this.population;
    }
}

class District{
  districtNo: number;
  totalPop: number;
  centerOfPop: Location;
  towns: Town[];

  constructor(num){
    this.districtNo = num;
    this.totalPop = 0;
    this.centerOfPop = null;
    this.towns = [];
  }

  addTown(town: Town){
    town.setDistrict(this.districtNo);
    if(this.centerOfPop == null){
      this.centerOfPop = town.location;
    }else{
      const newLat = (this.centerOfPop.lat * this.totalPop + town.location.lat * town.population) /(this.totalPop + town.population);
      const newLng = (this.centerOfPop.lng*this.totalPop+town.location.lng*town.population)/(this.totalPop+town.population);
      this.centerOfPop.lat = newLat;
      this.centerOfPop.lng = newLng;
    }
    this.totalPop += town.population;
    this.towns.push(town);
  }

  distTo(town){
    return this.centerOfPop.distTo(town.location)
  }

  toString(){
    var s ="";
    this.towns.forEach((t)=>{
      s+= "\n" + t.toString();
    })
    return s;
  }

}

class Calculate{
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


export function nmpAlgorithm(data:object,districts:number,threshold:number):object{
  var c:Calculate = new Calculate(data,districts,threshold);
  console.log(c.outputData);
  Object.keys(c.outputData).forEach(key=>{
    data[key][0] = c.outputData[key]; //set first element (district) to the district#
  })
  console.log(data);
  return data;
}

//data: only data for that one district. 
//returns: array of numbers, first index is total average distance, all subsequent indices are for each parameter in that order.
export function distToCenter(data:object,parameters:string[]): number[] {
  var center:Location = centerOfPop(data);
  var avDist = 0;
  var n = 0;
  var res:number[] = [];
  var allPrecints = Object.keys(data);
  //Fill out general avDist
  allPrecints.forEach(p=>{
    let arr:number[] = data[p].map(a=>Number(a));
    let pop = arr[1];
    avDist += pop*center.distTo(new Location(arr[2],arr[3]));
    n += pop;
  })
  res.push(avDist/n);

  //Then do so for each parameter
  var i =4;
  parameters.forEach(()=>{
    avDist = 0;
    n = 0;
    allPrecints.forEach(p=>{
      let arr:number = data[p].map(a=>Number(a));
      let population = arr[1];
      let param = arr[i];
      avDist += param*population*center.distTo(new Location(arr[2],arr[3]));
      n += param*population;
    })
    i++;
    res.push(avDist/n);
  })
  return res;
}

export function centerOfPop(data): Location{
  var cLat:number = 0;
  var cLng:number = 0;
  var n = 0;
  Object.keys(data).forEach((p)=>{
    cLat += Number(data[p][2]);
    cLng += Number(data[p][3]);
    n++;
  })
  return new Location(cLat/n,cLng/n);
}
