import Link from 'next/link'

import SelectGallery from '@/components/GallerySelector/SelectGallery'
import SelectModel from '@/components/ModelSelector/SelectModel'
import SelectTag from '@/components/TagsSelector/Selectag'

import type { UseVideoFormResult } from './useVideoForm'

interface Props {
    relations: UseVideoFormResult['relations']
}

const VideoRelationsSection = ({ relations }: Props) => {
    return (
        <section className="surface-panel editor-panel p-5 sm:p-6">
            <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <span className="editor-kicker">Paso 3</span>
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-white">Relacion editorial</h2>
                            <p className="text-sm leading-6 text-zinc-400">Asocia el video con modelos, tags y galerias para ordenar el catalogo.</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-1">
                    <div className="editor-subpanel space-y-4 p-5">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">Modelos</p>
                            <p className="text-sm leading-6 text-zinc-400">Define las protagonistas y conserva el contexto visual con avatar y nombre.</p>
                        </div>
                        <SelectModel
                            selectedModels={relations.selectedModels}
                            setSelectedModels={relations.setSelectedModels}
                        />
                        <div className="flex flex-col gap-3 rounded-[16px] border border-white/8 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-white">No ves el modelo que necesitas?</p>
                                <p className="mt-1 text-sm leading-6 text-zinc-400">Crea el perfil nuevo y luego vuelve para asociarlo a este video.</p>
                            </div>
                            <Link
                                href="/pageClients/models/new"
                                className="primary-action w-full justify-center sm:w-auto"
                            >
                                Añadir nuevo modelo
                            </Link>
                        </div>
                        {relations.errors.models && <p className="text-sm text-rose-300">{relations.errors.models}</p>}
                    </div>

                    <div className="editor-subpanel space-y-4 p-5">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">Tags</p>
                            <p className="text-sm leading-6 text-zinc-400">Agrupa temas y categorias para mejorar navegacion, discovery y filtros.</p>
                        </div>
                        <SelectTag
                            selectedTags={relations.selectedTags}
                            setSelectedTags={relations.setSelectedTags}
                        />
                        {relations.errors.tags && <p className="text-sm text-rose-300">{relations.errors.tags}</p>}
                    </div>

                    <div className="editor-subpanel space-y-4 p-5">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">Galerias relacionadas</p>
                            <p className="text-sm leading-6 text-zinc-400">Conecta el video con galerias existentes para mantener continuidad editorial.</p>
                        </div>
                        <SelectGallery
                            selectedGaleries={relations.selectedGaleries}
                            setSelectedGaleries={relations.setSelectedGaleries}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VideoRelationsSection
