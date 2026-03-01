import { NextResponse } from "next/server"
import { connectDB } from "@/database/utils/mongodb"
import { UploadFile } from "@/database/utils/cloudflare/Handler"

export async function POST(req: Request) {
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

        const files = formData.getAll("images") as File[]
        const folder = formData.get("folder") as string | null

        if (!files || files.length === 0) {
            return NextResponse.json(
                { message: "Debes enviar al menos una imagen." },
                { status: 400 }
            )
        }
        const dataWhitNameAndStatus: { filename: string, status: string, url: string }[] = []
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                if (!file || file.size === 0) return null

                const result = await UploadFile(
                    file,
                    folder || "gallery-default"
                )

                if (!result.success) {
                    throw new Error("Error subiendo archivo")
                }

                dataWhitNameAndStatus.push({
                    filename: file.name,
                    status: result.success ? "success" : "error",
                    url: result.url || ""
                })

                return result.url
            })
        )

        return NextResponse.json({
            ok: true,
            message: "Imágenes subidas correctamente.",
            urls: uploadResults.filter(Boolean),
            data: dataWhitNameAndStatus
        })

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { message: "Error interno del servidor." },
            { status: 500 }
        )
    }
}