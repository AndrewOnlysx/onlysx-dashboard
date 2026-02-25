import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const R2 = new S3Client({
    region: 'auto',
    endpoint: process.env.NEXT_URL ?? '',
    credentials: {
        accessKeyId: process.env.NEXT_CLIENT_ID ?? '',
        secretAccessKey: process.env.NEXT_SECRET_ID ?? '',
    },
})

export const UploadFile = async (file: File, userId: string) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const key = `page-content/${userId}/${file.name}`;
    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.NEXT_BUCKET ?? '',
        Key: key,
        Body: buffer,
    });

    try {
        const response = await R2.send(putObjectCommand);
        const baseUrl = `https://cdn.onlysx.stream`;
        const url = `${baseUrl}/${key}`;

        return {
            success: true,
            url,
            key,
            etag: response.ETag,
        };

    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}