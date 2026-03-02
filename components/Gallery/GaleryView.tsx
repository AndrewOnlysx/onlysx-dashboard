'use client'

import { NextPage } from 'next'
import { useState } from 'react'
import GaleryViewer from './components/GaleryViewer'
import GalleryVento from './components/GalleryVento'
import { Gallery } from './types'


interface Props {
    galeries: Gallery[]
}

const GaleryView: NextPage<Props> = ({ galeries }) => {
    const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null)

    const handleSelectGallery = (gallery: Gallery) => {
        setSelectedGallery(gallery)
    }

    const handleBack = () => {
        setSelectedGallery(null)
    }

    if (selectedGallery) {
        return (
            <GalleryVento
                gallery={selectedGallery}
                onBack={handleBack}
            />
        )
    }

    return (
        <GaleryViewer
            galeries={galeries}
            onSelectGallery={handleSelectGallery}
        />
    )
}

export default GaleryView