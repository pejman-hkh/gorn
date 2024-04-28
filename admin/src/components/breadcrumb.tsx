import  Link from "../router/link"

export function Item({ children, ...props }:any) {
    return <li>
        <div className="flex items-center">
            <svg className="rtl:hidden w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <svg transform="rotate(180 0 0)" className="ltr:hidden w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>

      
            <Link to={props.to} className="ltr:ml-1 rtl:mr-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white">{children}</Link>
      
        </div>
    </li>
}

export function ItemHome({children}:any) {
    return <li className="inline-flex items-center">
        <a href="#" className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
            <svg className="w-5 h-5 ltr:mr-2.5 rtl:ml-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            {children}
        </a>
    </li>
}

export function Title({ children, ...props }:any) {
    return <h1 {...props} className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">{children}</h1>
}

export function Wrapper({ children, ...props }:any) {
    return <div {...props} className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full mb-1">
        {children}
        </div>
    </div>
}

export function Main({ children, ...props }:any) {
    return <div {...props} className="mb-4"><nav className="flex mb-5" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
            {children}
        </ol>
    </nav></div>
}