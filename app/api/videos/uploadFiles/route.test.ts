import { describe, expect, it, vi, beforeEach } from 'vitest'

import { createUniqueVideoFixture } from '../../../../tests/helpers/videoFixture'

const createDirectUploadTargetMock = vi.fn()
const uploadFileMock = vi.fn()

vi.mock('@/database/utils/cloudflare/Handler', () => ({
    CreateDirectUploadTarget: createDirectUploadTargetMock,
    UploadFile: uploadFileMock
}))

describe('POST /api/videos/uploadFiles', () => {
    beforeEach(() => {
        createDirectUploadTargetMock.mockReset()
        uploadFileMock.mockReset()
    })

    it('prepara una subida directa a cloudflare para reportar progreso real del put', async () => {
        createDirectUploadTargetMock.mockResolvedValue({
            success: true,
            uploadUrl: 'https://r2.test/direct-put',
            url: 'https://cdn.test/video.mp4',
            key: 'page-content/test/video.mp4',
            filename: 'video.mp4',
        })

        const { POST } = await import('./route')
        const response = await POST(new Request('http://localhost/api/videos/uploadFiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: 'video original.mp4',
                type: 'video/mp4',
                size: 1234,
                assetType: 'video',
                folder: 'videos-admin'
            })
        }))

        const payload = await response.json()

        expect(response.status).toBe(200)
        expect(payload.ok).toBe(true)
        expect(payload.data.uploadUrl).toBe('https://r2.test/direct-put')
        expect(payload.data.url).toBe('https://cdn.test/video.mp4')
        expect(createDirectUploadTargetMock).toHaveBeenCalledWith(
            expect.objectContaining({
                filename: 'video original.mp4',
                contentType: 'video/mp4'
            })
        )
    })

    it('sube un video y devuelve la URL remota usando un nombre unico', async () => {
        const videoFile = await createUniqueVideoFixture()

        uploadFileMock.mockResolvedValue({
            success: true,
            url: `https://cdn.test/${videoFile.name}`,
            key: `page-content/test/${videoFile.name}`,
            filename: videoFile.name.replace(/\s+/g, '-'),
            etag: 'etag-123'
        })

        const formData = new FormData()
        formData.append('file', videoFile)
        formData.append('assetType', 'video')
        formData.append('folder', 'videos-admin')

        const { POST } = await import('./route')
        const response = await POST(new Request('http://localhost/api/videos/uploadFiles', {
            method: 'POST',
            body: formData
        }))

        const payload = await response.json()

        expect(response.status).toBe(200)
        expect(payload.ok).toBe(true)
        expect(payload.data.filename).toBe(videoFile.name.replace(/\s+/g, '-'))
        expect(payload.data.url).toBe(`https://cdn.test/${videoFile.name}`)
        expect(videoFile.name).toMatch(/^6583402-uhd_4096_2160_25fps-[0-9a-f-]+\.mp4$/)
        expect(uploadFileMock).toHaveBeenCalledWith(
            expect.objectContaining({ name: videoFile.name, size: videoFile.size }),
            expect.stringMatching(/^videos-admin\/video\//)
        )
    })

    it('rechaza un prepare upload con json invalido', async () => {
        const { POST } = await import('./route')
        const response = await POST(new Request('http://localhost/api/videos/uploadFiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }))

        const payload = await response.json()

        expect(response.status).toBe(400)
        expect(payload.ok).toBe(false)
        expect(payload.message).toBe('El cuerpo JSON es invalido.')
    })
})