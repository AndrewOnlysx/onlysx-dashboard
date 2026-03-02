'use client'

import { NextPage } from 'next'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    ArrowLeft01Icon,
    ArrowRight01Icon
} from '@hugeicons-pro/core-duotone-standard'
import { PRIMARYCOLOR } from '@/constant/Colors'

interface Props {
    images: string[]
    initialIndex: number
    onClose: () => void
}

const ImageDetail: NextPage<Props> = ({
    images,
    initialIndex,
    onClose
}) => {
    const [mounted, setMounted] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    const currentImage = images[currentIndex]

    // 🔒 Lock scroll
    useEffect(() => {
        setMounted(true)
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        )
    }

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        )
    }

    if (!mounted) return null

    return createPortal(
        <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex flex-col "
        >
            {/* 🔥 Fondo animado */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black backdrop-blur-sm"
                onClick={onClose}
            />

            {/* 🔥 Contenido animado */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative z-10 flex flex-col h-full"
            >
                {/* 🔥 Close Button */}
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-6 right-6 text-white text-2xl font-bold z-50 hover:scale-110 transition"
                >
                    ✕
                </button>

                {/* 🔥 Main Image Area */}
                <div className="flex-1 flex items-center justify-center relative">

                    {/* Prev */}
                    <button
                        onClick={handlePrev}
                        className="cursor-pointer absolute left-6 text-white z-50 hover:scale-110 transition"
                    >
                        <HugeiconsIcon
                            icon={ArrowLeft01Icon}
                            size={32}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    </button>

                    {/* 🔥 Imagen principal animada */}
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImage}
                            src={currentImage}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                                duration: 0.3,
                                ease: 'easeInOut'
                            }}
                            className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                        />
                    </AnimatePresence>

                    {/* Next */}
                    <button
                        onClick={handleNext}
                        className="cursor-pointer absolute right-6 text-white z-50 hover:scale-110 transition"
                    >
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={32}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    </button>
                </div>

                {/* 🔥 Thumbnails */}
                <div
                    className="
            thumbnail-scroll
            h-28
            px-10
            pb-6
            flex
            items-center
            overflow-x-auto
            gap-4
          "
                >
                    {images.map((img, index) => {
                        const isActive = index === currentIndex

                        return (
                            <motion.div
                                key={img}
                                onClick={() => setCurrentIndex(index)}
                                whileHover={{ scale: 1.08 }}
                                animate={{
                                    borderColor: isActive
                                        ? PRIMARYCOLOR
                                        : 'transparent'
                                }}
                                transition={{ duration: 0.2 }}
                                className="
                  min-w-[90px]
                  h-20
                  rounded-lg
                  overflow-hidden
                  border-3
                  cursor-pointer
                "
                            >
                                <img
                                    src={img}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            </motion.div>
                        )
                    })}
                </div>
            </motion.div>
        </motion.div>,
        document.body
    )
}

export default ImageDetail