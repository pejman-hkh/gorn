export function Wrapper({ children, ...props }) {
    return <div {...props} className="grid grid-cols-6 gap-6">{children}</div>
}
export function Col6({ children, ...props }) {
    return <div {...props} className="col-span-6 sm:col-span-3">{children}</div>
}
export function Span6({ children, ...props }) {
    return <div className="col-span-6">{children}</div>
}