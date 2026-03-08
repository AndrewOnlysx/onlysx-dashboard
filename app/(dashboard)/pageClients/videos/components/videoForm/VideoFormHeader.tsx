import Link from 'next/link'

interface Props {
    onReset: () => void
}

const VideoFormHeader = ({ onReset }: Props) => {
    return (
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.24),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_24%),linear-gradient(135deg,_rgba(20,20,23,0.98),_rgba(8,8,11,0.96))] p-6 sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl space-y-3">
                    <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.28em] text-zinc-300">
                        Alta de videos
                    </span>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Crea un registro nuevo con assets cargados por drag and drop
                        </h1>
                        <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                            El video principal y la portada entran por dropzone. El dump se deriva automaticamente del video seleccionado para usarlo como hover preview.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/pageClients/videos"
                        className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                        Volver al listado
                    </Link>
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                    >
                        Limpiar formulario
                    </button>
                </div>
            </div>
        </section>
    )
}

export default VideoFormHeader
