import { GetGaleriesById } from '@/database/actions/galeries/GetGaleriesById'
import { NextPage } from 'next'
import GalleryForm from '../../components/GalleryForm'

interface Props {
    params: Promise<{ id: string }>
}


const Page: NextPage<Props> = async ({ params }) => {
    const { id } = await params
    const { galeries } = await GetGaleriesById(id)
    return <GalleryForm mode="edit" gallery={galeries} />
}

export default Page
