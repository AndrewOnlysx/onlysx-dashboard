'use client'

import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'

dayjs.extend(relativeTime)

interface Gallery {
    _id: string
    name: string
    images: string[]
    updatedAt: string
    isVisible: boolean
}

interface Props {
    galeries: Gallery[]
}

const GaleriesAdminScreen = ({ galeries }: Props) => {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all')
    const [selected, setSelected] = useState<Set<string>>(new Set())

    const filtered = useMemo(() => {
        return galeries.filter((g) => {
            const matchSearch = g.name
                .toLowerCase()
                .includes(search.toLowerCase())

            const matchFilter =
                filter === 'all'
                    ? true
                    : filter === 'visible'
                        ? g.isVisible
                        : !g.isVisible

            return matchSearch && matchFilter
        })
    }, [galeries, search, filter])

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <div className="space-y-8 text-white">
            <section className="surface-panel surface-panel--hero p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <span className="page-shell__eyebrow">Galerias admin</span>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight">Biblioteca de galerias</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                            Revisa visibilidad, colecciones y acceso a la edicion desde un listado coherente con el sistema corporativo del dashboard.
                        </p>
                    </div>
                    <Link
                        href="galeries/addGallery"
                        className="primary-action"
                    >
                        Nueva galeria
                    </Link>
                </div>
            </section>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 gap-4">
                    <input
                        type="text"
                        placeholder="Buscar galería..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="app-input"
                    />

                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value as 'all' | 'visible' | 'hidden')
                        }
                        className="app-input max-w-[180px]"
                    >
                        <option value="all">Todas</option>
                        <option value="visible">Visibles</option>
                        <option value="hidden">Ocultas</option>
                    </select>
                </div>
            </div>

            {selected.size > 0 && (
                <div className="surface-panel flex items-center gap-4 p-4">
                    <span>{selected.size} seleccionadas</span>

                    <button className="success-pill normal-case tracking-normal">
                        Mostrar
                    </button>

                    <button className="warning-pill normal-case tracking-normal">
                        Ocultar
                    </button>

                    <button className="danger-action px-4 py-2 text-sm">
                        Eliminar
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((gallery) => {
                    const isSelected = selected.has(gallery._id)

                    return (
                        <div
                            key={gallery._id}
                            className={`
                                relative
                                interactive-card
                                overflow-hidden
                                ${isSelected ? 'border-[rgba(255,80,164,0.45)]' : ''}
                            `}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelect(gallery._id)}
                                className="absolute top-3 left-3 z-10"
                            />

                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={(gallery.images[0] as any).url}
                                    alt={gallery.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="space-y-2 p-4">
                                <h3 className="line-clamp-1 font-semibold">
                                    {gallery.name}
                                </h3>

                                <p className="text-xs text-zinc-400">
                                    {gallery.images.length} imágenes
                                </p>

                                <p className="text-xs text-zinc-500">
                                    Actualizado {dayjs(gallery.updatedAt).fromNow()}
                                </p>

                                {!gallery.isVisible && (
                                    <span className="warning-pill inline-flex normal-case tracking-normal text-xs">
                                        Oculta
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between px-4 pb-4 text-sm">
                                <Link
                                    href={`/pageClients/galeries/edit/${gallery._id}`}
                                    className="text-[var(--primary)] hover:underline"
                                >
                                    Editar
                                </Link>

                                <button className="text-rose-300 hover:underline">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className="empty-state py-20 text-center text-zinc-500">
                    No se encontraron galerías.
                </div>
            )}
        </div>
    )
}

export default GaleriesAdminScreen