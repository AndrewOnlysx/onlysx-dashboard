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

export const submitCreateVideoDraft = async (draft: VideoDraftSubmission) => {
    const { payload, assets } = draft
    const result = await CreateVideo(payload)

    console.log('Video creation result:', result)
    if (!result.ok) {
        return {
            ok: false,
            message: 'Error al crear el video. Revisa la consola para más detalles.'
        }
    }


    return {
        ok: true,
        message: 'Payload enviado a consola. La conexion real con el server action queda pendiente.'
    }
}

export default submitCreateVideoDraft
