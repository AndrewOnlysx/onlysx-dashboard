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

    // 🔎 Filtrado simple (preparado para server-side después)
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
        <div className="space-y-8">

            {/* 🔥 TOOLBAR */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Buscar galería..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 w-full"
                    />

                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value as any)
                        }
                        className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700"
                    >
                        <option value="all">Todas</option>
                        <option value="visible">Visibles</option>
                        <option value="hidden">Ocultas</option>
                    </select>
                </div>

                <Link
                    href="/admin/galeries/create"
                    className="px-5 py-2 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition"
                >
                    + Nueva Galería
                </Link>
            </div>

            {/* 🔥 BULK ACTIONS */}
            {selected.size > 0 && (
                <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                    <span>{selected.size} seleccionadas</span>

                    <button className="text-green-400 hover:underline">
                        Mostrar
                    </button>

                    <button className="text-yellow-400 hover:underline">
                        Ocultar
                    </button>

                    <button className="text-red-500 hover:underline">
                        Eliminar
                    </button>
                </div>
            )}

            {/* 🔥 GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((gallery) => {
                    const isSelected = selected.has(gallery._id)

                    return (
                        <div
                            key={gallery._id}
                            className={`
                relative
                bg-zinc-900
                rounded-2xl
                overflow-hidden
                border
                ${isSelected ? 'border-white' : 'border-zinc-800'}
                hover:border-zinc-600
                transition
              `}
                        >
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelect(gallery._id)}
                                className="absolute top-3 left-3 z-10"
                            />

                            {/* Cover */}
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={(gallery.images[0] as any).url}
                                    alt={gallery.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold line-clamp-1">
                                    {gallery.name}
                                </h3>

                                <p className="text-xs text-zinc-400">
                                    {gallery.images.length} imágenes
                                </p>

                                <p className="text-xs text-zinc-500">
                                    Actualizado {dayjs(gallery.updatedAt).fromNow()}
                                </p>

                                {!gallery.isVisible && (
                                    <span className="inline-block text-xs bg-red-900/40 text-red-400 px-2 py-1 rounded-full">
                                        Oculta
                                    </span>
                                )}
                            </div>

                            {/* Acciones */}
                            <div className="flex justify-between items-center px-4 pb-4 text-sm">
                                <Link
                                    href={`/admin/galeries/edit/${gallery._id}`}
                                    className="hover:underline"
                                >
                                    Editar
                                </Link>

                                <button className="text-red-400 hover:underline">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center text-zinc-500 py-20">
                    No se encontraron galerías.
                </div>
            )}
        </div>
    )
}

export default GaleriesAdminScreen