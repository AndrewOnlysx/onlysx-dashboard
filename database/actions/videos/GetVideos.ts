'use server'

import { Video } from '@/database/models/Video'
import { connectDB } from '@/database/utils/mongodb'
import { parseDurationToSeconds } from '@/lib/videos/admin'

import '@/database/models/Models'
import '@/database/models/Tags'
import '@/database/models/Galeries'

export const GetVideos = async () => {
    try {
        await connectDB()

        const videosResult = await Video.find()
            .sort({ createdAt: -1 })
            .populate('models')
            .populate('tags')
            .populate('galeries')
            .lean()

        const totalViews = videosResult.reduce(
            (acc, video) => acc + (video.views ?? 0),
            0
        )
        const totalDumpReady = videosResult.filter((video) => Boolean(video.dump)).length
        const totalWithGalleryLinks = videosResult.filter(
            (video) => Array.isArray(video.galeries) && video.galeries.length > 0
        ).length
        const totalDurationInSeconds = videosResult.reduce(
            (acc, video) => acc + parseDurationToSeconds(video.time ?? ''),
            0
        )
        const qualities = Array.from(
            new Set(
                videosResult
                    .map((video) => video.quality)
                    .filter((quality): quality is string => Boolean(quality))
            )
        ).sort((left, right) => left.localeCompare(right))

        return {
            ok: true,
            videos: JSON.parse(JSON.stringify(videosResult)),
            summary: {
                totalVideos: videosResult.length,
                totalViews,
                totalDumpReady,
                totalWithGalleryLinks,
                averageDurationInSeconds: videosResult.length
                    ? Math.round(totalDurationInSeconds / videosResult.length)
                    : 0
            },
            filters: {
                qualities
            },
            message: 'Videos fetched successfully'
        }
    } catch (error) {
        console.error('Error in GetVideos:', error)

        return {
            ok: false,
            videos: [],
            summary: {
                totalVideos: 0,
                totalViews: 0,
                totalDumpReady: 0,
                totalWithGalleryLinks: 0,
                averageDurationInSeconds: 0
            },
            filters: {
                qualities: []
            },
            message: 'Error fetching videos'
        }
    }
}
