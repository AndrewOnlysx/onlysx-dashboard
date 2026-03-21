/* eslint-disable @next/next/no-img-element */

import type { UseVideoFormResult } from './useVideoForm'
import AssetUploadStatus from './AssetUploadStatus'
import { formatFileSize } from './utils'

interface Props {
    assets: UseVideoFormResult['assets']
}

const VideoAssetsSection = ({ assets }: Props) => {
    const videoStatusLabel = assets.videoFile
        ? assets.videoUpload.status === 'success'
            ? 'Listo'
            : assets.videoUpload.status === 'error'
                ? 'Error'
                : assets.videoUpload.status === 'processing'
                    ? 'Procesando'
                    : 'En flujo'
        : 'Pendiente'

    const videoStatusStyles = assets.videoFile
        ? assets.videoUpload.status === 'success'
            ? 'accent-pill'
            : assets.videoUpload.status === 'error'
                ? 'warning-pill'
                : assets.videoUpload.status === 'processing'
                    ? 'warning-pill'
                    : 'muted-pill'
        : 'muted-pill'

    const coverSourceLabel = assets.manualCoverFile
        ? assets.activeCoverUpload.status === 'success'
            ? 'Manual lista'
            : assets.activeCoverUpload.status === 'error'
                ? 'Manual error'
                : assets.activeCoverUpload.status === 'processing'
                    ? 'Manual proc.'
                    : assets.activeCoverUpload.status === 'uploading'
                        ? 'Manual subiendo'
                        : 'Manual'
        : assets.generatedCoverFile
            ? assets.activeCoverUpload.status === 'success'
                ? 'Auto lista'
                : assets.activeCoverUpload.status === 'error'
                    ? 'Auto error'
                    : assets.activeCoverUpload.status === 'processing'
                        ? 'Auto proc.'
                        : assets.activeCoverUpload.status === 'uploading'
                            ? 'Auto subiendo'
                            : 'Auto'
            : assets.activeCoverRemoteUrl
                ? 'Remota'
                : 'Pendiente'

    const coverSourceStyles = assets.manualCoverFile
        ? assets.activeCoverUpload.status === 'success'
            ? 'accent-pill'
            : assets.activeCoverUpload.status === 'error'
                ? 'warning-pill'
                : assets.activeCoverUpload.status === 'processing'
                    ? 'warning-pill'
                    : 'muted-pill'
        : assets.generatedCoverFile
            ? assets.activeCoverUpload.status === 'success'
                ? 'accent-pill'
                : assets.activeCoverUpload.status === 'error'
                    ? 'warning-pill'
                    : assets.activeCoverUpload.status === 'processing'
                        ? 'warning-pill'
                        : 'muted-pill'
            : assets.activeCoverRemoteUrl
                ? 'accent-pill'
                : 'muted-pill'

    const activeCoverFile = assets.manualCoverFile || assets.generatedCoverFile
    const dumpStatusLabel = !assets.videoFile
        ? 'Esperando'
        : assets.isGeneratingPreview
            ? 'Generando'
            : assets.previewWindows.length > 0
                ? `${assets.previewWindows.length} snippets listos`
                : 'Sin snippets'

    const dumpStatusStyles = !assets.videoFile
        ? 'muted-pill'
        : assets.isGeneratingPreview
            ? 'warning-pill'
            : assets.previewWindows.length > 0
                ? 'accent-pill'
                : 'muted-pill'

    return (
        <section className="surface-panel p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-white">Assets y uploads</h2>
                    <p className="text-sm text-zinc-400">
                        El video empieza a subirse apenas lo sueltas. La portada usa formato horizontal y puede ser manual o generada desde el video.
                    </p>
                </div>
                <div className="muted-pill">
                    Paso 2
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                    <div
                        {...assets.coverDropzone.getRootProps()}
                        className={`group relative overflow-hidden rounded-[18px] border border-dashed p-4 transition ${assets.coverDropzone.isDragActive
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                            : 'border-white/10 bg-black/20 hover:border-white/20'
                            }`}
                    >
                        <input {...assets.coverDropzone.getInputProps()} />

                        <div className="aspect-video overflow-hidden rounded-[14px] border border-white/6 bg-zinc-950">
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

                        <div className="mt-4 space-y-2.5">
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
                        className={`group relative overflow-hidden rounded-[18px] border border-dashed p-4 transition ${assets.videoDropzone.isDragActive
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                            : 'border-white/10 bg-black/20 hover:border-white/20'
                            }`}
                    >
                        <input {...assets.videoDropzone.getInputProps()} />

                        <div className="aspect-video overflow-hidden rounded-[14px] border border-white/6 bg-zinc-950">
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

                        <div className="mt-4 space-y-2.5">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-white">Video principal</p>
                                <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${videoStatusStyles}`}>
                                    {videoStatusLabel}
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
                <div className="rounded-[16px] border border-white/8 bg-black/20 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-white">Dump derivado automaticamente</p>
                            <p className="mt-1 text-sm text-zinc-400">
                                El dump no se sube aparte. Usa pequenas fracciones del mismo video para el hover preview y para la reproduccion manual.
                            </p>
                        </div>
                        <div className={`${dumpStatusStyles} normal-case tracking-normal text-sm`}>
                            {dumpStatusLabel}
                        </div>
                    </div>
                </div>

                <div className="rounded-[16px] border border-white/8 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-zinc-300">URLs remotas listas</span>
                        <span className="text-zinc-400">
                            {[Boolean(assets.activeCoverRemoteUrl), Boolean(assets.uploadedVideoUrl)].filter(Boolean).length}/2
                        </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                        <div
                            className="h-full rounded-full bg-[var(--primary)] transition-all"
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
                    {assets.uploadedVideoUrl && (
                        <p className="mt-3 truncate text-xs text-zinc-500">
                            URL activa del video: {assets.uploadedVideoUrl}
                        </p>
                    )}
                </div>
            </div>

            {assets.assetMessage && (
                <div className="mt-4 rounded-[16px] border border-amber-400/20 bg-amber-400/8 p-4 text-sm text-amber-100">
                    {assets.assetMessage}
                </div>
            )}
        </section>
    )
}

export default VideoAssetsSection
