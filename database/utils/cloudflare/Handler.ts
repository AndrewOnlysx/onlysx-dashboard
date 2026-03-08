import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "node:stream";

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
            Bucket: process.env.NEXT_BUCKET ?? "",
            Key: key,
            Body: stream,
            ContentType: file.type,
            ContentLength: file.size, // 👈 SOLUCIÓN
        });

        const response = await R2.send(command);

        const baseUrl = `https://cdn.onlysx.stream`;
        const url = `${baseUrl}/${key}`;

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