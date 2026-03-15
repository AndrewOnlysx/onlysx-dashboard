import { formatDurationClock } from '@/lib/videos/admin'

export const revokeObjectUrl = (url: string) => {
    if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
    }
}

export const formatFileSize = (size: number) => {
    if (size <= 0) {
        return '0 B'
    }

    if (size < 1024) {
        return `${size} B`
    }

    if (size >= 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
    }

    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`
    }

    return `${Math.max(0.1, size / 1024).toFixed(size < 10 * 1024 ? 1 : 0)} KB`
}

const getPosterFileName = (sourceName: string) => {
    const sanitizedName = sourceName.trim() || 'video'
    const extensionIndex = sanitizedName.lastIndexOf('.')
    const basename = extensionIndex > 0
        ? sanitizedName.slice(0, extensionIndex)
        : sanitizedName

    return `${basename}-poster.jpg`
}

export interface PreviewWindow {
    start: number
    end: number
}

export const buildPreviewWindows = (durationSeconds: number): PreviewWindow[] => {
    const safeDuration = Math.max(0, durationSeconds)

    if (safeDuration <= 0) {
        return []
    }

    const clipDuration = Math.min(1.6, Math.max(0.6, safeDuration * 0.12))
    const anchors = safeDuration < 8
        ? [0.12, 0.46, 0.78]
        : [0.08, 0.28, 0.56, 0.8]

    return anchors.map((anchor) => {
        const targetStart = safeDuration * anchor
        const maxStart = Math.max(0, safeDuration - clipDuration)
        const start = Math.min(targetStart, maxStart)

        return {
            start,
            end: Math.min(safeDuration, start + clipDuration)
        }
    })
}

export const createPosterFromVideo = (videoUrl: string, sourceName = 'video') =>
    new Promise<{ posterUrl: string, posterFile: File, durationLabel: string, durationSeconds: number }>((resolve, reject) => {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.muted = true
        video.playsInline = true

        const releaseVideo = () => {
            video.pause()
            video.removeAttribute('src')
            video.load()
        }

        const captureFrame = (durationSeconds: number) => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth || 1280
            canvas.height = video.videoHeight || 720

            const context = canvas.getContext('2d')

            if (!context) {
                releaseVideo()
                reject(new Error('No se pudo acceder al canvas.'))
                return
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height)

            canvas.toBlob((blob) => {
                if (!blob) {
                    releaseVideo()
                    reject(new Error('No se pudo crear la portada.'))
                    return
                }

                const posterUrl = URL.createObjectURL(blob)
                const posterFile = new File([blob], getPosterFileName(sourceName), {
                    type: 'image/jpeg'
                })
                const durationLabel = formatDurationClock(durationSeconds)

                releaseVideo()
                resolve({ posterUrl, posterFile, durationLabel, durationSeconds })
            }, 'image/jpeg', 0.9)
        }

        video.addEventListener('loadeddata', () => {
            const durationSeconds = Number.isFinite(video.duration) ? video.duration : 0
            const captureSecond = durationSeconds > 2
                ? Math.min(durationSeconds * 0.12, 2.5)
                : 0

            if (captureSecond <= 0) {
                captureFrame(durationSeconds)
                return
            }

            const handleSeeked = () => {
                video.removeEventListener('seeked', handleSeeked)
                captureFrame(durationSeconds)
            }

            video.addEventListener('seeked', handleSeeked)
            video.currentTime = captureSecond
        }, { once: true })

        video.addEventListener('error', () => {
            releaseVideo()
            reject(new Error('No se pudo procesar el archivo de video.'))
        }, { once: true })

        video.src = videoUrl
        video.load()
    })
