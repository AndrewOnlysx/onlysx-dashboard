'use client'

import EditGallery from '@/database/actions/galeries/EditGallery'
import { CircularProgress } from '@mui/material'
import { NextPage } from 'next'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface GalleryType {
    _id: string
    idTags: string[]
    idModel: string[]
    idRelatedVideo: string
    name: string
    images: { filename: string, status: string, url: string }[]
    createdAt: string
    updatedAt: string
    __v: number
}

interface Props {
    gallery: GalleryType
}

const EditorGallery: NextPage<Props> = ({ gallery }) => {

    const [name, setName] = useState(gallery.name)
    const [video, setVideo] = useState(gallery.idRelatedVideo || '')
    const [model, setModel] = useState(gallery.idModel?.[0] || '')
    const [tags, setTags] = useState<string[]>(gallery.idTags || [])

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const [images, setImages] = useState(
        gallery.images.map((img) => ({
            ...img,
            isNew: false
        }))
    )

    const [loading, setLoading] = useState(false)




    const [loadingImage, setLoadingImage] = useState<number | null>(null)
    const [uploadingNewImages, setUploadingNewImages] = useState(false)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploadingNewImages(true)
        const formData = new FormData()
        acceptedFiles.forEach(file => formData.append('images', file))

        const result = await fetch('/api/galeries/uploadFiles', {
            method: 'POST',
            body: formData
        })

        console.log({ result })
        if (!result.ok) {
            alert('Error subiendo las imágenes')
            return
        }


        const { data: dataWhitNameAndStatus } = await result.json()

        const resultAction = await EditGallery({
            galleryId: gallery._id,
            images: [...images, ...dataWhitNameAndStatus]
        })
        console.log('EditGallery response:', resultAction)
        setImages(prev => [...prev, ...dataWhitNameAndStatus])
        setUploadingNewImages(false)
    }, [])
    const replaceImage = async (index: number, file: File) => {
        try {
            setLoadingImage(index)

            const formData = new FormData()
            formData.append('images', file)

            const result = await fetch('/api/galeries/uploadFiles', {
                method: 'POST',
                body: formData
            })

            if (!result.ok) {
                //  throw new Error('Upload failed')
                alert('Error subiendo la imagen')
                return
            }

            const data: { urls?: string[] } = await result.json()
            const newUrl = data.urls?.[0]

            if (!newUrl) {
                throw new Error('No URL returned')
            }

            // ✅ Copia inmutable real
            const updatedImages = images.map((img, i) =>
                i === index ? { ...img, url: newUrl } : img
            )

            const response = await EditGallery({
                galleryId: gallery._id,
                images: updatedImages
            })
            console.log('EditGallery response:', response)
            setImages(updatedImages)
            setLoading(false)

        } catch (error) {
            console.error('Error actualizando la galería:', error)
            alert('Error actualizando la galería')
        } finally {

            setLoadingImage(null)
        }
    }

    const removeImage = async (index: number) => {
        setLoadingImage(index)
        try {
            const response = await EditGallery({
                galleryId: gallery._id,
                images: images.filter((_, i) => i !== index)
            })
            console.log('EditGallery response:', response)
            setImages(prev => prev.filter((_, i) => i !== index))
        } catch (error) {
            console.error('Error actualizando la galería:', error)
            alert('Error actualizando la galería')
        } finally {
            setLoadingImage(null)
        }
    }

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => setLoading(false), 1000)
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: { 'image/*': [] },
        maxFiles: 20
    })
    return (
        <div className="max-w-7xl mx-auto p-6 text-white">

            <h1 className="text-2xl font-bold mb-8">
                Editar Galería
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* PANEL IZQUIERDO */}
                <div className="lg:col-span-1 space-y-6">

                    <div>
                        <label className="block text-sm mb-2">Nombre</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Video</label>
                        <select
                            value={video}
                            onChange={e => setVideo(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
                        >
                            <option value="">Seleccionar video</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Modelo</label>
                        <select
                            value={model}
                            onChange={e => setModel(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
                        >
                            <option value="">Seleccionar modelo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Tags</label>
                        <input
                            value={tags.join(', ')}
                            onChange={e =>
                                setTags(
                                    e.target.value.split(',').map(t => t.trim())
                                )
                            }
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
                        />
                    </div>



                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-zinc-200 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>

                </div>

                {/* PANEL DERECHO */}
                <div className="lg:col-span-2">

                    {/* Toggle vista */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-lg">
                            Imágenes ({images.length})
                        </h2>

                        <div className="flex gap-2">
                            <button>
                                Upload Images
                            </button>
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
                        className="max-h-[800px] overflow-y-auto">
                        <input {...getInputProps()} />

                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            opacity: uploadingNewImages ? 1 : 0,
                            transition: 'opacity 0.3s',
                            zIndex: uploadingNewImages ? 10 : 0
                        }}>
                            <CircularProgress />
                        </div>

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
                                            {img.isNew ? 'Imagen nueva' : 'Imagen existente'}
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
                        <br />

                    </div>


                </div>
            </div>
        </div>
    )
}

const ImageCard = ({ img, index, replaceImage, removeImage, loading }: any) => (
    <div className="relative group rounded-lg overflow-hidden bg-zinc-900" onClick={(e) => e.stopPropagation()}>
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            opacity: loading ? 1 : 0,
            transition: 'opacity 0.3s',
            zIndex: loading ? 10 : 0
        }}>
            <CircularProgress style={{ zIndex: 99 }} />
        </div>

        <img src={img.url} className="w-full h-40 object-cover" />

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
                    onChange={e => {
                        if (e.target.files?.[0]) {
                            replaceImage(index, e.target.files[0])
                        }
                    }}
                />
            </label>

            <button
                onClick={() => removeImage(index)}
                className="bg-red-600 text-white text-xs px-3 py-1 rounded cursor-pointer"
            >
                Eliminar
            </button>
        </div>
    </div>
)

export default EditorGallery