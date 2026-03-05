'use client'

import SelectModel from '@/components/ModelSelector/SelectModel'
import Selectag from '@/components/TagsSelector/Selectag'
import { CreateGallery } from '@/database/actions/galeries/CreateGallery'
import { ModelType, TagType } from '@/types/Types'
import { CircularProgress } from '@mui/material'
import { NextPage } from 'next'
import Image from 'next/image'
import { Select } from 'radix-ui'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface LocalImage {
    filename: string
    url: string
    status: string
    isNew: boolean
}

interface Props { }

const AddGalerieScreen: NextPage<Props> = () => {
    const [name, setName] = useState('')
    const [video, setVideo] = useState('')
    const [model, setModel] = useState('')
    const [tags, setTags] = useState<string[]>([])

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [images, setImages] = useState<LocalImage[]>([])

    const [loading, setLoading] = useState(false)
    const [loadingImage, setLoadingImage] = useState<number | null>(null)
    const [uploadingNewImages, setUploadingNewImages] = useState(false)

    // 🔥 Agregar imágenes nuevas
    const onDrop = async (acceptedFiles: File[]) => {
        setUploadingNewImages(true)

        const formData = new FormData()
        acceptedFiles.forEach(file => formData.append('images', file))



        const result = await fetch('/api/galeries/uploadFiles', {
            method: 'POST',
            body: formData
        })

        if (!result.ok) {
            alert('Error subiendo las imágenes')
            return
        }


        const { data: dataWhitNameAndStatus } = await result.json()
        // setImages((prev) => [...prev, ...mapped])
        console.log(dataWhitNameAndStatus)
        setImages(prev => [...prev, ...dataWhitNameAndStatus])

        setUploadingNewImages(false)
    }

    // 🔁 Reemplazar imagen
    const replaceImage = async (index: number, file: File) => {
        /*     setLoadingImage(index)
     
             const updated = images.map((img, i) =>
                 i === index
                     ? {
                         file,
                         url: URL.createObjectURL(file),
                         isNew: true
                     }
                     : img
             )
     
             setImages(updated)
     
             console.log('Imagen reemplazada:', index)
     
             setLoadingImage(null)*/
    }

    // 🗑 Eliminar imagen
    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        console.log('Imagen eliminada:', index)
    }

    // 💾 Guardar galería
    const handleSave = async () => {
        setLoading(true)

        const payload = {
            name,
            idRelatedVideo: video,
            idModel: selectedModels.map(m => m._id),
            idTags: selectedTags.map(t => t._id),
            images: images.map(img => ({
                filename: img.filename,
                url: img.url,
                status: 'uploaded',
                isNew: img.isNew
            }))
        }
        try {
            const result = await CreateGallery(payload)
        } catch (error) {
            console.error('Error creando galería:', error)
            alert('Error creando galería')
        } finally {
            setLoading(false)
        }
        setTimeout(() => {
            setLoading(false)
        }, 800)
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        accept: { 'image/*': [] },
        maxFiles: 20
    })
    const [selectedModels, setSelectedModels] = useState<ModelType[]>([])
    const [selectedTags, setSelectedTags] = useState<TagType[]>([])
    return (
        <div className="max-w-7xl mx-auto p-6 text-white">
            <h1 className="text-2xl font-bold mb-8">
                Crear Nueva Galería
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* PANEL IZQUIERDO */}
                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <label className="block text-sm mb-2">Nombre</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Video</label>
                        <input
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Modelo</label>

                        <SelectModel selectedModels={selectedModels} setSelectedModels={setSelectedModels} />
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Tags</label>
                        <Selectag selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-zinc-200 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Crear galería'}
                    </button>
                </div>

                {/* PANEL DERECHO */}
                <div className="lg:col-span-2">

                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-lg">
                            Imágenes ({images.length})
                        </h2>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1 rounded ${viewMode === 'grid'
                                    ? 'bg-white text-black'
                                    : 'bg-zinc-800'
                                    }`}
                            >
                                Cuadrícula
                            </button>

                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 rounded ${viewMode === 'list'
                                    ? 'bg-white text-black'
                                    : 'bg-zinc-800'
                                    }`}
                            >
                                Lista
                            </button>
                        </div>
                    </div>

                    <div
                        {...getRootProps()}
                        className="max-h-[800px] overflow-y-auto border-2 border-dashed border-zinc-700 rounded-lg p-4 relative cursor-pointer"
                    >
                        <input {...getInputProps()} />

                        {/* Overlay loader */}
                        {uploadingNewImages && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                                <CircularProgress />
                            </div>
                        )}

                        {/* GRID */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((img, index) => (
                                    <ImageCard
                                        key={index}
                                        img={img}
                                        index={index}
                                        replaceImage={replaceImage}
                                        removeImage={removeImage}
                                        loading={loadingImage === index}
                                    />
                                ))}
                            </div>
                        )}

                        {/* LIST */}
                        {viewMode === 'list' && (
                            <div className="space-y-4">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 bg-zinc-900 rounded-lg p-3"
                                    >
                                        <img
                                            src={img.url}
                                            className="w-32 h-20 object-cover rounded"
                                        />

                                        <div className="flex-1 text-sm">
                                            Imagen nueva
                                        </div>

                                        <button
                                            onClick={() => removeImage(index)}
                                            className="bg-red-600 text-xs px-3 py-1 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface ImageCardProps {
    img: LocalImage
    index: number
    replaceImage: (index: number, file: File) => void
    removeImage: (index: number) => void
    loading: boolean
}

const ImageCard = ({
    img,
    index,
    replaceImage,
    removeImage,
    loading
}: ImageCardProps) => (
    <div
        className="relative group rounded-lg overflow-hidden bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
    >
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                <CircularProgress />
            </div>
        )}

        <Image
            src={img.url}
            alt={`Imagen ${index}`}
            width={400}
            height={160}
            className="w-full h-40 object-cover"
        />

        {img.isNew && (
            <div className="absolute top-2 left-2 bg-green-600 text-xs px-2 py-1 rounded">
                Nueva
            </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <label className="bg-white text-black text-xs px-3 py-1 rounded cursor-pointer">
                Cambiar
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            replaceImage(index, e.target.files[0])
                        }
                    }}
                />
            </label>

            <button
                onClick={() => removeImage(index)}
                className="bg-red-600 text-white text-xs px-3 py-1 rounded"
            >
                Eliminar
            </button>
        </div>
    </div>
)

export default AddGalerieScreen