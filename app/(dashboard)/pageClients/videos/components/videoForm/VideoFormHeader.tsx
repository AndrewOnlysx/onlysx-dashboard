import Link from 'next/link'

import { VideoFormMode } from './formConfig'

interface Props {
    mode: VideoFormMode
    videoTitle?: string
    onReset: () => void
    readyAssets: number
    completedChecklist: number
    checklistTotal: number
    isUploadingAssets: boolean
}

const VideoFormHeader = ({
    mode,
    videoTitle,
    onReset,
    readyAssets,
    completedChecklist,
    checklistTotal,
    isUploadingAssets
}: Props) => {
    const isEdit = mode === 'edit'
    const syncStatusClassName = isUploadingAssets
        ? 'warning-pill'
        : readyAssets === 2
            ? 'success-pill'
            : 'muted-pill'
    const syncStatusLabel = isUploadingAssets
        ? 'Uploads en curso'
        : readyAssets === 2
            ? 'Assets resueltos'
            : 'Pendiente de assets'

    return (
        <section className="surface-panel editor-panel p-5 sm:p-7">
            <div className="relative flex flex-col gap-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl space-y-5">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="editor-kicker">
                                {isEdit ? 'Edicion de video' : 'Alta de videos'}
                            </span>
                            <span className={`${syncStatusClassName} normal-case tracking-normal text-xs`}>
                                {syncStatusLabel}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                                {isEdit
                                    ? `Ajusta metadata, assets y relaciones${videoTitle ? ` de ${videoTitle}` : ''}`
                                    : 'Carga un video nuevo con una superficie mas clara para editar, revisar y publicar'}
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-zinc-400 sm:text-[15px]">
                                {isEdit
                                    ? 'Puedes conservar los assets existentes o reemplazarlos desde los dropzones. El mismo formulario concentra la actualizacion visual, el control de uploads y el preview final del registro.'
                                    : 'El video principal se sube apenas lo seleccionas. La portada puede ser manual o generada, y el sidebar te deja validar el resultado sin salir del flujo.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/pageClients/videos"
                            className="secondary-action"
                        >
                            Volver al listado
                        </Link>
                        <button
                            type="button"
                            onClick={onReset}
                            className="primary-action"
                        >
                            {isEdit ? 'Restaurar cambios' : 'Limpiar formulario'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    <div className="editor-subpanel p-4 sm:p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Registro</p>
                        <p className="mt-3 text-xl font-semibold text-white">
                            {isEdit
                                ? 'Actualizacion completa'
                                : 'Nuevo alta editorial'}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                            {isEdit
                                ? 'Conserva lo que sirve y reemplaza solo los assets o metadatos que cambiaron.'
                                : 'Prepara el registro desde cero con preview local y subida automatica.'}
                        </p>
                    </div>

                    <div className="editor-subpanel p-4 sm:p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Assets remotos</p>
                        <div className="mt-3 flex items-end justify-between gap-3">
                            <p className="text-3xl font-semibold text-white">{readyAssets}/2</p>
                            <span className={`${readyAssets === 2 ? 'success-pill' : 'muted-pill'} normal-case tracking-normal text-xs`}>
                                {readyAssets === 2 ? 'Preview listo' : 'Falta sincronizar'}
                            </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                            Video y portada se reflejan aqui segun se resuelven sus URLs remotas.
                        </p>
                    </div>

                    <div className="editor-subpanel p-4 sm:p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Checklist visual</p>
                        <div className="mt-3 flex items-end justify-between gap-3">
                            <p className="text-3xl font-semibold text-white">{completedChecklist}/{checklistTotal}</p>
                            <span className={`${completedChecklist === checklistTotal ? 'success-pill' : 'warning-pill'} normal-case tracking-normal text-xs`}>
                                {completedChecklist === checklistTotal ? 'Completo' : 'Revisar campos'}
                            </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                            El sidebar usa este estado para mostrar que tan cerca esta el registro de quedar publicable.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VideoFormHeader
