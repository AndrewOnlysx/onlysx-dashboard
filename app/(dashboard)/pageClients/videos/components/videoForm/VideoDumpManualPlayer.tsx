'use client'

import { useEffect, useRef, useState } from 'react'

import { formatDurationClock } from '@/lib/videos/admin'

import { PREVIEW_GAP_MS, seekTo, sleep, waitForMetadata } from './dumpPlayback'
import type { PreviewWindow } from './utils'
import { videoFormPrimaryActionClassName, videoFormSecondaryActionClassName } from './videoFormUi'

interface Props {
    src: string
    previewWindows: PreviewWindow[]
    poster?: string
}

const VideoDumpManualPlayer = ({ src, previewWindows, poster }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const playbackRunRef = useRef(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [playbackStartIndex, setPlaybackStartIndex] = useState(0)
    const [playbackRequestId, setPlaybackRequestId] = useState(0)
    const [playbackError, setPlaybackError] = useState('')

    const hasPreview = Boolean(src && previewWindows.length > 0)

    const stopPlayback = () => {
        playbackRunRef.current += 1
        setIsPlaying(false)

        const video = videoRef.current
        if (video) {
            video.pause()
        }
    }

    const startPlayback = (startIndex = activeIndex) => {
        if (!hasPreview) {
            return
        }

        playbackRunRef.current += 1
        setPlaybackError('')
        setPlaybackStartIndex(startIndex)
        setActiveIndex(startIndex)
        setPlaybackRequestId((prev) => prev + 1)
        setIsPlaying(true)
    }

    useEffect(() => {
        const video = videoRef.current

        if (!video || !src || previewWindows.length === 0 || !isPlaying) {
            return
        }

        const runId = playbackRunRef.current
        let cancelled = false

        const playSequence = async () => {
            try {
                await waitForMetadata(video)

                for (let offset = 0; offset < previewWindows.length; offset += 1) {
                    if (cancelled || playbackRunRef.current !== runId) {
                        break
                    }

                    const index = (playbackStartIndex + offset) % previewWindows.length
                    const window = previewWindows[index]

                    setActiveIndex(index)
                    await seekTo(video, window.start)
                    await video.play().catch(() => undefined)

                    const clipDurationMs = Math.max(350, (window.end - window.start) * 1000)
                    await sleep(clipDurationMs)

                    if (cancelled || playbackRunRef.current !== runId) {
                        break
                    }

                    video.pause()
                    await sleep(PREVIEW_GAP_MS)
                }
            } catch (error) {
                console.error('Error reproduciendo el dump manual:', error)
                setPlaybackError('No se pudo reproducir el dump manualmente.')
            } finally {
                if (!cancelled && playbackRunRef.current === runId) {
                    video.pause()
                    setIsPlaying(false)
                }
            }
        }

        playSequence()

        return () => {
            cancelled = true
            video.pause()
        }
    }, [isPlaying, playbackRequestId, playbackStartIndex, previewWindows, src])

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-[6px] border border-[#262c35] bg-[#0d1015]">
                <div className="aspect-video bg-[#0d1015]">
                    {src ? (
                        <video
                            ref={videoRef}
                            src={src}
                            poster={poster}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#8f97a8]">
                            Sube el video para desbloquear el reproductor manual del dump.
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => startPlayback()}
                    disabled={!hasPreview}
                    className={videoFormPrimaryActionClassName}
                >
                    {isPlaying ? 'Reiniciar dump' : 'Reproducir dump'}
                </button>
                <button
                    type="button"
                    onClick={stopPlayback}
                    disabled={!hasPreview || !isPlaying}
                    className={videoFormSecondaryActionClassName}
                >
                    Detener
                </button>
                <span className="inline-flex items-center justify-center rounded-[6px] border border-[#303640] bg-[#171b22] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#aeb7c6]">
                    {previewWindows.length > 0 ? `${previewWindows.length} snippets` : 'Sin snippets'}
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {previewWindows.map((window, index) => (
                    <button
                        key={`${window.start}-${window.end}`}
                        type="button"
                        onClick={() => startPlayback(index)}
                        disabled={!src}
                        className={`rounded-[6px] border px-3 py-1.5 text-xs font-medium transition ${activeIndex === index
                            ? 'border-[#6b2f52] bg-[#27111e] text-[#ff8ecb]'
                            : 'border-[#303640] bg-[#171b22] text-[#aeb7c6] hover:border-[var(--primary)] hover:text-[#f5f7fb]'
                            }`}
                    >
                        {formatDurationClock(window.start)} - {formatDurationClock(window.end)}
                    </button>
                ))}
            </div>

            {playbackError && (
                <p className="text-sm text-[#ff9ca4]">{playbackError}</p>
            )}
        </div>
    )
}

export default VideoDumpManualPlayer
