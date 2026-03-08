'use client'

import { useEffect, useRef, useState } from 'react'

import type { PreviewWindow } from './utils'
import { PREVIEW_GAP_MS, seekTo, sleep, waitForMetadata } from './dumpPlayback'

interface Props {
    src: string
    previewWindows: PreviewWindow[]
}

const VideoHoverPreview = ({ src, previewWindows }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [isPreviewVisible, setIsPreviewVisible] = useState(false)

    useEffect(() => {
        let cancelled = false
        const video = videoRef.current

        const playSnippets = async () => {
            if (!video || !src || previewWindows.length === 0 || !isHovering) {
                return
            }

            try {
                await waitForMetadata(video)
                setIsPreviewVisible(true)

                let index = 0

                while (!cancelled && isHovering) {
                    const window = previewWindows[index % previewWindows.length]
                    await seekTo(video, window.start)
                    await video.play().catch(() => undefined)

                    const clipDurationMs = Math.max(350, (window.end - window.start) * 1000)
                    await sleep(clipDurationMs)

                    if (cancelled) {
                        break
                    }

                    video.pause()
                    index += 1
                    await sleep(PREVIEW_GAP_MS)
                }
            } catch (error) {
                console.error('Error reproduciendo snippets del hover preview:', error)
            }
        }

        playSnippets()

        return () => {
            cancelled = true

            if (video) {
                video.pause()
            }
        }
    }, [isHovering, previewWindows, src])

    return (
        <div
            className="absolute inset-0"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false)
                setIsPreviewVisible(false)

                const video = videoRef.current
                if (video) {
                    video.pause()
                }
            }}
        >
            <video
                ref={videoRef}
                src={src}
                className={`absolute inset-0 h-full w-full object-cover transition duration-300 ${isPreviewVisible ? 'opacity-100' : 'opacity-0'}`}
                muted
                playsInline
                preload="metadata"
            />
        </div>
    )
}

export default VideoHoverPreview
