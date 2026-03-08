import { NextPage } from 'next'

import ContainerPage from '@/components/Layout/Layouts'

import VideoForm from '../components/VideoForm'

interface Props {}

const Page: NextPage<Props> = () => {
    return (
        <ContainerPage>
            <VideoForm />
        </ContainerPage>
    )
}

export default Page
