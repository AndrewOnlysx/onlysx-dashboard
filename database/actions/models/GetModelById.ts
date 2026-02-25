import { Models } from "@/database/models/Models"
import { connectDB } from "@/database/utils/mongodb"


export const GetModelById = async (id: string) => {
    try {
        await connectDB()
        const response = await Models.findById(id).lean()
        if (!response) {
            return {
                ok: false,
                message: "Model not found"
            }
        }
        return {
            ok: true,
            model: JSON.parse(JSON.stringify(response))
        }
    } catch (error) {
        console.error(error)
        return {
            ok: false,
            message: "Error fetching model"
        }
    }
}