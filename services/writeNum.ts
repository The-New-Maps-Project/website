export default function writeNum(num:number,decimalPoints?:number):string{
    if(!num) return "0";
    var dpIndex:number = 0;
    var nStr:string = String(num);
    if(Math.round(num)==num) dpIndex = nStr.length;
    else{
        nStr = num.toFixed(decimalPoints || 1);
        dpIndex = nStr.indexOf(".");
    }
    for(let i = dpIndex-3;i>0;i-=3){
        nStr = nStr.substring(0,i) + "," + nStr.substring(i);
    }
    return nStr;
}