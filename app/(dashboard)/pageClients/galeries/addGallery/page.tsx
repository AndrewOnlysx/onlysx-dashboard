import ContainerPage from '@/components/Layout/Layouts'
import { NextPage } from 'next'
import GalleryForm from '../components/GalleryForm'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return <ContainerPage
        eyebrow="Create"
        title="Nueva galeria"
        description="Carga imagenes, vincula modelos y tags, y prepara la galeria para publicacion con una interfaz uniforme."
    >
        <GalleryForm mode="create" />
    </ContainerPage>
}

export default Page
