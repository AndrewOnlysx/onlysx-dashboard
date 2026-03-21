import Link from 'next/link'

import { VideoFormMode } from './formConfig'

interface Props {
    mode: VideoFormMode
    videoTitle?: string
    onReset: () => void
}

const VideoFormHeader = ({ mode, videoTitle, onReset }: Props) => {
    const isEdit = mode === 'edit'

    return (
        <section className="surface-panel overflow-hidden p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl space-y-4">
                    <span className="page-shell__eyebrow !bg-white/[0.03] !text-zinc-200 !border-white/8">
                        {isEdit ? 'Edicion de video' : 'Alta de videos'}
                    </span>
                    <div className="space-y-2.5">
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {isEdit
                                ? `Ajusta metadata, assets y relaciones${videoTitle ? ` de ${videoTitle}` : ''}`
                                : 'Crea un registro nuevo con assets cargados por drag and drop'}
                        </h1>
                        <p className="max-w-2xl text-sm leading-6 text-zinc-400 sm:text-[15px]">
                            {isEdit
                                ? 'Puedes conservar los assets existentes o reemplazarlos desde los dropzones. El mismo formulario maneja la actualizacion completa del registro.'
                                : 'El video principal y la portada entran por dropzone. El dump se deriva automaticamente del video seleccionado para usarlo como hover preview.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 text-xs text-zinc-300">
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
                            Metadata
                        </span>
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
                            Assets remotos
                        </span>
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
                            Relaciones editoriales
                        </span>
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
        </section>
    )
}

export default VideoFormHeader
