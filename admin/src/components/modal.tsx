import { useRef } from "react"

export function Delete({ children, ...props }: any) {

    const modalShow = props?.show[0]?"":"hidden"
    const modal = useRef(null)
    const clickHandler = (e: any) => {
        if (e.target != modal.current)
            return

        props.show[1](false)
    }

    const closeHandler = (e:any) => {
        e.preventDefault()
        props.show[1](false)
    }


    return <><div modal-backdrop="1" className={modalShow+" bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"}></div>
        <div ref={modal} onClick={clickHandler} className={modalShow+" fixed left-0 right-0 z-50 items-center justify-center overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full flex"}>
            <div className="relative w-full h-full max-w-md px-4 md:h-auto">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                    {/* Modal header */}
                    <div className="flex justify-end p-2">
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white" onClick={closeHandler}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                    {/* Modal body */}
                    <div className="p-6 pt-0 text-center">
                        <svg className="w-16 h-16 mx-auto text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="mt-5 mb-6 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete this ?</h3>
                        <a href="#" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-red-800">
                            Yes, I'm sure
                        </a>
                        <a href="#" onClick={closeHandler} className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700" data-modal-hide="delete-user-modal">
                            No, cancel
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export function Content({ children, ...props }: any) {
    return <div {...props} className="p-6 space-y-6">
        {children}
    </div>
}

export function Footer({ children, ...props }: any) {
    return <div {...props} className="items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-700">
        {children}
    </div>

}

export function Modal({ children, ...props }: any) {

    const modalShow = props?.show[0]?"":"hidden"
    const modal = useRef(null)
    const clickHandler = (e: any) => {
        if (e.target != modal.current)
            return

        props.show[1](false)
    }

    const closeHandler = () => {
        props.show[1](false)
    }

    return <>
        <div modal-backdrop="1" className={modalShow + " bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"}></div>
        <div ref={modal} {...props} onClick={clickHandler} className={modalShow + " fixed left-0 right-0 z-50 items-center justify-center overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full flex"}>
            <div className="relative w-full h-full max-w-2xl px-4 md:h-auto">

                <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">

                    <div className="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-700">
                        <h3 className="text-xl font-semibold dark:text-white">
                            {props.title}
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white" onClick={closeHandler}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    </>
}