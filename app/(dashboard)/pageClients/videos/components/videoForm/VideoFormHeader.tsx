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
        <section className="surface-panel surface-panel--hero overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl space-y-3">
                    <span className="page-shell__eyebrow">
                        {isEdit ? 'Edicion de video' : 'Alta de videos'}
                    </span>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            {isEdit
                                ? `Ajusta metadata, assets y relaciones${videoTitle ? ` de ${videoTitle}` : ''}`
                                : 'Crea un registro nuevo con assets cargados por drag and drop'}
                        </h1>
                        <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                            {isEdit
                                ? 'Puedes conservar los assets existentes o reemplazarlos desde los dropzones. El mismo formulario maneja la actualizacion completa del registro.'
                                : 'El video principal y la portada entran por dropzone. El dump se deriva automaticamente del video seleccionado para usarlo como hover preview.'}
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
        </section>
    )
}

export default VideoFormHeader
