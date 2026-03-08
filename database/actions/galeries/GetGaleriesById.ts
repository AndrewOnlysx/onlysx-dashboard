'use server'
import { connectDB } from "@/database/utils/mongodb"
import { Galeries } from "@/database/models/Galeries"
import "@/database/models/Models"
import "@/database/models/Tags"
import "@/database/models/Video"
export const GetGaleriesById = async (id: string) => {
    try {
        await connectDB()
        const res = await Galeries.findById(id)
            .populate("idTags")
            .populate("idModel")
            .populate("idRelatedVideo")

        return { galeries: JSON.parse(JSON.stringify(res)), ok: true }
    } catch (error) {
        console.error("Error fetching galeries:", error)
        return { galeries: [], ok: false }
    }
}
