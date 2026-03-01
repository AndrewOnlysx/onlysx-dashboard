'use client'

import { NextPage } from 'next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'

dayjs.extend(relativeTime)

interface Props {
    galeries: {
        _id: string
        idTags: string[]
        idModel: string[]
        idRelatedVideo: string
        name: string
        images: string[]
        createdAt: string
        updatedAt: string
        __v: number
    }[]
}

const GaleryView: NextPage<Props> = ({ galeries }) => {
    console.log('imagenes que llegan', { galeries })
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galeries.map((gallery) => (
                <div
                    key={gallery._id}
                    className="group relative bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition cursor-pointer"
                >
                    {/* 🔥 Portada */}
                    <div className="relative w-full aspect-square overflow-hidden">
                        <img
                            src={(gallery.images[0] as any).url}
                            alt={gallery.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />

                        {/* Overlay oscuro */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

                        {/* Cantidad de imágenes */}
                        <div className="absolute bottom-2 left-2 bg-black/80 text-xs px-2 py-1 rounded-md">
                            {gallery.images.length} fotos
                        </div>

                        {/* Botón editar */}
                        <Link
                            href={`/pageClients/galeries/edit/${gallery._id.toString()}`}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                        >
                            <div className="bg-white text-black text-xs font-medium px-3 py-1 rounded-full hover:bg-zinc-200 transition">
                                Editar
                            </div>
                        </Link>
                    </div>

                    {/* 🔥 Info */}
                    <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2">
                            {gallery.name}
                        </h3>

                        <p className="text-xs text-zinc-400 mt-1">
                            Actualizado {dayjs(gallery.updatedAt).fromNow()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GaleryView