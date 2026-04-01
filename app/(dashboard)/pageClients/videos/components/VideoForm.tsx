'use client'

import { cn } from '@/lib/utils'
import { VideoType } from '@/types/Types'

import VideoBasicInfoSection from './videoForm/VideoBasicInfoSection'
import VideoDiscoverabilitySection from './videoForm/VideoDiscoverabilitySection'
import VideoAssetsSection from './videoForm/VideoAssetsSection'
import { VideoFormMode } from './videoForm/formConfig'
import VideoFormHeader from './videoForm/VideoFormHeader'
import VideoPreviewSidebar from './videoForm/VideoPreviewSidebar'
import VideoRelationsSection from './videoForm/VideoRelationsSection'
import { useVideoForm } from './videoForm/useVideoForm'
import {
    videoFormBodyTextClassName,
    videoFormInsetClassName,
    videoFormLabelClassName,
    videoFormPrimaryActionClassName,
    videoFormSecondaryActionClassName,
    videoFormSurfaceClassName
} from './videoForm/videoFormUi'

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
    const readyAssets = [
        Boolean(form.preview.activeCoverRemoteUrl),
        Boolean(form.preview.uploadedVideoUrl)
    ].filter(Boolean).length

    return (
        <div className="grid gap-6 text-white xl:grid-cols-[minmax(0,1.28fr)_360px] 2xl:grid-cols-[minmax(0,1.35fr)_500px]">
            <div className="space-y-5">
                <VideoFormHeader
                    mode={mode}
                    videoTitle={initialVideo?.title}
                    onReset={form.actions.resetForm}
                    readyAssets={readyAssets}
                    completedChecklist={form.preview.completedChecklist}
                    checklistTotal={form.preview.checklist.length}
                    isUploadingAssets={form.preview.isUploadingAssets}
                />

                <div className="space-y-5">
                    <VideoBasicInfoSection basicInfo={form.basicInfo} />
                    <VideoAssetsSection assets={form.assets} />

                    <VideoRelationsSection relations={form.relations} />
                    <VideoDiscoverabilitySection discoverability={form.discoverability} />

                    <section>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                            <button
                                type="button"
                                onClick={form.actions.resetForm}
                                className={videoFormSecondaryActionClassName}
                            >
                                {isEdit ? 'Restaurar cambios' : 'Limpiar formulario'}
                            </button>
                            <button
                                type="button"
                                disabled={form.actions.isSubmitting}
                                onClick={form.actions.handleSubmit}
                                className={`${videoFormPrimaryActionClassName} min-w-[220px]`}
                            >
                                {form.actions.isSubmitting
                                    ? isEdit ? 'Actualizando video...' : 'Guardando video...'
                                    : isEdit ? 'Actualizar video' : 'Guardar video'}
                            </button>
                        </div>
                    </section>

                    {form.actions.submitMessage && (
                        <div
                            className={cn(
                                videoFormInsetClassName,
                                'text-sm',
                                form.actions.submitStatus === 'error'
                                    ? 'border-[#6d3036] bg-[#261215] text-[#ff9ca4]'
                                    : 'border-[#475c26] bg-[#171f0f] text-[#d4ff59]'
                            )}
                        >
                            {form.actions.submitMessage}
                        </div>
                    )}
                </div>
            </div>

            <VideoPreviewSidebar preview={form.preview} />
        </div>
    )
}

export default VideoForm
