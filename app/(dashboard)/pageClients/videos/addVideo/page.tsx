import { NextPage } from 'next'

import VideoEditorScreen from '../components/VideoEditorScreen'

interface Props { }

const Page: NextPage<Props> = () => {
    return (
        <VideoEditorScreen mode="create" />
    )
}

export default Page
