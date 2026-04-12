'use server'
import { connectDB } from "@/database/utils/mongodb"
import { Galeries } from "@/database/models/Galeries"
import { syncMissingSlugs } from '@/database/utils/slug'
import '@/database/models/Models'
import '@/database/models/Tags'
export const GetAllGalery = async () => {
    try {
        await connectDB()
        await syncMissingSlugs(Galeries, 'name')
        const res = await Galeries.find({}).populate('idModel').populate('idTags').sort({ createdAt: -1 })


        return { galeries: JSON.parse(JSON.stringify(res)), ok: true }
    } catch (error) {
        console.error("Error fetching galeries:", error)
        return { galeries: [], ok: false }
    }
}