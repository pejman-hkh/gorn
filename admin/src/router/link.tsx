export default function Link({ to, children, ...props }) {
     function handleClick( e ) {
  
        if( window.location.href != to)
            history.pushState({}, "", to);

         e.preventDefault();
 
     }

     return <a href={to} {...props} onClick={(e) => handleClick(e)}>{children}</a>;
 }
 