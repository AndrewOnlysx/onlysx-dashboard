import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/database/utils/mongodb'
import { Galeries } from '@/database/models/Galeries'

export async function GET() {
    try {
        await connectDB()

        const galeries = await Galeries.find({})

        let updatedCount = 0

        for (const gallery of galeries) {
            let needsUpdate = false

            // ---- idModel ----
            let newIdModel = gallery.idModel?.map((id: any) => {
                //  if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
                //    needsUpdate = true
                return new mongoose.Types.ObjectId(id)
                //   }
                //    return id
            })

            // ---- idTags ----
            let newIdTags = gallery.idTags?.map((id: any) => {
                //   if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
                needsUpdate = true
                return new mongoose.Types.ObjectId(id)
                //  }
                //  return id
            })

            // ---- idRelatedVideo ----
            let newRelatedVideo = gallery.idRelatedVideo

            // if (
            //  typeof gallery.idRelatedVideo === 'string' &&
            //  mongoose.Types.ObjectId.isValid(gallery.idRelatedVideo)
            // ) {
            needsUpdate = true
            newRelatedVideo = new mongoose.Types.ObjectId(
                gallery.idRelatedVideo
            )
            // }

            if (needsUpdate) {
                await Galeries.updateOne(
                    { _id: gallery._id },
                    {
                        $set: {
                            idModel: newIdModel,
                            idTags: newIdTags,
                            idRelatedVideo: newRelatedVideo
                        }
                    }
                )

                updatedCount++
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Migration completed',
            updatedDocuments: updatedCount
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { success: false, error: 'Migration failed' },
            { status: 500 }
        )
    }
}