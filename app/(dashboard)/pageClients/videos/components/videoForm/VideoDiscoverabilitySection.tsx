import type { UseVideoFormResult } from './useVideoForm'

interface Props {
    discoverability: UseVideoFormResult['discoverability']
}

const VideoDiscoverabilitySection = ({ discoverability }: Props) => {
    return (
        <section className="rounded-[28px] border border-white/10 bg-zinc-950/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Discoverability y metricas</h2>
                    <p className="mt-1 text-sm text-zinc-400">Controla keywords manuales y campos heredados como views o lastViews.</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-zinc-300">
                    Paso 4
                </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Views iniciales</span>
                    <input
                        type="number"
                        min={0}
                        value={discoverability.views}
                        onChange={(event) => discoverability.setViews(Number(event.target.value) || 0)}
                        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-white/30"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Last views</span>
                    <input
                        value={discoverability.lastViews}
                        onChange={(event) => discoverability.setLastViews(event.target.value)}
                        placeholder="Ej. 1.2K en las ultimas 24h"
                        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                    />
                </label>

                <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-zinc-200">Keywords manuales</span>
                    <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                value={discoverability.keywordInput}
                                onChange={(event) => discoverability.setKeywordInput(event.target.value)}
                                onBlur={discoverability.commitKeyword}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ',') {
                                        event.preventDefault()
                                        discoverability.commitKeyword()
                                    }
                                }}
                                placeholder="Agregar keyword manual y presionar Enter"
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                            />
                            <button
                                type="button"
                                onClick={discoverability.commitKeyword}
                                className="rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
                            >
                                Agregar
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {discoverability.manualSearchParams.length === 0 && (
                                <span className="text-sm text-zinc-500">
                                    Sin keywords manuales.
                                </span>
                            )}

                            {discoverability.manualSearchParams.map((keyword) => (
                                <button
                                    key={keyword}
                                    type="button"
                                    onClick={() => discoverability.removeKeyword(keyword)}
                                    className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200"
                                >
                                    {keyword} x
                                </button>
                            ))}
                        </div>
                    </div>
                </label>
            </div>
        </section>
    )
}

export default VideoDiscoverabilitySection
