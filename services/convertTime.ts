export default function convertTime(num:number):string {
    const d = new Date(num);
    var str = ""
    str += d.getMonth() + d.getDate() + d.getFullYear();
    return str;
}