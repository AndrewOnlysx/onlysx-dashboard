'use server'

import { Video } from "@/database/models/Video";
import { connectDB } from "@/database/utils/mongodb";
import "@/database/models/Models";
import "@/database/models/Tags";
import "@/database/models/Galeries";
export const GetVideos = async () => {

    try {
        await connectDB()
        //    await Models.find() // Verificar que se puede acceder a la colección de modelos
        const video = await Video.find().sort({ createdAt: -1 }).populate("models").populate("tags").populate("galeries").exec();
        return {
            videos: video,
            recomendedContent: [],
            relatedVideos: [],
            relatedGarelies: []
        }
    } catch (error) {
        console.error('Error in GetVideoById:', error);
        throw error;
    }
}