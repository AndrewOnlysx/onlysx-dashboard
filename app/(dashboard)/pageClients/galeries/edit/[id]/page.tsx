import { GetGaleriesById } from '@/database/actions/galeries/GetGaleriesById'
import { Edit } from '@toolpad/core'
import { NextPage } from 'next'
import EditorGallery from './components/EditorGallery'

interface Props {
    params: Promise<{ id: string }>
}


const Page: NextPage<Props> = async ({ params }) => {
    const { id } = await params
    const { galeries } = await GetGaleriesById(id)
    console.log({ galeries })
    return <div>

        <EditorGallery gallery={galeries} />
    </div>
}

export default Page