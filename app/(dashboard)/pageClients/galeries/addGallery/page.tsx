import ContainerPage from '@/components/Layout/Layouts'
import { Container } from 'lucide-react'
import { NextPage } from 'next'
import AddGalerieScreen from './components/AddGalerieScreen'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return <ContainerPage>
        <AddGalerieScreen />
    </ContainerPage>
}

export default Page