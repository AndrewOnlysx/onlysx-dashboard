import GetModelById from '@/database/actions/models/GetModelById'
import { NextPage } from 'next'
import ContainerPage from '@/components/Layout/Layouts'
import ModelForm from '../components/ModelForm'

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
            <ModelForm mode="edit" model={model} />
        </ContainerPage>
    )
}

export default Page