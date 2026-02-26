"use server"

// Tipos basados en tus modelos
export interface VideoType {
    _id: string
    title: string
    time: string
    image: string
    video: string
    dump: string
    quality: string
    models: string[] | ModelType[]
    tags: string[] | TagType[]
    views?: number
    lastViews?: string
    searchPrarms: string[]
    createdAt: Date
    updatedAt: Date
}

export interface ModelType {
    _id: string
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
