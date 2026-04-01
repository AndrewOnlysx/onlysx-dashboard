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
    const readyAssets = [
        Boolean(form.preview.activeCoverRemoteUrl),
        Boolean(form.preview.uploadedVideoUrl)
    ].filter(Boolean).length

    return (
        <div className="space-y-8 text-white">
            <VideoFormHeader
                mode={mode}
                videoTitle={initialVideo?.title}
                onReset={form.actions.resetForm}
                readyAssets={readyAssets}
                completedChecklist={form.preview.completedChecklist}
                checklistTotal={form.preview.checklist.length}
                isUploadingAssets={form.preview.isUploadingAssets}
            />

            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_380px]">
                <div className="space-y-6">
                    <VideoBasicInfoSection basicInfo={form.basicInfo} />
                    <VideoAssetsSection assets={form.assets} />

                    <div className="grid gap-6 2xl:grid-cols-2">
                        <VideoRelationsSection relations={form.relations} />
                        <VideoDiscoverabilitySection discoverability={form.discoverability} />
                    </div>

                    <section className="surface-panel editor-panel p-5 sm:p-6">
                        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <span className="editor-kicker">Publicacion</span>
                                    <p className="pt-3 text-lg font-semibold text-white">
                                        {isEdit ? 'Listo para actualizar' : 'Listo para guardar'}
                                    </p>
                                    <p className="max-w-2xl text-sm leading-6 text-zinc-400">
                                        {isEdit
                                            ? 'Si no cambias los assets, se conservan las URLs remotas actuales. Si subes nuevos archivos, se usaran esos reemplazos.'
                                            : 'Los assets se suben al seleccionarlos. Este paso solo persiste en base de datos las URLs remotas ya resueltas.'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <div className="editor-metric min-w-[150px] p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Assets remotos</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">{readyAssets}/2</p>
                                    </div>
                                    <div className="editor-metric min-w-[150px] p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Checklist</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">
                                            {form.preview.completedChecklist}/{form.preview.checklist.length}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={form.actions.isSubmitting}
                                onClick={form.actions.handleSubmit}
                                className="primary-action min-w-[220px] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {form.actions.isSubmitting
                                    ? isEdit ? 'Actualizando video...' : 'Guardando video...'
                                    : isEdit ? 'Actualizar video' : 'Guardar video'}
                            </button>
                        </div>
                    </section>

                    {form.actions.submitMessage && (
                        <div
                            className={`rounded-[18px] p-4 text-sm ${form.actions.submitStatus === 'error'
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
