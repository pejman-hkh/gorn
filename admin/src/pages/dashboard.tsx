import { useEffect } from "react"
import Chart from "./dashboard/chart"

export default function Dashboard() {
    useEffect(() => {
        Chart()
    }, [])
    return <></>
}