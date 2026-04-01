/* eslint-disable @next/next/no-img-element */
'use client'

import { formatCompactNumber } from '@/lib/videos/admin'

import type { UseVideoFormResult } from './useVideoForm'
import VideoCardPreview from './VideoCardPreview'
import VideoDumpManualPlayer from './VideoDumpManualPlayer'
import VideoHoverPreview from './VideoHoverPreview'
import {
    getVideoFormBadgeClassName,
    getVideoFormProgressClassName,
    type VideoFormTone,
    videoFormBodyTextClassName,
    videoFormInsetClassName,
    videoFormLabelClassName,
    videoFormMutedTextClassName,
    videoFormSurfaceClassName
} from './videoFormUi'

interface Props {
    preview: UseVideoFormResult['preview']
}

const VideoPreviewSidebar = ({ preview }: Props) => {
    const readyAssets = [
        Boolean(preview.activeCoverRemoteUrl),
        Boolean(preview.uploadedVideoUrl)
    ].filter(Boolean).length
    const relationshipSummary = `${preview.selectedModels.length} modelos • ${preview.selectedTags.length} tags • ${preview.selectedGaleriesCount} galerias`
    const coverStatusLabel = preview.manualCoverFile
        ? preview.activeCoverUpload.status === 'success'
            ? 'Cover manual'
            : preview.activeCoverUpload.status === 'error'
                ? 'Manual error'
                : preview.activeCoverUpload.status === 'processing'
                    ? 'Manual proc.'
                    : preview.activeCoverUpload.status === 'uploading'
                        ? 'Manual subiendo'
                        : 'Manual lista local'
        : preview.generatedCoverFile
            ? preview.activeCoverUpload.status === 'success'
                ? 'Cover auto'
                : preview.activeCoverUpload.status === 'error'
                    ? 'Auto error'
                    : preview.activeCoverUpload.status === 'processing'
                        ? 'Auto proc.'
                        : preview.activeCoverUpload.status === 'uploading'
                            ? 'Auto subiendo'
                            : 'Auto lista local'
            : preview.activeCoverRemoteUrl
                ? 'Cover remota'
                : 'Sin cover'
    const coverStatusClassName = preview.manualCoverFile
        ? preview.activeCoverUpload.status === 'success'
            ? 'success'
            : preview.activeCoverUpload.status === 'error'
                ? 'danger'
                : preview.activeCoverUpload.status === 'processing'
                    ? 'warning'
                    : 'accent'
        : preview.generatedCoverFile
            ? preview.activeCoverUpload.status === 'success'
                ? 'success'
                : preview.activeCoverUpload.status === 'error'
                    ? 'danger'
                    : preview.activeCoverUpload.status === 'processing'
                        ? 'warning'
                        : 'accent'
            : preview.activeCoverRemoteUrl
                ? 'success'
                : 'neutral'
    const qualityClassName = preview.currentQuality
        ? 'accent'
        : 'neutral'
    const syncStatusClassName = preview.isUploadingAssets
        ? 'warning'
        : readyAssets === 2
            ? 'success'
            : 'neutral'
    const syncStatusLabel = preview.isUploadingAssets
        ? 'Sincronizando assets'
        : readyAssets === 2
            ? 'Preview listo'
            : 'Falta resolver assets'
    const submitFeedbackClassName = preview.submitStatus === 'error'
        ? 'border-[#6d3036] bg-[#261215] text-[#ff9ca4]'
        : 'border-[#475c26] bg-[#171f0f] text-[#d4ff59]'
    const checklistTone: VideoFormTone = preview.completedChecklist === preview.checklist.length ? 'success' : 'warning'

    return (
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <section >
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#f5f7fb]">Revision visual</h3>
                        </div>
                        <span className={getVideoFormBadgeClassName(syncStatusClassName as VideoFormTone)}>
                            {syncStatusLabel}
                        </span>
                    </div>

                    <div className="group relative aspect-video overflow-hidden rounded-[6px] border border-[#262c35] bg-[#0d1015]">
                        {preview.activeCoverUrl ? (
                            <img
                                src={preview.activeCoverUrl}
                                alt={preview.title || 'Preview del video'}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-[#0d1015] px-8 text-center text-sm text-[#8f97a8]">
                                La portada horizontal aparecera aqui cuando subas una imagen o se genere desde el video.
                            </div>
                        )}

                        {preview.dumpUrl && (
                            <VideoHoverPreview
                                src={preview.dumpUrl}
                                previewWindows={preview.previewWindows}
                            />
                        )}

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-[#262c35] bg-[#11151b] px-4 py-3">
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f97a8]">Preview vivo</p>
                                <p className="mt-1 text-sm text-[#f5f7fb]">
                                    {preview.dumpUrl ? 'El hover recorre pequenos snippets del dump, no reproduce el video completo.' : 'Esperando video para construir el dump.'}
                                </p>
                            </div>
                            <span className={getVideoFormBadgeClassName(coverStatusClassName as VideoFormTone)}>
                                {coverStatusLabel}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className={videoFormInsetClassName}>
                            <div className="flex items-center justify-between gap-3">
                                <span className={videoFormLabelClassName}>Calidad</span>
                                <span className={getVideoFormBadgeClassName(qualityClassName as VideoFormTone)}>
                                    {preview.currentQuality || 'Sin calidad'}
                                </span>
                            </div>
                            <div className="mt-3 space-y-2">
                                <h3 className="break-words text-[18px] font-semibold leading-6 text-[#f5f7fb]">
                                    {preview.title || 'Nuevo video sin titulo'}
                                </h3>
                                <p className="text-sm text-[#c1c8d3]">
                                    {preview.time || 'Duracion pendiente'} • {formatCompactNumber(preview.views)} views iniciales
                                </p>
                                <p className={videoFormMutedTextClassName}>{relationshipSummary}</p>
                            </div>
                        </div>

                        <div className={videoFormInsetClassName}>
                            <div className="flex items-center justify-between gap-3">
                                <span className={videoFormLabelClassName}>Checklist</span>
                                <span className={getVideoFormBadgeClassName(checklistTone)}>
                                    {preview.completedChecklist}/{preview.checklist.length}
                                </span>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-[6px] bg-[#242932]">
                                <div
                                    className={getVideoFormProgressClassName(checklistTone)}
                                    style={{ width: `${(preview.completedChecklist / preview.checklist.length) * 100}%` }}
                                />
                            </div>
                            <p className="mt-3 text-sm text-[#8f97a8]">Verifica que el registro tenga todo lo necesario antes de publicar.</p>
                        </div>
                    </div>

                    <div className={`${videoFormInsetClassName} space-y-3`}>
                        {preview.checklist.map((item) => (
                            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-[#374151]">{item.label}</span>
                                <span
                                    className={getVideoFormBadgeClassName(item.done ? 'success' : 'neutral')}
                                >
                                    {item.done ? 'Listo' : 'Pendiente'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={`${videoFormInsetClassName} grid gap-3 text-sm`}>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-[#8f97a8]">Portada remota</span>
                            <span className="font-medium text-[#f5f7fb]">
                                {preview.activeCoverRemoteUrl ? 'Lista' : preview.activeCoverUpload.status === 'error' ? 'Error' : 'Pendiente'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-[#8f97a8]">Video remoto</span>
                            <span className="font-medium text-[#f5f7fb]">
                                {preview.uploadedVideoUrl ? 'Listo' : preview.videoUpload.status === 'error' ? 'Error' : 'Pendiente'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-[#8f97a8]">Assets listos</span>
                            <span className="font-medium text-[#f5f7fb]">{readyAssets}/2</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className={videoFormLabelClassName}>Keywords generadas</p>
                        <div className="flex flex-wrap gap-2">
                            {preview.generatedSearchParams.length === 0 && (
                                <span className={videoFormMutedTextClassName}>Aun no hay keywords.</span>
                            )}

                            {preview.generatedSearchParams.map((keyword) => (
                                <span
                                    key={keyword}
                                    className="inline-flex items-center justify-center rounded-[6px] border border-[#6b2f52] bg-[#27111e] px-2 py-1 text-[12px] font-medium text-[#ff8ecb]"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {preview.submitMessage && (
                        <div className={`rounded-[4px] border p-4 text-sm ${submitFeedbackClassName}`}>
                            {preview.submitMessage}
                        </div>
                    )}
                </div>
            </section>

            <section >
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                       
                        <span className={getVideoFormBadgeClassName(coverStatusClassName as VideoFormTone)}>
                            {coverStatusLabel}
                        </span>
                    </div>

                    <VideoCardPreview preview={preview} />

                    <details className={`${videoFormInsetClassName} p-4`}>
                        <summary className="cursor-pointer text-sm font-medium text-[#f5f7fb]">
                            Ver payload estructural
                        </summary>
                        <pre className="mt-4 max-h-[340px] overflow-auto rounded-[6px] border border-[#262c35] bg-[#0d1015] p-4 text-xs leading-6 text-[#c1c8d3]">
                            {JSON.stringify(preview.draftSubmission, null, 2)}
                        </pre>

                        {preview.lastPayloadPreview && (
                            <div className="mt-4 rounded-[6px] border border-[#262c35] bg-[#171b22] p-4">
                                <p className="text-sm font-medium text-[#f5f7fb]">Ultimo payload enviado a consola</p>
                                <pre className="mt-3 max-h-[280px] overflow-auto text-xs leading-6 text-[#8f97a8]">
                                    {preview.lastPayloadPreview}
                                </pre>
                            </div>
                        )}
                    </details>
                </div>
            </section>

            <section >
                <div className="space-y-4">
                    <div>
                        <h3 className="mt-2 text-[20px] font-semibold text-[#f5f7fb]">Reproduccion controlada</h3>
                       
                    </div>

                    <VideoDumpManualPlayer
                        src={preview.dumpUrl}
                        previewWindows={preview.previewWindows}
                        poster={preview.activeCoverUrl}
                    />
                </div>
            </section>
        </aside>
    )
}

export default VideoPreviewSidebar
