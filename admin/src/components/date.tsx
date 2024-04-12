export default function DateTime( {time}:any ) {
    const date = new Date(time);
    return <>{date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate()+' '+ date.getHours()+':'+date.getMinutes()+':'+ date.getSeconds()}</>
}