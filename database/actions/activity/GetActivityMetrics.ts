'use server'

import { Activity } from '@/database/models/Activity'
import { connectDB } from '@/database/utils/mongodb'

import {
    activityMetricsRanges,
    type ActivityDailyPoint,
    type ActivityDepthPoint,
    type ActivityHighlight,
    type ActivityHourlyPoint,
    type ActivityLocationPoint,
    type ActivityMetricsPayload,
    type ActivityMetricsRange,
    type ActivityMetricsSummary,
    type ActivityTopPage
} from './activityMetrics.types'

type PageStatRecord = {
    path?: string
    visits?: number
    activeTimeMs?: number
    firstVisitedAt?: Date | string | null
    lastVisitedAt?: Date | string | null
}

type ActivityRecord = {
    visitorId?: string
    dayKey?: string
    dayStartUtc?: Date | string
    totalActiveTimeMs?: number
    segmentCount?: number
    visitedPages?: string[]
    favoritePages?: string[]
    location?: string
    firstSeenAt?: Date | string | null
    pageStats?: PageStatRecord[]
}

type AggregateOptions = {
    rangeDays: ActivityMetricsRange
    endDate: Date
}

const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 60 * MS_PER_MINUTE
const DEFAULT_RANGE: ActivityMetricsRange = 30

const DAY_FORMATTER = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC'
})

const NUMBER_FORMATTER = new Intl.NumberFormat('es-ES')

const EMPTY_DEPTH_BUCKETS = [
    { label: '1 pagina', records: 0 },
    { label: '2-3 paginas', records: 0 },
    { label: '4-6 paginas', records: 0 },
    { label: '7+ paginas', records: 0 }
] as const

const normalizeRange = (value?: number | string | null): ActivityMetricsRange => {
    const parsedValue = Number(value)

    return activityMetricsRanges.includes(parsedValue as ActivityMetricsRange)
        ? (parsedValue as ActivityMetricsRange)
        : DEFAULT_RANGE
}

const toUtcDayStart = (value: Date) => {
    const utcDate = new Date(value)
    utcDate.setUTCHours(0, 0, 0, 0)
    return utcDate
}

const shiftUtcDays = (value: Date, days: number) => {
    const shiftedDate = new Date(value)
    shiftedDate.setUTCDate(shiftedDate.getUTCDate() + days)
    return shiftedDate
}

const toDate = (value?: Date | string | null) => {
    if (!value) {
        return null
    }

    const parsedDate = value instanceof Date ? value : new Date(value)

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

const formatDayLabel = (value: Date) => {
    return DAY_FORMATTER.format(value).replace('.', '')
}

const formatDayKey = (value: Date) => {
    return value.toISOString().slice(0, 10)
}

const normalizePath = (value?: string) => {
    const normalizedValue = (value ?? '').trim()

    if (!normalizedValue) {
        return '/'
    }

    const withoutQuery = normalizedValue.split('?')[0]?.trim() ?? '/'
    return withoutQuery || '/'
}

const normalizeLocation = (value?: string) => {
    const normalizedValue = (value ?? '').trim()
    return normalizedValue || 'Desconocida'
}

const roundTo = (value: number, digits = 1) => {
    const factor = 10 ** digits
    return Math.round(value * factor) / factor
}

const getDepthBucketLabel = (uniquePages: number) => {
    if (uniquePages <= 1) {
        return '1 pagina'
    }

    if (uniquePages <= 3) {
        return '2-3 paginas'
    }

    if (uniquePages <= 6) {
        return '4-6 paginas'
    }

    return '7+ paginas'
}

const calculateDelta = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) {
        return currentValue === 0 ? 0 : null
    }

    return roundTo(((currentValue - previousValue) / previousValue) * 100)
}

const createEmptySummary = (): ActivityMetricsSummary => ({
    uniqueVisitors: 0,
    activeRecords: 0,
    returningVisitors: 0,
    returningRate: 0,
    totalPageViews: 0,
    trackedPages: 0,
    totalActiveHours: 0,
    averageActiveMinutes: 0,
    averagePagesPerRecord: 0,
    topLocation: null,
    deltas: {
        visitors: 0,
        pageViews: 0,
        activeHours: 0,
        returningRate: 0
    }
})

