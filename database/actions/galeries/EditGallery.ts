
'use server'
import { Galeries } from "@/database/models/Galeries";
import { connectDB } from "@/database/utils/mongodb";


interface EditGalleryData {
    galleryId: string
    title?: string
    description?: string
    images?: { filename: string, status: string, url: string, isNew: boolean }[]
}

export default async function EditGallery(data: EditGalleryData) {
    try {
        await connectDB()

        const { galleryId, title, description, images } = data

        const gallery = await Galeries.findById(galleryId)
        if (!gallery) {
            return {
                ok: false,
                message: "Galería no encontrada."
            }
        }

        if (title !== undefined) gallery.title = title
        if (description !== undefined) gallery.description = description
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