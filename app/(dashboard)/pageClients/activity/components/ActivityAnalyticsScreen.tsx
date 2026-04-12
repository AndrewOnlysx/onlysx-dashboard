'use client'

import { useEffect, useRef, useState, useTransition, type ReactNode } from 'react'
import { BarChart, LineChart, PieChart } from '@mui/x-charts'

import { cn } from '@/lib/utils'
import {
    getVideoFormBadgeClassName,
    videoFormBodyTextClassName,
    videoFormLabelClassName,
    videoFormMetricClassName,
    videoFormMutedTextClassName,
    videoFormPrimaryActionClassName,
    videoFormSecondaryActionClassName,
    videoFormSurfaceClassName
} from '@/app/(dashboard)/pageClients/videos/components/videoForm/videoFormUi'
import {
    activityMetricsRanges,
    type ActivityInsightTone,
    type ActivityMetricsPayload,
    type ActivityMetricsRange
} from '@/database/actions/activity/activityMetrics.types'

interface Props {
    initialMetrics: ActivityMetricsPayload
}

const chartSx = {
    '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
        stroke: '#303640'
    },
    '& .MuiChartsAxis-tickLabel, & .MuiChartsLegend-label': {
        fill: '#8f97a8',
        fontSize: 11
    },
    '& .MuiChartsGrid-line': {
        stroke: 'rgba(255,255,255,0.08)',
        strokeDasharray: '4 6'
    }
} as const

const deltaToneMap: Record<'up' | 'down', ActivityInsightTone> = {
    up: 'success',
    down: 'danger'
}

const numberFormatter = new Intl.NumberFormat('es-ES')

const formatDelta = (value: number | null) => {
    if (value === null) {
        return 'Sin base previa'
    }

    if (value === 0) {
        return 'Sin cambio'
    }

    const signal = value > 0 ? '+' : ''
    return `${signal}${value}% vs periodo previo`
}

const getDeltaDirection = (value: number | null) => {
    if (value === null || value === 0) {
        return 'flat'
    }

    return value > 0 ? 'up' : 'down'
}

const getToneLabel = (tone: ActivityInsightTone | 'neutral') => {
    if (tone === 'success') {
        return 'sube'
    }

    if (tone === 'danger') {
        return 'baja'
    }

    if (tone === 'warning') {
        return 'alerta'
    }

    if (tone === 'accent') {
        return 'clave'
    }

    return 'estable'
}

const formatHours = (value: number) => `${numberFormatter.format(value)} h`

const formatMinutes = (value: number) => `${numberFormatter.format(value)} min`

const formatPercentage = (value: number) => `${numberFormatter.format(value)}%`

const formatCompactNumber = (value: number) => numberFormatter.format(value)

const useChartWidth = () => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const node = ref.current
        if (!node) {
            return undefined
        }

        const observer = new ResizeObserver(([entry]) => {
            setWidth(Math.max(260, Math.floor(entry.contentRect.width) - 8))
        })

        observer.observe(node)
        setWidth(Math.max(260, Math.floor(node.getBoundingClientRect().width) - 8))

        return () => {
            observer.disconnect()
        }
    }, [])

    return { ref, width }
}

const ChartCard = ({
    title,
    description,
    children,
    className
}: {
    title: string
    description: string
    className?: string
    children: (width: number) => ReactNode
}) => {
    const { ref, width } = useChartWidth()

    return (
        <section className={cn(videoFormSurfaceClassName, 'h-full p-5', className)}>
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className={videoFormLabelClassName}>{title}</p>
                    <p className={cn(videoFormBodyTextClassName, 'mt-2 max-w-2xl')}>{description}</p>
                </div>
            </div>

            <div ref={ref} className="min-h-[280px]">
                {width > 0 ? children(width) : null}
            </div>
        </section>
    )
}

const SummaryCard = ({
    label,
    value,
    helper,
    tone = 'neutral'
}: {
    label: string
    value: string
    helper: string
    tone?: ActivityInsightTone | 'neutral'
}) => {
    return (
        <article className={cn(videoFormMetricClassName, 'space-y-3')}>
            <p className={videoFormLabelClassName}>{label}</p>
            <p className="text-[30px] font-semibold tracking-[-0.04em] text-white">{value}</p>
            <div className="flex items-center justify-between gap-3">
                <p className={videoFormMutedTextClassName}>{helper}</p>
                <span className={getVideoFormBadgeClassName(tone === 'neutral' ? undefined : tone)}>
                    {getToneLabel(tone)}
                </span>
            </div>
        </article>
    )
}

