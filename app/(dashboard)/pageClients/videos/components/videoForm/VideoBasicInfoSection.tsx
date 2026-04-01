import type { UseVideoFormResult } from './useVideoForm'
import {
    getVideoFormBadgeClassName,
    videoFormBodyTextClassName,
    videoFormInputClassName,
    videoFormInsetClassName,
    videoFormLabelClassName,
    videoFormMutedTextClassName,
    videoFormSectionTitleClassName,
    videoFormSurfaceClassName
} from './videoFormUi'

interface Props {
    basicInfo: UseVideoFormResult['basicInfo']
}

const VideoBasicInfoSection = ({ basicInfo }: Props) => {
    const qualityLabel = basicInfo.qualityPreset === 'custom'
        ? basicInfo.customQuality || 'Definir calidad personalizada'
        : basicInfo.qualityPreset

    return (
        <section >
            <div className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <h2 className={videoFormSectionTitleClassName}>Campos principales del video</h2>

                    </div>

                    <span className={getVideoFormBadgeClassName(qualityLabel ? 'accent' : 'neutral')}>
                        {qualityLabel}
                    </span>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.92fr)]">
                    <label className={`${videoFormInsetClassName} space-y-3`}>
                        <span className={videoFormLabelClassName}>Titulo</span>
                        <input
                            value={basicInfo.title}
                            onChange={(event) => basicInfo.setTitle(event.target.value)}
                            placeholder="Ej. Summer rooftop casting"
                            className={videoFormInputClassName}
                        />
                        <p className={videoFormMutedTextClassName}>
                            Usa un titulo corto, descriptivo y facil de leer sin que se corte en listados.
                        </p>
                        {basicInfo.errors.title && <p className="text-sm text-[#a53535]">{basicInfo.errors.title}</p>}
                    </label>

                    <div className="grid gap-4">
                        <label className={`${videoFormInsetClassName} space-y-3`}>
                            <span className={videoFormLabelClassName}>Duracion</span>
                            <input
                                value={basicInfo.time}
                                onChange={(event) => basicInfo.setTime(event.target.value)}
                                placeholder="Se completa desde el video, pero puedes ajustarla"
                                className={videoFormInputClassName}
                            />
                            <p className={videoFormMutedTextClassName}>
                                Se autocompleta al procesar el video, pero puedes afinarla si necesitas una etiqueta mas editorial.
                            </p>
                            {basicInfo.errors.time && <p className="text-sm text-[#a53535]">{basicInfo.errors.time}</p>}
                        </label>

                        <div className={`${videoFormInsetClassName} space-y-3`}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className={videoFormLabelClassName}>Calidad</span>
                                <span className={getVideoFormBadgeClassName('neutral')}>{qualityLabel}</span>
                            </div>
                            <div className="grid gap-3 w-full">
                                <select
                                    value={basicInfo.qualityPreset}
                                    onChange={(event) => basicInfo.setQualityPreset(event.target.value as typeof basicInfo.qualityPreset)}
                                    className={videoFormInputClassName}
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
                                        className={videoFormInputClassName}
                                    />
                                )}
                            </div>
                            <p className={videoFormMutedTextClassName}>
                                Mantiene una lectura limpia en el preview y evita etiquetas ambiguas.
                            </p>
                            {basicInfo.errors.quality && <p className="text-sm text-[#a53535]">{basicInfo.errors.quality}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VideoBasicInfoSection
