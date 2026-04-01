import { formatFileSize } from './utils'
import { getVideoFormBadgeClassName, getVideoFormProgressClassName, type VideoFormTone, videoFormInsetClassName, videoFormMutedTextClassName } from './videoFormUi'

interface UploadState {
    status: 'idle' | 'uploading' | 'processing' | 'success' | 'error'
    progress: number
    uploadedBytes: number
    totalBytes: number
    remainingBytes: number
    remoteUrl: string
    error: string
}

interface Props {
    title: string
    file: File | null
    state: UploadState
    emptyMessage: string
}

const STATUS_STYLES: Record<UploadState['status'], string> = {
    idle: 'muted-pill',
    uploading: 'accent-pill',
    processing: 'warning-pill',
    success: 'success-pill',
    error: 'status-pill-error'
}

const STATUS_LABELS: Record<UploadState['status'], string> = {
    idle: 'Pendiente',
    uploading: 'Subiendo',
    processing: 'Procesando',
    success: 'Subido',
    error: 'Error'
}

const AssetUploadStatus = ({ title, file, state, emptyMessage }: Props) => {
    const progressWidth = state.status === 'idle'
        ? 0
        : state.status === 'error'
            ? Math.max(6, state.progress)
            : state.status === 'processing'
                ? Math.min(96, Math.max(state.progress, 12))
                : Math.max(state.progress, state.status === 'success' ? 100 : 4)

    const primaryMessage = file
        ? `${file.name} • ${formatFileSize(file.size)}`
        : state.remoteUrl
            ? 'Asset remoto ya disponible. No necesita volver a subirse.'
            : emptyMessage

    const secondaryMessage = state.status === 'processing'
        ? 'El archivo ya llego al servidor. Falta la transferencia final hacia Cloudflare.'
        : state.remoteUrl
            ? 'Disponible en CDN.'
            : state.status === 'uploading'
                ? 'Transferencia activa.'
                : 'Sin actividad todavia.'
    const tone: VideoFormTone = state.status === 'success'
        ? 'success'
        : state.status === 'error'
            ? 'danger'
            : state.status === 'processing'
                ? 'warning'
                : state.status === 'uploading'
                    ? 'accent'
                    : 'neutral'

    return (
        <div className={videoFormInsetClassName}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#f5f7fb]">{title}</p>
                    <p className="mt-1 break-all text-[13px] leading-5 text-[#c1c8d3]">{primaryMessage}</p>
                </div>
                <span className={getVideoFormBadgeClassName(tone)}>
                    {STATUS_LABELS[state.status]}
                </span>
            </div>

            <p className={`mt-3 ${videoFormMutedTextClassName}`}>
                {secondaryMessage}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-[6px] bg-[#242932]">
                <div
                    className={getVideoFormProgressClassName(tone === 'neutral' ? 'accent' : tone as Exclude<VideoFormTone, 'neutral'>)}
                    style={{ width: `${progressWidth}%` }}
                />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8f97a8]">
                <span>
                    {state.status === 'processing' && state.totalBytes > 0
                        ? `${formatFileSize(state.totalBytes)} recibidos por el servidor`
                        : state.totalBytes > 0
                            ? `${formatFileSize(state.uploadedBytes)} / ${formatFileSize(state.totalBytes)}`
                            : state.remoteUrl
                                ? 'Persistido'
                                : 'Esperando archivo'}
                </span>
                <span>
                    {state.status === 'processing'
                        ? 'Servidor -> Cloudflare'
                        : state.totalBytes > 0 && state.status !== 'success'
                            ? `${formatFileSize(state.remainingBytes)} restantes`
                            : state.remoteUrl
                                ? 'Disponible en CDN'
                                : 'Sin URL remota'}
                </span>
            </div>

            {state.error && (
                <p className="mt-3 text-sm text-[#ff9ca4]">{state.error}</p>
            )}
        </div>
    )
}

export default AssetUploadStatus
