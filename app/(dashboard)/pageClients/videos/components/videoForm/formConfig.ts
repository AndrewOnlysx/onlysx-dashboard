import { VIDEO_QUALITY_OPTIONS, buildVideoSearchParams, parseDurationToSeconds } from '@/lib/videos/admin'
import { GalleryType, ModelType, TagType, VideoType } from '@/types/Types'

export type VideoFormMode = 'create' | 'edit'

export interface VideoFormInitialState {
    videoId: string | null
    title: string
    time: string
    persistedCoverUrl: string
    persistedVideoUrl: string
    persistedDumpUrl: string
    videoDurationSeconds: number
    qualityPreset: (typeof VIDEO_QUALITY_OPTIONS)[number] | 'custom'
    customQuality: string
    views: number
    lastViews: string
    selectedModels: ModelType[]
    selectedTags: TagType[]
    selectedGaleries: GalleryType[]
    manualSearchParams: string[]
}

const getModels = (video?: VideoType | null) =>
    (video?.models ?? []).filter((model): model is ModelType => typeof model !== 'string')

const getTags = (video?: VideoType | null) =>
    (video?.tags ?? []).filter((tag): tag is TagType => typeof tag !== 'string')

const getGaleries = (video?: VideoType | null) =>
    (video?.galeries ?? []).filter((gallery): gallery is GalleryType => typeof gallery !== 'string')

const deriveManualSearchParams = ({
    title,
    models,
    tags,
    searchPrarms
}: {
    title: string
    models: ModelType[]
    tags: TagType[]
    searchPrarms: string[]
}) => {
    const generatedTerms = new Set(
        buildVideoSearchParams({
            title,
            models,
            tags,
            manualSearchParams: []
        })
    )

    return searchPrarms.filter((keyword) => {
        const normalizedKeyword = keyword.trim().toLowerCase()
        return Boolean(normalizedKeyword) && !generatedTerms.has(normalizedKeyword)
    })
}

export const createVideoFormInitialState = ({
    mode,
    initialVideo
}: {
    mode: VideoFormMode
    initialVideo?: VideoType | null
}): VideoFormInitialState => {
    if (mode === 'edit' && initialVideo) {
        const selectedModels = getModels(initialVideo)
        const selectedTags = getTags(initialVideo)
        const selectedGaleries = getGaleries(initialVideo)
        const quality = initialVideo.quality?.trim() ?? ''
        const hasPresetQuality = VIDEO_QUALITY_OPTIONS.includes(
            quality as (typeof VIDEO_QUALITY_OPTIONS)[number]
        )

        return {
            videoId: initialVideo._id,
            title: initialVideo.title ?? '',
            time: initialVideo.time ?? '',
            persistedCoverUrl: initialVideo.image ?? '',
            persistedVideoUrl: initialVideo.video ?? '',
            persistedDumpUrl: initialVideo.dump ?? initialVideo.video ?? '',
            videoDurationSeconds: parseDurationToSeconds(initialVideo.time ?? ''),
            qualityPreset: hasPresetQuality
                ? (quality as (typeof VIDEO_QUALITY_OPTIONS)[number])
                : 'custom',
            customQuality: hasPresetQuality ? '' : quality,
            views: initialVideo.views ?? 0,
            lastViews: initialVideo.lastViews ?? '',
            selectedModels,
            selectedTags,
            selectedGaleries,
            manualSearchParams: deriveManualSearchParams({
                title: initialVideo.title ?? '',
                models: selectedModels,
                tags: selectedTags,
                searchPrarms: initialVideo.searchPrarms ?? []
            })
        }
    }

    return {
        videoId: null,
        title: '',
        time: '',
        persistedCoverUrl: '',
        persistedVideoUrl: '',
        persistedDumpUrl: '',
        videoDurationSeconds: 0,
        qualityPreset: '1080p',
        customQuality: '',
        views: 0,
        lastViews: '',
        selectedModels: [],
        selectedTags: [],
        selectedGaleries: [],
        manualSearchParams: []
    }
}