const createEmptyPayload = (rangeDays: ActivityMetricsRange, endDate: Date): ActivityMetricsPayload => {
    const endDay = toUtcDayStart(endDate)
    const startDay = shiftUtcDays(endDay, -(rangeDays - 1))
    const dailySeries: ActivityDailyPoint[] = []

    for (let dayOffset = 0; dayOffset < rangeDays; dayOffset += 1) {
        const currentDay = shiftUtcDays(startDay, dayOffset)
        dailySeries.push({
            dayKey: formatDayKey(currentDay),
            label: formatDayLabel(currentDay),
            visitors: 0,
            pageViews: 0,
            activeMinutes: 0,
            averagePagesPerRecord: 0
        })
    }

    return {
        rangeDays,
        generatedAt: new Date().toISOString(),
        summary: createEmptySummary(),
        highlights: [],
        dailySeries,
        hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
            hour: `${hour}`.padStart(2, '0'),
            label: `${hour}`.padStart(2, '0'),
            records: 0
        })),
        engagementDepth: EMPTY_DEPTH_BUCKETS.map((bucket) => ({
            label: bucket.label,
            records: 0,
            share: 0
        })),
        topPages: [],
        locationBreakdown: []
    }
}

const summarizeDocuments = (documents: ActivityRecord[]) => {
    const uniqueVisitors = new Map<string, Set<string>>()
    const locations = new Map<string, Set<string>>()
    let totalPageViews = 0
    let totalActiveTimeMs = 0
    let totalUniquePages = 0

    for (const document of documents) {
        const visitorId = document.visitorId?.trim()
        if (!visitorId) {
            continue
        }

        const dayKey = document.dayKey ?? formatDayKey(toDate(document.dayStartUtc) ?? new Date())
        const visitorDays = uniqueVisitors.get(visitorId) ?? new Set<string>()
        visitorDays.add(dayKey)
        uniqueVisitors.set(visitorId, visitorDays)

        const location = normalizeLocation(document.location)
        const locationVisitors = locations.get(location) ?? new Set<string>()
        locationVisitors.add(visitorId)
        locations.set(location, locationVisitors)

        totalActiveTimeMs += document.totalActiveTimeMs ?? 0

        const pageStats = Array.isArray(document.pageStats) ? document.pageStats : []
        const pageViews = pageStats.reduce((total, pageStat) => total + (pageStat.visits ?? 0), 0)
        totalPageViews += pageViews

        const uniquePages = Array.isArray(document.visitedPages) && document.visitedPages.length > 0
            ? new Set(document.visitedPages.map((path) => normalizePath(path))).size
            : new Set(pageStats.map((pageStat) => normalizePath(pageStat.path))).size
        totalUniquePages += uniquePages
    }

    const topLocationEntry = Array.from(locations.entries())
        .sort((left, right) => right[1].size - left[1].size)[0]

    const returningVisitors = Array.from(uniqueVisitors.values())
        .filter((days) => days.size > 1)
        .length

    const uniqueVisitorCount = uniqueVisitors.size
    const activeRecords = documents.length

    return {
        uniqueVisitors: uniqueVisitorCount,
        activeRecords,
        returningVisitors,
        returningRate: uniqueVisitorCount > 0 ? roundTo((returningVisitors / uniqueVisitorCount) * 100) : 0,
        totalPageViews,
        totalActiveHours: roundTo(totalActiveTimeMs / MS_PER_HOUR),
        averageActiveMinutes: activeRecords > 0 ? roundTo(totalActiveTimeMs / activeRecords / MS_PER_MINUTE) : 0,
        averagePagesPerRecord: activeRecords > 0 ? roundTo(totalUniquePages / activeRecords) : 0,
        topLocation: topLocationEntry?.[0] ?? null
    }
}

