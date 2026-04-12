'use server'

import { revalidatePath } from 'next/cache'
import mongoose from 'mongoose'
import { z } from 'zod'

import { Models } from '@/database/models/Models'
import { Tags } from '@/database/models/Tags'
import { Video } from '@/database/models/Video'
import { connectDB } from '@/database/utils/mongodb'
import { buildVideoSearchParams } from '@/lib/videos/admin'

import '@/database/models/Galeries'

import { createVideoInputSchema, ensureObjectIds } from './videoInput'

const updateVideoInputSchema = createVideoInputSchema.extend({
    videoId: z.string().trim().min(1, 'El id del video es obligatorio.')
})

export type UpdateVideoInput = z.infer<typeof updateVideoInputSchema>

export const UpdateVideo = async (input: UpdateVideoInput) => {
    try {
        await connectDB()

        const parsedInput = updateVideoInputSchema.parse(input)

        if (!mongoose.Types.ObjectId.isValid(parsedInput.videoId)) {
            return {
                ok: false,
                video: null,
                message: 'El id del video no es valido.'
            }
        }

        const videoObjectId = new mongoose.Types.ObjectId(parsedInput.videoId)
        const modelIds = ensureObjectIds(parsedInput.models, 'models')
        const tagIds = ensureObjectIds(parsedInput.tags, 'tags')
        const galerieIds = ensureObjectIds(parsedInput.galeries, 'galeries')

        const existingVideo = await Video.findById(videoObjectId)

        if (!existingVideo) {
            return {
                ok: false,
                video: null,
                message: 'No se encontro el video a editar.'
            }
        }

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

        existingVideo.title = parsedInput.title
        existingVideo.time = parsedInput.time
        existingVideo.image = parsedInput.image
        existingVideo.video = parsedInput.video
        existingVideo.dump = parsedInput.dump
        existingVideo.quality = parsedInput.quality
        existingVideo.models = modelIds
        existingVideo.tags = tagIds
        existingVideo.galeries = galerieIds
        existingVideo.views = parsedInput.views
        existingVideo.lastViews = parsedInput.lastViews
        existingVideo.searchPrarms = searchPrarms

        await existingVideo.save()

        const hydratedVideo = await Video.findById(videoObjectId)
            .populate('models')
            .populate('tags')
            .populate('galeries')
            .lean()

        revalidatePath('/pageClients/videos')
        if (hydratedVideo?.slug) {
            revalidatePath(`/pageClients/videos/edit/${hydratedVideo.slug}`)
        }

        return {
            ok: true,
            video: JSON.parse(JSON.stringify(hydratedVideo)),
            payload: {
                ...parsedInput,
                searchPrarms
            },
            message: 'Video actualizado correctamente.'
        }
    } catch (error) {
        console.error('Error updating video:', error)

        return {
            ok: false,
            video: null,
            message: error instanceof Error ? error.message : 'No se pudo actualizar el video.'
        }
    }
}

export default UpdateVideo
