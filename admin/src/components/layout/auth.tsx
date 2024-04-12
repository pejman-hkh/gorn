import { useContext } from "react";
import Nav from "../nav";
import Side from "../side";
import { DataContext } from "../../router/data";
export default function Auth({ children }:any) {
    const dataContext = useContext(DataContext) as Array<any>
	const direction = dataContext[4]

    return <div dir={direction[0]}>
        <Nav></Nav>
        <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">

            <Side></Side>

            <div className="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/90" id="sidebarBackdrop"></div>

            <div id="main-content" className="relative w-full h-full overflow-y-auto bg-gray-50 ltr:lg:ml-64 rtl:lg:mr-64 dark:bg-gray-900">
                <main>
                    {children}
                </main>
                <footer className="p-4 my-6 mx-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 xl:p-8 dark:bg-gray-800">
                  
                    <div className="flex space-x-6 sm:justify-center">
                 
                        <a target="_blank" href="https://github.com/pejman-hkh/gorn/" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                
                    </div>
                </footer>
                <p className="my-10 text-sm text-center text-gray-500">
                    © 2024-2024 <a href="https://github.com/pejman-hkh/gorn/" className="hover:underline" target="_blank">Gron</a>. All
                    rights reserved.
                </p>
            </div>

        </div>
    </div>
}