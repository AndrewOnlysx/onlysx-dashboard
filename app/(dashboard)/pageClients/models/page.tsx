import ContainerPage from '@/components/Layout/Layouts'
import { NextPage } from 'next'
import GridModels from './components/GridModels'
import { GetModels } from '@/database/actions/models/GetModels'

interface Props { }

const Page: NextPage<Props> = async ({ }) => {
    const { models } = await GetModels()

    return <ContainerPage
        eyebrow="Catalogo"
        title="Modelos"
        description="Administra perfiles, assets visuales y accesos a la vista publica de cada modelo desde una unica tabla operativa."
    >
        <GridModels models={models} />
    </ContainerPage>
}

export default Page