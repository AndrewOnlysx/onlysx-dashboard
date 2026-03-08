import { randomUUID } from "node:crypto"

import { NextResponse } from "next/server"

import { UploadFile } from "@/database/utils/cloudflare/Handler"

type AssetType = "video" | "cover"

const normalizeSegment = (value: string) =>
    value
        .trim()
        .replace(/[^a-zA-Z0-9/_-]+/g, "-")
        .replace(/\/+/g, "/")
        .replace(/^\/|\/$/g, "")

const getAssetType = (value: FormDataEntryValue | null): AssetType =>
    value === "cover" ? "cover" : "video"

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get("content-type") || ""

        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                { ok: false, message: "El cuerpo debe ser multipart/form-data." },
                { status: 400 }
            )
        }

        const formData = await req.formData()
        const file = formData.get("file")

        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json(
                { ok: false, message: "Debes enviar un archivo valido." },
                { status: 400 }
            )
        }

        const assetType = getAssetType(formData.get("assetType"))
        const folderValue = formData.get("folder")
        const baseFolder = typeof folderValue === "string" && folderValue.trim()
            ? normalizeSegment(folderValue)
            : "videos-admin"

        const uploadFolder = normalizeSegment(
            `${baseFolder}/${assetType}/${Date.now().toString(36)}-${randomUUID()}`
        )

        const result = await UploadFile(file, uploadFolder)

        if (!result.success || !result.url || !result.key) {
            return NextResponse.json(
                { ok: false, message: "No se pudo subir el archivo." },
                { status: 500 }
            )
        }

        return NextResponse.json({
            ok: true,
            message: "Archivo subido correctamente.",
            data: {
                assetType,
                filename: file.name,
                size: file.size,
                type: file.type,
                status: "success",
                url: result.url,
                key: result.key
            }
        })
    } catch (error) {
        console.error("Error subiendo asset de video:", error)

        return NextResponse.json(
            { ok: false, message: "Error interno del servidor." },
            { status: 500 }
        )
    }
}
