import type { UseVideoFormResult } from './useVideoForm'

interface Props {
    discoverability: UseVideoFormResult['discoverability']
}

const VideoDiscoverabilitySection = ({ discoverability }: Props) => {
    return (
        <section className="surface-panel editor-panel p-5 sm:p-6">
            <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <span className="editor-kicker">Paso 4</span>
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-white">Discoverability y metricas</h2>
                            <p className="text-sm leading-6 text-zinc-400">Controla keywords manuales y campos heredados como views o lastViews.</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-1">
                    <div className="grid gap-4">
                        <label className="editor-subpanel space-y-3 p-5">
                            <span className="text-sm font-medium text-zinc-200">Views iniciales</span>
                            <input
                                type="number"
                                min={0}
                                value={discoverability.views}
                                onChange={(event) => discoverability.setViews(Number(event.target.value) || 0)}
                                className="app-input"
                            />
                            <p className="text-sm leading-6 text-zinc-400">Numero de arranque para el card y para la vista administrativa del video.</p>
                        </label>

                        <label className="editor-subpanel space-y-3 p-5">
                            <span className="text-sm font-medium text-zinc-200">Last views</span>
                            <input
                                value={discoverability.lastViews}
                                onChange={(event) => discoverability.setLastViews(event.target.value)}
                                placeholder="Ej. 1.2K en las ultimas 24h"
                                className="app-input"
                            />
                            <p className="text-sm leading-6 text-zinc-400">Campo editorial para contexto reciente o un snapshot de performance.</p>
                        </label>
                    </div>

                    <div className="editor-subpanel space-y-4 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-white">Keywords manuales</p>
                                <p className="text-sm leading-6 text-zinc-400">Agrega terminos editoriales que no dependen del analisis automatico y ayudan a discovery interno.</p>
                            </div>
                            <span className="muted-pill normal-case tracking-normal text-xs">
                                {discoverability.manualSearchParams.length} keywords
                            </span>
                        </div>

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
                </div>
            </div>
        </section>
    )
}

export default VideoDiscoverabilitySection
