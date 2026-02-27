import GetModelById from '@/database/actions/models/GetModelById'
import { NextPage } from 'next'
import EditModelForm from './components/EditModelForm'
import { use } from "react";
interface Props {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params
    const { model, ok } = await GetModelById(id)
    return <div><EditModelForm model={model} /></div>
}

export default Page