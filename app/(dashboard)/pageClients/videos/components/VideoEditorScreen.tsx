import ContainerPage from '@/components/Layout/Layouts'
import { VideoType } from '@/types/Types'

import VideoForm from './VideoForm'

interface Props {
    mode: 'create' | 'edit'
    initialVideo?: VideoType | null
}

const COPY_BY_MODE = {
    create: {
        eyebrow: 'Create',
        title: 'Nuevo video',
        description:
            'Alta editorial con carga de assets, metadata y relaciones en un flujo consistente con el resto del dashboard.'
    },
    edit: {
        eyebrow: 'Edit',
        title: 'Editar video',
        description:
            'La misma pantalla de alta cambia a modo edicion para reemplazar assets o conservar las URLs actuales antes de persistir el update.'
    }
} as const

const VideoEditorScreen = ({ mode, initialVideo }: Props) => {
    const copy = COPY_BY_MODE[mode]

    return (
        <ContainerPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
        >
            <VideoForm
                mode={mode}
                initialVideo={initialVideo}
            />
        </ContainerPage>
    )
}

export default VideoEditorScreen