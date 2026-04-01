/* eslint-disable @next/next/no-img-element */

import type { UseVideoFormResult } from './useVideoForm'
import AssetUploadStatus from './AssetUploadStatus'
import { formatFileSize } from './utils'
import {
    getVideoFormBadgeClassName,
    getVideoFormProgressClassName,
    type VideoFormTone,
    videoFormBodyTextClassName,
    videoFormDropzoneClassName,
    videoFormInsetClassName,
    videoFormLabelClassName,
    videoFormMutedTextClassName,
    videoFormSecondaryActionClassName,
    videoFormSectionTitleClassName,
    videoFormSurfaceClassName
} from './videoFormUi'

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
        ? 'neutral'
        : assets.isGeneratingPreview
            ? 'warning'
            : assets.previewWindows.length > 0
                ? 'accent'
                : 'neutral'
    const getToneFromUploadStatus = (status: typeof assets.videoUpload.status): VideoFormTone => {
        if (status === 'success') return 'success'
        if (status === 'error') return 'danger'
        if (status === 'processing') return 'warning'
        if (status === 'uploading') return 'accent'
        return 'neutral'
    }
    const videoTone = getToneFromUploadStatus(assets.videoUpload.status)
    const coverTone = getToneFromUploadStatus(assets.activeCoverUpload.status)
    const dumpTone = dumpStatusStyles as VideoFormTone
    const remoteTone: VideoFormTone = remoteReadyCount === 2 ? 'success' : assets.isUploadingAssets ? 'warning' : 'neutral'

    return (
        <section >
            <div className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <h2 className={videoFormSectionTitleClassName}>Video principal y portada</h2>

                    </div>

                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className={videoFormInsetClassName}>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className={videoFormLabelClassName}>URLs remotas</p>
                                <p className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-[#f5f7fb]">{remoteReadyCount}/2</p>
                            </div>
                            <span className={getVideoFormBadgeClassName(remoteTone)}>
                                {remoteReadyCount === 2 ? 'Listas' : assets.isUploadingAssets ? 'Sincronizando' : 'Pendientes'}
                            </span>
                        </div>
                    </div>

                    <div className={videoFormInsetClassName}>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className={videoFormLabelClassName}>Dump</p>
                                <p className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-[#f5f7fb]">{dumpStatusLabel}</p>
                            </div>
                            <span className={getVideoFormBadgeClassName(dumpTone)}>
                                {assets.previewWindows.length > 0 ? 'Activo' : 'Pendiente'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                    <div
                        {...assets.videoDropzone.getRootProps()}
                        className={`${videoFormDropzoneClassName} cursor-pointer ${assets.videoDropzone.isDragActive ? 'border-[var(--primary)] bg-[#1f1621]' : ''}`}
                    >
                        <input {...assets.videoDropzone.getInputProps()} />

                        <div className="space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 space-y-1">
                                    <p className="text-[15px] font-semibold text-[#f5f7fb]">Video principal</p>

                                </div>
                                <span className={getVideoFormBadgeClassName(videoTone)}>{videoStatusLabel}</span>
                            </div>

                            <div className="aspect-video overflow-hidden rounded-[6px] border border-[#262c35] bg-[#0d1015]">
                                {assets.videoPreviewUrl ? (
                                    <video
                                        src={assets.videoPreviewUrl}
                                        className="h-full w-full object-cover"
                                        controls
                                        muted
                                        playsInline
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-[#8f97a8]">
                                        Arrastra el video principal. El preview local aparece aqui mientras se resuelve la URL remota.
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                <div className="min-w-0 space-y-1">
                                    <p className="break-all text-[14px] font-medium text-[#f5f7fb]">
                                        {assets.videoFile
                                            ? `${assets.videoFile.name} • ${formatFileSize(assets.videoFile.size)}`
                                            : 'Acepta MP4, MOV, WebM u otros formatos compatibles con el navegador.'}
                                    </p>

                                </div>


                            </div>
                            <button
                                type="button"
                                onClick={assets.clearVideoSelection}
                                disabled={!assets.videoFile}
                                className={videoFormSecondaryActionClassName}
                            >
                                Quitar video
                            </button>
                            {assets.errors.video && <p className="text-sm text-[#a53535]">{assets.errors.video}</p>}
                        </div>
                    </div>

                    <div
                        {...assets.coverDropzone.getRootProps()}
                        className={`${videoFormDropzoneClassName} cursor-pointer ${assets.coverDropzone.isDragActive ? 'border-[#caff36] bg-[#18200e]' : ''}`}
                    >
                        <input {...assets.coverDropzone.getInputProps()} />

                        <div className="space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 space-y-1">
                                    <p className="text-[15px] font-semibold text-[#f5f7fb]">Portada horizontal</p>

                                </div>
                                <span className={getVideoFormBadgeClassName(coverTone)}>{coverSourceLabel}</span>
                            </div>

                            <div className="aspect-video overflow-hidden rounded-[6px] border border-[#262c35] bg-[#0d1015]">
                                {assets.activeCoverUrl ? (
                                    <img
                                        src={assets.activeCoverUrl}
                                        alt="Portada del video"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-[#8f97a8]">
                                        Arrastra una portada horizontal o espera la imagen derivada del video.
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="break-all text-[14px] font-medium text-[#f5f7fb]">
                                    {assets.manualCoverFile
                                        ? `${assets.manualCoverFile.name} • ${formatFileSize(assets.manualCoverFile.size)}`
                                        : assets.generatedCoverFile
                                            ? 'Generada automaticamente desde el video cargado.'
                                            : 'Acepta JPG, PNG o WebP y mantiene el layout horizontal del card.'}
                                </p>

                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={assets.clearManualCover}
                                    disabled={!assets.manualCoverFile}
                                    className={videoFormSecondaryActionClassName}
                                >
                                    Quitar portada manual
                                </button>
                            </div>

                            {assets.errors.image && <p className="text-sm text-[#a53535]">{assets.errors.image}</p>}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <AssetUploadStatus
                        title="Estado del video"
                        file={assets.videoFile}
                        state={assets.videoUpload}
                        emptyMessage="Todavia no hay un video en cola."
                    />

                    <AssetUploadStatus
                        title="Estado de la portada"
                        file={activeCoverFile}
                        state={assets.activeCoverUpload}
                        emptyMessage="Todavia no hay una portada en cola."
                    />
                </div>

                <div className={videoFormInsetClassName}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-[15px] font-semibold text-[#f5f7fb]">Derivados y persistencia</p>

                            </div>
                            <span className={getVideoFormBadgeClassName(dumpTone)}>{dumpStatusLabel}</span>
                        </div>

                        <div>
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span className="font-medium text-[#f5f7fb]">URLs remotas listas</span>
                                <span className="text-[#8f97a8]">{remoteReadyCount}/2</span>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-[6px] bg-[#242932]">
                                <div
                                    className={getVideoFormProgressClassName(remoteTone === 'neutral' ? 'accent' : remoteTone as Exclude<VideoFormTone, 'neutral'>)}
                                    style={{ width: `${(remoteReadyCount / 2) * 100}%` }}
                                />
                            </div>
                            <p className={`mt-3 ${videoFormMutedTextClassName}`}>
                                {assets.isUploadingAssets
                                    ? 'La subida sigue en curso. El payload final usara las URLs remotas apenas ambas queden listas.'
                                    : 'Cuando ambos assets esten resueltos, el payload queda listo para persistirse.'}
                            </p>
                            {assets.uploadedVideoUrl && (
                                <p className="mt-3 break-all text-xs text-[#8f97a8]">
                                    URL activa del video: {assets.uploadedVideoUrl}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {assets.assetMessage && (
                    <div className="rounded-[6px] border border-[#6b4f1f] bg-[#21190e] p-4 text-sm text-[#ffcc63]">
                        {assets.assetMessage}
                    </div>
                )}
            </div>
        </section>
    )
}

export default VideoAssetsSection
