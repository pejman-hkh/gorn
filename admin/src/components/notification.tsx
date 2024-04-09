export function Text() {
    return <><div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">New message from <span className="font-semibold text-gray-900 dark:text-white">Bonnie Green</span>: "Hey, what's up? All set
        for the presentation?"</div>
        <div className="text-xs font-medium text-primary-700 dark:text-primary-400">a few moments ago</div>
    </>
}

export function Item() {
    return <a href="#" className="flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600">
        <div className="flex-shrink-0">
            <img className="rounded-full w-11 h-11" src="images/users/bonnie-green.png" alt="Jese image" />
            <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 border border-white rounded-full bg-primary-700 dark:border-gray-700">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z">
                    </path>
                    <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z">
                    </path>
                </svg>
            </div>
        </div>
        <div className="w-full pl-3">
            <Text></Text>
        </div>
    </a>
}