import { NextResponse } from "next/server"
import { Models } from "@/database/models/Models"
import { connectDB } from "@/database/utils/mongodb"
import { UploadFile } from "@/database/utils/cloudflare/Handler"

const parseMultipartForm = async (req: Request) => {
    const contentType = req.headers.get("content-type") || ""

    if (!contentType.includes("multipart/form-data")) {
        return {
            ok: false as const,
            response: NextResponse.json(
                { ok: false, message: "El cuerpo debe ser multipart/form-data." },
                { status: 400 }
            )
        }
    }

    return {
        ok: true as const,
        formData: await req.formData()
    }
}

const uploadModelImage = async (image: File) => {
    const uploadResult = await UploadFile(image, 'user-0')

    if (!uploadResult.success || !uploadResult.url) {
        return null
    }

    return uploadResult.url
}

export async function POST(req: Request) {
    try {
        await connectDB()

        const parsed = await parseMultipartForm(req)

        if (!parsed.ok) {
            return parsed.response
        }

        const name = parsed.formData.get("name") as string | null
        const image = parsed.formData.get("image") as File | null

        if (!name?.trim()) {
            return NextResponse.json(
                { ok: false, message: "El nombre del modelo es obligatorio." },
                { status: 400 }
            )
        }

        if (!image || image.size === 0) {
            return NextResponse.json(
                { ok: false, message: "La imagen del modelo es obligatoria." },
                { status: 400 }
            )
        }

        const imageUrl = await uploadModelImage(image)

        if (!imageUrl) {
            return NextResponse.json(
                { ok: false, message: "Error al subir imagen." },
                { status: 500 }
            )
        }

        const model = await Models.create({
            name: name.trim(),
            image: imageUrl
        })

        return NextResponse.json({
            ok: true,
            message: "Modelo creado correctamente.",
            model
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { ok: false, message: "Error interno del servidor." },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: Request,

) {
    try {
        await connectDB()

        const parsed = await parseMultipartForm(req)

        if (!parsed.ok) {
            return parsed.response
        }

        const formData = parsed.formData

        const name = formData.get("name") as string | null
        const image = formData.get("image") as File | null
        const id = formData.get("id") as string | null

        if (!id) {
            return NextResponse.json(
                { ok: false, message: "El ID del modelo es obligatorio." },
                { status: 400 }
            )
        }

        if (!name) {
            return NextResponse.json(
                { ok: false, message: "El nombre es obligatorio." },
                { status: 400 }
            )
        }

        const model = await Models.findById(id)

        if (!model) {
            return NextResponse.json(
                { ok: false, message: "Modelo no encontrado." },
                { status: 404 }
            )
        }

        let imageUrl = model.image

        if (image && image.size > 0) {
            const uploadedImageUrl = await uploadModelImage(image)

            if (!uploadedImageUrl) {
                return NextResponse.json(
                    { ok: false, message: "Error al subir imagen." },
                    { status: 500 }
                )
            }

            imageUrl = uploadedImageUrl
        }

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
            { ok: false, message: "Error interno del servidor." },
            { status: 500 }
        )
    }
}