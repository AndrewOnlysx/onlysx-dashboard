'use client'
import VideoBasicInfoSection from './videoForm/VideoBasicInfoSection'
import VideoDiscoverabilitySection from './videoForm/VideoDiscoverabilitySection'
import VideoAssetsSection from './videoForm/VideoAssetsSection'
import VideoFormHeader from './videoForm/VideoFormHeader'
import VideoPreviewSidebar from './videoForm/VideoPreviewSidebar'
import VideoRelationsSection from './videoForm/VideoRelationsSection'
import { useVideoForm } from './videoForm/useVideoForm'

const VideoForm = () => {
    const form = useVideoForm()

    return (
        <div className="space-y-8 text-white">
            <VideoFormHeader onReset={form.actions.resetForm} />

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
                            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-400"
                        >
                            {form.actions.isSubmitting ? 'Preparando payload...' : 'Guardar video (console.log)'}
                        </button>
                        <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                            Los archivos ya se suben al seleccionar. El submit actual todavia solo imprime el payload normalizado y los metadatos.
                        </span>
                    </section>
                </div>

                <VideoPreviewSidebar preview={form.preview} />
            </div>
        </div>
    )
}

export default VideoForm
