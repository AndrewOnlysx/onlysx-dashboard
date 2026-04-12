"use server"

import { Models } from "@/database/models/Models"
import { Video } from "@/database/models/Video"
import { Galeries } from "@/database/models/Galeries"
import { connectDB } from "@/database/utils/mongodb"
import { syncMissingSlugs } from '@/database/utils/slug'

export async function GetModels() {
    try {
        await connectDB()
        await syncMissingSlugs(Models, 'name')
        const models = await Models.find().sort({ name: 1 }).lean()

        const videosCount = await Video.aggregate([
            { $unwind: "$models" },
            {
                $group: {
                    _id: "$models",
                    totalVideos: { $sum: 1 }
                }
            }
        ])

        const galeriesCount = await Galeries.aggregate([
            { $unwind: "$idModel" },
            {
                $group: {
                    _id: "$idModel",
                    totalGaleries: { $sum: 1 }
                }
            }
        ])

        const videoMap = new Map(
            videosCount.map(item => [item._id.toString(), item.totalVideos])
        )
        const galeryMap = new Map(
            galeriesCount.map(item => [item._id.toString(), item.totalGaleries])
        )

        const modelsWithStats = models.map((model: any) => ({
            ...model,
            totalVideos: videoMap.get(model._id.toString()) || 0,
            totalGaleries: galeryMap.get(model._id.toString()) || 0
        }))

        return {
            ok: true,
            models: JSON.parse(JSON.stringify(modelsWithStats.map((model: any, index) => ({
                ...model,
                id: index + 1,
            }))))
        }

    } catch (error) {
        console.error(error)
        return {
            ok: false,
            models: []
        }
    }
}