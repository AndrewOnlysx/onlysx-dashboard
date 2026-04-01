import { NextPage } from 'next'
import Link from 'next/link'

import ContainerPage from '@/components/Layout/Layouts'
import { GetVideos } from '@/database/actions/videos/GetVideos'

import VideoAdminScreen from './components/VideoAdminScreen'

interface Props { }

const Page: NextPage<Props> = async () => {
    const { videos, summary, filters } = await GetVideos()

    return (
        <ContainerPage
            eyebrow="Catalogo"
            title="Videos"
            description="Gestion centralizada del catalogo audiovisual con filtros, indicadores y acceso directo a la edicion de cada registro."
            actions={
                <Link href="/pageClients/videos/upload-debug" className="secondary-action">
                    Probar Upload Aislado
                </Link>
            }
        >
            <VideoAdminScreen
                videos={videos}
                summary={summary}
                qualities={filters.qualities}
            />
        </ContainerPage>
    )
}

export default Page
