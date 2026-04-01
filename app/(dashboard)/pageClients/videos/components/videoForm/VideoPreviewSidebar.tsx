/* eslint-disable @next/next/no-img-element */
'use client'

import { formatCompactNumber } from '@/lib/videos/admin'

import type { UseVideoFormResult } from './useVideoForm'
import VideoCardPreview from './VideoCardPreview'
import VideoDumpManualPlayer from './VideoDumpManualPlayer'
import VideoHoverPreview from './VideoHoverPreview'

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
            ? 'accent-pill'
            : preview.activeCoverUpload.status === 'error'
                ? 'warning-pill'
                : preview.activeCoverUpload.status === 'processing'
                    ? 'warning-pill'
                    : 'muted-pill'
        : preview.generatedCoverFile
            ? preview.activeCoverUpload.status === 'success'
                ? 'accent-pill'
                : preview.activeCoverUpload.status === 'error'
                    ? 'warning-pill'
                    : preview.activeCoverUpload.status === 'processing'
                        ? 'warning-pill'
                        : 'muted-pill'
            : preview.activeCoverRemoteUrl
                ? 'accent-pill'
                : 'muted-pill'
    const qualityClassName = preview.currentQuality
        ? 'accent-pill'
        : 'muted-pill'
    const syncStatusClassName = preview.isUploadingAssets
        ? 'warning-pill'
        : readyAssets === 2
            ? 'success-pill'
            : 'muted-pill'
    const syncStatusLabel = preview.isUploadingAssets
        ? 'Sincronizando assets'
        : readyAssets === 2
            ? 'Preview listo'
            : 'Falta resolver assets'
    const submitFeedbackClassName = preview.submitStatus === 'error'
        ? 'border border-rose-400/20 bg-rose-400/10 text-rose-100'
        : 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-100'

    return (
        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="surface-panel editor-panel overflow-hidden">
                <div className="group relative aspect-video overflow-hidden border-b border-white/8 bg-zinc-950">
                    {preview.activeCoverUrl ? (
                        <img
                            src={preview.activeCoverUrl}
                            alt={preview.title || 'Preview del video'}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-zinc-950 px-8 text-center text-sm text-zinc-500">
                            La portada horizontal aparecera aqui cuando subas una imagen o se genere desde el video.
                        </div>
                    )}

                    {preview.dumpUrl && (
                        <VideoHoverPreview
                            src={preview.dumpUrl}
                            previewWindows={preview.previewWindows}
                        />
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.78)_100%)] px-5 pb-5 pt-10">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">Preview vivo</p>
                            <p className="mt-1 text-sm text-white">
                                {preview.dumpUrl ? 'El hover recorre pequenos snippets del dump, no reproduce el video completo.' : 'Esperando video para construir el dump.'}
                            </p>
                        </div>
                        <span className={`${coverStatusClassName} border-0 normal-case tracking-normal text-xs text-zinc-200`}>
                            {coverStatusLabel}
                        </span>
                    </div>
                </div>

                <div className="relative space-y-5 p-5">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <span className="editor-kicker">Resumen del preview</span>
                            <span className={`${qualityClassName} normal-case tracking-normal text-xs`}>
                                {preview.currentQuality || 'Sin calidad'}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-semibold tracking-tight text-white">
                                {preview.title || 'Nuevo video sin titulo'}
                            </h3>
                            <p className="text-sm text-zinc-400">
                                {preview.time || 'Duracion pendiente'} • {formatCompactNumber(preview.views)} views iniciales
                            </p>
                            <p className="text-sm text-zinc-500">{relationshipSummary}</p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="editor-metric p-4">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Checklist</span>
                                <span className={`${preview.completedChecklist === preview.checklist.length ? 'success-pill' : 'warning-pill'} normal-case tracking-normal text-xs`}>
                                    {preview.completedChecklist}/{preview.checklist.length}
                                </span>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                                <div
                                    className="h-full rounded-full bg-[var(--primary)] transition-all"
                                    style={{ width: `${(preview.completedChecklist / preview.checklist.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="editor-metric p-4">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Assets remotos</span>
                                <span className={`${syncStatusClassName} normal-case tracking-normal text-xs`}>
                                    {syncStatusLabel}
                                </span>
                            </div>
                            <p className="mt-3 text-2xl font-semibold text-white">{readyAssets}/2</p>
                        </div>
                    </div>

                    <div className="editor-subpanel space-y-3 p-4">
                        {preview.checklist.map((item) => (
                            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-zinc-300">{item.label}</span>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs ${item.done
                                        ? 'success-pill normal-case tracking-normal'
                                        : 'muted-pill normal-case tracking-normal'
                                        }`}
                                >
                                    {item.done ? 'Listo' : 'Pendiente'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="editor-subpanel grid gap-3 p-4 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-zinc-400">Portada remota</span>
                            <span className="text-zinc-100">
                                {preview.activeCoverRemoteUrl ? 'Lista' : preview.activeCoverUpload.status === 'error' ? 'Error' : 'Pendiente'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-zinc-400">Video remoto</span>
                            <span className="text-zinc-100">
                                {preview.uploadedVideoUrl ? 'Listo' : preview.videoUpload.status === 'error' ? 'Error' : 'Pendiente'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-zinc-400">Assets listos</span>
                            <span className="text-zinc-100">{readyAssets}/2</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Keywords generadas</p>
                        <div className="flex flex-wrap gap-2">
                            {preview.generatedSearchParams.length === 0 && (
                                <span className="text-sm text-zinc-500">Aun no hay keywords.</span>
                            )}

                            {preview.generatedSearchParams.map((keyword) => (
                                <span
                                    key={keyword}
                                    className="accent-pill normal-case tracking-normal text-xs"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {preview.submitMessage && (
                        <div className={`rounded-[16px] p-4 text-sm ${submitFeedbackClassName}`}>
                            {preview.submitMessage}
                        </div>
                    )}
                </div>
            </section>

            <section className="surface-panel editor-panel p-5">
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Preview publico</p>
                            <h3 className="mt-2 text-lg font-semibold">Asi quedaria el card</h3>
                        </div>
                        <span className={`${coverStatusClassName} normal-case tracking-normal text-xs`}>
                            {coverStatusLabel}
                        </span>
                    </div>

                    <VideoCardPreview preview={preview} />

                    <details className="editor-subpanel p-4">
                        <summary className="cursor-pointer text-sm font-medium text-zinc-200">
                            Ver payload estructural
                        </summary>
                        <pre className="mt-4 max-h-[340px] overflow-auto rounded-[16px] border border-white/8 bg-black/30 p-4 text-xs leading-6 text-zinc-300">
                            {JSON.stringify(preview.draftSubmission, null, 2)}
                        </pre>

                        {preview.lastPayloadPreview && (
                            <div className="mt-4 rounded-[16px] border border-white/8 bg-black/20 p-4">
                                <p className="text-sm font-medium text-zinc-200">Ultimo payload enviado a consola</p>
                                <pre className="mt-3 max-h-[280px] overflow-auto text-xs leading-6 text-zinc-400">
                                    {preview.lastPayloadPreview}
                                </pre>
                            </div>
                        )}
                    </details>
                </div>
            </section>

            <section className="surface-panel editor-panel p-5">
                <div className="space-y-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Control de dump</p>
                        <h3 className="mt-2 text-lg font-semibold">Reproduccion controlada</h3>
                        <p className="mt-2 text-sm text-zinc-400">
                            Puedes disparar manualmente las mismas fracciones que usa el hover preview para revisar ritmo y cortes.
                        </p>
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
