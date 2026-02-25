"use server"

import { Models } from "@/database/models/Models"
import { Video } from "@/database/models/Video"
import { Galeries } from "@/database/models/Galeries"
import { connectDB } from "@/database/utils/mongodb"

export async function GetModels() {
    try {
        await connectDB()
        // 1️⃣ Obtener todos los modelos
        const models = await Models.find().sort({ name: 1 }).lean() // 1 = ascendente

        // 2️⃣ Contar videos agrupados por modelo
        const videosCount = await Video.aggregate([
            { $unwind: "$models" },
            {
                $group: {
                    _id: "$models",
                    totalVideos: { $sum: 1 }
                }
            }
        ])

        // 3️⃣ Contar galerías agrupadas por modelo
        const galeriesCount = await Galeries.aggregate([
            { $unwind: "$idModel" },
            {
                $group: {
                    _id: "$idModel",
                    totalGaleries: { $sum: 1 }
                }
            }
        ])

        // 4️⃣ Convertir a mapas para lookup rápido
        const videoMap = new Map(
            videosCount.map(item => [item._id.toString(), item.totalVideos])
        )
        const galeryMap = new Map(
            galeriesCount.map(item => [item._id.toString(), item.totalGaleries])
        )

        // 5️⃣ Combinar datos
        const modelsWithStats = models.map((model: any) => ({
            ...model,
            totalVideos: videoMap.get(model._id.toString()) || 0,
            totalGaleries: galeryMap.get(model._id.toString()) || 0
        }))

        return {
            ok: true,
            models: JSON.parse(JSON.stringify(modelsWithStats.map((model: any, index) => ({
                ...model,
                id: index + 1, // Agregar un ID incremental para el DataGrid
            }))))
        }

    } catch (error) {
        console.error(error)
        return {
            ok: false,
            models: []
        }
    }
}