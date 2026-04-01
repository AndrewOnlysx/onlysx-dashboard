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

interface PreparedUploadAsset extends UploadedVideoAsset {
    uploadUrl: string
    method: 'PUT'
    headers?: Record<string, string>
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

const UPLOAD_LOG_PREFIX = '[upload]'

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
        'assetType' in data &&
        (data.assetType === 'video' || data.assetType === 'cover') &&
        'filename' in data &&
        typeof data.filename === 'string' &&
        'size' in data &&
        typeof data.size === 'number' &&
        'type' in data &&
        typeof data.type === 'string' &&
        'url' in data &&
        typeof data.url === 'string' &&
        'key' in data &&
        typeof data.key === 'string'
    )
}

const isPreparedUploadAsset = (payload: unknown): payload is { ok: true; data: PreparedUploadAsset } => {
    if (!isUploadedVideoAsset(payload)) {
        return false
    }

    const { data } = payload as { data: unknown }

    return Boolean(
        data &&
        typeof data === 'object' &&
        'uploadUrl' in data &&
        typeof data.uploadUrl === 'string' &&
        'method' in data &&
        data.method === 'PUT'
    )
}

const getErrorMessage = (payload: unknown, status?: number) => {
    if (
        payload &&
        typeof payload === 'object' &&
        'message' in payload &&
        typeof payload.message === 'string'
    ) {
        return payload.message
    }

    if (status === 413) {
        return 'El archivo es demasiado pesado para este endpoint.'
    }

    return 'No se pudo completar la subida.'
}

const createSnapshot = (
    uploadedBytes: number,
    totalBytes: number,
    maxProgress = 100
): UploadProgressSnapshot => ({
    progress: totalBytes > 0 ? Math.min(maxProgress, Math.round((uploadedBytes / totalBytes) * maxProgress)) : 0,
    uploadedBytes,
    totalBytes,
    remainingBytes: Math.max(0, totalBytes - uploadedBytes)
})

const parseResponse = (responseText: string): unknown => {
    if (!responseText) {
        return null
    }

    try {
        return JSON.parse(responseText) as unknown
    } catch {
        return null
    }
}

