type props = {
    to:string,
    className?:string
    children:any,
    props?:any
}

export default function Link({ className, to, children, ...props }:props) {
     function handleClick( e :React.MouseEvent<HTMLAnchorElement>) {
  
        if( window.location.href != to)
            history.pushState({}, "", to);

         e.preventDefault();
 
     }

     return <a href={to} {...props} onClick={(e) => handleClick(e)}>{children}</a>;
 }
 