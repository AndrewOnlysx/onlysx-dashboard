'use server'

import { Galeries } from "@/database/models/Galeries"
import { connectDB } from "@/database/utils/mongodb"



export const CreateGallery = async (data: {
    name: string
    idTags: string[],
    idModel: string[],
    idRelatedVideo: string,
    images: { filename: string, status: string, url: string }[]
}) => {
    await connectDB()

    const { name, idModel, idTags, idRelatedVideo, images } = data
    console.log("Creating gallery with data:", data)
    try {
        const newGallery = new Galeries({
            name,
            description: '',
            models: idModel,
            tags: idTags,
            videoRelated: idRelatedVideo || null,
            images
        })
        await newGallery.save()
        return JSON.parse(JSON.stringify(newGallery))
    } catch (error) {
        console.error("Error creating gallery:", error)
        throw new Error("Failed to create gallery")
    }
}