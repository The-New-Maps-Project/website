//returns: array of numbers, how much total population of each param [total,param1,param2,...]
export function sumPopulation(data:object,params:string[]): number[]{
    var res = [];
    for(let i = 0;i<=params.length;i++){
        let n = 0;
        Object.keys(data).forEach(precinct=>{
            let arr = data[precinct];
            let pop = arr[1];
            if(i>0) pop *= arr[3+i];
            if(Number.isNaN(pop)) pop = 0;
            n += pop;
        })
        res.push(Math.round(n));
    }
    return res;
}