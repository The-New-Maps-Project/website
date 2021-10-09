//ORDER OF VALUES IN THE "data" OBJECT: 
//[assigned district,population,lat,lng,parameters...]


export default function readFileText(text:string,colors:string[],setDistricts,setParameters):object{
    var obj = {};
    var lines:string[] = text.split("\n");
    var count:number = 0;
    lines.forEach(line=>{
        count++;
        line.replace("\r","");
        let elements: any[] = line.split(",");
        if(elements.length==0) return;

        if(count==1){
            let d:string[] = [];
            let n:number = Math.round(Number(elements.shift()));
            for(let i:number=0;i<n;i++) d.push(colors[i%colors.length]);
            setDistricts(d);
            setParameters(elements);
        }else{
            let precinctName = elements.shift();//remove the precinct name
            if(!precinctName) {
                console.log(count);
                return;
            
            }
            // next, move the population to index 1 from index 3 (how it used to be when input files were inserted)
            let population = elements.splice(3,1);
            elements.splice(1,0,population);
            obj[precinctName] = [...elements].map(a=>Number(a));//then add the entire array
        }
    })
    return obj;
}