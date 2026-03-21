import { describe, expect, it, vi, beforeEach } from 'vitest'

import { createUniqueVideoFixture } from '../../../../tests/helpers/videoFixture'

const createDirectUploadTargetMock = vi.fn()
const createMultipartUploadTargetMock = vi.fn()
const createMultipartUploadPartUrlMock = vi.fn()
const uploadFileMock = vi.fn()

vi.mock('@/database/utils/cloudflare/Handler', () => ({
    CreateDirectUploadTarget: createDirectUploadTargetMock,
    CreateMultipartUploadPartUrl: createMultipartUploadPartUrlMock,
    CreateMultipartUploadTarget: createMultipartUploadTargetMock,
    UploadFile: uploadFileMock
}))

describe('POST /api/videos/uploadFiles', () => {
    beforeEach(() => {
        createDirectUploadTargetMock.mockReset()
        createMultipartUploadTargetMock.mockReset()
        createMultipartUploadPartUrlMock.mockReset()
        uploadFileMock.mockReset()
    })

    it('sube un video y devuelve la URL remota usando un nombre unico', async () => {
        const videoFile = await createUniqueVideoFixture()

        uploadFileMock.mockResolvedValue({
            success: true,
            url: `https://cdn.test/${videoFile.name}`,
            key: `page-content/test/${videoFile.name}`,
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
        expect(payload.data.filename).toBe(videoFile.name)
        expect(payload.data.url).toBe(`https://cdn.test/${videoFile.name}`)
        expect(videoFile.name).toMatch(/^6583402-uhd_4096_2160_25fps-[0-9a-f-]+\.mp4$/)
        expect(uploadFileMock).toHaveBeenCalledWith(
            expect.objectContaining({ name: videoFile.name, size: videoFile.size }),
            expect.stringMatching(/^videos-admin\/video\//)
        )
    })

    it('prepara multipart para videos grandes antes del limite maximo de PUT simple', async () => {
        createMultipartUploadTargetMock.mockResolvedValue({
            success: true,
            uploadId: 'upload-123',
            url: 'https://cdn.test/video.mp4',
            key: 'page-content/test/video.mp4'
        })
        createMultipartUploadPartUrlMock
            .mockResolvedValueOnce({ success: true, partNumber: 1, uploadUrl: 'https://r2.test/part-1' })
            .mockResolvedValueOnce({ success: true, partNumber: 2, uploadUrl: 'https://r2.test/part-2' })
            .mockResolvedValueOnce({ success: true, partNumber: 3, uploadUrl: 'https://r2.test/part-3' })

        const largeVideoSize = 129 * 1024 * 1024

        const { POST } = await import('./route')
        const response = await POST(new Request('http://localhost/api/videos/uploadFiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: 'heavy-video.mp4',
                size: largeVideoSize,
                type: 'video/mp4',
                assetType: 'video',
                folder: 'videos-admin'
            })
        }))

        const payload = await response.json()

        expect(response.status).toBe(200)
        expect(payload.ok).toBe(true)
        expect(payload.data.strategy).toBe('multipart')
        expect(payload.data.partSize).toBe(64 * 1024 * 1024)
        expect(payload.data.parts).toHaveLength(3)
        expect(createMultipartUploadTargetMock).toHaveBeenCalledWith(
            expect.objectContaining({
                filename: 'heavy-video.mp4',
                contentType: 'video/mp4'
            })
        )
        expect(createMultipartUploadPartUrlMock).toHaveBeenCalledTimes(3)
        expect(createDirectUploadTargetMock).not.toHaveBeenCalled()
    })
})