import ContainerPage from '@/components/Layout/Layouts'
import { NextPage } from 'next'
import GalleryForm from '../components/GalleryForm'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return <ContainerPage>
        <GalleryForm mode="create" />
    </ContainerPage>
}

export default Page
