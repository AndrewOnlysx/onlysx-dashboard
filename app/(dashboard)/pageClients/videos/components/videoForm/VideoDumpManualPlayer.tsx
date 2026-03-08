'use client'

import { useEffect, useRef, useState } from 'react'

import { formatDurationClock } from '@/lib/videos/admin'

import { PREVIEW_GAP_MS, seekTo, sleep, waitForMetadata } from './dumpPlayback'
import type { PreviewWindow } from './utils'

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
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/40">
                <div className="aspect-video bg-zinc-900">
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
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-500">
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
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-500"
                >
                    {isPlaying ? 'Reiniciar dump' : 'Reproducir dump'}
                </button>
                <button
                    type="button"
                    onClick={stopPlayback}
                    disabled={!hasPreview || !isPlaying}
                    className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Detener
                </button>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-zinc-400">
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
                        className={`rounded-full px-3 py-1.5 text-xs transition ${activeIndex === index
                            ? 'border border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                            : 'border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                            }`}
                    >
                        {formatDurationClock(window.start)} - {formatDurationClock(window.end)}
                    </button>
                ))}
            </div>

            {playbackError && (
                <p className="text-sm text-rose-300">{playbackError}</p>
            )}
        </div>
    )
}

export default VideoDumpManualPlayer
