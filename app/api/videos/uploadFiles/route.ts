import { randomUUID } from "node:crypto"

import { NextResponse } from "next/server"

import { CreateDirectUploadTarget, UploadFile } from "@/database/utils/cloudflare/Handler"

type AssetType = "video" | "cover"
const API_LOG_PREFIX = '[upload-api]'

interface PrepareUploadBody {
    filename?: string
    type?: string
    size?: number
    assetType?: AssetType
    folder?: string
}

const normalizeSegment = (value: string) =>
    value
        .trim()
        .replace(/[^a-zA-Z0-9/_-]+/g, "-")
        .replace(/\/+/g, "/")
        .replace(/^\/|\/$/g, "")

const getAssetType = (value: FormDataEntryValue | null): AssetType =>
    value === "cover" ? "cover" : "video"

const resolveUploadFolder = (folderValue: FormDataEntryValue | string | null, assetType: AssetType) => {
    const baseFolder = typeof folderValue === "string" && folderValue.trim()
        ? normalizeSegment(folderValue)
        : "videos-admin"

    return normalizeSegment(
        `${baseFolder}/${assetType}/${Date.now().toString(36)}-${randomUUID()}`
    )
}

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get("content-type") || ""

        if (contentType.includes('application/json')) {
            let body: PrepareUploadBody

            try {
                body = (await req.json()) as PrepareUploadBody
            } catch {
                return NextResponse.json(
                    { ok: false, message: 'El cuerpo JSON es invalido.' },
                    { status: 400 }
                )
            }

            const filename = typeof body.filename === 'string' ? body.filename.trim() : ''
            const fileType = typeof body.type === 'string' && body.type.trim()
                ? body.type
                : 'application/octet-stream'
            const assetType = body.assetType === 'cover' ? 'cover' : 'video'

            if (!filename) {
                return NextResponse.json(
                    { ok: false, message: 'Debes enviar un nombre de archivo valido.' },
                    { status: 400 }
                )
            }

            const uploadFolder = resolveUploadFolder(body.folder ?? null, assetType)

            console.log(`${API_LOG_PREFIX} prepare`, {
                assetType,
                uploadFolder,
                fileName: filename,
                fileType,
                fileSize: body.size,
            })

            const result = await CreateDirectUploadTarget({
                filename,
                contentType: fileType,
                userId: uploadFolder,
            })

            if (!result.success || !result.uploadUrl || !result.url || !result.key || !result.filename) {
                return NextResponse.json(
                    { ok: false, message: 'No se pudo preparar la subida.' },
                    { status: 500 }
                )
            }

            return NextResponse.json({
                ok: true,
                message: 'Upload preparado correctamente.',
                data: {
                    assetType,
                    filename: result.filename,
                    size: typeof body.size === 'number' ? body.size : 0,
                    type: fileType,
                    url: result.url,
                    key: result.key,
                    uploadUrl: result.uploadUrl,
                    method: 'PUT',
                    headers: {
                        'Content-Type': fileType,
                    },
                }
            })
        }

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
        const uploadFolder = resolveUploadFolder(formData.get("folder"), assetType)

        console.log(`${API_LOG_PREFIX} start`, {
            assetType,
            uploadFolder,
            fileName: file.name,
            fileSize: file.size,
        })

        const result = await UploadFile(file, uploadFolder)

        if (!result.success || !result.url || !result.key) {
            return NextResponse.json(
                { ok: false, message: "No se pudo subir el archivo." },
                { status: 500 }
            )
        }

        console.log(`${API_LOG_PREFIX} success`, {
            assetType,
            fileName: file.name,
            url: result.url,
        })

        return NextResponse.json({
            ok: true,
            message: "Archivo subido correctamente.",
            data: {
                assetType,
                filename: result.filename || file.name,
                size: file.size,
                type: file.type,
                status: "success",
                url: result.url,
                key: result.key
            }
        })
    } catch (error) {
        console.error(`${API_LOG_PREFIX} error`, error)

        return NextResponse.json(
            { ok: false, message: "Error interno del servidor." },
            { status: 500 }
        )
    }
}
