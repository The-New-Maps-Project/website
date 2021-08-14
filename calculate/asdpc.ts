import Location from "./classes/Location";

//ASPDC: Average Squared Distance to Population Center

//data: for whole district (or population)
//returns: asdpc for each param [total,param1,param2,param3,...]
export function allAsdpc(data:object,params:string[]):number[]{
    var res = [innerAsdpc(data,0)];
    for(let i = 1;i<=params.length;i++){
        res.push(innerAsdpc(data,i));
    }
    return res;
}

//data: for whole district (or population)
//returns: asdpc for specific # param (0 for total, 1 for first param, etc..)
export function innerAsdpc(data:object,param: number): number {
  var center:Location = centerOfPop(data,param);
  var avDist:number = 0;
  var n:number = 0;
  Object.keys(data).forEach(p=>{
    let arr:number[] = data[p].map(a=>Number.isNaN(Number(a))?0:Number(a));
    let paramPop = arr[1] * arr[3+param];
    if(param==0) paramPop = arr[1];
    avDist += paramPop*Math.pow(center.distTo(new Location(arr[2],arr[3])),2); //SQUARED distance
    n += paramPop;
  })
  if(n==0) return 0;
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

export function centerOfPop(data:object,param:number): Location{
  var cLat:number = 0;
  var cLng:number = 0;
  var n:number = 0;
  Object.keys(data).forEach((p)=>{
    let arr = data[p].map(a=>Number.isNaN(Number(a))?0:Number(a));
    let paramPop = arr[1] * arr[3+param]; //whole population * percentage of this that is [param]
    if(param==0) paramPop = arr[1]; //for whole population
    cLat += paramPop*Number(arr[2]);
    cLng += paramPop*Number(arr[3]);
    n+= paramPop || 0;
  })
  return new Location(cLat/n,cLng/n);
}
