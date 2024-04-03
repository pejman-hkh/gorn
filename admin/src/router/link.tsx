
export default function Link({ children, ...props }:any) {
     function handleClick( e :React.MouseEvent<HTMLAnchorElement>) {
  
        if( window.location.href != props.to)
            history.pushState({}, "", props.to);

         e.preventDefault();
 
     }

     return <a href={props.to} {...props} onClick={(e) => handleClick(e)}>{children}</a>;
 }
 