export default function Button({children, ...props }:any) {
    let color = props?.color??"primary"
    let pd = props?.nopd?"":"px-5 py-2.5 "
    return <button {...props} className={pd+" "+props?.className+" ml-2 text-white bg-"+color+"-700 hover:bg-"+color+"-800 focus:ring-4 focus:ring-"+color+"-300 font-medium rounded-lg text-sm text-center dark:bg-"+color+"-600 dark:hover:bg-"+color+"-700 dark:focus:ring-"+color+"-800"}>{children}</button>
}