export interface Gallery {
    _id: string
    idTags: string[]
    idModel: string[]
    idRelatedVideo: string
    name: string
    images: {
        _id?: string
        url: string
    }[]
    createdAt: string
    updatedAt: string
}