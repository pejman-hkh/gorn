import { useContext } from "react"
import { DataContext } from "../../router/data"

export default function Geust({ children }: any) {
  const dataContext = useContext(DataContext) as any
  const direction = dataContext.direction

  return <main dir={direction[0]} className="bg-gray-50 dark:bg-gray-900">
    {children}
  </main>
}