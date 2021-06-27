import Location from "../classes/Location";

//data: only data for that one district/param;
//returns: 
export function asdpc(data:object): number {
  var center:Location = centerOfPop(data);
  var avDist:number = 0;
  var n:number = 0;
  var res:number[] = [];
  var allPrecints = Object.keys(data);
  //Fill out general avDist
  allPrecints.forEach(p=>{
    let arr:number[] = data[p].map(a=>Number(a));
    let pop = arr[1];
    avDist += pop*center.distTo(new Location(arr[2],arr[3]));
    n += pop;
  })
  return (avDist/n);

  // //Then do so for each parameter
  // var i =4;
  // parameters.forEach(()=>{
  //   avDist = 0;
  //   n = 0;
  //   allPrecints.forEach(p=>{
  //     let arr:number = data[p].map(a=>Number(a));
  //     let population = arr[1];
  //     let param = arr[i];
  //     avDist += param*population*center.distTo(new Location(arr[2],arr[3]));
  //     n += param*population;
  //   })
  //   i++;
  //   res.push(avDist/n);
  // })
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
