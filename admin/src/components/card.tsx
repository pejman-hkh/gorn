export default function Card({children, ...props}:any) {
    return  <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {props.title}
    </h2>
    {children}
    </div>
}