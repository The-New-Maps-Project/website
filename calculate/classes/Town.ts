import Location from "./Location";

export default class Town{
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