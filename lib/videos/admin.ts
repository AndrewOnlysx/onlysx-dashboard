import { GalleryType, ModelType, TagType } from '@/types/Types'

export const VIDEO_QUALITY_OPTIONS = [
    '4K',
    '1440p',
    '1080p',
    '720p',
    '480p'
] as const

export interface VideoDraftInput {
    title: string
    time: string
    image: string
    video: string
    dump: string
    quality: string
    selectedModels: ModelType[]
    selectedTags: TagType[]
    selectedGaleries: GalleryType[]
    views: number
    lastViews: string
    manualSearchParams: string[]
}

export interface CreateVideoPayload {
    title: string
    time: string
    image: string
    video: string
    dump: string
    quality: string
    models: string[]
    tags: string[]
    galeries: string[]
    views: number
    lastViews: string
    manualSearchParams: string[]
    searchPrarms: string[]
}

const stripAccents = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const normalizeSearchValue = (value: string) =>
    stripAccents(value).trim().toLowerCase()

const explodeIntoTokens = (value: string) =>
    normalizeSearchValue(value)
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length >= 2)

export const buildVideoSearchParams = ({
    title,
    models,
    tags,
    manualSearchParams
}: {
    title: string
    models: Array<Pick<ModelType, '_id' | 'name'>>
    tags: Array<Pick<TagType, '_id' | 'name'>>
    manualSearchParams: string[]
}) => {
    const candidates = [
        normalizeSearchValue(title),
        ...explodeIntoTokens(title),
        ...models.flatMap((model) => [
            normalizeSearchValue(model.name),
            ...explodeIntoTokens(model.name)
        ]),
        ...tags.flatMap((tag) => [
            normalizeSearchValue(tag.name),
            ...explodeIntoTokens(tag.name)
        ]),
        ...manualSearchParams.flatMap((keyword) => [
            normalizeSearchValue(keyword),
            ...explodeIntoTokens(keyword)
        ])
    ]

    return Array.from(new Set(candidates.filter(Boolean)))
}

export const buildCreateVideoPayload = ({
    title,
    time,
    image,
    video,
    dump,
    quality,
    selectedModels,
    selectedTags,
    selectedGaleries,
    views,
    lastViews,
    manualSearchParams
}: VideoDraftInput): CreateVideoPayload => ({
    title: title.trim(),
    time: time.trim(),
    image: image.trim(),
    video: video.trim(),
    dump: dump.trim(),
    quality: quality.trim(),
    models: selectedModels.map((model) => model._id),
    tags: selectedTags.map((tag) => tag._id),
    galeries: selectedGaleries.map((gallery) => gallery._id),
    views,
    lastViews: lastViews.trim(),
    manualSearchParams: manualSearchParams.map((keyword) => keyword.trim()).filter(Boolean),
    searchPrarms: buildVideoSearchParams({
        title,
        models: selectedModels,
        tags: selectedTags,
        manualSearchParams
    })
})

export const parseDurationToSeconds = (value: string) => {
    const normalized = value.trim()

    if (!normalized) {
        return 0
    }

    if (/^\d+$/.test(normalized)) {
        return Number(normalized)
    }

    const parts = normalized
        .split(':')
        .map((part) => Number(part))
        .filter((part) => !Number.isNaN(part))

    if (parts.length === 2) {
        return (parts[0] * 60) + parts[1]
    }

    if (parts.length === 3) {
        return (parts[0] * 3600) + (parts[1] * 60) + parts[2]
    }

    return 0
}

export const formatDurationLabel = (totalSeconds: number) => {
    if (!totalSeconds) {
        return '0s'
    }

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
        return `${hours}h ${minutes}m`
    }

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`
    }

    return `${seconds}s`
}

export const formatDurationClock = (totalSeconds: number) => {
    const safeSeconds = Math.max(0, Math.round(totalSeconds))
    const hours = Math.floor(safeSeconds / 3600)
    const minutes = Math.floor((safeSeconds % 3600) / 60)
    const seconds = safeSeconds % 60

    const paddedMinutes = hours > 0
        ? String(minutes).padStart(2, '0')
        : String(minutes)
    const paddedSeconds = String(seconds).padStart(2, '0')

    if (hours > 0) {
        return `${hours}:${paddedMinutes}:${paddedSeconds}`
    }

    return `${paddedMinutes}:${paddedSeconds}`
}

export const formatCompactNumber = (value: number) =>
    new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(value)
