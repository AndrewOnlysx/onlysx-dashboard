import SaveVideo from '@/database/actions/videos/SaveVideo'
import type { CreateVideoPayload } from '@/lib/videos/admin'
import type { VideoType } from '@/types/Types'
import type { VideoFormMode } from '../components/videoForm/formConfig'

export interface VideoDraftSubmission {
    mode: VideoFormMode
    videoId: string | null
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
    video: VideoType | null
}

export const submitCreateVideoDraft = async (draft: VideoDraftSubmission) => {
    const { payload, assets, mode, videoId } = draft
    const result = await SaveVideo({
        ...payload,
        videoId
    })

    if (!result.ok) {
        return {
            ok: false,
            message: result.message || 'No se pudo guardar el video en la base de datos.',
            video: null
        }
    }

    console.log('[videos-admin] video guardado en base de datos', {
        mode,
        id: result.video?._id,
        title: payload.title,
        assets
    })

    return {
        ok: true,
        message: result.message || (
            mode === 'edit'
                ? 'Video actualizado correctamente en la base de datos.'
                : 'Video guardado correctamente en la base de datos.'
        ),
        video: result.video
    }
}

export default submitCreateVideoDraft
