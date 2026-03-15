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
    const submitFeedbackClassName = preview.submitStatus === 'error'
        ? 'border border-rose-400/20 bg-rose-400/10 text-rose-100'
        : 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-100'

    return (
        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="surface-panel overflow-hidden">
                <div className="group relative aspect-video overflow-hidden bg-zinc-900">
                    {preview.activeCoverUrl ? (
                        <img
                            src={preview.activeCoverUrl}
                            alt={preview.title || 'Preview del video'}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(255,80,164,0.16),_transparent_45%),linear-gradient(180deg,_rgba(24,24,27,1),_rgba(9,9,11,1))] px-8 text-center text-sm text-zinc-500">
                            La portada horizontal aparecera aqui cuando subas una imagen o se genere desde el video.
                        </div>
                    )}

                    {preview.dumpUrl && (
                        <VideoHoverPreview
                            src={preview.dumpUrl}
                            previewWindows={preview.previewWindows}
                        />
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black via-black/70 to-transparent px-5 pb-5 pt-10">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">Hover preview</p>
                            <p className="mt-1 text-sm text-white">
                                {preview.dumpUrl ? 'El hover recorre pequenos snippets del dump, no reproduce el video completo.' : 'Esperando video para construir el dump.'}
                            </p>
                        </div>
                        <span className="muted-pill border-0 normal-case tracking-normal text-xs text-zinc-200">
                            {preview.manualCoverFile ? 'Cover manual' : preview.generatedCoverFile ? 'Cover auto' : 'Sin cover'}
                        </span>
                    </div>
                </div>

                <div className="space-y-5 p-5">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <span className="muted-pill">
                                Preview admin
                            </span>
                            <span className="accent-pill normal-case tracking-normal text-xs">
                                {preview.currentQuality || 'Sin calidad'}
                            </span>
                        </div>

                        <h3 className="text-xl font-semibold tracking-tight">
                            {preview.title || 'Nuevo video sin titulo'}
                        </h3>
                        <p className="text-sm text-zinc-400">
                            {preview.time || 'Duracion pendiente'} • {formatCompactNumber(preview.views)} views iniciales
                        </p>
                    </div>

                    <div className="space-y-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
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

                    <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-zinc-300">Completitud del formulario</span>
                            <span className="text-zinc-400">{preview.completedChecklist}/4</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/8">
                            <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,_#FF50A4,_#FF89C1)] transition-all"
                                style={{ width: `${(preview.completedChecklist / preview.checklist.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 text-sm">
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
                </div>
            </section>

            <section className="surface-panel p-5">
                <div className="space-y-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Preview publico</p>
                        <h3 className="mt-2 text-lg font-semibold">Asi quedaria el card</h3>
                    </div>

                    <VideoCardPreview preview={preview} />
                </div>
            </section>

            <section className="surface-panel p-5">
                <div className="space-y-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Dump manual</p>
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

            <section className="surface-panel p-5">
                <div className="space-y-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                            {preview.mode === 'edit' ? 'Payload listo para actualizar' : 'Payload listo para crear'}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">Preview estructural</h3>
                    </div>

                    <pre className="max-h-[340px] overflow-auto rounded-[24px] border border-white/8 bg-black/30 p-4 text-xs leading-6 text-zinc-300">
                        {JSON.stringify(preview.draftSubmission, null, 2)}
                    </pre>

                    {preview.submitMessage && (
                        <div className={`rounded-[24px] p-4 text-sm ${submitFeedbackClassName}`}>
                            {preview.submitMessage}
                        </div>
                    )}

                    {preview.lastPayloadPreview && (
                        <details className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                            <summary className="cursor-pointer text-sm font-medium text-zinc-200">
                                Ultimo payload enviado a consola
                            </summary>
                            <pre className="mt-4 max-h-[280px] overflow-auto text-xs leading-6 text-zinc-400">
                                {preview.lastPayloadPreview}
                            </pre>
                        </details>
                    )}
                </div>
            </section>
        </aside>
    )
}

export default VideoPreviewSidebar
