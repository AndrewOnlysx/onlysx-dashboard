import mongoose from 'mongoose'
import { z } from 'zod'

export const createVideoInputSchema = z.object({
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

export const ensureObjectIds = (ids: string[], fieldName: string) => {
    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error(`Invalid ${fieldName} ids`)
    }

    return ids.map((id) => new mongoose.Types.ObjectId(id))
}