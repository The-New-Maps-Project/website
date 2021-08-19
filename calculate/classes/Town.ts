import Location from "./Location";

export default class Town{
  name: string;
  population: number;
  location: Location;
  district: number;
  secondDistrict: number; //a second district who's border is closest
  id:number;
  closestTownDist:number = Number.MAX_VALUE;
  parameter: number = 0;

    constructor(name:string,population:number,lat:number,lng:number){
        this.name = name;
        this.population = population;
        this.location = new Location(lat,lng)
        this.district = -1;
    }

    setDistrict(district: number):void {
      this.district = district;
    }

    distTo(that:Town):number{
      return this.location.distTo(that.location);
    }

    setClosestTownDist(t:Town){
      this.closestTownDist = this.distTo(t);
    }

    toString(): string{
      return this.name + ","+this.district+","+this.location.lat+","+this.location.lng+","+this.population;
    }
}