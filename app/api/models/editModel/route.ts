import { NextResponse } from "next/server"
import { Models } from "@/database/models/Models"
import { connectDB } from "@/database/utils/mongodb"
import { UploadFile } from "@/database/utils/cloudflare/Handler"

export async function PUT(
    req: Request,

) {
    try {
        await connectDB()

        const contentType = req.headers.get("content-type") || ""

        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                { message: "El cuerpo debe ser multipart/form-data." },
                { status: 400 }
            )
        }

        const formData = await req.formData()

        const name = formData.get("name") as string | null
        const image = formData.get("image") as File | null
        const id = formData.get("id") as string | null
        if (!id) {
            return NextResponse.json(
                { message: "El ID del modelo es obligatorio." },
                { status: 400 }
            )
        }
        if (!name) {
            return NextResponse.json(
                { message: "El nombre es obligatorio." },
                { status: 400 }
            )
        }

        const model = await Models.findById(id)

        if (!model) {
            return NextResponse.json(
                { message: "Modelo no encontrado." },
                { status: 404 }
            )
        }

        let imageUrl = model.image

        // 🔥 Si enviaron imagen nueva → subir a R2
        if (image && image.size > 0) {
            const uploadResult = await UploadFile(image, 'user-0')

            if (!uploadResult.success) {
                return NextResponse.json(
                    { message: "Error al subir imagen." },
                    { status: 500 }
                )
            }

            console.log("Image URL:", uploadResult) // Debug: Verificar URL de la imagen
            imageUrl = uploadResult.url
        }
        // 🔥 Actualizar modelo
        model.name = name
        model.image = imageUrl

        await model.save()

        return NextResponse.json({
            ok: true,
            message: "Modelo actualizado correctamente.",
            model
        })

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { message: "Error interno del servidor." },
            { status: 500 }
        )
    }
}