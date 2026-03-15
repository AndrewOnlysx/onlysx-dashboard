import SelectGallery from '@/components/GallerySelector/SelectGallery'
import SelectModel from '@/components/ModelSelector/SelectModel'
import SelectTag from '@/components/TagsSelector/Selectag'

import type { UseVideoFormResult } from './useVideoForm'

interface Props {
    relations: UseVideoFormResult['relations']
}

const VideoRelationsSection = ({ relations }: Props) => {
    return (
        <section className="surface-panel p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Relacion editorial</h2>
                    <p className="mt-1 text-sm text-zinc-400">Asocia el video con modelos, tags y galerias para ordenar el catalogo.</p>
                </div>
                <div className="muted-pill">
                    Paso 3
                </div>
            </div>

            <div className="grid gap-5">
                <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Modelos</span>
                    <SelectModel
                        selectedModels={relations.selectedModels}
                        setSelectedModels={relations.setSelectedModels}
                    />
                    {relations.errors.models && <p className="text-sm text-rose-300">{relations.errors.models}</p>}
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Tags</span>
                    <SelectTag
                        selectedTags={relations.selectedTags}
                        setSelectedTags={relations.setSelectedTags}
                    />
                    {relations.errors.tags && <p className="text-sm text-rose-300">{relations.errors.tags}</p>}
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-200">Galerias relacionadas</span>
                    <SelectGallery
                        selectedGaleries={relations.selectedGaleries}
                        setSelectedGaleries={relations.setSelectedGaleries}
                    />
                </label>
            </div>
        </section>
    )
}

export default VideoRelationsSection
