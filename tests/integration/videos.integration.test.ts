import { randomUUID } from 'node:crypto'

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { createUniqueCoverFixture, createUniqueVideoFixture } from '@/tests/helpers/videoFixture'

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}))

type UploadedAsset = {
    key: string
    url: string
    filename: string
}

const REQUIRED_ENV_VARS = [
    'NEXT_URL',
    'NEXT_CLIENT_ID',
    'NEXT_SECRET_ID',
    'NEXT_BUCKET',
    'MONGODB_URI',
    'MONGODB_URI_APP'
] as const

const assertIntegrationEnv = () => {
    const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name])

    if (missingVars.length > 0) {
        throw new Error(
            `Faltan variables para correr la integracion real de videos: ${missingVars.join(', ')}`
        )
    }
}

const r2Client = new S3Client({
    region: 'auto',
    endpoint: process.env.NEXT_URL ?? '',
    credentials: {
        accessKeyId: process.env.NEXT_CLIENT_ID ?? '',
        secretAccessKey: process.env.NEXT_SECRET_ID ?? ''
    }
})

const uploadAssetThroughRoute = async (file: File, assetType: 'video' | 'cover') => {
    const { POST } = await import('@/app/api/videos/uploadFiles/route')
    const formData = new FormData()

    formData.append('file', file)
    formData.append('assetType', assetType)
    formData.append('folder', 'videos-admin-integration')

    const response = await POST(new Request('http://localhost/api/videos/uploadFiles', {
        method: 'POST',
        body: formData
    }))

    const payload = await response.json()

    if (response.status !== 200 || !payload?.ok || !payload?.data?.url || !payload?.data?.key) {
        throw new Error(payload?.message || 'La subida real del asset no devolvio una URL valida.')
    }

    return payload.data as UploadedAsset
}

describe('real video integration flow', () => {
    let modelId = ''
    let tagId = ''
    let createdVideoId = ''
    const uploadedKeys: string[] = []

    beforeAll(async () => {
        assertIntegrationEnv()

        const [{ connectDB }, { Models }, { Tags }] = await Promise.all([
            import('@/database/utils/mongodb'),
            import('@/database/models/Models'),
            import('@/database/models/Tags')
        ])

        await connectDB()

        const [model, tag] = await Promise.all([
            Models.findOne().select('_id').lean(),
            Tags.findOne().select('_id').lean()
        ])

        if (!model?._id || !tag?._id) {
            throw new Error('La integracion real necesita al menos un modelo y un tag existentes en MongoDB.')
        }

        modelId = String(model._id)
        tagId = String(tag._id)
    })

    afterAll(async () => {
        if (createdVideoId) {
            const [{ connectDB }, { Video }] = await Promise.all([
                import('@/database/utils/mongodb'),
                import('@/database/models/Video')
            ])

            await connectDB()
            await Video.findByIdAndDelete(createdVideoId)
        }

        if (uploadedKeys.length > 0) {
            await Promise.allSettled(
                uploadedKeys.map((key) =>
                    r2Client.send(new DeleteObjectCommand({
                        Bucket: process.env.NEXT_BUCKET ?? '',
                        Key: key
                    }))
                )
            )
        }
    })

    it('sube assets reales y persiste create mas update con URLs nuevas', async () => {
        const { default: SaveVideo } = await import('@/database/actions/videos/SaveVideo')
        const runId = randomUUID()
        const coverFile = createUniqueCoverFixture(`cover-${runId}`)
        const firstVideoFile = await createUniqueVideoFixture()
        const secondVideoFile = await createUniqueVideoFixture()

        const [coverAsset, firstVideoAsset, secondVideoAsset] = await Promise.all([
            uploadAssetThroughRoute(coverFile, 'cover'),
            uploadAssetThroughRoute(firstVideoFile, 'video'),
            uploadAssetThroughRoute(secondVideoFile, 'video')
        ])

        uploadedKeys.push(coverAsset.key, firstVideoAsset.key, secondVideoAsset.key)

        expect(firstVideoAsset.filename).toMatch(/^6583402-uhd_4096_2160_25fps-[0-9a-f-]+\.mp4$/)
        expect(secondVideoAsset.filename).toMatch(/^6583402-uhd_4096_2160_25fps-[0-9a-f-]+\.mp4$/)
        expect(firstVideoAsset.url).not.toBe(secondVideoAsset.url)

        const createResult = await SaveVideo({
            title: `Integration Video ${runId}`,
            time: '00:12',
            image: coverAsset.url,
            video: firstVideoAsset.url,
            dump: firstVideoAsset.url,
            quality: '1080p',
            models: [modelId],
            tags: [tagId],
            galeries: [],
            views: 0,
            lastViews: 'integration-create',
            manualSearchParams: [runId],
            searchPrarms: ['integration', runId]
        })

        expect(createResult.ok).toBe(true)
        expect(createResult.video).not.toBeNull()

        createdVideoId = String(createResult.video?._id)

        const updateResult = await SaveVideo({
            videoId: createdVideoId,
            title: `Integration Video Updated ${runId}`,
            time: '00:15',
            image: coverAsset.url,
            video: secondVideoAsset.url,
            dump: secondVideoAsset.url,
            quality: '1080p',
            models: [modelId],
            tags: [tagId],
            galeries: [],
            views: 7,
            lastViews: 'integration-update',
            manualSearchParams: [runId, 'updated'],
            searchPrarms: ['integration', runId, 'updated']
        })

        expect(updateResult.ok).toBe(true)
        expect(updateResult.video).not.toBeNull()
        expect(updateResult.video?.title).toBe(`Integration Video Updated ${runId}`)
        expect(updateResult.video?.video).toBe(secondVideoAsset.url)
        expect(updateResult.video?.dump).toBe(secondVideoAsset.url)
        expect(updateResult.video?.image).toBe(coverAsset.url)
        expect(String(updateResult.video?._id)).toBe(createdVideoId)
    })
})