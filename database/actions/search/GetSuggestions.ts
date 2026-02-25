"use server";

import { Video } from "@/database/models/Video";
import { Models } from "@/database/models/Models";
import { Tags } from "@/database/models/Tags";
import { ModelType, TagType, VideoType } from "@/types/Types";
import { connectDB } from "@/database/utils/mongodb";

/**
 * Escapa caracteres especiales de una cadena para usarla como RegExp.
 * (Opcional, evita que una búsqueda con '*', '+' o '?' se interprete como regex)
 */
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Devuelve sugerencias de búsqueda (videos, modelos y tags) que contengan el
 * texto introducido en la base de datos.
 *
 * @param query Texto a buscar
 * @returns Objetos con los resultados filtrados
 */
export async function getSearchSuggestions(
    query: string
): Promise<{
    videos: VideoType[];
    models: ModelType[];
    tags: TagType[];
}> {
    await connectDB()
    // Si el query está vacío o sólo contiene espacios, devolvemos resultados vacíos
    if (!query.trim()) return { videos: [], models: [], tags: [] };

    // Creamos una expresión regular que ignore mayúsculas/minúsculas
    const regex = new RegExp(escapeRegex(query), "i");

    try {
        // Ejecutamos las tres búsquedas en paralelo
        const [videos, models, tags] = await Promise.all([
            Video.find({ title: regex }).sort({ createdAt: -1 })
                .limit(10)   // Ajusta o elimina el límite según necesites
                .lean()      // Devuelve objetos JS sin la sobrecarga de Mongoose
                .exec(),

            Models.find({ name: regex })
                .limit(10)
                .lean()
                .exec(),

            Tags.find({ name: regex })
                .limit(10)
                .lean()
                .exec(),
        ]);

        return JSON.parse(JSON.stringify({ videos, models, tags }));
    } catch (error) {
        console.error("Error fetching search suggestions:", error);
        // En caso de error devolvemos los resultados vacíos
        return { videos: [], models: [], tags: [] };
    }
}
