import { useContext } from "react";
import { DataContext } from "./data";

export default function Link({ children, ...props }: any) {
    const dataContext = useContext(DataContext) as any
    const baseUri = dataContext?.baseUri

    function handleClick(e: any) {

        if (window.location.href != baseUri+props.to)
            history.pushState({}, "", baseUri+props.to);

        e.preventDefault();

    }

    return <a ref={props.fref} href={baseUri+props.to} {...props} onClick={(e) => handleClick(e)}>{children}</a>;
}
