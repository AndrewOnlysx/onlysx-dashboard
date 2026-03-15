import type { UseVideoFormResult } from './useVideoForm'

interface Props {
    discoverability: UseVideoFormResult['discoverability']
}

const VideoDiscoverabilitySection = ({ discoverability }: Props) => {
    return (
        <section className="surface-panel p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Discoverability y metricas</h2>
                    <p className="mt-1 text-sm text-zinc-400">Controla keywords manuales y campos heredados como views o lastViews.</p>
                </div>
                <div className="muted-pill">
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
                        className="app-input"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Last views</span>
                    <input
                        value={discoverability.lastViews}
                        onChange={(event) => discoverability.setLastViews(event.target.value)}
                        placeholder="Ej. 1.2K en las ultimas 24h"
                        className="app-input"
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
                                className="app-input"
                            />
                            <button
                                type="button"
                                onClick={discoverability.commitKeyword}
                                className="secondary-action"
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
                                    className="accent-pill normal-case tracking-normal text-xs"
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
