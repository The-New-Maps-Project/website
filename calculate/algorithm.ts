import Calculate from "./classes/Calculate";

export default function algorithm(data:object,districts:number,threshold:number):object{
    var c:Calculate = new Calculate(data,districts,threshold);
    Object.keys(c.outputData).forEach(key=>{
      data[key][0] = c.outputData[key]; //set first element (district) to the district#
    })
    return data;
  }