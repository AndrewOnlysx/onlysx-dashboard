'use client'

import { useMemo, useRef, useState } from 'react'

import ContainerPage from '@/components/Layout/Layouts'

import uploadVideoAsset, { UploadProgressSnapshot, VideoAssetUploadTask, VideoAssetUploadStatus } from '../components/videoForm/uploadVideoAsset'

type LogEntry = {
    id: number
    message: string
}

const formatBytes = (value: number) => {
    if (value < 1024) {
        return `${value} B`
    }

    if (value < 1024 * 1024) {
        return `${(value / 1024).toFixed(1)} KB`
    }

    if (value < 1024 * 1024 * 1024) {
        return `${(value / (1024 * 1024)).toFixed(1)} MB`
    }

    return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export default function UploadDebugPage() {
    const taskRef = useRef<VideoAssetUploadTask | null>(null)
    const logIdRef = useRef(0)

    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<VideoAssetUploadStatus>('idle')
    const [progress, setProgress] = useState<UploadProgressSnapshot>({
        progress: 0,
        uploadedBytes: 0,
        totalBytes: 0,
        remainingBytes: 0,
    })
    const [remoteUrl, setRemoteUrl] = useState('')
    const [error, setError] = useState('')
    const [logs, setLogs] = useState<LogEntry[]>([])

    const appendLog = (message: string) => {
        logIdRef.current += 1
        setLogs((current) => [{ id: logIdRef.current, message }, ...current].slice(0, 12))
    }

    const resetState = () => {
        setStatus('idle')
        setProgress({
            progress: 0,
            uploadedBytes: 0,
            totalBytes: 0,
            remainingBytes: 0,
        })
        setRemoteUrl('')
        setError('')
    }

    const selectVideo = (nextFile: File | null) => {
        taskRef.current?.abort()
        taskRef.current = null
        setFile(nextFile)
        resetState()
        setLogs([])

        if (nextFile) {
            appendLog(`video seleccionado: ${nextFile.name}`)
        }
    }

    const startUpload = () => {
        if (!file) {
            setError('Selecciona un video antes de subirlo.')
            appendLog('error: no hay video seleccionado')
            return
        }

        resetState()
        appendLog(`subida iniciada: ${file.name}`)

        const task = uploadVideoAsset({
            file,
            assetType: 'video',
            folder: 'videos-debug',
            onProgress: (snapshot) => {
                setProgress(snapshot)
            },
            onStatusChange: (nextStatus) => {
                setStatus(nextStatus)
                appendLog(`estado: ${nextStatus}`)
            }
        })

        taskRef.current = task

        void task.promise
            .then((asset) => {
                setRemoteUrl(asset.url)
                appendLog(`subida correcta: ${asset.url}`)
            })
            .catch((uploadError) => {
                if (uploadError instanceof DOMException && uploadError.name === 'AbortError') {
                    appendLog('subida cancelada')
                    return
                }

                const message = uploadError instanceof Error
                    ? uploadError.message
                    : 'No se pudo completar la subida.'

                setError(message)
                appendLog(`error: ${message}`)
            })
            .finally(() => {
                taskRef.current = null
            })
    }

    const statusLabel = useMemo(() => {
        if (status === 'uploading') return 'Subiendo'
        if (status === 'success') return 'Subido correctamente'
        if (status === 'error') return 'Error'
        if (status === 'processing') return 'Procesando'
        return 'Pendiente'
    }, [status])

    return (
        <ContainerPage
            eyebrow="Sandbox"
            title="Upload De Video Aislado"
            description="Ruta de prueba para validar solo el frontend de subida sin pasar por el formulario complejo."
        >
            <section className="surface-panel grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_380px]">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-white">1. Selecciona un video</p>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(event) => selectVideo(event.target.files?.[0] ?? null)}
                            className="app-input"
                        />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                        {file ? (
                            <div className="space-y-1">
                                <p className="font-medium text-white">{file.name}</p>
                                <p>{formatBytes(file.size)}</p>
                            </div>
                        ) : (
                            <p>No hay video seleccionado.</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={startUpload}
                            disabled={!file || status === 'uploading'}
                            className="primary-action disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Subir video
                        </button>
                        <button
                            type="button"
                            onClick={() => selectVideo(null)}
                            className="secondary-action"
                        >
                            Limpiar
                        </button>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-white">2. Resultado</p>
                            <span className={status === 'success' ? 'success-pill px-3 py-1 text-xs' : status === 'error' ? 'danger-action px-3 py-1 text-xs' : 'accent-pill px-3 py-1 text-xs'}>
                                {statusLabel}
                            </span>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                                className={`h-full rounded-full transition-all ${status === 'error' ? 'bg-rose-400' : 'bg-[var(--primary)]'}`}
                                style={{ width: `${progress.progress}%` }}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-400">
                            <span>progreso: {progress.progress}%</span>
                            <span>subido: {formatBytes(progress.uploadedBytes)}</span>
                            <span>restante: {formatBytes(progress.remainingBytes)}</span>
                        </div>

                        {remoteUrl && (
                            <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                                <p className="font-medium">Video subido correctamente</p>
                                <p className="mt-1 break-all text-xs text-emerald-200">{remoteUrl}</p>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-sm font-semibold text-white">Trazas del flujo</p>
                    <p className="mt-1 text-sm text-zinc-400">El recorrido esperado es: seleccionar video, subir, exito o error.</p>

                    <div className="mt-4 space-y-2">
                        {logs.length > 0 ? logs.map((entry) => (
                            <div key={entry.id} className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-xs text-zinc-300">
                                {entry.message}
                            </div>
                        )) : (
                            <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-zinc-500">
                                Aun no hay eventos para mostrar.
                            </div>
                        )}
                    </div>
                </aside>
            </section>
        </ContainerPage>
    )
}