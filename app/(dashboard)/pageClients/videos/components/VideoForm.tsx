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
        <div className="space-y-6 text-white">
            <VideoFormHeader
                mode={mode}
                videoTitle={initialVideo?.title}
                onReset={form.actions.resetForm}
            />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_360px]">
                <div className="space-y-5">
                    <VideoBasicInfoSection basicInfo={form.basicInfo} />
                    <VideoAssetsSection assets={form.assets} />
                    <VideoRelationsSection relations={form.relations} />
                    <VideoDiscoverabilitySection discoverability={form.discoverability} />

                    <section className="surface-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-white">
                                {isEdit ? 'Listo para actualizar' : 'Listo para guardar'}
                            </p>
                            <p className="max-w-2xl text-sm leading-6 text-zinc-400">
                                {isEdit
                                    ? 'Si no cambias los assets, se conservan las URLs remotas actuales. Si subes nuevos archivos, se usan esos reemplazos.'
                                    : 'Los assets se suben al seleccionarlos. Este paso solo persiste en base de datos las URLs remotas ya resueltas.'}
                            </p>
                        </div>

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
                    </section>

                    {form.actions.submitMessage && (
                        <div
                            className={`rounded-[16px] p-4 text-sm ${form.actions.submitStatus === 'error'
                                ? 'border border-rose-400/20 bg-rose-400/8 text-rose-100'
                                : 'border border-emerald-400/20 bg-emerald-400/8 text-emerald-100'
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
