import { afterEach, describe, expect, it, vi } from 'vitest'

import { createUniqueVideoFixture } from '@/tests/helpers/videoFixture'

import { uploadVideoAsset } from './uploadVideoAsset'

type UploadListener = (event?: { loaded: number; total: number }) => void

class MockXMLHttpRequest {
    static DONE = 4

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

    send() {
        queueMicrotask(() => {
            const total = 4096

            this.uploadListeners.get('loadstart')?.({ loaded: 0, total })
            this.uploadListeners.get('progress')?.({ loaded: 2048, total })
            this.uploadListeners.get('load')?.({ loaded: total, total })

            this.readyState = MockXMLHttpRequest.DONE
            this.status = 200
            this.onreadystatechange?.()

            this.response = {
                ok: true,
                data: {
                    assetType: 'video',
                    filename: 'video.mp4',
                    size: total,
                    type: 'video/mp4',
                    url: 'https://cdn.test/video.mp4',
                    key: 'page-content/test/video.mp4'
                }
            }
            this.responseText = JSON.stringify(this.response)
            this.onload?.()
        })
    }

    abort() {
        this.onabort?.()
    }
}

describe('uploadVideoAsset', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('espera la respuesta final del servidor antes de exponer la URL remota', async () => {
        vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest)

        const file = await createUniqueVideoFixture()
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
        expect(statusChanges).toEqual(['uploading', 'uploading', 'processing', 'success'])
    })
})