export const PREVIEW_GAP_MS = 220

export const waitForMetadata = (video: HTMLVideoElement) =>
    new Promise<void>((resolve, reject) => {
        if (video.readyState >= 1) {
            resolve()
            return
        }

        const handleLoadedMetadata = () => {
            cleanup()
            resolve()
        }

        const handleError = () => {
            cleanup()
            reject(new Error('No se pudo cargar la metadata del video.'))
        }

        const cleanup = () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
            video.removeEventListener('error', handleError)
        }

        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('error', handleError)
    })

export const seekTo = (video: HTMLVideoElement, time: number) =>
    new Promise<void>((resolve, reject) => {
        if (Math.abs(video.currentTime - time) < 0.05) {
            resolve()
            return
        }

        const handleSeeked = () => {
            cleanup()
            resolve()
        }

        const handleError = () => {
            cleanup()
            reject(new Error('No se pudo posicionar el preview.'))
        }

        const cleanup = () => {
            video.removeEventListener('seeked', handleSeeked)
            video.removeEventListener('error', handleError)
        }

        video.addEventListener('seeked', handleSeeked)
        video.addEventListener('error', handleError)
        video.currentTime = time
    })

export const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms)
    })
