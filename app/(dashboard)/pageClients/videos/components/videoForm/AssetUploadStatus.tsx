import { formatFileSize } from './utils'

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
    idle: 'border border-white/10 bg-white/5 text-zinc-400',
    uploading: 'border border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
    processing: 'border border-amber-400/20 bg-amber-400/10 text-amber-100',
    success: 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    error: 'border border-rose-400/20 bg-rose-400/10 text-rose-100'
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
            : Math.max(state.progress, state.status === 'success' ? 100 : 4)

    return (
        <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{title}</p>
                <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${STATUS_STYLES[state.status]}`}>
                    {STATUS_LABELS[state.status]}
                </span>
            </div>

            <p className="mt-2 text-sm text-zinc-400">
                {file ? `${file.name} • ${formatFileSize(file.size)}` : emptyMessage}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                <div
                    className={`h-full rounded-full transition-all ${state.status === 'error' ? 'bg-rose-400' : 'bg-[linear-gradient(90deg,_#38bdf8,_#22c55e)]'}`}
                    style={{ width: `${progressWidth}%` }}
                />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                <span>
                    {state.totalBytes > 0
                        ? `${formatFileSize(state.uploadedBytes)} / ${formatFileSize(state.totalBytes)}`
                        : 'Esperando archivo'}
                </span>
                <span>
                    {state.totalBytes > 0 && state.status !== 'success'
                        ? `${formatFileSize(state.remainingBytes)} restantes`
                        : state.remoteUrl
                            ? 'Disponible en CDN'
                            : 'Sin URL remota'}
                </span>
            </div>

            {state.error && (
                <p className="mt-3 text-sm text-rose-300">{state.error}</p>
            )}
        </div>
    )
}

export default AssetUploadStatus
