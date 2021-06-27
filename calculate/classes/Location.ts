export default class Location{
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

