import { describe, expect, it, vi, beforeEach } from 'vitest'

import { createUniqueVideoFixture } from '../../../../tests/helpers/videoFixture'

const uploadFileMock = vi.fn()

vi.mock('@/database/utils/cloudflare/Handler', () => ({
    UploadFile: uploadFileMock
}))

describe('POST /api/videos/uploadFiles', () => {
    beforeEach(() => {
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
})