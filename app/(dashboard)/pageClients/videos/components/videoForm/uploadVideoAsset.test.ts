import { afterEach, describe, expect, it, vi } from 'vitest'

import { uploadVideoAsset } from './uploadVideoAsset'

const uploadSuccessPayload = {
    ok: true,
    data: {
        assetType: 'video',
        filename: 'video.mp4',
        size: 4096,
        type: 'video/mp4',
        url: 'https://cdn.test/video.mp4',
        key: 'page-content/test/video.mp4',
        uploadUrl: 'https://r2.test/direct-put',
        method: 'PUT',
        headers: {
            'Content-Type': 'video/mp4'
        }
    }
} as const

type UploadListener = (event?: { loaded: number; total: number }) => void

class MockXMLHttpRequest {
    static DONE = 4

    static nextResponseText = JSON.stringify(uploadSuccessPayload)

    static nextStatus = 200

    readyState = 0
    status = 0
    responseType = ''
    response: unknown = null
    responseText = ''
    onload: null | (() => void) = null
    onreadystatechange: null | (() => void) = null
    onerror: null | (() => void) = null
    onabort: null | (() => void) = null
    upload = {
        addEventListener: (eventName: string, listener: UploadListener) => {
            this.uploadListeners.set(eventName, listener)
        }
    }

    private uploadListeners = new Map<string, UploadListener>()

    open() {
        return undefined
    }

    setRequestHeader() {
        return undefined
    }

    getResponseHeader(name: string) {
        return name === 'ETag' ? '"etag-123"' : null
    }

    send(body?: Document | XMLHttpRequestBodyInit | null) {
        queueMicrotask(() => {
            const total = body instanceof Blob ? body.size : 4096

            this.uploadListeners.get('loadstart')?.({ loaded: 0, total })
            this.uploadListeners.get('progress')?.({ loaded: total / 2, total })
            this.uploadListeners.get('load')?.({ loaded: total, total })

            this.readyState = MockXMLHttpRequest.DONE
            this.status = MockXMLHttpRequest.nextStatus
            this.onreadystatechange?.()

            this.response = MockXMLHttpRequest.nextResponseText
            this.responseText = MockXMLHttpRequest.nextResponseText
            this.onload?.()
        })
    }

    abort() {
        this.onabort?.()
    }
}

describe('uploadVideoAsset', () => {
    afterEach(() => {
        MockXMLHttpRequest.nextResponseText = JSON.stringify(uploadSuccessPayload)
        MockXMLHttpRequest.nextStatus = 200
        vi.unstubAllGlobals()
    })

    it('sube archivos simples por la API local y espera la respuesta final del servidor antes de exponer la URL remota', async () => {
        vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest)
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => uploadSuccessPayload
        })

        vi.stubGlobal('fetch', fetchMock)

        const file = new File([new Uint8Array(4096)], 'video.mp4', { type: 'video/mp4' })
        const statusChanges: string[] = []
        const progressSnapshots: number[] = []

        const task = uploadVideoAsset({
            file,
            assetType: 'video',
            onStatusChange: (status) => {
                statusChanges.push(status)
            },
            onProgress: (snapshot) => {
                progressSnapshots.push(snapshot.progress)
            }
        })

        const uploadedAsset = await task.promise

        expect(uploadedAsset.url).toBe('https://cdn.test/video.mp4')
        expect(progressSnapshots).toEqual([0, 50, 100])
        expect(statusChanges).toEqual(['uploading', 'uploading', 'success'])
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('sube portadas por el endpoint local para evitar el bloqueo del put directo', async () => {
        vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest)
        const fetchMock = vi.fn()

        vi.stubGlobal('fetch', fetchMock)

        const file = new File([new Uint8Array(1024)], 'poster image.jpg', { type: 'image/jpeg' })
        const task = uploadVideoAsset({
            file,
            assetType: 'cover'
        })

        const uploadedAsset = await task.promise

        expect(uploadedAsset.url).toBe('https://cdn.test/video.mp4')
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('usa el endpoint local para videos cuando corre en localhost', async () => {
        vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest)
        vi.stubGlobal('window', {
            location: {
                hostname: 'localhost'
            }
        })
        const fetchMock = vi.fn()

        vi.stubGlobal('fetch', fetchMock)

        const file = new File([new Uint8Array(2048)], 'video.mp4', { type: 'video/mp4' })
        const task = uploadVideoAsset({
            file,
            assetType: 'video'
        })

        const uploadedAsset = await task.promise

        expect(uploadedAsset.url).toBe('https://cdn.test/video.mp4')
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('expone un error cuando falla la subida', async () => {
        class FailingXMLHttpRequest extends MockXMLHttpRequest {
            override send() {
                queueMicrotask(() => {
                    this.onerror?.()
                })
            }
        }

        vi.stubGlobal('XMLHttpRequest', FailingXMLHttpRequest)
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => uploadSuccessPayload
        }))

        const file = new File([new Uint8Array(32)], 'video.mp4', { type: 'video/mp4' })

        const task = uploadVideoAsset({
            file,
            assetType: 'video'
        })

        await expect(task.promise).rejects.toThrow('No se pudo completar la subida.')
    })
})