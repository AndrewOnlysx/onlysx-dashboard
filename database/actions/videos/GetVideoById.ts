'use server'

import { Video } from "@/database/models/Video";
import { connectDB } from "@/database/utils/mongodb";
import "@/database/models/Models";
import "@/database/models/Tags";
import "@/database/models/Galeries";
import mongoose from "mongoose";
export const GetVideoById = async (id: string) => {

    try {
        await connectDB()
        //    await Models.find() // Verificar que se puede acceder a la colección de modelos
        const video = await Video.findById(id).populate("models").populate("tags").populate("galeries").exec();
        return {
            video,
            recomendedContent: [],
            relatedVideos: [],
            relatedGarelies: []
        }
    } catch (error) {
        console.error('Error in GetVideoById:', error);
        throw error;
    }
}