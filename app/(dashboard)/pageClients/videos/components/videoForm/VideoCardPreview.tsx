/* eslint-disable @next/next/no-img-element */

import { formatCompactNumber } from '@/lib/videos/admin'

import type { UseVideoFormResult } from './useVideoForm'
import VideoHoverPreview from './VideoHoverPreview'
import { getVideoFormBadgeClassName } from './videoFormUi'

interface Props {
    preview: UseVideoFormResult['preview']
}

const VideoCardPreview = ({ preview }: Props) => {
    const primaryModel = preview.selectedModels[0]
    const extraModels = Math.max(preview.selectedModels.length - 1, 0)

    return (
        <div className="overflow-hidden rounded-[6px] border border-[#262c35] bg-[#11151b] shadow-none">
            <div className="relative overflow-hidden border-b border-[#262c35] bg-[#0d1015]">
                <div className="relative h-0 w-full pb-[56.25%]">
                    {preview.activeCoverUrl ? (
                        <img
                            src={preview.activeCoverUrl}
                            alt={preview.title || 'Card preview'}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#0d1015] px-6 text-center text-sm text-[#8f97a8]">
                            La portada horizontal aparecera aqui.
                        </div>
                    )}

                    {preview.dumpUrl && (
                        <VideoHoverPreview
                            src={preview.dumpUrl}
                            previewWindows={preview.previewWindows}
                        />
                    )}

                    <span className="absolute bottom-2 right-2 rounded-[6px] border border-[#303640] bg-[#11151b] px-2 py-1 text-[11px] font-medium tracking-[0.01em] text-[#f5f7fb]">
                        {preview.time || '00:00'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3 p-3.5">
                <div className="flex items-start justify-between gap-3">
                    <span className={getVideoFormBadgeClassName('neutral')}>
                        Card preview
                    </span>
                    <span className={getVideoFormBadgeClassName('accent')}>
                        {preview.currentQuality || 'Sin calidad'}
                    </span>
                </div>

                <p className="break-words text-[15px] font-semibold leading-5 text-[#f5f7fb]">
                    {preview.title || 'Nuevo video sin titulo'}
                </p>

                {primaryModel && (
                    <div className="flex items-center gap-2.5 text-sm text-[#c1c8d3]">
                        <img
                            src={primaryModel.image}
                            alt={primaryModel.name}
                            className="h-7 w-7 rounded-full object-cover"
                        />
                        <span className="truncate">{primaryModel.name}</span>
                        {extraModels > 0 && (
                            <span className="rounded-[6px] border border-[#303640] bg-[#171b22] px-2 py-1 text-[11px] text-[#aeb7c6]">
                                +{extraModels}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#8f97a8]">
                    <span>{formatCompactNumber(preview.views)} views</span>
                    <span className="h-1 w-1 rounded-full bg-[#47505d]" aria-hidden="true" />
                    <span>{preview.previewWindows.length > 0 ? `${preview.previewWindows.length} snippets` : 'Sin dump'}</span>
                </div>

                <div className="mt-auto flex flex-wrap gap-1.5">
                    {preview.selectedTags.length === 0 && (
                        <span className="text-xs text-[#6f7888]">Sin tags todavia.</span>
                    )}

                    {preview.selectedTags.slice(0, 3).map((tag) => (
                        <span
                            key={tag._id}
                            className="rounded-[6px] border border-[#303640] bg-[#171b22] px-2 py-1 text-[11px] text-[#aeb7c6]"
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
