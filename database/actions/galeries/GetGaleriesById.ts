import { connectDB } from "@/database/utils/mongodb"
import { Galeries } from "@/database/models/Galeries"
export const GetGaleriesById = async (id: string) => {
    try {
        await connectDB()
        const res = await Galeries.findById(id)


        return { galeries: JSON.parse(JSON.stringify(res)), ok: true }
    } catch (error) {
        console.error("Error fetching galeries:", error)
        return { galeries: [], ok: false }
    }
}