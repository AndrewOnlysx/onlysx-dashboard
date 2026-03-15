'use client'

import { VideoType } from '@/types/Types'

import VideoBasicInfoSection from './videoForm/VideoBasicInfoSection'
import VideoDiscoverabilitySection from './videoForm/VideoDiscoverabilitySection'
import VideoAssetsSection from './videoForm/VideoAssetsSection'
import { VideoFormMode } from './videoForm/formConfig'
import VideoFormHeader from './videoForm/VideoFormHeader'
import VideoPreviewSidebar from './videoForm/VideoPreviewSidebar'
import VideoRelationsSection from './videoForm/VideoRelationsSection'
import { useVideoForm } from './videoForm/useVideoForm'

interface Props {
    mode?: VideoFormMode
    initialVideo?: VideoType | null
}

const VideoForm = ({
    mode = 'create',
    initialVideo
}: Props) => {
    const form = useVideoForm({
        mode,
        initialVideo
    })
    const isEdit = mode === 'edit'

    return (
        <div className="space-y-8 text-white">
            <VideoFormHeader
                mode={mode}
                videoTitle={initialVideo?.title}
                onReset={form.actions.resetForm}
            />

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.8fr)_380px]">
                <div className="space-y-6">
                    <VideoBasicInfoSection basicInfo={form.basicInfo} />
                    <VideoAssetsSection assets={form.assets} />
                    <VideoRelationsSection relations={form.relations} />
                    <VideoDiscoverabilitySection discoverability={form.discoverability} />

                    <section className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            disabled={form.actions.isSubmitting}
                            onClick={form.actions.handleSubmit}
                            className="primary-action disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {form.actions.isSubmitting
                                ? isEdit ? 'Actualizando video...' : 'Guardando video...'
                                : isEdit ? 'Actualizar video' : 'Guardar video'}
                        </button>
                        <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                            {isEdit
                                ? 'Si no cambias los assets, se reutilizan las URLs remotas actuales. Si subes nuevos archivos, el update usa esas nuevas URLs.'
                                : 'Los assets se suben al seleccionar. Este boton persiste el video en la base de datos usando las URLs remotas ya cargadas.'}
                        </span>
                    </section>

                    {form.actions.submitMessage && (
                        <div
                            className={`rounded-[24px] p-4 text-sm ${form.actions.submitStatus === 'error'
                                ? 'border border-rose-400/20 bg-rose-400/10 text-rose-100'
                                : 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                                }`}
                        >
                            {form.actions.submitMessage}
                        </div>
                    )}
                </div>

                <VideoPreviewSidebar preview={form.preview} />
            </div>
        </div>
    )
}

export default VideoForm
