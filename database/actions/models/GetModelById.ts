'use server'

import { Galeries } from '@/database/models/Galeries'
import { Models } from '@/database/models/Models'
import { Video } from '@/database/models/Video'
import { connectDB } from '@/database/utils/mongodb'
import '@/database/models/Tags'
import { ok } from 'assert'

import mongoose from 'mongoose'

export default async function GetModelFullProfile(modelId: string) {
    if (!mongoose.Types.ObjectId.isValid(modelId)) {
        throw new Error('Invalid model id')
    }
    try {
        await connectDB() // Aseguramos conexión a DB

        const objectId = new mongoose.Types.ObjectId(modelId)

        // 🔥 Ejecutamos todo en paralelo
        const [
            model,
            videos,
            galeries,
            totalVideos,
            totalGaleries
        ] = await Promise.all([
            Models.findById(objectId).lean(),

            Video.find({ models: objectId })
                .sort({ createdAt: -1 }).populate('models').populate('tags')
                .select('-dump') // opcional si no quieres traer peso innecesario
                .lean(),

            Galeries.find({ idModel: objectId })
                .sort({ createdAt: -1 })
                .lean(),

            Video.countDocuments({ models: objectId }),

            Galeries.countDocuments({ idModel: objectId })
        ])

        if (!model) {
            throw new Error('Model not found')
        }

        // 🔥 Calcular total de views del creador
        const totalViews = videos.reduce(
            (acc, video) => acc + (video.views || 0),
            0
        )
        const data = {

            ok: true,
            model,
            stats: {
                totalVideos,
                totalGaleries,
                totalViews
            },
            videos,
            galeries,
            message: 'Model profile fetched successfully'
        }
        return {
            ok: true,
            model,
            stats: {
                totalVideos,
                totalGaleries,
                totalViews
            },
            videos,
            galeries,
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

