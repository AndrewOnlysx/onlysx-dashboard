/* eslint-disable @next/next/no-img-element */

import type { UseVideoFormResult } from './useVideoForm'
import AssetUploadStatus from './AssetUploadStatus'
import { formatFileSize } from './utils'

interface Props {
    assets: UseVideoFormResult['assets']
}

const VideoAssetsSection = ({ assets }: Props) => {
    const coverSourceLabel = assets.manualCoverFile
        ? 'Manual'
        : assets.generatedCoverFile
            ? 'Auto'
            : 'Pendiente'

    const coverSourceStyles = assets.manualCoverFile
        ? 'accent-pill'
        : assets.generatedCoverFile
            ? 'success-pill'
            : 'muted-pill'

    const activeCoverFile = assets.manualCoverFile || assets.generatedCoverFile

    return (
        <section className="surface-panel p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Assets y uploads</h2>
                    <p className="mt-1 text-sm text-zinc-400">
                        El video empieza a subirse apenas lo sueltas. La portada usa formato horizontal y puede ser manual o generada desde el video.
                    </p>
                </div>
                <div className="muted-pill">
                    Paso 2
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-4">
                    <div
                        {...assets.coverDropzone.getRootProps()}
                        className={`group relative overflow-hidden rounded-[28px] border-2 border-dashed p-4 transition ${assets.coverDropzone.isDragActive
                            ? 'border-[#FF50A4] bg-[#FF50A4]/10'
                            : 'border-white/12 bg-black/20 hover:border-white/25'
                            }`}
                    >
                        <input {...assets.coverDropzone.getInputProps()} />

                        <div className="aspect-video overflow-hidden rounded-[22px] bg-zinc-900">
                            {assets.activeCoverUrl ? (
                                <img
                                    src={assets.activeCoverUrl}
                                    alt="Portada del video"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-500">
                                    Arrastra una portada horizontal o deja que el sistema la genere desde el video.
                                </div>
                            )}
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-white">Portada horizontal</p>
                                <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${coverSourceStyles}`}>
                                    {coverSourceLabel}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-400">
                                {assets.manualCoverFile
                                    ? `${assets.manualCoverFile.name} • ${formatFileSize(assets.manualCoverFile.size)}`
                                    : assets.generatedCoverFile
                                        ? 'Generada automaticamente desde el video cargado.'
                                        : 'Acepta JPG, PNG o WebP y mantendra el layout horizontal del card.'}
                            </p>
                        </div>
                    </div>

                    <AssetUploadStatus
                        title="Estado de la portada"
                        file={activeCoverFile}
                        state={assets.activeCoverUpload}
                        emptyMessage="Todavia no hay una portada en cola."
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={assets.clearManualCover}
                            disabled={!assets.manualCoverFile}
                            className="secondary-action disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Quitar portada manual
                        </button>
                        {assets.generatedCoverFile && assets.manualCoverFile && (
                            <span className="text-sm text-zinc-400">
                                Si quitas la portada manual, se usara la generada automaticamente.
                            </span>
                        )}
                        {assets.errors.image && <p className="text-sm text-rose-300">{assets.errors.image}</p>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div
                        {...assets.videoDropzone.getRootProps()}
                        className={`group relative overflow-hidden rounded-[28px] border-2 border-dashed p-4 transition ${assets.videoDropzone.isDragActive
                            ? 'border-[#FF50A4] bg-[#FF50A4]/10'
                            : 'border-white/12 bg-black/20 hover:border-white/25'
                            }`}
                    >
                        <input {...assets.videoDropzone.getInputProps()} />

                        <div className="aspect-video overflow-hidden rounded-[22px] bg-zinc-900">
                            {assets.videoPreviewUrl ? (
                                <video
                                    src={assets.videoPreviewUrl}
                                    className="h-full w-full object-cover"
                                    controls
                                    muted
                                    playsInline
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-500">
                                    Arrastra el video principal. Apenas se seleccione empezara a subirse via el endpoint de videos.
                                </div>
                            )}
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-white">Video principal</p>
                                <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${assets.videoFile
                                    ? 'accent-pill'
                                    : 'muted-pill'
                                    }`}>
                                    {assets.videoFile ? 'En flujo' : 'Pendiente'}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-400">
                                {assets.videoFile
                                    ? `${assets.videoFile.name} • ${formatFileSize(assets.videoFile.size)}`
                                    : 'Acepta MP4, MOV, WebM u otros formatos compatibles con el navegador.'}
                            </p>
                        </div>
                    </div>

                    <AssetUploadStatus
                        title="Estado del video"
                        file={assets.videoFile}
                        state={assets.videoUpload}
                        emptyMessage="Todavia no hay un video en cola."
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={assets.clearVideoSelection}
                            disabled={!assets.videoFile}
                            className="secondary-action disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Quitar video
                        </button>
                        {assets.isGeneratingPreview && (
                            <span className="text-sm text-[#ffd2e8]">
                                Generando portada automatica y calculando duracion...
                            </span>
                        )}
                        {assets.errors.video && <p className="text-sm text-rose-300">{assets.errors.video}</p>}
                    </div>
                </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-white">Dump derivado automaticamente</p>
                            <p className="mt-1 text-sm text-zinc-400">
                                El dump no se sube aparte. Usa pequenas fracciones del mismo video para el hover preview y para la reproduccion manual.
                            </p>
                        </div>
                        <div className="success-pill normal-case tracking-normal text-sm">
                            {assets.videoFile ? `${assets.previewWindows.length} snippets listos` : 'Esperando video principal'}
                        </div>
                    </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-zinc-300">URLs remotas listas</span>
                        <span className="text-zinc-400">
                            {[Boolean(assets.activeCoverRemoteUrl), Boolean(assets.uploadedVideoUrl)].filter(Boolean).length}/2
                        </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                        <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,_#FF50A4,_#FF89C1)] transition-all"
                            style={{
                                width: `${([Boolean(assets.activeCoverRemoteUrl), Boolean(assets.uploadedVideoUrl)].filter(Boolean).length / 2) * 100}%`
                            }}
                        />
                    </div>
                    <p className="mt-3 text-sm text-zinc-400">
                        {assets.isUploadingAssets
                            ? 'La subida sigue en curso. El payload final usara las URLs remotas cuando ambas esten listas.'
                            : 'Cuando ambos assets esten subidos, el payload quedara listo para persistirse.'}
                    </p>
                </div>
            </div>

            {assets.assetMessage && (
                <div className="mt-4 rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                    {assets.assetMessage}
                </div>
            )}
        </section>
    )
}

export default VideoAssetsSection
