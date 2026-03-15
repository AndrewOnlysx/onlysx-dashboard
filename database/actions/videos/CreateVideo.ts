'use server'

import { revalidatePath } from 'next/cache'

import { Video } from '@/database/models/Video'
import { Models } from '@/database/models/Models'
import { Tags } from '@/database/models/Tags'
import { connectDB } from '@/database/utils/mongodb'
import { buildVideoSearchParams } from '@/lib/videos/admin'

import '@/database/models/Galeries'

import { createVideoInputSchema, CreateVideoInput, ensureObjectIds } from './videoInput'

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
