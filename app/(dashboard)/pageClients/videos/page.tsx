import { NextPage } from 'next'

import ContainerPage from '@/components/Layout/Layouts'
import { GetVideos } from '@/database/actions/videos/GetVideos'

import VideoAdminScreen from './components/VideoAdminScreen'

interface Props {}

const Page: NextPage<Props> = async () => {
    const { videos, summary, filters } = await GetVideos()

    return (
        <ContainerPage>
            <VideoAdminScreen
                videos={videos}
                summary={summary}
                qualities={filters.qualities}
            />
        </ContainerPage>
    )
}

export default Page
