'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import mongoose from 'mongoose'

import { Video } from '@/database/models/Video'
import { Models } from '@/database/models/Models'
import { Tags } from '@/database/models/Tags'
import { connectDB } from '@/database/utils/mongodb'
import { buildVideoSearchParams } from '@/lib/videos/admin'

import '@/database/models/Galeries'

const createVideoInputSchema = z.object({
    title: z.string().trim().min(1, 'El titulo es obligatorio.'),
    time: z.string().trim().min(1, 'La duracion es obligatoria.'),
    image: z.string().trim().min(1, 'La portada es obligatoria.'),
    video: z.string().trim().min(1, 'La URL del video es obligatoria.'),
    dump: z.string().trim().min(1, 'La URL del dump es obligatoria.'),
    quality: z.string().trim().min(1, 'La calidad es obligatoria.'),
    models: z.array(z.string().trim().min(1)).min(1, 'Selecciona al menos un modelo.'),
    tags: z.array(z.string().trim().min(1)).min(1, 'Selecciona al menos un tag.'),
    galeries: z.array(z.string().trim().min(1)).default([]),
    views: z.number().int().min(0).default(0),
    lastViews: z.string().trim().default(''),
    manualSearchParams: z.array(z.string().trim().min(1)).default([]),
    searchPrarms: z.array(z.string().trim().min(1)).optional()
})

export type CreateVideoInput = z.infer<typeof createVideoInputSchema>

const ensureObjectIds = (ids: string[], fieldName: string) => {
    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error(`Invalid ${fieldName} ids`)
    }

    return ids.map((id) => new mongoose.Types.ObjectId(id))
}

export const CreateVideo = async (input: CreateVideoInput) => {
    try {
        await connectDB()

        const parsedInput = createVideoInputSchema.parse(input)
        const modelIds = ensureObjectIds(parsedInput.models, 'models')
        const tagIds = ensureObjectIds(parsedInput.tags, 'tags')
        const galerieIds = ensureObjectIds(parsedInput.galeries, 'galeries')

        const [models, tags] = await Promise.all([
            Models.find({ _id: { $in: modelIds } }).select('name').lean(),
            Tags.find({ _id: { $in: tagIds } }).select('name').lean()
        ])

        const searchPrarms = parsedInput.searchPrarms?.length
            ? parsedInput.searchPrarms
            : buildVideoSearchParams({
                title: parsedInput.title,
                models: JSON.parse(JSON.stringify(models)),
                tags: JSON.parse(JSON.stringify(tags)),
                manualSearchParams: parsedInput.manualSearchParams
            })

        const createdVideo = await Video.create({
            title: parsedInput.title,
            time: parsedInput.time,
            image: parsedInput.image,
            video: parsedInput.video,
            dump: parsedInput.dump,
            quality: parsedInput.quality,
            models: modelIds,
            tags: tagIds,
            galeries: galerieIds,
            views: parsedInput.views,
            lastViews: parsedInput.lastViews,
            searchPrarms
        })

        const hydratedVideo = await Video.findById(createdVideo._id)
            .populate('models')
            .populate('tags')
            .populate('galeries')
            .lean()

        revalidatePath('/pageClients/videos')

        return {
            ok: true,
            video: JSON.parse(JSON.stringify(hydratedVideo)),
            payload: {
                ...parsedInput,
                searchPrarms
            },
            message: 'Video creado correctamente.'
        }
    } catch (error) {
        console.error('Error creating video:', error)

        return {
            ok: false,
            video: null,
            message: error instanceof Error ? error.message : 'No se pudo crear el video.'
        }
    }
}

export default CreateVideo
