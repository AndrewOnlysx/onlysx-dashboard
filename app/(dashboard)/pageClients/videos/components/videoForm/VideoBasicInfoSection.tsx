import type { UseVideoFormResult } from './useVideoForm'

interface Props {
    basicInfo: UseVideoFormResult['basicInfo']
}

const VideoBasicInfoSection = ({ basicInfo }: Props) => {
    return (
        <section className="rounded-[28px] border border-white/10 bg-zinc-950/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Informacion base</h2>
                    <p className="mt-1 text-sm text-zinc-400">Titulo, duracion y calidad visible en cards y vistas internas.</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-zinc-300">
                    Paso 1
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-zinc-200">Titulo</span>
                    <input
                        value={basicInfo.title}
                        onChange={(event) => basicInfo.setTitle(event.target.value)}
                        placeholder="Ej. Summer rooftop casting"
                        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                    />
                    {basicInfo.errors.title && <p className="text-sm text-rose-300">{basicInfo.errors.title}</p>}
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Duracion</span>
                    <input
                        value={basicInfo.time}
                        onChange={(event) => basicInfo.setTime(event.target.value)}
                        placeholder="Se completa desde el video, pero puedes ajustarla"
                        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                    />
                    {basicInfo.errors.time && <p className="text-sm text-rose-300">{basicInfo.errors.time}</p>}
                </label>

                <div className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Calidad</span>
                    <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
                        <select
                            value={basicInfo.qualityPreset}
                            onChange={(event) => basicInfo.setQualityPreset(event.target.value as typeof basicInfo.qualityPreset)}
                            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-white/30"
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
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
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