const aggregateDocuments = (documents: ActivityRecord[], options: AggregateOptions) => {
    const { rangeDays, endDate } = options
    const endDay = toUtcDayStart(endDate)
    const startDay = shiftUtcDays(endDay, -(rangeDays - 1))
    const dailyMap = new Map<string, ActivityDailyPoint>()
    const locationMap = new Map<string, { visitors: Set<string>; activeTimeMs: number }>()
    const pageMap = new Map<string, { visits: number; activeTimeMs: number; visitors: Set<string> }>()
    const depthMap = new Map<string, number>(EMPTY_DEPTH_BUCKETS.map((bucket) => [bucket.label, 0]))
    const hourlyMap = new Map<string, number>()

    for (let dayOffset = 0; dayOffset < rangeDays; dayOffset += 1) {
        const currentDay = shiftUtcDays(startDay, dayOffset)
        const dayKey = formatDayKey(currentDay)
        dailyMap.set(dayKey, {
            dayKey,
            label: formatDayLabel(currentDay),
            visitors: 0,
            pageViews: 0,
            activeMinutes: 0,
            averagePagesPerRecord: 0
        })
    }

    const dailyPageDepthAccumulator = new Map<string, number>()
    const summaryBase = summarizeDocuments(documents)

    for (const document of documents) {
        const visitorId = document.visitorId?.trim()
        if (!visitorId) {
            continue
        }

        const dayDate = toDate(document.dayStartUtc)
        if (!dayDate) {
            continue
        }

        const dayKey = document.dayKey ?? formatDayKey(dayDate)
        const dayEntry = dailyMap.get(dayKey)
        if (!dayEntry) {
            continue
        }

        const pageStats = Array.isArray(document.pageStats) ? document.pageStats : []
        const pageViews = pageStats.reduce((total, pageStat) => total + (pageStat.visits ?? 0), 0)
        const activeTimeMs = document.totalActiveTimeMs ?? 0
        const uniquePages = Array.isArray(document.visitedPages) && document.visitedPages.length > 0
            ? new Set(document.visitedPages.map((path) => normalizePath(path))).size
            : new Set(pageStats.map((pageStat) => normalizePath(pageStat.path))).size

        dayEntry.visitors += 1
        dayEntry.pageViews += pageViews
        dayEntry.activeMinutes = roundTo(dayEntry.activeMinutes + activeTimeMs / MS_PER_MINUTE)
        dailyPageDepthAccumulator.set(dayKey, (dailyPageDepthAccumulator.get(dayKey) ?? 0) + uniquePages)

        const location = normalizeLocation(document.location)
        const locationEntry = locationMap.get(location) ?? { visitors: new Set<string>(), activeTimeMs: 0 }
        locationEntry.visitors.add(visitorId)
        locationEntry.activeTimeMs += activeTimeMs
        locationMap.set(location, locationEntry)

        for (const pageStat of pageStats) {
            const pagePath = normalizePath(pageStat.path)
            const pageEntry = pageMap.get(pagePath) ?? { visits: 0, activeTimeMs: 0, visitors: new Set<string>() }
            pageEntry.visits += pageStat.visits ?? 0
            pageEntry.activeTimeMs += pageStat.activeTimeMs ?? 0
            pageEntry.visitors.add(visitorId)
            pageMap.set(pagePath, pageEntry)
        }

        const depthBucket = getDepthBucketLabel(uniquePages)
        depthMap.set(depthBucket, (depthMap.get(depthBucket) ?? 0) + 1)

        const firstSeenAt = toDate(document.firstSeenAt)
        if (firstSeenAt) {
            const hourLabel = `${firstSeenAt.getUTCHours()}`.padStart(2, '0')
            hourlyMap.set(hourLabel, (hourlyMap.get(hourLabel) ?? 0) + 1)
        }
    }

    const dailySeries = Array.from(dailyMap.values()).map((entry) => ({
        ...entry,
        averagePagesPerRecord: entry.visitors > 0
            ? roundTo((dailyPageDepthAccumulator.get(entry.dayKey) ?? 0) / entry.visitors)
            : 0
    }))

    const topPages: ActivityTopPage[] = Array.from(pageMap.entries())
        .map(([path, entry]) => ({
            path,
            visits: entry.visits,
            activeMinutes: roundTo(entry.activeTimeMs / MS_PER_MINUTE),
            uniqueVisitors: entry.visitors.size,
            share: summaryBase.totalPageViews > 0 ? roundTo((entry.visits / summaryBase.totalPageViews) * 100) : 0
        }))
        .sort((left, right) => {
            if (right.visits !== left.visits) {
                return right.visits - left.visits
            }

            return right.activeMinutes - left.activeMinutes
        })
        .slice(0, 6)

    const locationBreakdown: ActivityLocationPoint[] = Array.from(locationMap.entries())
        .map(([location, entry]) => ({
            location,
            visitors: entry.visitors.size,
            activeHours: roundTo(entry.activeTimeMs / MS_PER_HOUR),
            share: summaryBase.uniqueVisitors > 0 ? roundTo((entry.visitors.size / summaryBase.uniqueVisitors) * 100) : 0
        }))
        .sort((left, right) => right.visitors - left.visitors)
        .slice(0, 5)

    const hourlyDistribution: ActivityHourlyPoint[] = Array.from({ length: 24 }, (_, hour) => {
        const hourKey = `${hour}`.padStart(2, '0')

        return {
            hour: hourKey,
            label: hourKey,
            records: hourlyMap.get(hourKey) ?? 0
        }
    })

    const engagementDepth: ActivityDepthPoint[] = EMPTY_DEPTH_BUCKETS.map((bucket) => {
        const records = depthMap.get(bucket.label) ?? 0

        return {
            label: bucket.label,
            records,
            share: summaryBase.activeRecords > 0 ? roundTo((records / summaryBase.activeRecords) * 100) : 0
        }
    })

    return {
        summary: {
            ...createEmptySummary(),
            ...summaryBase,
            trackedPages: pageMap.size,
            deltas: createEmptySummary().deltas
        },
        dailySeries,
        topPages,
        locationBreakdown,
        hourlyDistribution,
        engagementDepth
    }
}

