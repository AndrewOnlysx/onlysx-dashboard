import {
    AbortMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    PutObjectCommand,
    S3Client,
    UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "node:stream";

const bucketName = process.env.NEXT_BUCKET ?? ""
const publicBaseUrl = "https://cdn.onlysx.stream"

const R2 = new S3Client({
    region: "auto",
    endpoint: process.env.NEXT_URL ?? "",
    credentials: {
        accessKeyId: process.env.NEXT_CLIENT_ID ?? "",
        secretAccessKey: process.env.NEXT_SECRET_ID ?? "",
    },
});

export const UploadFile = async (file: File, userId: string) => {
    try {
        const key = `page-content/${userId}/${file.name}`;

        // convertir WebStream → Node Stream
        const stream = Readable.fromWeb(file.stream() as any);

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: stream,
            ContentType: file.type,
            ContentLength: file.size, // 👈 SOLUCIÓN
        });

        const response = await R2.send(command);

        const url = `${publicBaseUrl}/${key}`;

        return {
            success: true,
            url,
            key,
            etag: response.ETag,
        };
    } catch (error) {
        console.error("Error subiendo archivo a R2:", error);
        return {
            success: false,
            url: null,
            key: null,
            etag: null,
        };
    }
};

export const CreateDirectUploadTarget = async ({
    filename,
    contentType,
    userId,
}: {
    filename: string
    contentType: string
    userId: string
}) => {
    try {
        const key = `page-content/${userId}/${filename}`

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType || "application/octet-stream",
        })

        const uploadUrl = await getSignedUrl(R2 as any, command as any, { expiresIn: 60 * 60 })
        const url = `${publicBaseUrl}/${key}`

        return {
            success: true,
            uploadUrl,
            url,
            key,
        }
    } catch (error) {
        console.error("Error creando upload directo a R2:", error)

        return {
            success: false,
            uploadUrl: null,
            url: null,
            key: null,
        }
    }
}

export const CreateMultipartUploadTarget = async ({
    filename,
    contentType,
    userId,
}: {
    filename: string
    contentType: string
    userId: string
}) => {
    try {
        const key = `page-content/${userId}/${filename}`

        const response = await R2.send(new CreateMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType || "application/octet-stream",
        }))

        if (!response.UploadId) {
            return {
                success: false,
                uploadId: null,
                url: null,
                key: null,
            }
        }

        return {
            success: true,
            uploadId: response.UploadId,
            url: `${publicBaseUrl}/${key}`,
            key,
        }
    } catch (error) {
        console.error("Error creando multipart upload en R2:", error)

        return {
            success: false,
            uploadId: null,
            url: null,
            key: null,
        }
    }
}

export const CreateMultipartUploadPartUrl = async ({
    key,
    uploadId,
    partNumber,
}: {
    key: string
    uploadId: string
    partNumber: number
}) => {
    try {
        const command = new UploadPartCommand({
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber,
        })

        const uploadUrl = await getSignedUrl(R2 as any, command as any, { expiresIn: 60 * 60 })

        return {
            success: true,
            uploadUrl,
            partNumber,
        }
    } catch (error) {
        console.error("Error creando URL firmada para parte multipart:", error)

        return {
            success: false,
            uploadUrl: null,
            partNumber,
        }
    }
}

export const CompleteMultipartUploadTarget = async ({
    key,
    uploadId,
    parts,
}: {
    key: string
    uploadId: string
    parts: Array<{ ETag: string; PartNumber: number }>
}) => {
    try {
        await R2.send(new CompleteMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: parts,
            },
        }))

        return {
            success: true,
            url: `${publicBaseUrl}/${key}`,
            key,
        }
    } catch (error) {
        console.error("Error completando multipart upload en R2:", error)

        return {
            success: false,
            url: null,
            key: null,
        }
    }
}

export const AbortMultipartUploadTarget = async ({
    key,
    uploadId,
}: {
    key: string
    uploadId: string
}) => {
    try {
        await R2.send(new AbortMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
        }))

        return { success: true }
    } catch (error) {
        console.error("Error abortando multipart upload en R2:", error)
        return { success: false }
    }
}