import { notFound } from 'next/navigation'
import { NextPage } from 'next'

import { GetVideoById } from '@/database/actions/videos/GetVideoById'

import VideoEditorScreen from '../../components/VideoEditorScreen'

interface Props {
    params: Promise<{ id: string }>
}

const Page: NextPage<Props> = async ({ params }) => {
    const { id } = await params
    const result = await GetVideoById(id)

    if (!result.ok || !result.video) {
        notFound()
    }

    return (
        <VideoEditorScreen
            mode="edit"
            initialVideo={result.video}
        />
    )
}

export default Page
