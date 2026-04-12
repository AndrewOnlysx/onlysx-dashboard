'use server'
import { connectDB } from "@/database/utils/mongodb"
import { Galeries } from "@/database/models/Galeries"
import { buildSlugLookup, syncMissingSlugs } from '@/database/utils/slug'
import "@/database/models/Models"
import "@/database/models/Tags"
import "@/database/models/Video"
export const GetGaleriesBySlug = async (slug: string) => {
    try {
        await connectDB()
        await syncMissingSlugs(Galeries, 'name')

        const res = await Galeries.findOne(buildSlugLookup(slug))
            .populate("idTags")
            .populate("idModel")
            .populate("idRelatedVideo")

        return { galeries: JSON.parse(JSON.stringify(res)), ok: true }
    } catch (error) {
        console.error("Error fetching galeries:", error)
        return { galeries: [], ok: false }
    }
}

export const GetGaleriesById = GetGaleriesBySlug
