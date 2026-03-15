'use server'

import { z } from 'zod'

import CreateVideo from './CreateVideo'
import UpdateVideo from './UpdateVideo'
import { createVideoInputSchema } from './videoInput'

const saveVideoInputSchema = createVideoInputSchema.extend({
    videoId: z.string().trim().optional().nullable()
})

export type SaveVideoInput = z.infer<typeof saveVideoInputSchema>

export const SaveVideo = async (input: SaveVideoInput) => {
    const parsedInput = saveVideoInputSchema.parse(input)

    if (parsedInput.videoId) {
        return UpdateVideo({
            ...parsedInput,
            videoId: parsedInput.videoId
        })
    }

    const { videoId, ...createPayload } = parsedInput

    return CreateVideo(createPayload)
}

export default SaveVideo