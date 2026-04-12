'use server'

import { Galeries } from "@/database/models/Galeries"
import { connectDB } from "@/database/utils/mongodb"
import mongoose from "mongoose"

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
        const parseObjectIdArray = (ids: string[], fieldName: string) => {
            if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
                throw new Error(`Invalid ${fieldName} id`)
            }

            return ids.map((id) => new mongoose.Types.ObjectId(id))
        }

        if (idRelatedVideo && !mongoose.Types.ObjectId.isValid(idRelatedVideo)) {
            throw new Error("Invalid idRelatedVideo id")
        }

        const newGallery = new Galeries({
            name,
            idTags: parseObjectIdArray(idTags, "idTags"),
            idModel: parseObjectIdArray(idModel, "idModel"),
            idRelatedVideo: idRelatedVideo ? new mongoose.Types.ObjectId(idRelatedVideo) : undefined,
            images
        })
        await newGallery.save()
        return {
            ok: true,
            gallery: JSON.parse(JSON.stringify(newGallery)),
            message: 'Galeria creada correctamente.'
        }
    } catch (error) {
        console.error("Error creating gallery:", error)
        return {
            ok: false,
            gallery: null,
            message: "Failed to create gallery"
        }
    }
}
