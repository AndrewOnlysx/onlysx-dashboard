import GetModelById from '@/database/actions/models/GetModelById'
import { NextPage } from 'next'
import EditModelForm from './components/EditModelForm'
import ContainerPage from '@/components/Layout/Layouts'

interface Props {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params
    const { model } = await GetModelById(id)
    return (
        <ContainerPage
            eyebrow="Edit"
            title="Editar modelo"
            description="Actualiza nombre e imagen principal de cada perfil con el mismo sistema de superficies y controles del dashboard."
        >
            <EditModelForm model={model} />
        </ContainerPage>
    )
}

export default Page