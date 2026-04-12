'use client'
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { formatCompactNumber, formatDurationLabel } from '@/lib/videos/admin'
import { GalleryType, ModelType, TagType, VideoType } from '@/types/Types'

dayjs.extend(relativeTime)

interface Props {
    videos: VideoType[]
    summary: {
        totalVideos: number
        totalViews: number
        totalDumpReady: number
        totalWithGalleryLinks: number
        averageDurationInSeconds: number
    }
    qualities: string[]
}

const getModels = (video: VideoType) =>
    (video.models ?? []).filter((model): model is ModelType => typeof model !== 'string')

const getTags = (video: VideoType) =>
    (video.tags ?? []).filter((tag): tag is TagType => typeof tag !== 'string')

const getGaleries = (video: VideoType) =>
    (video.galeries ?? []).filter((gallery): gallery is GalleryType => typeof gallery !== 'string')

const VideoAdminScreen = ({ videos, summary, qualities }: Props) => {
    const [search, setSearch] = useState('')
    const [selectedQuality, setSelectedQuality] = useState('all')
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views' | 'title'>('newest')

    const filteredVideos = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        const results = videos.filter((video) => {
            const matchesQuality =
                selectedQuality === 'all' ? true : video.quality === selectedQuality

            if (!matchesQuality) {
                return false
            }

            if (!normalizedSearch) {
                return true
            }

            const haystack = [
                video.title,
                video.quality,
                video.time,
                ...(video.searchPrarms ?? []),
                ...getModels(video).map((model) => model.name),
                ...getTags(video).map((tag) => tag.name),
                ...getGaleries(video).map((gallery) => gallery.name)
            ]
                .join(' ')
                .toLowerCase()

            return haystack.includes(normalizedSearch)
        })

        return results.sort((left, right) => {
            if (sortBy === 'title') {
                return left.title.localeCompare(right.title)
            }

            if (sortBy === 'views') {
                return (right.views ?? 0) - (left.views ?? 0)
            }

            const leftDate = new Date(left.createdAt).getTime()
            const rightDate = new Date(right.createdAt).getTime()

            return sortBy === 'newest' ? rightDate - leftDate : leftDate - rightDate
        })
    }, [search, selectedQuality, sortBy, videos])

    const statCards = [
        {
            label: 'Videos publicados',
            value: summary.totalVideos.toString(),
            helper: `${filteredVideos.length} visibles con los filtros actuales`
        },
        {
            label: 'Views acumuladas',
            value: formatCompactNumber(summary.totalViews),
            helper: 'Referencia para priorizar contenido'
        },
        {
            label: 'Duracion promedio',
            value: formatDurationLabel(summary.averageDurationInSeconds),
            helper: 'Calculada sobre toda la libreria'
        },
        {
            label: 'Con dump y galerias',
            value: `${summary.totalDumpReady}/${summary.totalWithGalleryLinks}`,
            helper: 'Dump listos / videos enlazados a galerias'
        }
    ]

    return (
        <div className="space-y-8 text-white">
            <section className="overflow-hidden rounded-[24px] border border-white/8 bg-[rgba(15,18,24,0.96)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)] sm:p-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl space-y-3">
                        <span className="page-shell__eyebrow">
                            Videos admin
                        </span>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Libreria de videos lista para operar desde el dashboard
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                                Revisa la portada, calidad, relaciones con modelos/tags y entra directo al editor haciendo click sobre cualquier card del listado.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/pageClients/videos/addVideo"
                            className="primary-action"
                        >
                            Nuevo video
                        </Link>
                        <div className="secondary-action text-sm font-medium">
                            {summary.totalVideos} registros cargados
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                    <article
                        key={card.label}
                        className="rounded-[18px] border border-white/8 bg-[rgba(18,21,27,0.94)] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
                    >
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{card.label}</p>
                        <p className="mt-4 text-3xl font-semibold">{card.value}</p>
                        <p className="mt-2 text-sm text-zinc-400">{card.helper}</p>
                    </article>
                ))}
            </section>

            <section className="rounded-[20px] border border-white/8 bg-[rgba(18,21,27,0.94)] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_220px_220px]">
                    <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">Buscar</span>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Titulo, tag, modelo, keyword o galeria"
                            className="app-input"
                        />
                    </label>

                    <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">Calidad</span>
                        <select
                            value={selectedQuality}
                            onChange={(event) => setSelectedQuality(event.target.value)}
                            className="app-input"
                        >
                            <option value="all">Todas</option>
                            {qualities.map((quality) => (
                                <option key={quality} value={quality}>
                                    {quality}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">Orden</span>
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                            className="app-input"
                        >
                            <option value="newest">Mas recientes</option>
                            <option value="oldest">Mas antiguos</option>
                            <option value="views">Mas views</option>
                            <option value="title">Titulo A-Z</option>
                        </select>
                    </label>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {filteredVideos.map((video) => {
                    const models = getModels(video)
                    const tags = getTags(video)
                    const galeries = getGaleries(video)
                    const visibleModels = models.slice(0, 3)
                    const hiddenModelsCount = Math.max(0, models.length - visibleModels.length)

                    return (
                        <Link
                            key={video._id}
                            href={`/pageClients/videos/edit/${video.slug}`}
                            className="group block overflow-hidden rounded-[18px] border border-white/8 bg-[rgba(18,21,27,0.94)] shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition-[transform,border-color,box-shadow,background-color] duration-200 hover:-translate-y-[1px] hover:border-[rgba(255,80,164,0.18)] hover:bg-[rgba(20,23,29,0.98)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.22)]"
                        >
                            <div className="relative aspect-video overflow-hidden border-b border-white/8 bg-[rgba(255,255,255,0.02)]">
                                <img
                                    src={video.image}
                                    alt={video.title}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
                                />

                                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                                    <span className="rounded-md border border-white/10 bg-[rgba(15,18,24,0.82)] px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                                        {video.quality}
                                    </span>
                                    <span className="rounded-md border border-white/10 bg-[rgba(15,18,24,0.82)] px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                                        {video.time}
                                    </span>
                                </div>

                                <div className="absolute bottom-3 right-3 rounded-md border border-white/10 bg-[rgba(15,18,24,0.82)] px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                                    {formatCompactNumber(video.views ?? 0)} views
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 p-4">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-zinc-400">
                                        <span>{dayjs(video.updatedAt).fromNow()}</span>
                                        <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden="true" />
                                        <span>{video.dump ? 'Dump listo' : 'Sin dump'}</span>
                                        <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden="true" />
                                        <span>{galeries.length > 0 ? `${galeries.length} galerias` : 'Sin galerias'}</span>
                                    </div>

                                    <h2 className="truncate text-[17px] font-semibold leading-6 tracking-[-0.02em] text-white">
                                        {video.title}
                                    </h2>
                                </div>

                                {visibleModels.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {visibleModels.map((model) => (
                                            <div
                                                key={model._id}
                                                className="flex items-center gap-2 rounded-md border border-white/8 bg-white/[0.02] px-2 py-1.5 text-[12px] text-zinc-300"
                                            >
                                                <img
                                                    src={model.image}
                                                    alt={model.name}
                                                    className="h-5 w-5 rounded-full object-cover"
                                                />
                                                <span className="max-w-[92px] truncate">{model.name}</span>
                                            </div>
                                        ))}

                                        {hiddenModelsCount > 0 && (
                                            <span className="rounded-md border border-white/8 bg-transparent px-2 py-1.5 text-[12px] text-zinc-400">
                                                +{hiddenModelsCount}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-0 overflow-hidden rounded-[12px] border border-white/8 bg-white/[0.02]">
                                    <div className="px-3 py-2.5">
                                        <p className="text-[11px] text-zinc-500">Modelos</p>
                                        <p className="mt-1 text-sm font-medium text-zinc-100">{models.length}</p>
                                    </div>
                                    <div className="border-x border-white/8 px-3 py-2.5">
                                        <p className="text-[11px] text-zinc-500">Tags</p>
                                        <p className="mt-1 text-sm font-medium text-zinc-100">{tags.length}</p>
                                    </div>
                                    <div className="px-3 py-2.5">
                                        <p className="text-[11px] text-zinc-500">Galerias</p>
                                        <p className="mt-1 text-sm font-medium text-zinc-100">{galeries.length}</p>
                                    </div>
                                </div>


                                <div className="flex flex-wrap gap-1.5 border-t border-white/8 pt-3">
                                    {tags.slice(0, 4).map((tag) => (
                                        <span
                                            key={tag._id}
                                            className="rounded-md border border-white/8 bg-transparent px-2 py-1 text-[11px] text-zinc-400"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </section>

            {filteredVideos.length === 0 && (
                <section className="empty-state px-6 py-16 text-center">
                    <p className="text-lg font-medium text-white">No hay videos que coincidan con los filtros actuales.</p>
                    <p className="mt-2 text-sm text-zinc-400">
                        Ajusta la busqueda o crea un nuevo registro desde el formulario de alta.
                    </p>
                </section>
            )}
        </div>
    )
}

export default VideoAdminScreen
