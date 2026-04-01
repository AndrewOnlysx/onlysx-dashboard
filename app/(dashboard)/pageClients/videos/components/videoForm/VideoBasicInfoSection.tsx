import type { UseVideoFormResult } from './useVideoForm'

interface Props {
    basicInfo: UseVideoFormResult['basicInfo']
}

const VideoBasicInfoSection = ({ basicInfo }: Props) => {
    const qualityLabel = basicInfo.qualityPreset === 'custom'
        ? basicInfo.customQuality || 'Definir calidad personalizada'
        : basicInfo.qualityPreset

    return (
        <section className="surface-panel editor-panel p-5 sm:p-6">
            <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <span className="editor-kicker">Paso 1</span>
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-white">Informacion base</h2>
                            <p className="text-sm leading-6 text-zinc-400">Titulo, duracion y calidad visible en cards y vistas internas.</p>
                        </div>
                    </div>
                    <div className="editor-metric hidden min-w-[150px] p-4 md:block">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Calidad activa</p>
                        <p className="mt-2 text-base font-semibold text-white">{qualityLabel}</p>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)]">
                    <label className="editor-subpanel space-y-3 p-5">
                        <span className="text-sm font-medium text-zinc-200">Titulo</span>
                        <input
                            value={basicInfo.title}
                            onChange={(event) => basicInfo.setTitle(event.target.value)}
                            placeholder="Ej. Summer rooftop casting"
                            className="app-input"
                        />
                        <p className="text-sm leading-6 text-zinc-400">
                            Usa un titulo corto, descriptivo y util para listado, buscador y vista interna.
                        </p>
                        {basicInfo.errors.title && <p className="text-sm text-rose-300">{basicInfo.errors.title}</p>}
                    </label>

                    <div className="grid gap-4">
                        <label className="editor-subpanel space-y-3 p-5">
                            <span className="text-sm font-medium text-zinc-200">Duracion</span>
                            <input
                                value={basicInfo.time}
                                onChange={(event) => basicInfo.setTime(event.target.value)}
                                placeholder="Se completa desde el video, pero puedes ajustarla"
                                className="app-input"
                            />
                            <p className="text-sm leading-6 text-zinc-400">
                                Se autocompleta al procesar el video, pero puedes corregirla si necesitas una etiqueta mas editorial.
                            </p>
                            {basicInfo.errors.time && <p className="text-sm text-rose-300">{basicInfo.errors.time}</p>}
                        </label>

                        <div className="editor-subpanel space-y-3 p-5">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-zinc-200">Calidad</span>
                                <span className="muted-pill normal-case tracking-normal text-xs">{qualityLabel}</span>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[170px_minmax(0,1fr)]">
                                <select
                                    value={basicInfo.qualityPreset}
                                    onChange={(event) => basicInfo.setQualityPreset(event.target.value as typeof basicInfo.qualityPreset)}
                                    className="app-input"
                                >
                                    {basicInfo.qualityOptions.map((quality) => (
                                        <option key={quality} value={quality}>
                                            {quality}
                                        </option>
                                    ))}
                                    <option value="custom">Custom</option>
                                </select>

                                {basicInfo.qualityPreset === 'custom' && (
                                    <input
                                        value={basicInfo.customQuality}
                                        onChange={(event) => basicInfo.setCustomQuality(event.target.value)}
                                        placeholder="Ej. 2160p HDR"
                                        className="app-input"
                                    />
                                )}
                            </div>
                            {basicInfo.errors.quality && <p className="text-sm text-rose-300">{basicInfo.errors.quality}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VideoBasicInfoSection
