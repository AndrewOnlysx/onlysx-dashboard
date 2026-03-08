/* eslint-disable @next/next/no-img-element */

import { formatCompactNumber } from '@/lib/videos/admin'

import type { UseVideoFormResult } from './useVideoForm'
import VideoHoverPreview from './VideoHoverPreview'

interface Props {
    preview: UseVideoFormResult['preview']
}

const VideoCardPreview = ({ preview }: Props) => {
    const primaryModel = preview.selectedModels[0]

    return (
        <div className="rounded-[24px] border border-white/10 bg-zinc-950/85 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="relative overflow-hidden rounded-[18px] bg-zinc-900">
                <div className="relative h-0 w-full pb-[56.25%]">
                    {preview.activeCoverUrl ? (
                        <img
                            src={preview.activeCoverUrl}
                            alt={preview.title || 'Card preview'}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_45%),linear-gradient(180deg,_rgba(24,24,27,1),_rgba(9,9,11,1))] px-6 text-center text-sm text-zinc-500">
                            La portada horizontal aparecera aqui.
                        </div>
                    )}

                    {preview.dumpUrl && (
                        <VideoHoverPreview
                            src={preview.dumpUrl}
                            previewWindows={preview.previewWindows}
                        />
                    )}

                    <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                        {preview.time || '00:00'}
                    </span>
                </div>
            </div>

            <div className="space-y-3 px-2 pb-2 pt-4">
                <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-zinc-300">
                        Card preview
                    </span>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-100">
                        {preview.currentQuality || 'Sin calidad'}
                    </span>
                </div>

                <p className="line-clamp-2 text-base font-medium text-white">
                    {preview.title || 'Nuevo video sin titulo'}
                </p>

                {primaryModel && (
                    <div className="flex items-center gap-2">
                        <img
                            src={primaryModel.image}
                            alt={primaryModel.name}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-zinc-300">{primaryModel.name}</span>
                    </div>
                )}

                <div className="flex items-center justify-between gap-3 text-xs text-zinc-400">
                    <span>{formatCompactNumber(preview.views)} views</span>
                    <span>{preview.previewWindows.length > 0 ? `${preview.previewWindows.length} snippets` : 'Sin dump'}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {preview.selectedTags.length === 0 && (
                        <span className="text-xs text-zinc-500">Sin tags todavia.</span>
                    )}

                    {preview.selectedTags.slice(0, 3).map((tag) => (
                        <span
                            key={tag._id}
                            className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-100"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default VideoCardPreview
