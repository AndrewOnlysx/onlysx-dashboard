'use client'

import { NextPage } from 'next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Gallery } from '../types'

dayjs.extend(relativeTime)

interface Props {
    galeries: Gallery[]
    onSelectGallery: (gallery: Gallery) => void
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.04,
            staggerDirection: -1
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 120,
            damping: 18
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
}

const GaleryViewer: NextPage<Props> = ({
    galeries,
    onSelectGallery
}) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="gallery-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                {galeries.map((gallery) => (
                    <motion.div
                        key={gallery._id}
                        variants={cardVariants as any}
                        layout
                        whileHover={{ y: -6 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSelectGallery(gallery)}
                        className="
                            group
                            relative
                            bg-zinc-900
                            rounded-2xl
                            overflow-hidden
                            cursor-pointer
                            transition
                            shadow-md
                            hover:shadow-xl
                        "
                    >
                        {/* 🔥 Portada */}
                        <div className="relative w-full aspect-square overflow-hidden">
                            <motion.img
                                src={gallery.images[0]?.url}
                                alt={gallery.name}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            />

                            <div
                                className="
    absolute inset-0
    bg-gradient-to-b
    from-transparent
    via-black/10
    to-black/60
    opacity-70
                     group-hover:opacity-90
                  transition-opacity duration-300
  "
                            />

                            <div className="absolute bottom-2 left-2 bg-black/80 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                                {gallery.images.length} fotos
                            </div>

                            <Link
                                href={`/pageClients/galeries/edit/${gallery._id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                            >
                                <div className="bg-white text-black text-xs font-medium px-3 py-1 rounded-full hover:bg-zinc-200 transition">
                                    Editar
                                </div>
                            </Link>
                        </div>

                        {/* 🔥 Info */}
                        <div className="p-4">
                            <h3 className="font-semibold text-sm line-clamp-2">
                                {gallery.name}
                            </h3>

                            <p className="text-xs text-zinc-400 mt-1">
                                Actualizado {dayjs(gallery.updatedAt).fromNow()}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
    )
}

export default GaleryViewer