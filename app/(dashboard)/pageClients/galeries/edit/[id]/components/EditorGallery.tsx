'use client'

import { NextPage } from 'next'
import GalleryForm from '../../../components/GalleryForm'
import { ModelType, TagType } from '@/types/Types'

interface GalleryType {
    _id: string
    idTags: Array<string | TagType>
    idModel: Array<string | ModelType>
    idRelatedVideo?: string | { _id: string } | null
    name: string
    images: { filename: string, status: string, url: string }[]
}

interface Props {
    gallery: GalleryType
}

const EditorGallery: NextPage<Props> = ({ gallery }) => {
    return <GalleryForm mode="edit" gallery={gallery} />
}

export default EditorGallery
