'use client'

import { NextPage } from 'next'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Gallery } from '../types'
import ImageDetail from './ImageDetail'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    ArrowLeft01Icon,
    ArrowRight01Icon
} from '@hugeicons-pro/core-duotone-standard'
interface Props {
    gallery: Gallery
    onBack: () => void
}

const GalleryVento: NextPage<Props> = ({ gallery, onBack }) => {
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => {
            const next = new Set(prev)
            next.add(id)
            return next
        })
    }

    const imageUrls = gallery.images.map((img) => img.url)

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={gallery._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    {/* Header */}
                    <div className="flex items-center gap-8 mb-8">
                        <button
                            onClick={onBack}
                            className="cursor-pointer
                             w-[100px] px-4
                             bg-white 
                             flex items-center justify-center gap-2
                             text-black rounded-full  hover:bg-zinc-200 transition"
                        >
                            <HugeiconsIcon
                                icon={ArrowLeft01Icon}
                                size={48}
                                color="currentColor"
                                strokeWidth={1.5}
                            /> Back
                        </button>
                        <h2 className="text-2xl w-[400px] font-bold">{gallery.name}</h2>


                    </div>

                    {/* Masonry */}
                    <div
                        className="
              columns-2
              sm:columns-3
              md:columns-4
              lg:columns-5
              gap-5
              space-y-5
            "
                    >
                        {gallery.images.map((img, index) => {
                            const id = img._id ?? index.toString()
                            const isLoaded = loadedImages.has(id)

                            return (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{
                                        opacity: isLoaded ? 1 : 0,
                                        y: isLoaded ? 0 : 30
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: 'easeOut'
                                    }}
                                    onClick={() => setSelectedIndex(index)}
                                    className="
                    break-inside-avoid
                    rounded-2xl
                    overflow-hidden
                    bg-zinc-900
                    relative
                    cursor-pointer
                  "
                                >
                                    {/* Skeleton */}
                                    {!isLoaded && (
                                        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
                                    )}

                                    <img
                                        src={img.url}
                                        alt={`Imagen ${index}`}
                                        className={`
                      w-full
                      h-auto
                      object-cover
                      transition
                      duration-300
                      ${isLoaded ? 'opacity-100' : 'opacity-0'}
                    `}
                                        loading="lazy"
                                        decoding="async"
                                        onLoad={() => handleImageLoad(id)}
                                    />
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* 🔥 IMAGE DETAIL OVERLAY */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <ImageDetail
                        images={imageUrls}
                        initialIndex={selectedIndex}
                        onClose={() => setSelectedIndex(null)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default GalleryVento