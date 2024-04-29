export function Wrapper({ children, ...props }:any) {
    return <div ref={props.fref} {...props} className={props?.className+" grid grid-cols-6 gap-6"}>{children}</div>
}
export function Col6({ children, ...props }:any) {
    return <div {...props} className="col-span-6 sm:col-span-3">{children}</div>
}
export function Span6({ children, ...props }:any) {
    return <div {...props} className="col-span-6">{children}</div>
}