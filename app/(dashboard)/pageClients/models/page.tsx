import ContainerPage from '@/components/Layout/Layouts'
import { NextPage } from 'next'
import GridModels from './components/GridModels'
import { GetModels } from '@/database/actions/models/GetModels'

interface Props { }

const Page: NextPage<Props> = async ({ }) => {
    const { models } = await GetModels()

    return <ContainerPage>
        <GridModels models={models} />
    </ContainerPage>
}

export default Page