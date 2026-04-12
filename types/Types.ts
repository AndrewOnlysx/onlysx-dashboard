"use server"

// Tipos basados en tus modelos
export interface GalleryImageType {
    filename: string
    status: string
    url: string
}

export interface GalleryType {
    _id: string
    slug: string
    name: string
    images: GalleryImageType[]
    isVisible?: boolean
    updatedAt?: Date | string
    createdAt?: Date | string
}

export interface VideoType {
    _id: string
    slug: string
    title: string
    time: string
    image: string
    video: string
    dump: string
    quality: string
    models: string[] | ModelType[]
    tags: string[] | TagType[]
    galeries?: string[] | GalleryType[]
    views?: number
    lastViews?: string
    searchPrarms: string[]
    createdAt: Date
    updatedAt: Date
}

export interface ModelType {
    _id: string
    slug: string
    name: string
    folder?: string
    searchCounts?: number
    image: string
}

export interface TagType {
    _id: string
    name: string
    searches?: number
}
