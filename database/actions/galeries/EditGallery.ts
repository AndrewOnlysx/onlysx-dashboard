
'use server'
import { Galeries } from "@/database/models/Galeries";
import { connectDB } from "@/database/utils/mongodb";
import mongoose from "mongoose";


interface EditGalleryData {
    galleryId: string
    name?: string
    idTags?: string[]
    idModel?: string[]
    idRelatedVideo?: string
    images?: { filename: string, status: string, url: string, isNew: boolean }[]
}

export default async function EditGallery(data: EditGalleryData) {
    try {
        await connectDB()

        const { galleryId, name, idTags, idModel, idRelatedVideo, images } = data

        const gallery = await Galeries.findById(galleryId)
        if (!gallery) {
            return {
                ok: false,
                message: "Galería no encontrada."
            }
        }

        const parseObjectIdArray = (ids: string[], fieldName: string) => {
            if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
                throw new Error(`Invalid ${fieldName} id`)
            }

            return ids.map((id) => new mongoose.Types.ObjectId(id))
        }

        if (name !== undefined) gallery.name = name
        if (idTags !== undefined) gallery.idTags = parseObjectIdArray(idTags, "idTags")
        if (idModel !== undefined) gallery.idModel = parseObjectIdArray(idModel, "idModel")
        if (idRelatedVideo !== undefined) {
            if (idRelatedVideo === '') {
                gallery.idRelatedVideo = undefined
            } else if (!mongoose.Types.ObjectId.isValid(idRelatedVideo)) {
                throw new Error("Invalid idRelatedVideo id")
            } else {
                gallery.idRelatedVideo = new mongoose.Types.ObjectId(idRelatedVideo)
            }
        }
        if (images !== undefined) gallery.images = images

        await gallery.save()

        return {
            ok: true,
            message: "Galería actualizada correctamente.",
            gallery: JSON.parse(JSON.stringify(gallery))
        }
    } catch (error) {
        console.error("Error editando galería:", error)
        return {
            ok: false,
            message: "Error interno del servidor."
        }
    }
}