const ActivityAnalyticsScreen = ({ initialMetrics }: Props) => {
    const [metrics, setMetrics] = useState(initialMetrics)
    const [selectedRange, setSelectedRange] = useState<ActivityMetricsRange>(initialMetrics.rangeDays)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleRangeChange = (nextRange: ActivityMetricsRange) => {
        if (nextRange === selectedRange || isPending) {
            return
        }

        setLoadError(null)

        startTransition(() => {
            void (async () => {
                try {
                    const response = await fetch(`/api/activity/metrics?days=${nextRange}`, {
                        cache: 'no-store'
                    })
                    const result = await response.json()

                    if (!response.ok || !result.ok) {
                        throw new Error(result.message ?? 'No se pudieron cargar las metricas')
                    }

                    setMetrics(result.data)
                    setSelectedRange(result.data.rangeDays)
                } catch (error) {
                    setLoadError(error instanceof Error ? error.message : 'No se pudieron cargar las metricas')
                }
            })()
        })
    }

    const summaryCards = [
        {
            label: 'Visitantes unicos',
            value: formatCompactNumber(metrics.summary.uniqueVisitors),
            helper: formatDelta(metrics.summary.deltas.visitors),
            tone: getDeltaDirection(metrics.summary.deltas.visitors) === 'flat'
                ? 'neutral'
                : deltaToneMap[getDeltaDirection(metrics.summary.deltas.visitors)]
        },
        {
            label: 'Pageviews',
            value: formatCompactNumber(metrics.summary.totalPageViews),
            helper: `${formatCompactNumber(metrics.summary.trackedPages)} rutas rastreadas`,
            tone: getDeltaDirection(metrics.summary.deltas.pageViews) === 'flat'
                ? 'neutral'
                : deltaToneMap[getDeltaDirection(metrics.summary.deltas.pageViews)]
        },
        {
            label: 'Tiempo activo',
            value: formatHours(metrics.summary.totalActiveHours),
            helper: formatDelta(metrics.summary.deltas.activeHours),
            tone: getDeltaDirection(metrics.summary.deltas.activeHours) === 'flat'
                ? 'neutral'
                : deltaToneMap[getDeltaDirection(metrics.summary.deltas.activeHours)]
        },
        {
            label: 'Retorno',
            value: formatPercentage(metrics.summary.returningRate),
            helper: `${formatCompactNumber(metrics.summary.returningVisitors)} visitantes volvieron al menos 2 dias`,
            tone: getDeltaDirection(metrics.summary.deltas.returningRate) === 'flat'
                ? 'neutral'
                : deltaToneMap[getDeltaDirection(metrics.summary.deltas.returningRate)]
        }
    ]

    return (
        <div className="space-y-6 text-white">
            <section className={cn(videoFormSurfaceClassName, 'editor-panel overflow-hidden p-6')}>
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div className="space-y-4">
                        <span className="editor-kicker">Activity intelligence</span>
                        <div>
                            <h2 className="text-[34px] font-semibold tracking-[-0.05em] text-white">Lectura accionable del trafico real</h2>
                            <p className={cn(videoFormBodyTextClassName, 'mt-3 max-w-3xl')}>
                                Esta vista resume comportamiento real por visitante, rutas con mas peso, retencion y momentos de mayor actividad.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {activityMetricsRanges.map((range) => {
                            const isActive = range === selectedRange

                            return (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => handleRangeChange(range)}
                                    disabled={isPending}
                                    className={cn(
                                        isActive ? videoFormPrimaryActionClassName : videoFormSecondaryActionClassName,
                                        'min-w-[88px]'
                                    )}
                                >
                                    {range} dias
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-4">
                    {summaryCards.map((card) => (
                        <SummaryCard
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            helper={card.helper}
                            tone={card.tone}
                        />
                    ))}
                </div>

                {loadError && (
                    <div className="mt-4 rounded-[6px] border border-[#6d3036] bg-[#261215] px-4 py-3 text-sm text-[#ff9ca4]">
                        {loadError}
                    </div>
                )}
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
                <ChartCard
                    title="Tendencia diaria"
                    description="Cruza visitantes y pageviews para detectar volumen real frente a profundidad de consumo."
                >
                    {(width) => (
                        <LineChart
                            width={width}
                            height={300}
                            xAxis={[{
                                scaleType: 'point',
                                data: metrics.dailySeries.map((point) => point.label)
                            }]}
                            series={[
                                {
                                    data: metrics.dailySeries.map((point) => point.visitors),
                                    label: 'Visitantes',
                                    color: '#ff50a4',
                                    showMark: false,
                                    curve: 'monotoneX'
                                },
                                {
                                    data: metrics.dailySeries.map((point) => point.pageViews),
                                    label: 'Pageviews',
                                    color: '#ff89c1',
                                    showMark: false,
                                    curve: 'monotoneX'
                                }
                            ]}
                            grid={{ vertical: false, horizontal: true }}
                            margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                            sx={chartSx}
                        />
                    )}
                </ChartCard>

                <section className={cn(videoFormSurfaceClassName, 'h-full p-5')}>
                    <p className={videoFormLabelClassName}>Lecturas clave</p>
                    <div className="mt-4 space-y-4">
                        {metrics.highlights.map((highlight) => (
                            <article key={highlight.title} className="editor-subpanel rounded-[12px] p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-white">{highlight.title}</p>
                                        <p className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-white">{highlight.value}</p>
                                    </div>
                                    <span className={getVideoFormBadgeClassName(highlight.tone)}>{getToneLabel(highlight.tone)}</span>
                                </div>
                                <p className={cn(videoFormMutedTextClassName, 'mt-3')}>{highlight.description}</p>
                            </article>
                        ))}

                        <article className="editor-subpanel rounded-[12px] p-4">
                            <p className="text-sm font-semibold text-white">Promedio por registro</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[10px] border border-white/8 bg-white/[0.03] p-3">
                                    <p className={videoFormMutedTextClassName}>Tiempo activo</p>
                                    <p className="mt-1 text-xl font-semibold text-white">{formatMinutes(metrics.summary.averageActiveMinutes)}</p>
                                </div>
                                <div className="rounded-[10px] border border-white/8 bg-white/[0.03] p-3">
                                    <p className={videoFormMutedTextClassName}>Profundidad</p>
                                    <p className="mt-1 text-xl font-semibold text-white">{metrics.summary.averagePagesPerRecord} paginas</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <ChartCard
                    title="Actividad por hora"
                    description="Muestra en que franja UTC empiezan mas recorridos. Sirve para saber cuando revisar contenido, incidencias o drops."
                >
                    {(width) => (
                        <BarChart
                            width={width}
                            height={300}
                            xAxis={[{
                                scaleType: 'band',
                                data: metrics.hourlyDistribution.map((point) => point.label)
                            }]}
                            series={[{
                                data: metrics.hourlyDistribution.map((point) => point.records),
                                label: 'Registros',
                                color: '#e5a94d'
                            }]}
                            grid={{ vertical: false, horizontal: true }}
                            margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                            sx={chartSx}
                        />
                    )}
                </ChartCard>

                <ChartCard
                    title="Peso geografico"
                    description="Distribucion de visitantes unicos por localizacion detectada."
                >
                    {(width) => (
                        <PieChart
                            width={width}
                            height={300}
                            margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
                            series={[{
                                innerRadius: 54,
                                outerRadius: 110,
                                paddingAngle: 2,
                                cornerRadius: 6,
                                data: metrics.locationBreakdown.map((item, index) => ({
                                    id: item.location,
                                    value: item.visitors,
                                    label: item.location,
                                    color: ['#ff50a4', '#ff89c1', '#e5a94d', '#3bb273', '#7d8798'][index % 5]
                                }))
                            }]}
                            sx={chartSx}
                        />
                    )}
                </ChartCard>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <section className={cn(videoFormSurfaceClassName, 'p-5')}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className={videoFormLabelClassName}>Rutas top</p>
                            <p className={cn(videoFormBodyTextClassName, 'mt-2')}>Las paginas con mayor presion de trafico y tiempo activo.</p>
                        </div>
                        {metrics.summary.topLocation && (
                            <span className={getVideoFormBadgeClassName('accent')}>{metrics.summary.topLocation}</span>
                        )}
                    </div>

                    <div className="mt-5 space-y-3">
                        {metrics.topPages.map((page) => (
                            <article key={page.path} className="editor-subpanel rounded-[12px] p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">{page.path}</p>
                                        <p className={cn(videoFormMutedTextClassName, 'mt-1')}>
                                            {formatCompactNumber(page.uniqueVisitors)} visitantes, {formatMinutes(page.activeMinutes)} activos
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-base font-semibold text-white">{formatCompactNumber(page.visits)} visitas</p>
                                        <p className={videoFormMutedTextClassName}>{formatPercentage(page.share)} del total</p>
                                    </div>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                                    <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${Math.min(100, Math.max(6, page.share))}%` }} />
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={cn(videoFormSurfaceClassName, 'p-5')}>
                    <p className={videoFormLabelClassName}>Profundidad del recorrido</p>
                    <p className={cn(videoFormBodyTextClassName, 'mt-2')}>Cuanto navega cada registro diario antes de salir.</p>

                    <div className="mt-5 space-y-4">
                        {metrics.engagementDepth.map((bucket) => (
                            <article key={bucket.label} className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium text-white">{bucket.label}</p>
                                    <span className={getVideoFormBadgeClassName(bucket.records > 0 ? 'success' : undefined)}>
                                        {formatCompactNumber(bucket.records)}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                    <div className="h-full rounded-full bg-[#caff36]" style={{ width: `${Math.min(100, Math.max(bucket.share, bucket.records > 0 ? 6 : 0))}%` }} />
                                </div>
                                <p className={videoFormMutedTextClassName}>{formatPercentage(bucket.share)} del periodo</p>
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </div>
    )
}

export default ActivityAnalyticsScreen