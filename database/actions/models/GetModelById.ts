'use server'

import { Galeries } from '@/database/models/Galeries'
import { Models } from '@/database/models/Models'
import { Video } from '@/database/models/Video'
import { connectDB } from '@/database/utils/mongodb'
import { buildSlugLookup, syncMissingSlugs } from '@/database/utils/slug'
import '@/database/models/Tags'

export default async function GetModelFullProfile(modelSlug: string) {
    try {
        await connectDB()
        await syncMissingSlugs(Models, 'name')
        await syncMissingSlugs(Video, 'title')
        await syncMissingSlugs(Galeries, 'name')

        const model = await Models.findOne(buildSlugLookup(modelSlug)).lean()

        if (!model) {
            throw new Error('Model not found')
        }

        const [
            videos,
            galeries,
            totalVideos,
            totalGaleries
        ] = await Promise.all([
            Video.find({ models: model._id })
                .sort({ createdAt: -1 }).populate('models').populate('tags')
                .select('-dump')
                .lean(),

            Galeries.find({ idModel: model._id })
                .sort({ createdAt: -1 })
                .lean(),

            Video.countDocuments({ models: model._id }),

            Galeries.countDocuments({ idModel: model._id })
        ])

        const totalViews = videos.reduce(
            (acc, video) => acc + (video.views || 0),
            0
        )

        return {
            ok: true,
            model: JSON.parse(JSON.stringify(model)),
            stats: {
                totalVideos,
                totalGaleries,
                totalViews
            },
            videos: JSON.parse(JSON.stringify(videos)),
            galeries: JSON.parse(JSON.stringify(galeries)),
            message: 'Model profile fetched successfully'
        }
    } catch (error) {
        console.error('Error fetching model profile:', error)
        return {
            ok: false,
            message: 'Error fetching model profile'
        }
    }
}

