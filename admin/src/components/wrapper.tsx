
export default function Guest({ children, ...props }: any) {
    return <div {...props} className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">{children}</div>
}
