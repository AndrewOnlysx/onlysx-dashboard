'use server'

import { Video } from '@/database/models/Video'
import { connectDB } from '@/database/utils/mongodb'
import { buildSlugLookup, syncMissingSlugs } from '@/database/utils/slug'

import '@/database/models/Models'
import '@/database/models/Tags'
import '@/database/models/Galeries'

export const GetVideoBySlug = async (slug: string) => {
    try {
        await connectDB()
        await syncMissingSlugs(Video, 'title')

        const video = await Video.findOne(buildSlugLookup(slug))
            .populate('models')
            .populate('tags')
            .populate('galeries')
            .lean()

        if (!video) {
            return {
                ok: false,
                video: null,
                recomendedContent: [],
                relatedVideos: [],
                relatedGarelies: [],
                message: 'Video not found'
            }
        }

        const modelIds = (video.models ?? []).map((model: any) =>
            typeof model === 'string' ? model : model._id
        )
        const tagIds = (video.tags ?? []).map((tag: any) =>
            typeof tag === 'string' ? tag : tag._id
        )

        const relatedVideos = await Video.find({
            _id: { $ne: video._id },
            $or: [
                { models: { $in: modelIds } },
                { tags: { $in: tagIds } }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(6)
            .populate('models')
            .populate('tags')
            .populate('galeries')
            .lean()

        return {
            ok: true,
            video: JSON.parse(JSON.stringify(video)),
            recomendedContent: JSON.parse(JSON.stringify(relatedVideos.slice(0, 3))),
            relatedVideos: JSON.parse(JSON.stringify(relatedVideos)),
            relatedGarelies: JSON.parse(JSON.stringify(video.galeries ?? [])),
            message: 'Video fetched successfully'
        }
    } catch (error) {
        console.error('Error in GetVideoById:', error)

        return {
            ok: false,
            video: null,
            recomendedContent: [],
            relatedVideos: [],
            relatedGarelies: [],
            message: 'Error fetching video'
        }
    }
}

export const GetVideoById = GetVideoBySlug
