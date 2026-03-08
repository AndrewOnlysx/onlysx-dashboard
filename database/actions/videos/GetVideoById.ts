'use server'

import mongoose from 'mongoose'

import { Video } from '@/database/models/Video'
import { connectDB } from '@/database/utils/mongodb'

import '@/database/models/Models'
import '@/database/models/Tags'
import '@/database/models/Galeries'

export const GetVideoById = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
                ok: false,
                video: null,
                recomendedContent: [],
                relatedVideos: [],
                relatedGarelies: [],
                message: 'Invalid video id'
            }
        }

        await connectDB()

        const video = await Video.findById(id)
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
            _id: { $ne: new mongoose.Types.ObjectId(id) },
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
