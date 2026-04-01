import type { UseVideoFormResult } from './useVideoForm'
import {
    getVideoFormBadgeClassName,
    videoFormBodyTextClassName,
    videoFormInputClassName,
    videoFormInsetClassName,
    videoFormLabelClassName,
    videoFormMutedTextClassName,
    videoFormSecondaryActionClassName,
    videoFormSectionTitleClassName,
    videoFormSurfaceClassName
} from './videoFormUi'

interface Props {
    discoverability: UseVideoFormResult['discoverability']
}

const VideoDiscoverabilitySection = ({ discoverability }: Props) => {
    return (
        <section>
            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 className={videoFormSectionTitleClassName}>Metricas y palabras clave</h2>

                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <label className={`${videoFormInsetClassName} space-y-3`}>
                        <span className={videoFormLabelClassName}>Views iniciales</span>
                        <input
                            type="number"
                            min={0}
                            value={discoverability.views}
                            onChange={(event) => discoverability.setViews(Number(event.target.value) || 0)}
                            className={videoFormInputClassName}
                        />
                    </label>

                    <label className={`${videoFormInsetClassName} space-y-3`}>
                        <span className={videoFormLabelClassName}>Last views</span>
                        <input
                            value={discoverability.lastViews}
                            onChange={(event) => discoverability.setLastViews(event.target.value)}
                            placeholder="Ej. 1.2K en las ultimas 24h"
                            className={videoFormInputClassName}
                        />
                    </label>
                </div>

                <div className={`${videoFormInsetClassName} space-y-4`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                            <p className="text-[15px] font-semibold text-[#f5f7fb]">Keywords manuales</p>
                        </div>
                        <span className={getVideoFormBadgeClassName(discoverability.manualSearchParams.length > 0 ? 'accent' : 'neutral')}>
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
                            className={videoFormInputClassName}
                        />
                        <button
                            type="button"
                            onClick={discoverability.commitKeyword}
                            className={`${videoFormSecondaryActionClassName} sm:min-w-[120px]`}
                        >
                            Agregar
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {discoverability.manualSearchParams.length === 0 && (
                            <span className={videoFormMutedTextClassName}>
                                Sin keywords manuales.
                            </span>
                        )}

                        {discoverability.manualSearchParams.map((keyword) => (
                            <button
                                key={keyword}
                                type="button"
                                onClick={() => discoverability.removeKeyword(keyword)}
                                className="inline-flex items-center justify-center rounded-[6px] border border-[#6b2f52] bg-[#27111e] px-2 py-1 text-[12px] font-medium text-[#ff8ecb]"
                            >
                                {keyword} x
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VideoDiscoverabilitySection
