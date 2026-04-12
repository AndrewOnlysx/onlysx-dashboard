export const activityMetricsRanges = [7, 14, 30, 90] as const

export type ActivityMetricsRange = (typeof activityMetricsRanges)[number]

export type ActivityInsightTone = 'accent' | 'success' | 'warning' | 'danger'

export interface ActivitySummaryDelta {
    visitors: number | null
    pageViews: number | null
    activeHours: number | null
    returningRate: number | null
}

export interface ActivityMetricsSummary {
    uniqueVisitors: number
    activeRecords: number
    returningVisitors: number
    returningRate: number
    totalPageViews: number
    trackedPages: number
    totalActiveHours: number
    averageActiveMinutes: number
    averagePagesPerRecord: number
    topLocation: string | null
    deltas: ActivitySummaryDelta
}

export interface ActivityDailyPoint {
    dayKey: string
    label: string
    visitors: number
    pageViews: number
    activeMinutes: number
    averagePagesPerRecord: number
}

export interface ActivityTopPage {
    path: string
    visits: number
    activeMinutes: number
    uniqueVisitors: number
    share: number
}

export interface ActivityLocationPoint {
    location: string
    visitors: number
    activeHours: number
    share: number
}

export interface ActivityHourlyPoint {
    hour: string
    label: string
    records: number
}

export interface ActivityDepthPoint {
    label: string
    records: number
    share: number
}

export interface ActivityHighlight {
    title: string
    value: string
    description: string
    tone: ActivityInsightTone
}

export interface ActivityMetricsPayload {
    rangeDays: ActivityMetricsRange
    generatedAt: string
    summary: ActivityMetricsSummary
    highlights: ActivityHighlight[]
    dailySeries: ActivityDailyPoint[]
    hourlyDistribution: ActivityHourlyPoint[]
    engagementDepth: ActivityDepthPoint[]
    topPages: ActivityTopPage[]
    locationBreakdown: ActivityLocationPoint[]
}