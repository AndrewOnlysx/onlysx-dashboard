import { randomUUID } from "node:crypto"

import { NextResponse } from "next/server"

import {
    AbortMultipartUploadTarget,
    CompleteMultipartUploadTarget,
    CreateDirectUploadTarget,
    CreateMultipartUploadPartUrl,
    CreateMultipartUploadTarget,
    UploadFile,
} from "@/database/utils/cloudflare/Handler"

type AssetType = "video" | "cover"

interface DirectUploadRequestBody {
    action?: "completeMultipart" | "abortMultipart"
    filename?: string
    size?: number
    type?: string
    assetType?: AssetType
    folder?: string
    key?: string
    uploadId?: string
    parts?: Array<{ ETag: string; PartNumber: number }>
}

const SINGLE_PUT_MAX_BYTES = 5 * 1024 * 1024 * 1024
const MULTIPART_PART_SIZE_BYTES = 64 * 1024 * 1024

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

        if (contentType.includes("application/json")) {
            const body = (await req.json()) as DirectUploadRequestBody
            const action = body.action

            if (action === "completeMultipart") {
                const key = typeof body.key === "string" ? body.key : ""
                const uploadId = typeof body.uploadId === "string" ? body.uploadId : ""
                const parts = Array.isArray(body.parts) ? body.parts : []

                if (!key || !uploadId || parts.length === 0) {
                    return NextResponse.json(
                        { ok: false, message: "Faltan datos para completar el multipart upload." },
                        { status: 400 }
                    )
                }

                const result = await CompleteMultipartUploadTarget({ key, uploadId, parts })

                if (!result.success || !result.url || !result.key) {
                    return NextResponse.json(
                        { ok: false, message: "No se pudo completar el multipart upload." },
                        { status: 500 }
                    )
                }

                return NextResponse.json({
                    ok: true,
                    message: "Multipart upload completado correctamente.",
                    data: {
                        assetType: body.assetType === "cover" ? "cover" : "video",
                        filename: body.filename ?? "",
                        size: typeof body.size === "number" ? body.size : 0,
                        type: typeof body.type === "string" ? body.type : "application/octet-stream",
                        url: result.url,
                        key: result.key,
                    }
                })
            }

            if (action === "abortMultipart") {
                const key = typeof body.key === "string" ? body.key : ""
                const uploadId = typeof body.uploadId === "string" ? body.uploadId : ""

                if (!key || !uploadId) {
                    return NextResponse.json(
                        { ok: false, message: "Faltan datos para abortar el multipart upload." },
                        { status: 400 }
                    )
                }

                const result = await AbortMultipartUploadTarget({ key, uploadId })

                return NextResponse.json(
                    result.success
                        ? { ok: true, message: "Multipart upload abortado." }
                        : { ok: false, message: "No se pudo abortar el multipart upload." },
                    { status: result.success ? 200 : 500 }
                )
            }

            const filename = typeof body.filename === "string" ? body.filename.trim() : ""
            const fileType = typeof body.type === "string" && body.type.trim()
                ? body.type
                : "application/octet-stream"
            const size = typeof body.size === "number" ? body.size : 0
            const assetType = body.assetType === "cover" ? "cover" : "video"

            if (!filename) {
                return NextResponse.json(
                    { ok: false, message: "Debes enviar un nombre de archivo valido." },
                    { status: 400 }
                )
            }

            const uploadFolder = resolveUploadFolder(body.folder ?? null, assetType)

            if (assetType === "video" && size > SINGLE_PUT_MAX_BYTES) {
                const initResult = await CreateMultipartUploadTarget({
                    filename,
                    contentType: fileType,
                    userId: uploadFolder,
                })

                if (!initResult.success || !initResult.uploadId || !initResult.url || !initResult.key) {
                    return NextResponse.json(
                        { ok: false, message: "No se pudo preparar el multipart upload." },
                        { status: 500 }
                    )
                }

                const partCount = Math.ceil(size / MULTIPART_PART_SIZE_BYTES)
                const signedParts = await Promise.all(
                    Array.from({ length: partCount }, (_, index) =>
                        CreateMultipartUploadPartUrl({
                            key: initResult.key as string,
                            uploadId: initResult.uploadId as string,
                            partNumber: index + 1,
                        })
                    )
                )

                const hasFailedPart = signedParts.some((part) => !part.success || !part.uploadUrl)

                if (hasFailedPart) {
                    await AbortMultipartUploadTarget({
                        key: initResult.key,
                        uploadId: initResult.uploadId,
                    })

                    return NextResponse.json(
                        { ok: false, message: "No se pudieron preparar todas las partes del multipart upload." },
                        { status: 500 }
                    )
                }

                return NextResponse.json({
                    ok: true,
                    message: "Multipart upload preparado correctamente.",
                    data: {
                        strategy: "multipart",
                        assetType,
                        filename,
                        size,
                        type: fileType,
                        url: initResult.url,
                        key: initResult.key,
                        uploadId: initResult.uploadId,
                        partSize: MULTIPART_PART_SIZE_BYTES,
                        method: "PUT",
                        parts: signedParts.map((part) => ({
                            partNumber: part.partNumber,
                            uploadUrl: part.uploadUrl,
                        })),
                    }
                })
            }

            const result = await CreateDirectUploadTarget({
                filename,
                contentType: fileType,
                userId: uploadFolder,
            })

            if (!result.success || !result.uploadUrl || !result.url || !result.key) {
                return NextResponse.json(
                    { ok: false, message: "No se pudo preparar la subida directa." },
                    { status: 500 }
                )
            }

            return NextResponse.json({
                ok: true,
                message: "Upload directo preparado correctamente.",
                data: {
                    strategy: "single",
                    assetType,
                    filename,
                    size,
                    type: fileType,
                    url: result.url,
                    key: result.key,
                    uploadUrl: result.uploadUrl,
                    method: "PUT",
                    headers: {
                        "Content-Type": fileType,
                    },
                }
            })
        }

        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                { ok: false, message: "El cuerpo debe ser multipart/form-data o application/json." },
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
