import { Outlet } from "react-router-dom";

export default function Geust({children}) {
    return <main className="bg-gray-50 dark:bg-gray-900">
        {children}
  </main>
}