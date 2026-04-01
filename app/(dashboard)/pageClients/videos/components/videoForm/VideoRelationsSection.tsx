import Link from 'next/link'

import SelectGallery from '@/components/GallerySelector/SelectGallery'
import SelectModel from '@/components/ModelSelector/SelectModel'
import SelectTag from '@/components/TagsSelector/Selectag'

import type { UseVideoFormResult } from './useVideoForm'
import {
    getVideoFormBadgeClassName,
    videoFormBodyTextClassName,
    videoFormInsetClassName,
    videoFormLabelClassName,
    videoFormMutedTextClassName,
    videoFormPrimaryActionClassName,
    videoFormSectionTitleClassName,
    videoFormSurfaceClassName
} from './videoFormUi'

interface Props {
    relations: UseVideoFormResult['relations']
}

const VideoRelationsSection = ({ relations }: Props) => {
    return (
        <section >
            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 className={videoFormSectionTitleClassName}>Asociaciones del contenido</h2>

                </div>

                <div className="space-y-4">
                    <div className={videoFormInsetClassName}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                                <p className="text-[15px] font-semibold text-[#f5f7fb]">Modelos</p>
                            </div>
                            <span className={getVideoFormBadgeClassName(relations.selectedModels.length > 0 ? 'success' : 'neutral')}>
                                {relations.selectedModels.length} seleccionados
                            </span>
                        </div>

                        <SelectModel
                            selectedModels={relations.selectedModels}
                            setSelectedModels={relations.setSelectedModels}
                            uiVariant="compact"
                        />



                        {relations.errors.models && <p className="mt-3 text-sm text-[#a53535]">{relations.errors.models}</p>}
                    </div>
                    <div className="flex flex-col gap-3  pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <p className={videoFormMutedTextClassName}>Crea el modelo </p>
                        </div>
                        <Link
                            href="/pageClients/models/new"
                            className={`${videoFormPrimaryActionClassName} w-full sm:w-auto`}
                        >
                            Añadir modelo
                        </Link>
                    </div>
                    <br />
                    <div className={videoFormInsetClassName}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                                <p className="text-[15px] font-semibold text-[#f5f7fb]">Tags</p>
                            </div>
                            <span className={getVideoFormBadgeClassName(relations.selectedTags.length > 0 ? 'success' : 'neutral')}>
                                {relations.selectedTags.length} activos
                            </span>
                        </div>

                        <SelectTag
                            selectedTags={relations.selectedTags}
                            setSelectedTags={relations.setSelectedTags}
                            uiVariant="compact"
                        />

                        {relations.errors.tags && <p className="mt-3 text-sm text-[#a53535]">{relations.errors.tags}</p>}
                    </div>

                    <div className={videoFormInsetClassName}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                                <p className="text-[15px] font-semibold text-[#f5f7fb]">Galerias relacionadas</p>
                            </div>
                            <span className={getVideoFormBadgeClassName(relations.selectedGaleries.length > 0 ? 'success' : 'neutral')}>
                                {relations.selectedGaleries.length} enlazadas
                            </span>
                        </div>

                        <SelectGallery
                            selectedGaleries={relations.selectedGaleries}
                            setSelectedGaleries={relations.setSelectedGaleries}
                            uiVariant="compact"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VideoRelationsSection
