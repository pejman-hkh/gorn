export default function toDate( str:string ) {
    const date = new Date(str);
    return date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate()+' '+ date.getHours()+':'+date.getMinutes()+':'+ date.getSeconds()
}