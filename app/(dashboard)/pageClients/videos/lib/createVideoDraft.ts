import CreateVideo from '@/database/actions/videos/CreateVideo'
import type { CreateVideoPayload } from '@/lib/videos/admin'

export interface VideoDraftSubmission {
    payload: CreateVideoPayload
    assets: {
        cover: null | {
            name: string
            size: number
            type: string
            source: 'manual' | 'generated-from-video'
            previewUrl: string
            uploadedUrl: string
            uploadStatus: 'idle' | 'uploading' | 'processing' | 'success' | 'error'
        }
        video: null | {
            name: string
            size: number
            type: string
            previewUrl: string
            uploadedUrl: string
            uploadStatus: 'idle' | 'uploading' | 'processing' | 'success' | 'error'
        }
        dump: null | {
            source: 'derived-from-video'
            previewUrl: string
            uploadedUrl: string
            mode: 'snippet-preview'
            windows: Array<{
                start: number
                end: number
            }>
        }
    }
}

export interface SubmitCreateVideoDraftResult {
    ok: boolean
    message: string
    video: unknown
}

export const submitCreateVideoDraft = async (draft: VideoDraftSubmission) => {
    const { payload, assets } = draft
    const result = await CreateVideo(payload)

    if (!result.ok) {
        return {
            ok: false,
            message: result.message || 'No se pudo guardar el video en la base de datos.',
            video: null
        }
    }

    console.log('[videos-admin] video guardado en base de datos', {
        id: result.video?._id,
        title: payload.title,
        assets
    })

    return {
        ok: true,
        message: result.message || 'Video guardado correctamente en la base de datos.',
        video: result.video
    }
}

export default submitCreateVideoDraft
