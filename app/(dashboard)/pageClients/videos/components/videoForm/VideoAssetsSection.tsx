/* eslint-disable @next/next/no-img-element */

import type { UseVideoFormResult } from './useVideoForm'
import AssetUploadStatus from './AssetUploadStatus'
import { formatFileSize } from './utils'

interface Props {
    assets: UseVideoFormResult['assets']
}

const VideoAssetsSection = ({ assets }: Props) => {
    const remoteReadyCount = [Boolean(assets.activeCoverRemoteUrl), Boolean(assets.uploadedVideoUrl)].filter(Boolean).length
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
    const videoMetaLabel = !assets.videoFile
        ? 'Sin archivo'
        : assets.videoUpload.status === 'success'
            ? 'Remoto listo'
            : assets.videoUpload.status === 'error'
                ? 'Revisar'
                : 'En trabajo'

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
    const coverMetaLabel = assets.manualCoverFile
        ? 'Manual'
        : assets.generatedCoverFile
            ? 'Auto'
            : assets.activeCoverRemoteUrl
                ? 'Remota'
                : 'Pendiente'

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
        <section className="surface-panel editor-panel p-5 sm:p-6">
            <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <span className="editor-kicker">Paso 2</span>
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-white">Assets y uploads</h2>
                            <p className="max-w-3xl text-sm leading-6 text-zinc-400">
                                El video empieza a subirse apenas lo sueltas. La portada puede ser manual o generada, pero espera al video remoto antes de enviarse.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-5 grid gap-3 md:grid-cols-3">
                    <div className="editor-metric p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Video</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-lg font-semibold text-white">{videoStatusLabel}</p>
                            <span className={`${videoStatusStyles} normal-case tracking-normal text-xs`}>{videoMetaLabel}</span>
                        </div>
                    </div>

                    <div className="editor-metric p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Portada</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-lg font-semibold text-white">{coverSourceLabel}</p>
                            <span className={`${coverSourceStyles} normal-case tracking-normal text-xs`}>
                                {coverMetaLabel}
                            </span>
                        </div>
                    </div>

                    <div className="editor-metric p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">URLs remotas</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-lg font-semibold text-white">{remoteReadyCount}/2</p>
                            <span className={`${remoteReadyCount === 2 ? 'success-pill' : 'muted-pill'} normal-case tracking-normal text-xs`}>
                                {remoteReadyCount === 2 ? 'Listas' : assets.isUploadingAssets ? 'Sincronizando' : 'Pendientes'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.85fr)]">
                    <div className="space-y-4">
                        <div
                            {...assets.videoDropzone.getRootProps()}
                            className={`editor-dropzone p-4 sm:p-5 ${assets.videoDropzone.isDragActive ? 'editor-dropzone--active' : ''}`}
                        >
                            <input {...assets.videoDropzone.getInputProps()} />

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                        <p className="text-base font-semibold text-white">Video principal</p>
                                        <p className="text-sm leading-6 text-zinc-400">
                                            El asset prioritario del formulario. Apenas lo seleccionas, arranca la subida y se prepara el preview local.
                                        </p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${videoStatusStyles}`}>
                                        {videoStatusLabel}
                                    </span>
                                </div>

                                <div className="aspect-video overflow-hidden rounded-[18px] border border-white/6 bg-zinc-950">
                                    {assets.videoPreviewUrl ? (
                                        <video
                                            src={assets.videoPreviewUrl}
                                            className="h-full w-full object-cover"
                                            controls
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-zinc-500">
                                            Arrastra el video principal. La subida se dispara de inmediato y el preview local queda disponible mientras se resuelve el remoto.
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-zinc-200">
                                            {assets.videoFile
                                                ? `${assets.videoFile.name} • ${formatFileSize(assets.videoFile.size)}`
                                                : 'Acepta MP4, MOV, WebM u otros formatos compatibles con el navegador.'}
                                        </p>
                                        <p className="text-sm text-zinc-500">
                                            {assets.isGeneratingPreview
                                                ? 'Generando portada automatica y calculando duracion...'
                                                : 'El dump se deriva automaticamente para hover preview y reproduccion controlada.'}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={assets.clearVideoSelection}
                                        disabled={!assets.videoFile}
                                        className="secondary-action disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Quitar video
                                    </button>
                                </div>

                                {assets.errors.video && <p className="text-sm text-rose-300">{assets.errors.video}</p>}
                            </div>
                        </div>

                        <AssetUploadStatus
                            title="Estado del video"
                            file={assets.videoFile}
                            state={assets.videoUpload}
                            emptyMessage="Todavia no hay un video en cola."
                        />
                    </div>

                    <div className="space-y-4">
                        <div
                            {...assets.coverDropzone.getRootProps()}
                            className={`editor-dropzone p-4 sm:p-5 ${assets.coverDropzone.isDragActive ? 'editor-dropzone--active' : ''}`}
                        >
                            <input {...assets.coverDropzone.getInputProps()} />

                            <div className="space-y-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                        <p className="text-base font-semibold text-white">Portada horizontal</p>
                                        <p className="text-sm leading-6 text-zinc-400">
                                            Puedes subir una portada manual o esperar la generada automaticamente desde el video.
                                        </p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${coverSourceStyles}`}>
                                        {coverSourceLabel}
                                    </span>
                                </div>

                                <div className="aspect-video overflow-hidden rounded-[18px] border border-white/6 bg-zinc-950">
                                    {assets.activeCoverUrl ? (
                                        <img
                                            src={assets.activeCoverUrl}
                                            alt="Portada del video"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-zinc-500">
                                            Arrastra una portada horizontal o deja que el sistema la genere desde el video.
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-zinc-200">
                                        {assets.manualCoverFile
                                            ? `${assets.manualCoverFile.name} • ${formatFileSize(assets.manualCoverFile.size)}`
                                            : assets.generatedCoverFile
                                                ? 'Generada automaticamente desde el video cargado.'
                                                : 'Acepta JPG, PNG o WebP y mantiene el layout horizontal del card.'}
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        {assets.generatedCoverFile && assets.manualCoverFile
                                            ? 'Si quitas la portada manual, se vuelve a usar la generada automaticamente.'
                                            : 'La portada espera a que el video termine de resolverse antes de subirse.'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={assets.clearManualCover}
                                        disabled={!assets.manualCoverFile}
                                        className="secondary-action disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Quitar portada manual
                                    </button>
                                </div>

                                {assets.errors.image && <p className="text-sm text-rose-300">{assets.errors.image}</p>}
                            </div>
                        </div>

                        <AssetUploadStatus
                            title="Estado de la portada"
                            file={activeCoverFile}
                            state={assets.activeCoverUpload}
                            emptyMessage="Todavia no hay una portada en cola."
                        />

                        <div className="editor-subpanel p-4 sm:p-5">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Derivados y persistencia</p>
                                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                                            El dump no se sube aparte. Usa pequenas fracciones del mismo video para hover preview y control manual.
                                        </p>
                                    </div>
                                    <span className={`${dumpStatusStyles} normal-case tracking-normal text-xs`}>
                                        {dumpStatusLabel}
                                    </span>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-zinc-300">URLs remotas listas</span>
                                        <span className="text-zinc-400">{remoteReadyCount}/2</span>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                                        <div
                                            className="h-full rounded-full bg-[var(--primary)] transition-all"
                                            style={{ width: `${(remoteReadyCount / 2) * 100}%` }}
                                        />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                                        {assets.isUploadingAssets
                                            ? 'La subida sigue en curso. El payload final usara las URLs remotas apenas ambas queden listas.'
                                            : 'Cuando ambos assets esten resueltos, el payload queda listo para persistirse.'}
                                    </p>
                                    {assets.uploadedVideoUrl && (
                                        <p className="mt-3 truncate text-xs text-zinc-500">
                                            URL activa del video: {assets.uploadedVideoUrl}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {assets.assetMessage && (
                    <div className="mt-4 rounded-[18px] border border-amber-400/20 bg-amber-400/8 p-4 text-sm text-amber-100">
                        {assets.assetMessage}
                    </div>
                )}
            </div>
        </section>
    )
}

export default VideoAssetsSection
