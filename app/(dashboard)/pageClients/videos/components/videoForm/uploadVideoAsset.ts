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

interface DirectSingleUploadDescriptor extends UploadedVideoAsset {
    strategy: 'single'
    uploadUrl: string
    method: 'PUT'
    headers?: Record<string, string>
}

interface DirectMultipartUploadDescriptor extends UploadedVideoAsset {
    strategy: 'multipart'
    uploadId: string
    partSize: number
    method: 'PUT'
    parts: Array<{
        partNumber: number
        uploadUrl: string
    }>
}

type UploadDescriptor = DirectSingleUploadDescriptor | DirectMultipartUploadDescriptor

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
        data.url.trim() &&
        'key' in data &&
        typeof data.key === 'string'
    )
}

const isUploadDescriptor = (payload: unknown): payload is { ok: true; data: UploadDescriptor } => {
    if (!isUploadedVideoAsset(payload)) {
        return false
    }

    const data = payload.data as unknown

    if (!data || typeof data !== 'object' || !('strategy' in data)) {
        return false
    }

    if (data.strategy === 'single') {
        return Boolean(
            'uploadUrl' in data &&
            typeof data.uploadUrl === 'string' &&
            data.uploadUrl.trim() &&
            'method' in data &&
            data.method === 'PUT'
        )
    }

    if (data.strategy === 'multipart') {
        const parts = 'parts' in data ? data.parts : undefined

        return Boolean(
            'uploadId' in data &&
            typeof data.uploadId === 'string' &&
            data.uploadId.trim() &&
            'partSize' in data &&
            typeof data.partSize === 'number' &&
            Array.isArray(parts) &&
            parts.every((part) => (
                part &&
                typeof part === 'object' &&
                'partNumber' in part &&
                typeof part.partNumber === 'number' &&
                'uploadUrl' in part &&
                typeof part.uploadUrl === 'string' &&
                part.uploadUrl.trim()
            ))
        )
    }

    return false
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
        return 'El archivo es demasiado pesado para este endpoint. Intenta con un archivo mas pequeno o cambia la estrategia de subida.'
    }

    return 'No se pudo completar la subida.'
}

const getTransportErrorMessage = (uploadUrl: string) => {
    try {
        const { hostname } = new URL(uploadUrl)

        if (hostname.endsWith('.r2.cloudflarestorage.com')) {
            return 'La URL firmada de R2 fue bloqueada por CORS. Debes permitir este origin en la configuracion del bucket.'
        }
    } catch {
        return 'No se pudo completar la subida.'
    }

    return 'No se pudo completar la subida.'
}

const createSnapshot = ({
    uploadedBytes,
    totalBytes,
}: {
    uploadedBytes: number
    totalBytes: number
}): UploadProgressSnapshot => ({
    progress: totalBytes > 0 ? Math.min(100, Math.round((uploadedBytes / totalBytes) * 100)) : 0,
    uploadedBytes,
    totalBytes,
    remainingBytes: Math.max(0, totalBytes - uploadedBytes)
})

