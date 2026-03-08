'use client'

import { NextPage } from 'next'
import GalleryForm from '../../components/GalleryForm'

interface Props { }

const AddGalerieScreen: NextPage<Props> = () => {
    return <GalleryForm mode="create" />
}

export default AddGalerieScreen
