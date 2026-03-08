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
            <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.24),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(96,165,250,0.24),_transparent_26%),linear-gradient(135deg,_rgba(24,24,27,0.98),_rgba(9,9,11,0.96))] p-6 sm:p-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl space-y-3">
                        <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.28em] text-zinc-300">
                            Videos admin
                        </span>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Libreria de videos lista para operar desde el dashboard
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                                Revisa la portada, calidad, relaciones con modelos/tags y el estado de cada asset antes de conectar la creacion real con el backend.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/pageClients/videos/addVideo"
                            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                        >
                            Nuevo video
                        </Link>
                        <div className="rounded-full border border-white/12 bg-black/20 px-5 py-3 text-sm text-zinc-300">
                            {summary.totalVideos} registros cargados
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                    <article
                        key={card.label}
                        className="rounded-[28px] border border-white/10 bg-zinc-950/70 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
                    >
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{card.label}</p>
                        <p className="mt-4 text-3xl font-semibold">{card.value}</p>
                        <p className="mt-2 text-sm text-zinc-400">{card.helper}</p>
                    </article>
                ))}
            </section>

            <section className="rounded-[28px] border border-white/10 bg-zinc-950/70 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_220px_220px]">
                    <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">Buscar</span>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Titulo, tag, modelo, keyword o galeria"
                            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                        />
                    </label>

                    <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">Calidad</span>
                        <select
                            value={selectedQuality}
                            onChange={(event) => setSelectedQuality(event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-white/30"
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
                            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-white/30"
                        >
                            <option value="newest">Mas recientes</option>
                            <option value="oldest">Mas antiguos</option>
                            <option value="views">Mas views</option>
                            <option value="title">Titulo A-Z</option>
                        </select>
                    </label>
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                {filteredVideos.map((video) => {
                    const models = getModels(video)
                    const tags = getTags(video)
                    const galeries = getGaleries(video)

                    return (
                        <article
                            key={video._id}
                            className="group overflow-hidden rounded-[30px] border border-white/10 bg-zinc-950/80 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_28px_90px_rgba(0,0,0,0.45)]"
                        >
                            <div className="relative aspect-video overflow-hidden bg-zinc-900">
                                <img
                                    src={video.image}
                                    alt={video.title}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                                        {video.quality}
                                    </span>
                                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-zinc-100 backdrop-blur">
                                        {video.time}
                                    </span>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-300">Actualizado</p>
                                        <p className="text-sm font-medium text-white">
                                            {dayjs(video.updatedAt).fromNow()}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/15 bg-black/45 px-3 py-2 text-right backdrop-blur">
                                        <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">Views</p>
                                        <p className="text-sm font-semibold text-white">
                                            {formatCompactNumber(video.views ?? 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 p-5">
                                <div className="space-y-2">
                                    <h2 className="line-clamp-2 text-xl font-semibold tracking-tight">
                                        {video.title}
                                    </h2>
                                    <p className="line-clamp-2 text-sm text-zinc-400">
                                        {video.searchPrarms?.slice(0, 8).join(' • ') || 'Sin keywords generadas'}
                                    </p>
                                </div>

                                <div className="grid gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Modelos</p>
                                        <p className="mt-2 text-sm text-zinc-100">{models.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Tags</p>
                                        <p className="mt-2 text-sm text-zinc-100">{tags.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Galerias</p>
                                        <p className="mt-2 text-sm text-zinc-100">{galeries.length}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {models.slice(0, 3).map((model) => (
                                            <span
                                                key={model._id}
                                                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200"
                                            >
                                                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                                                {model.name}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {tags.slice(0, 4).map((tag) => (
                                            <span
                                                key={tag._id}
                                                className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-200"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/8 pt-4 text-sm text-zinc-400">
                                    <span>{video.dump ? 'Dump listo' : 'Sin dump'}</span>
                                    <span>{galeries.length > 0 ? `${galeries.length} galerias enlazadas` : 'Sin galerias enlazadas'}</span>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </section>

            {filteredVideos.length === 0 && (
                <section className="rounded-[28px] border border-dashed border-white/12 bg-zinc-950/50 px-6 py-16 text-center">
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
