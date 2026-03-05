'use server'

import { Tags } from '@/database/models/Tags'
import { connectDB } from '@/database/utils/mongodb'

export const GetTags = async () => {
    await connectDB()
    const AllTags = await Tags.find().sort({ searches: -1 }).lean()
    return JSON.parse(JSON.stringify({ tags: AllTags }))
}

export default GetTags