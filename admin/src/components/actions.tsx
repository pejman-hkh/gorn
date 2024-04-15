import { useTranslation } from "react-i18next";
import { useApiPath } from "../router/api";
import Form from "./form";

export function SearchForm({ ...props }) {
    const handler = (e:any) => {
        const data = new URLSearchParams(new FormData(e.target) as any).toString();

        history.pushState({}, "", "?"+data);
        e.preventDefault();
    }
    const { t } = useTranslation();
    return <Form {...props} onSubmit={handler} className="ltr:lg:pr-3 rtl:lg:pl-3" action={props.action} method="GET">
        <label htmlFor="search" className="sr-only">{t("Search")}</label>
        <div className="relative mt-1 lg:w-64 xl:w-96">
            <input type="text" name="search" id="search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={t("Search...")} />
        </div>
    </Form>
}


export function Tasks({ children, ...props }:any) {
    return <div {...props} className="flex pl-0 mt-3 space-x-1 sm:pl-2 sm:mt-0">
        {children}
    </div>
}


export function ExportButton({ children, ...props }:any) {
    const path = useApiPath('/admin'+props?.route)
    return <a href={path+"&excel=true"} {...props} className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
        <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" /></svg>
        {children}
    </a>
}

export function AddButton({ children, ...props }:any) {
    return <button {...props} type="button" className="rtl:ml-2 inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
        {children}
    </button>
}

export function RightSide({ children, ...props }:any) {
    return <div {...props} className="flex items-center rtl:mr-auto ltr:ml-auto space-x-2 sm:space-x-3">
        {children}
    </div>
}
export function LeftSide({ children, ...props }:any) {
    return <div {...props} className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">{children}</div>
}

export function Wrapper({ children, ...props }:any) {
    return <div {...props} className="sm:flex">

        {children}
    </div>
}