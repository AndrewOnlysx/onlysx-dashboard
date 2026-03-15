import GaleryView from '@/components/Gallery/GaleryView'
import ContainerPage from '@/components/Layout/Layouts'
import { GetAllGalery } from '@/database/actions/galeries/GetAllGallery'
import { NextPage } from 'next'
import GaleriesAdminScreen from './edit/[id]/components/GalerieAdminScreen'

interface Props { }

const Page: NextPage<Props> = async ({ }) => {
    const { galeries, ok } = await GetAllGalery()
    return <ContainerPage
        eyebrow="Catalogo"
        title="Galerias"
        description="Organiza colecciones de imagenes, visibilidad y relaciones editoriales dentro del mismo lenguaje visual del dashboard."
    >

        <GaleriesAdminScreen galeries={galeries} />
    </ContainerPage>

}

export default Page