const shouldUseLocalVideoUpload = () => {
    if (typeof window === 'undefined') {
        return false
    }

    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

const uploadThroughLocalApi = ({
    xhr,
    file,
    assetType,
    folder,
    onProgress,
    onStatusChange,
    resolve,
    reject,
}: {
    xhr: XMLHttpRequest
    file: File
    assetType: VideoAssetType
    folder: string
    onProgress?: (snapshot: UploadProgressSnapshot) => void
    onStatusChange?: (status: VideoAssetUploadStatus) => void
    resolve: (value: UploadedVideoAsset) => void
    reject: (reason?: unknown) => void
}) => {
    const formData = new FormData()

    formData.set('file', file)
    formData.set('assetType', assetType)
    formData.set('folder', folder)

    console.log(`${UPLOAD_LOG_PREFIX} start-local`, {
        assetType,
        fileName: file.name,
        fileSize: file.size,
    })

    xhr.open('POST', '/api/videos/uploadFiles')
    xhr.responseType = 'text'

    xhr.upload.addEventListener('loadstart', () => {
        onStatusChange?.('uploading')
        onProgress?.(createSnapshot(0, file.size, 78))
    })

    xhr.upload.addEventListener('progress', (event: ProgressEvent<EventTarget>) => {
        onStatusChange?.('uploading')
        onProgress?.(createSnapshot(Math.min(file.size, event.loaded), file.size, 78))
    })

    xhr.upload.addEventListener('load', () => {
        onStatusChange?.('processing')
        onProgress?.(createSnapshot(file.size, file.size, 88))
    })

    xhr.onload = () => {
        const payload = parseResponse(xhr.responseText)

        if (xhr.status < 200 || xhr.status >= 300 || !isUploadedVideoAsset(payload)) {
            const message = getErrorMessage(payload, xhr.status)

            console.error(`${UPLOAD_LOG_PREFIX} error-local`, {
                assetType,
                fileName: file.name,
                message,
                status: xhr.status,
            })

            onStatusChange?.('error')
            reject(new Error(message))
            return
        }

        console.log(`${UPLOAD_LOG_PREFIX} success-local`, {
            assetType,
            fileName: payload.data.filename,
            url: payload.data.url,
        })

        onProgress?.(createSnapshot(file.size, file.size))
        onStatusChange?.('success')
        resolve(payload.data)
    }

    xhr.onerror = () => {
        console.error(`${UPLOAD_LOG_PREFIX} error-local`, {
            assetType,
            fileName: file.name,
            message: 'Fallo la subida por servidor.',
        })

        onStatusChange?.('error')
        reject(new Error('No se pudo completar la subida.'))
    }

    xhr.onabort = () => {
        console.warn(`${UPLOAD_LOG_PREFIX} aborted-local`, {
            assetType,
            fileName: file.name,
        })

        reject(new DOMException('Upload aborted', 'AbortError'))
    }

    xhr.send(formData)
}

export const uploadVideoAsset = ({
    file,
    assetType,
    folder = 'videos-admin',
    onProgress,
    onStatusChange
}: UploadVideoAssetOptions): VideoAssetUploadTask => {
    const xhr = new XMLHttpRequest()
    let prepareController: AbortController | null = null

    const promise = new Promise<UploadedVideoAsset>((resolve, reject) => {
        if (assetType === 'cover' || shouldUseLocalVideoUpload()) {
            uploadThroughLocalApi({
                xhr,
                file,
                assetType,
                folder,
                onProgress,
                onStatusChange,
                resolve,
                reject,
            })

            return
        }

        console.log(`${UPLOAD_LOG_PREFIX} prepare`, {
            assetType,
            fileName: file.name,
            fileSize: file.size,
        })

        prepareController = new AbortController()

        void fetch('/api/videos/uploadFiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: prepareController.signal,
            body: JSON.stringify({
                filename: file.name,
                type: file.type,
                size: file.size,
                assetType,
                folder,
            })
        })
            .then(async (response) => {
                const payload = await response.json().catch(() => null)

                if (!response.ok || !isPreparedUploadAsset(payload)) {
                    throw new Error(getErrorMessage(payload, response.status))
                }

                const prepared = payload.data

                console.log(`${UPLOAD_LOG_PREFIX} start`, {
                    assetType,
                    fileName: prepared.filename,
                    fileSize: file.size,
                    key: prepared.key,
                })

                xhr.open('PUT', prepared.uploadUrl)
                xhr.responseType = 'text'

                Object.entries(prepared.headers ?? {}).forEach(([header, value]) => {
                    xhr.setRequestHeader(header, value)
                })

                xhr.upload.addEventListener('loadstart', () => {
                    onStatusChange?.('uploading')
                    onProgress?.(createSnapshot(0, file.size))
                })

                xhr.upload.addEventListener('progress', (event: ProgressEvent<EventTarget>) => {
                    onStatusChange?.('uploading')
                    onProgress?.(createSnapshot(Math.min(file.size, event.loaded), file.size))
                })

                xhr.onload = () => {
                    if (xhr.status < 200 || xhr.status >= 300) {
                        console.error(`${UPLOAD_LOG_PREFIX} error`, {
                            assetType,
                            fileName: prepared.filename,
                            message: 'Cloudflare rechazo la subida.',
                            status: xhr.status,
                        })

                        onStatusChange?.('error')
                        reject(new Error('No se pudo completar la subida.'))
                        return
                    }

                    console.log(`${UPLOAD_LOG_PREFIX} success`, {
                        assetType,
                        fileName: prepared.filename,
                        url: prepared.url,
                    })

                    onProgress?.(createSnapshot(file.size, file.size))
                    onStatusChange?.('success')
                    resolve(prepared)
                }

                xhr.onerror = () => {
                    console.error(`${UPLOAD_LOG_PREFIX} error`, {
                        assetType,
                        fileName: prepared.filename,
                        message: 'Fallo la subida directa a Cloudflare.',
                    })

                    onStatusChange?.('error')
                    reject(new Error('No se pudo completar la subida.'))
                }

                xhr.onabort = () => {
                    console.warn(`${UPLOAD_LOG_PREFIX} aborted`, {
                        assetType,
                        fileName: prepared.filename,
                    })

                    reject(new DOMException('Upload aborted', 'AbortError'))
                }

                xhr.send(file)
            })
            .catch((error) => {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    reject(error)
                    return
                }

                console.error(`${UPLOAD_LOG_PREFIX} error`, {
                    assetType,
                    fileName: file.name,
                    message: error instanceof Error ? error.message : 'No se pudo preparar la subida.',
                })

                onStatusChange?.('error')
                reject(error instanceof Error ? error : new Error('No se pudo completar la subida.'))
            })
    })

    return {
        abort: () => {
            prepareController?.abort()
            xhr.abort()
        },
        promise
    }
}

export default uploadVideoAsset