const buildHighlights = (payload: Omit<ActivityMetricsPayload, 'highlights' | 'generatedAt'>): ActivityHighlight[] => {
    const strongestDay = [...payload.dailySeries].sort((left, right) => right.pageViews - left.pageViews)[0]
    const topPage = payload.topPages[0]
    const activeHour = [...payload.hourlyDistribution].sort((left, right) => right.records - left.records)[0]

    const highlights: ActivityHighlight[] = []

    if (strongestDay) {
        highlights.push({
            title: 'Pico diario',
            value: `${strongestDay.label}`,
            description: `${NUMBER_FORMATTER.format(strongestDay.pageViews)} pageviews y ${NUMBER_FORMATTER.format(strongestDay.visitors)} visitantes en la jornada mas fuerte.`,
            tone: 'accent'
        })
    }

    if (topPage) {
        highlights.push({
            title: 'Ruta dominante',
            value: topPage.path,
            description: `${NUMBER_FORMATTER.format(topPage.visits)} visitas y ${topPage.share}% del trafico del periodo.`,
            tone: 'success'
        })
    }

    if (activeHour) {
        highlights.push({
            title: 'Hora de arranque',
            value: `${activeHour.label}:00 UTC`,
            description: `${NUMBER_FORMATTER.format(activeHour.records)} registros arrancaron en esta franja.`,
            tone: 'warning'
        })
    }

    return highlights
}

export const resolveActivityMetricsRange = normalizeRange

export const GetActivityMetrics = async (days?: number | string | null) => {
    const rangeDays = normalizeRange(days)
    const now = new Date()
    const currentRangeEnd = toUtcDayStart(now)
    const currentRangeStart = shiftUtcDays(currentRangeEnd, -(rangeDays - 1))
    const previousRangeStart = shiftUtcDays(currentRangeStart, -rangeDays)

    try {
        await connectDB()

        const records = await Activity.find({
            dayStartUtc: { $gte: previousRangeStart }
        })
            .select('visitorId dayKey dayStartUtc totalActiveTimeMs segmentCount visitedPages favoritePages location firstSeenAt pageStats')
            .sort({ dayStartUtc: 1 })
            .lean<ActivityRecord[]>()

        const currentDocuments = records.filter((record) => {
            const dayStartUtc = toDate(record.dayStartUtc)
            return Boolean(dayStartUtc && dayStartUtc >= currentRangeStart)
        })
        const previousDocuments = records.filter((record) => {
            const dayStartUtc = toDate(record.dayStartUtc)
            return Boolean(dayStartUtc && dayStartUtc >= previousRangeStart && dayStartUtc < currentRangeStart)
        })

        if (currentDocuments.length === 0) {
            return {
                ok: true,
                data: createEmptyPayload(rangeDays, now),
                message: 'No activity data available'
            }
        }

        const currentAggregation = aggregateDocuments(currentDocuments, {
            rangeDays,
            endDate: now
        })
        const previousSummary = summarizeDocuments(previousDocuments)

        const payloadWithoutHighlights = {
            rangeDays,
            generatedAt: new Date().toISOString(),
            summary: {
                ...currentAggregation.summary,
                deltas: {
                    visitors: calculateDelta(currentAggregation.summary.uniqueVisitors, previousSummary.uniqueVisitors),
                    pageViews: calculateDelta(currentAggregation.summary.totalPageViews, previousSummary.totalPageViews),
                    activeHours: calculateDelta(currentAggregation.summary.totalActiveHours, previousSummary.totalActiveHours),
                    returningRate: calculateDelta(currentAggregation.summary.returningRate, previousSummary.returningRate)
                }
            },
            dailySeries: currentAggregation.dailySeries,
            hourlyDistribution: currentAggregation.hourlyDistribution,
            engagementDepth: currentAggregation.engagementDepth,
            topPages: currentAggregation.topPages,
            locationBreakdown: currentAggregation.locationBreakdown
        }

        const data: ActivityMetricsPayload = {
            ...payloadWithoutHighlights,
            highlights: buildHighlights(payloadWithoutHighlights)
        }

        return {
            ok: true,
            data,
            message: 'Activity metrics fetched successfully'
        }
    } catch (error) {
        console.error('Error in GetActivityMetrics:', error)

        return {
            ok: false,
            data: createEmptyPayload(rangeDays, now),
            message: 'Error fetching activity metrics'
        }
    }
}