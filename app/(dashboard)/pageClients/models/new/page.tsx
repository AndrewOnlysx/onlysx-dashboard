import ContainerPage from '@/components/Layout/Layouts'

import ModelForm from '../components/ModelForm'

const Page = () => {
    return (
        <ContainerPage
            eyebrow="Nuevo"
            title="Crear modelo"
            description="Publica un perfil nuevo para que quede disponible en el catalogo y en los selectores editoriales."
        >
            <ModelForm mode="create" />
        </ContainerPage>
    )
}

export default Page