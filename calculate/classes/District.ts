import Town  from "./Town";
import Location from "./Location";

export default class District{
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