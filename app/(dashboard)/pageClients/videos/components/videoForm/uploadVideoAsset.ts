'use client'

export type VideoAssetType = 'video' | 'cover'
export type VideoAssetUploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

export interface UploadProgressSnapshot {
    progress: number
    uploadedBytes: number
    totalBytes: number
    remainingBytes: number
}

export interface UploadedVideoAsset {
    assetType: VideoAssetType
    filename: string
    size: number
    type: string
    url: string
    key: string
}

interface UploadVideoAssetOptions {
    file: File
    assetType: VideoAssetType
    folder?: string
    onProgress?: (snapshot: UploadProgressSnapshot) => void
    onStatusChange?: (status: VideoAssetUploadStatus) => void
}

export interface VideoAssetUploadTask {
    abort: () => void
    promise: Promise<UploadedVideoAsset>
}

const isUploadedVideoAsset = (payload: unknown): payload is { ok: true; data: UploadedVideoAsset } => {
    if (!payload || typeof payload !== 'object') {
        return false
    }

    if (!('ok' in payload) || payload.ok !== true || !('data' in payload)) {
        return false
    }

    const { data } = payload as { data: unknown }

    return Boolean(
        data &&
        typeof data === 'object' &&
        'url' in data &&
        typeof data.url === 'string' &&
        data.url.trim()
    )
}

const getErrorMessage = (payload: unknown) => {
    if (
        payload &&
        typeof payload === 'object' &&
        'message' in payload &&
        typeof payload.message === 'string'
    ) {
        return payload.message
    }

    return 'No se pudo completar la subida.'
}

export const uploadVideoAsset = ({
    file,
    assetType,
    folder = 'videos-admin',
    onProgress,
    onStatusChange
}: UploadVideoAssetOptions): VideoAssetUploadTask => {
    const xhr = new XMLHttpRequest()

    const promise = new Promise<UploadedVideoAsset>((resolve, reject) => {
        let settled = false

        const safeParsePayload = () => {
            if (xhr.response && typeof xhr.response === 'object') {
                return xhr.response
            }

            if (!xhr.responseText) {
                return null
            }

            try {
                return JSON.parse(xhr.responseText)
            } catch {
                return null
            }
        }

        const settleSuccess = (payload: unknown) => {
            if (settled) {
                return
            }

            settled = true
            onStatusChange?.('success')
            resolve((payload as { data: UploadedVideoAsset }).data)
        }

        const settleError = (payload?: unknown) => {
            if (settled) {
                return
            }

            settled = true
            onStatusChange?.('error')
            reject(new Error(getErrorMessage(payload)))
        }

        xhr.open('POST', '/api/videos/uploadFiles')
        xhr.responseType = 'json'

        xhr.upload.addEventListener('loadstart', () => {
            onStatusChange?.('uploading')
            onProgress?.({
                progress: 0,
                uploadedBytes: 0,
                totalBytes: file.size,
                remainingBytes: file.size
            })
        })

        xhr.upload.addEventListener('progress', (event) => {
            const totalBytes = event.total || file.size || 0
            const uploadedBytes = event.loaded
            const progress = totalBytes > 0
                ? Math.min(100, Math.round((uploadedBytes / totalBytes) * 100))
                : 0

            onStatusChange?.('uploading')
            onProgress?.({
                progress,
                uploadedBytes,
                totalBytes,
                remainingBytes: Math.max(0, totalBytes - uploadedBytes)
            })
        })

        xhr.upload.addEventListener('load', () => {
            onStatusChange?.('processing')
            onProgress?.({
                progress: 100,
                uploadedBytes: file.size,
                totalBytes: file.size,
                remainingBytes: 0
            })
        })

        const finalizeRequest = ({
            allowPendingPayload = false
        }: {
            allowPendingPayload?: boolean
        } = {}) => {
            if (xhr.readyState !== XMLHttpRequest.DONE || settled) {
                return
            }

            const payload = safeParsePayload()

            if (allowPendingPayload && xhr.status >= 200 && xhr.status < 300 && payload === null) {
                return
            }

            if (xhr.status < 200 || xhr.status >= 300 || !isUploadedVideoAsset(payload)) {
                settleError(payload)
                return
            }

            settleSuccess(payload)
        }

        xhr.onload = () => finalizeRequest()
        xhr.onreadystatechange = () => finalizeRequest({ allowPendingPayload: true })

        xhr.onerror = () => {
            settleError({ message: 'No se pudo completar la subida.' })
        }

        xhr.onabort = () => {
            settled = true
            reject(new DOMException('Upload aborted', 'AbortError'))
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('assetType', assetType)
        formData.append('folder', folder)

        xhr.send(formData)
    })

    return {
        abort: () => xhr.abort(),
        promise
    }
}

export default uploadVideoAsset
