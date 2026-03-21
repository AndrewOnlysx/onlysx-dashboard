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
        <div className="overflow-hidden rounded-[16px] border border-[var(--border)] bg-[rgba(23,27,34,0.9)] shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
            <div className="relative overflow-hidden border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
                <div className="relative h-0 w-full pb-[56.25%]">
                    {preview.activeCoverUrl ? (
                        <img
                            src={preview.activeCoverUrl}
                            alt={preview.title || 'Card preview'}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(15,18,24,0.9)] px-6 text-center text-sm text-zinc-500">
                            La portada horizontal aparecera aqui.
                        </div>
                    )}

                    {preview.dumpUrl && (
                        <VideoHoverPreview
                            src={preview.dumpUrl}
                            previewWindows={preview.previewWindows}
                        />
                    )}

                    <span className="absolute bottom-2 right-2 rounded-md border border-white/10 bg-[rgba(15,18,24,0.82)] px-2 py-1 text-[11px] font-medium tracking-[0.01em] text-white backdrop-blur-sm">
                        {preview.time || '00:00'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3 p-3.5">
                <div className="flex items-start justify-between gap-3">
                    <span className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-[11px] font-medium tracking-[0.01em] text-[var(--muted-foreground)]">
                        Card preview
                    </span>
                    <span className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-[11px] font-medium tracking-[0.01em] text-[var(--muted-foreground)]">
                        {preview.currentQuality || 'Sin calidad'}
                    </span>
                </div>

                <p className="line-clamp-2 text-[15px] font-semibold leading-5 text-white">
                    {preview.title || 'Nuevo video sin titulo'}
                </p>

                {primaryModel && (
                    <div className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                        <img
                            src={primaryModel.image}
                            alt={primaryModel.name}
                            className="h-7 w-7 rounded-full object-cover"
                        />
                        <span className="truncate">{primaryModel.name}</span>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--muted-foreground)]">
                    <span>{formatCompactNumber(preview.views)} views</span>
                    <span className="h-1 w-1 rounded-full bg-[rgba(255,255,255,0.18)]" aria-hidden="true" />
                    <span>{preview.previewWindows.length > 0 ? `${preview.previewWindows.length} snippets` : 'Sin dump'}</span>
                </div>

                <div className="mt-auto flex flex-wrap gap-1.5">
                    {preview.selectedTags.length === 0 && (
                        <span className="text-xs text-zinc-500">Sin tags todavia.</span>
                    )}

                    {preview.selectedTags.slice(0, 3).map((tag) => (
                        <span
                            key={tag._id}
                            className="rounded-md border border-white/8 bg-white/[0.02] px-2 py-1 text-[11px] text-[var(--muted-foreground)]"
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
