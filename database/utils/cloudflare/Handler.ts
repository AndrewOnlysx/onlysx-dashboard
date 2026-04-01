import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "node:stream";

const bucketName = process.env.NEXT_BUCKET ?? ""
const publicBaseUrl = "https://cdn.onlysx.stream"
const R2_LOG_PREFIX = '[r2]'

export const buildPublicUrl = (key: string) => {
    const encodedKey = key
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/')

    return `${publicBaseUrl}/${encodedKey}`
}

export const sanitizeUploadFilename = (filename: string) =>
    filename
        .trim()
        .replace(/\s+/g, '-')

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
        const sanitizedFilename = sanitizeUploadFilename(filename)
        const key = `page-content/${userId}/${sanitizedFilename}`

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType || 'application/octet-stream',
        })

        const uploadUrl = await getSignedUrl(R2 as any, command as any, { expiresIn: 60 * 60 })
        const url = buildPublicUrl(key)

        console.log(`${R2_LOG_PREFIX} target`, {
            key,
            sanitizedFilename,
            contentType,
        })

        return {
            success: true,
            uploadUrl,
            url,
            key,
            filename: sanitizedFilename,
        }
    } catch (error) {
        console.error(`${R2_LOG_PREFIX} target-error`, error)

        return {
            success: false,
            uploadUrl: null,
            url: null,
            key: null,
            filename: null,
        }
    }
}

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
        const sanitizedFilename = sanitizeUploadFilename(file.name);
        const key = `page-content/${userId}/${sanitizedFilename}`;

        console.log(`${R2_LOG_PREFIX} start`, {
            key,
            fileName: file.name,
            sanitizedFilename,
            fileSize: file.size,
        })

        const stream = Readable.fromWeb(file.stream() as any);

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: stream,
            ContentType: file.type,
            ContentLength: file.size, // 👈 SOLUCIÓN
        });

        const response = await R2.send(command);
        const headResponse = await R2.send(new HeadObjectCommand({
            Bucket: bucketName,
            Key: key,
        }))

        const url = buildPublicUrl(key);

        console.log(`${R2_LOG_PREFIX} success`, {
            key,
            url,
            etag: response.ETag,
            contentLength: headResponse.ContentLength,
        })

        return {
            success: true,
            url,
            key,
            filename: sanitizedFilename,
            etag: response.ETag,
        };
    } catch (error) {
        console.error(`${R2_LOG_PREFIX} error`, error);
        return {
            success: false,
            url: null,
            key: null,
            filename: null,
            etag: null,
        };
    }
};