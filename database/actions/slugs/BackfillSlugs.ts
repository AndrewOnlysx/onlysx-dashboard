'use server'

import { Galeries } from '@/database/models/Galeries'
import { Models } from '@/database/models/Models'
import { Video } from '@/database/models/Video'
import { connectDB } from '@/database/utils/mongodb'
import { syncMissingSlugs } from '@/database/utils/slug'

export interface BackfillSlugsResult {
    ok: boolean
    updatedSlugs: {
        models: number
        videos: number
        galleries: number
    }
    message: string
}

export const BackfillSlugs = async (): Promise<BackfillSlugsResult> => {
    try {
        await connectDB()

        const [models, videos, galleries] = await Promise.all([
            syncMissingSlugs(Models, 'name'),
            syncMissingSlugs(Video, 'title'),
            syncMissingSlugs(Galeries, 'name')
        ])

        return {
            ok: true,
            updatedSlugs: {
                models,
                videos,
                galleries
            },
            message: 'Slug backfill completed successfully.'
        }
    } catch (error) {
        console.error('Error backfilling slugs:', error)

        return {
            ok: false,
            updatedSlugs: {
                models: 0,
                videos: 0,
                galleries: 0
            },
            message: 'Slug backfill failed.'
        }
    }
}

export default BackfillSlugs