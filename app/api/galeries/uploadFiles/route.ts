import { NextResponse } from "next/server"
import { connectDB } from "@/database/utils/mongodb"
import { UploadFile } from "@/database/utils/cloudflare/Handler"

export async function POST(req: Request) {
    try {
        await connectDB()
        console.log("Conectado a la base de datos")
        const contentType = req.headers.get("content-type") || ""

        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                { message: "El cuerpo debe ser multipart/form-data." },
                { status: 400 }
            )
        }
        console.log('paso 2')
        const formData = await req.formData()

        const files = formData
            .getAll("images")
            .filter((item): item is File => item instanceof File)
        console.log('files', files)
        const folder = formData.get("folder") as string | 'user-0'
        console.log('paso 3')
        if (!files || files.length === 0) {
            return NextResponse.json(
                { message: "Debes enviar al menos una imagen." },
                { status: 400 }
            )
        }
        console.log('paso 4')
        const dataWhitNameAndStatus: { filename: string, status: string, url: string }[] = []
        let uploadResults: (string | null)[] = []
        try {
            uploadResults = await Promise.all(
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
        } catch (error) {
            console.error("Error subiendo archivos:", error)
            return NextResponse.json(
                { message: "Error subiendo los archivos." },
                { status: 500 }
            )
        }
        console.log('paso 5')
        console.log(dataWhitNameAndStatus)
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