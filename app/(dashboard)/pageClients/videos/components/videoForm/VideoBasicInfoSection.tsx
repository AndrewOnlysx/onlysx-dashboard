import type { UseVideoFormResult } from './useVideoForm'

interface Props {
    basicInfo: UseVideoFormResult['basicInfo']
}

const VideoBasicInfoSection = ({ basicInfo }: Props) => {
    return (
        <section className="surface-panel p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-white">Informacion base</h2>
                    <p className="text-sm text-zinc-400">Titulo, duracion y calidad visible en cards y vistas internas.</p>
                </div>
                <div className="muted-pill">
                    Paso 1
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-zinc-200">Titulo</span>
                    <input
                        value={basicInfo.title}
                        onChange={(event) => basicInfo.setTitle(event.target.value)}
                        placeholder="Ej. Summer rooftop casting"
                        className="app-input"
                    />
                    {basicInfo.errors.title && <p className="text-sm text-rose-300">{basicInfo.errors.title}</p>}
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Duracion</span>
                    <input
                        value={basicInfo.time}
                        onChange={(event) => basicInfo.setTime(event.target.value)}
                        placeholder="Se completa desde el video, pero puedes ajustarla"
                        className="app-input"
                    />
                    {basicInfo.errors.time && <p className="text-sm text-rose-300">{basicInfo.errors.time}</p>}
                </label>

                <div className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Calidad</span>
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
        </section>
    )
}

export default VideoBasicInfoSection