export const uploadVideoAsset = ({
    file,
    assetType,
    folder = 'videos-admin',
    onProgress,
    onStatusChange
}: UploadVideoAssetOptions): VideoAssetUploadTask => {
    let activeRequest: XMLHttpRequest | null = null
    let activeMultipartContext: { key: string; uploadId: string } | null = null
    let rejectedByAbort = false
    let rejectPromise: ((reason?: unknown) => void) | null = null

    const abortMultipart = () => {
        if (!activeMultipartContext) {
            return
        }

        void fetch('/api/videos/uploadFiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'abortMultipart',
                key: activeMultipartContext.key,
                uploadId: activeMultipartContext.uploadId,
            })
        })
    }

    const uploadChunk = ({
        uploadUrl,
        blob,
        headers,
        uploadedBytesBefore = 0,
    }: {
        uploadUrl: string
        blob: Blob
        headers?: Record<string, string>
        uploadedBytesBefore?: number
    }) => new Promise<{ etag?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        activeRequest = xhr

        xhr.open('PUT', uploadUrl)
        xhr.responseType = 'text'

        Object.entries(headers ?? {}).forEach(([header, value]) => {
            xhr.setRequestHeader(header, value)
        })

        xhr.upload.addEventListener('loadstart', () => {
            onStatusChange?.('uploading')
            onProgress?.(createSnapshot({
                uploadedBytes: uploadedBytesBefore,
                totalBytes: file.size,
            }))
        })

        xhr.upload.addEventListener('progress', (event) => {
            const uploadedBytes = Math.min(file.size, uploadedBytesBefore + event.loaded)
            onStatusChange?.('uploading')
            onProgress?.(createSnapshot({
                uploadedBytes,
                totalBytes: file.size,
            }))
        })

        xhr.onload = () => {
            activeRequest = null

            if (xhr.status < 200 || xhr.status >= 300) {
                reject(new Error(getErrorMessage(null, xhr.status)))
                return
            }

            const etag = xhr.getResponseHeader('ETag')?.replaceAll('"', '')
            resolve({ etag: etag || undefined })
        }

        xhr.onerror = () => {
            activeRequest = null
            reject(new Error(getTransportErrorMessage(uploadUrl)))
        }

        xhr.onabort = () => {
            activeRequest = null
            reject(new DOMException('Upload aborted', 'AbortError'))
        }

        xhr.send(blob)
    })

    const promise = new Promise<UploadedVideoAsset>(async (resolve, reject) => {
        rejectPromise = reject

        let descriptor: UploadDescriptor | null = null

        try {
            const response = await fetch('/api/videos/uploadFiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: file.name,
                    size: file.size,
                    type: file.type,
                    assetType,
                    folder,
                })
            })

            const payload = await response.json().catch(() => null)

            if (!response.ok || !isUploadDescriptor(payload)) {
                reject(new Error(getErrorMessage(payload, response.status)))
                return
            }

            descriptor = payload.data

            if (rejectedByAbort) {
                reject(new DOMException('Upload aborted', 'AbortError'))
                return
            }

            if (descriptor.strategy === 'single') {
                await uploadChunk({
                    uploadUrl: descriptor.uploadUrl,
                    blob: file,
                    headers: descriptor.headers,
                })

                onStatusChange?.('processing')
                onProgress?.(createSnapshot({
                    uploadedBytes: file.size,
                    totalBytes: file.size,
                }))
                onStatusChange?.('success')
                resolve(descriptor)
                return
            }

            activeMultipartContext = {
                key: descriptor.key,
                uploadId: descriptor.uploadId,
            }

            const completedParts: Array<{ ETag: string; PartNumber: number }> = []
            let uploadedBytesBefore = 0

            for (const part of descriptor.parts) {
                if (rejectedByAbort) {
                    abortMultipart()
                    reject(new DOMException('Upload aborted', 'AbortError'))
                    return
                }

                const start = (part.partNumber - 1) * descriptor.partSize
                const end = Math.min(start + descriptor.partSize, file.size)
                const chunk = file.slice(start, end)
                const { etag } = await uploadChunk({
                    uploadUrl: part.uploadUrl,
                    blob: chunk,
                    uploadedBytesBefore,
                })

                uploadedBytesBefore += chunk.size
                onProgress?.(createSnapshot({
                    uploadedBytes: uploadedBytesBefore,
                    totalBytes: file.size,
                }))

                if (!etag) {
                    abortMultipart()
                    reject(new Error('No se pudo confirmar una parte del multipart upload.'))
                    return
                }

                completedParts.push({
                    ETag: etag,
                    PartNumber: part.partNumber,
                })
            }

            onStatusChange?.('processing')

            const completeResponse = await fetch('/api/videos/uploadFiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'completeMultipart',
                    assetType,
                    filename: descriptor.filename,
                    size: descriptor.size,
                    type: descriptor.type,
                    key: descriptor.key,
                    uploadId: descriptor.uploadId,
                    parts: completedParts,
                })
            })

            const completePayload = await completeResponse.json().catch(() => null)

            if (!completeResponse.ok || !isUploadedVideoAsset(completePayload)) {
                reject(new Error(getErrorMessage(completePayload, completeResponse.status)))
                return
            }

            activeMultipartContext = null
            onStatusChange?.('success')
            resolve(completePayload.data)
        } catch (error) {
            if (descriptor?.strategy === 'multipart') {
                abortMultipart()
            }

            if (error instanceof DOMException && error.name === 'AbortError') {
                reject(error)
                return
            }

            onStatusChange?.('error')
            reject(error instanceof Error ? error : new Error('No se pudo completar la subida.'))
        }
    })

    return {
        abort: () => {
            rejectedByAbort = true

            if (activeRequest) {
                activeRequest.abort()
            } else if (rejectPromise) {
                rejectPromise(new DOMException('Upload aborted', 'AbortError'))
            }

            abortMultipart()
        },
        promise
    }
}

export default uploadVideoAsset
