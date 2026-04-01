import ContainerPage from '@/components/Layout/Layouts'
import Link from 'next/link'
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
        actions={
            <Link href="/pageClients/models/new" className="primary-action">
                Nuevo modelo
            </Link>
        }
    >
        <GridModels models={models} />
    </ContainerPage>
}

export default Page