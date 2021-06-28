export default function convertTime(num:number):string {
    const d = new Date(num);
    var str:string = ""
    str += `${d.getMonth()+1}-${d.getDate()}-${String(d.getFullYear()).substring(2,4)}`;
    return str;
}