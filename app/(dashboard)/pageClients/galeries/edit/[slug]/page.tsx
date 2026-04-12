import { GetGaleriesById } from '@/database/actions/galeries/GetGaleriesById'
import { NextPage } from 'next'
import GalleryForm from '../../components/GalleryForm'

interface Props {
    params: Promise<{ slug: string }>
}


const Page: NextPage<Props> = async ({ params }) => {
    const { slug } = await params
    const { galeries } = await GetGaleriesById(slug)
    return <GalleryForm mode="edit" gallery={galeries} />
}

export default Page
