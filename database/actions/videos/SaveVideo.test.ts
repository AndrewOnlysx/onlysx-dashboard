import { beforeEach, describe, expect, it, vi } from 'vitest'

const createVideoMock = vi.fn()
const updateVideoMock = vi.fn()

vi.mock('./CreateVideo', () => ({
    __esModule: true,
    default: createVideoMock,
    CreateVideo: createVideoMock
}))

vi.mock('./UpdateVideo', () => ({
    __esModule: true,
    default: updateVideoMock,
    UpdateVideo: updateVideoMock
}))

const validPayload = {
    title: 'Video de prueba',
    time: '01:20',
    image: 'https://cdn.test/cover.webp',
    video: 'https://cdn.test/video.mp4',
    dump: 'https://cdn.test/video.mp4',
    quality: '1080p',
    models: ['507f1f77bcf86cd799439011'],
    tags: ['507f1f77bcf86cd799439012'],
    galeries: ['507f1f77bcf86cd799439013'],
    views: 120,
    lastViews: 'ayer',
    manualSearchParams: ['editorial'],
    searchPrarms: ['video', 'editorial']
}

describe('SaveVideo', () => {
    beforeEach(() => {
        createVideoMock.mockReset()
        updateVideoMock.mockReset()
    })

    it('crea un video nuevo cuando no recibe videoId', async () => {
        createVideoMock.mockResolvedValue({
            ok: true,
            video: { _id: 'new-video-id', ...validPayload }
        })

        const { SaveVideo } = await import('./SaveVideo')
        const result = await SaveVideo(validPayload)

        expect(createVideoMock).toHaveBeenCalledWith(validPayload)
        expect(updateVideoMock).not.toHaveBeenCalled()
        expect(result.ok).toBe(true)
    })

    it('actualiza un video existente cuando recibe videoId', async () => {
        updateVideoMock.mockResolvedValue({
            ok: true,
            video: { _id: 'existing-video-id', ...validPayload }
        })

        const { SaveVideo } = await import('./SaveVideo')
        const result = await SaveVideo({
            ...validPayload,
            videoId: 'existing-video-id'
        })

        expect(updateVideoMock).toHaveBeenCalledWith({
            ...validPayload,
            videoId: 'existing-video-id'
        })
        expect(createVideoMock).not.toHaveBeenCalled()
        expect(result.ok).toBe(true)
    })
})