'use client'

import SelectModel from '@/components/ModelSelector/SelectModel'
import Selectag from '@/components/TagsSelector/Selectag'
import { CreateGallery } from '@/database/actions/galeries/CreateGallery'
import EditGallery from '@/database/actions/galeries/EditGallery'
import { ModelType, TagType } from '@/types/Types'
import { CircularProgress } from '@mui/material'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface LocalImage {
    filename: string
    url: string
    status: string
    isNew: boolean
}

const sortImagesByFilename = <T extends { filename: string }>(images: T[]) => {
    return [...images].sort((a, b) =>
        a.filename.localeCompare(b.filename, undefined, {
            numeric: true,
            sensitivity: 'base'
        })
    )
}

interface GalleryFormGallery {
    _id: string
    idTags: Array<string | TagType>
    idModel: Array<string | ModelType>
    idRelatedVideo?: string | { _id: string } | null
    name: string
    images: Array<{ filename: string, status: string, url: string }>
}

interface Props {
    mode: 'create' | 'edit'
    gallery?: GalleryFormGallery
}

const toTag = (tag: string | TagType): TagType | null => {
    if (typeof tag === 'string') {
        return null
    }

    return tag
}

const toModel = (model: string | ModelType): ModelType | null => {
    if (typeof model === 'string') {
        return null
    }

    return model
}

const getVideoValue = (video?: string | { _id: string } | null) => {
    if (!video) {
        return ''
    }

    return typeof video === 'string' ? video : video._id
}

const GalleryForm: NextPage<Props> = ({ mode, gallery }) => {
    const router = useRouter()
    const isEdit = mode === 'edit'

    const [name, setName] = useState(gallery?.name ?? '')
    const [video, setVideo] = useState(getVideoValue(gallery?.idRelatedVideo))
    const [selectedModels, setSelectedModels] = useState<ModelType[]>(
        (gallery?.idModel.map(toModel).filter(Boolean) as ModelType[]) ?? []
    )
    const [selectedTags, setSelectedTags] = useState<TagType[]>(
        (gallery?.idTags.map(toTag).filter(Boolean) as TagType[]) ?? []
    )
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [images, setImages] = useState<LocalImage[]>(
        gallery?.images.map((img) => ({
            ...img,
            isNew: false
        })) ?? []
    )
    const [loading, setLoading] = useState(false)
    const [loadingImage, setLoadingImage] = useState<number | null>(null)
    const [uploadingNewImages, setUploadingNewImages] = useState(false)

    const onDrop = async (acceptedFiles: File[], fileRejections: any[]) => {
        if (isEdit) {
            if (!gallery) {
                return
            }

            if (fileRejections.length > 0) {
                alert('Has seleccionado demasiados archivos')
                return
            }

            if (acceptedFiles.length === 0) {
                alert('No se seleccionaron archivos válidos')
                return
            }

            setUploadingNewImages(true)

            try {
                const uploads = await Promise.all(
                    acceptedFiles.map(async (file) => {
                        const formData = new FormData()
                        formData.append('images', file)

                        const result = await fetch('/api/galeries/uploadFiles', {
                            method: 'POST',
                            body: formData
                        })

                        if (!result.ok) {
                            throw new Error('Error subiendo imagen')
                        }

                        return result.json()
                    })
                )

                const dataWhitNameAndStatus = uploads.flatMap((response) => response.data)
                const sortedImages = sortImagesByFilename([...images, ...dataWhitNameAndStatus])

                await EditGallery({
                    galleryId: gallery._id,
                    images: sortedImages
                })

                setImages(sortedImages)
                router.refresh()
            } catch (error) {
                console.error('Error subiendo las imágenes:', error)
                alert('Error subiendo las imágenes')
            } finally {
                setUploadingNewImages(false)
            }

            return
        }

        setUploadingNewImages(true)

        try {
            const formData = new FormData()
            acceptedFiles.forEach((file) => formData.append('images', file))

            const result = await fetch('/api/galeries/uploadFiles', {
                method: 'POST',
                body: formData
            })

            if (!result.ok) {
                alert('Error subiendo las imágenes')
                return
            }

            const { data: dataWhitNameAndStatus } = await result.json()
            setImages((prev) => sortImagesByFilename([...prev, ...dataWhitNameAndStatus]))
        } finally {
            setUploadingNewImages(false)
        }
    }

    const replaceImage = async (index: number, file: File) => {
        if (!isEdit || !gallery) {
            return
        }

        try {
            setLoadingImage(index)

            const formData = new FormData()
            formData.append('images', file)

            const result = await fetch('/api/galeries/uploadFiles', {
                method: 'POST',
                body: formData
            })

            if (!result.ok) {
                alert('Error subiendo la imagen')
                return
            }

            const response: { data?: Array<{ filename: string, status: string, url: string }> } = await result.json()
            const uploadedImage = response.data?.[0]

            if (!uploadedImage) {
                throw new Error('No image data returned')
            }

            const updatedImages = images.map((img, i) =>
                i === index
                    ? {
                        ...img,
                        filename: uploadedImage.filename,
                        status: uploadedImage.status,
                        url: uploadedImage.url,
                        isNew: true
                    }
                    : img
            )
            const sortedImages = sortImagesByFilename(updatedImages)

            await EditGallery({
                galleryId: gallery._id,
                images: sortedImages
            })

            setImages(sortedImages)
            router.refresh()
        } catch (error) {
            console.error('Error actualizando la galería:', error)
            alert('Error actualizando la galería')
        } finally {
            setLoadingImage(null)
        }
    }

    const removeImage = async (index: number) => {
        if (!isEdit || !gallery) {
            setImages((prev) => prev.filter((_, i) => i !== index))
            return
        }

        setLoadingImage(index)

        try {
            const updatedImages = sortImagesByFilename(images.filter((_, i) => i !== index))

            await EditGallery({
                galleryId: gallery._id,
                images: updatedImages
            })

            setImages(updatedImages)
            router.refresh()
        } catch (error) {
            console.error('Error actualizando la galería:', error)
            alert('Error actualizando la galería')
        } finally {
            setLoadingImage(null)
        }
    }

    const handleSave = async () => {
        setLoading(true)

        const payload = {
            name,
            idRelatedVideo: video,
            idModel: selectedModels.map((model) => model._id),
            idTags: selectedTags.map((tag) => tag._id),
            images: sortImagesByFilename(images).map((img) => ({
                filename: img.filename,
                url: img.url,
                status: img.status,
                isNew: img.isNew
            }))
        }

        try {
            if (isEdit && gallery) {
                await EditGallery({
                    galleryId: gallery._id,
                    ...payload
                })

                alert('Galería actualizada con éxito')
                router.refresh()
            } else {
                await CreateGallery(payload)
                alert('Galería creada con éxito')
                window.setTimeout(() => {
                    window.location.href = '/pageClients/galeries'
                }, 1000)
            }
        } catch (error) {
            console.error(`Error ${isEdit ? 'actualizando' : 'creando'} galería:`, error)
            alert(`Error ${isEdit ? 'actualizando' : 'creando'} galería`)
        } finally {
            setLoading(false)
        }
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        accept: { 'image/*': [] },
        maxFiles: 100
    })

    return (
        <div className="max-w-7xl mx-auto p-6 text-white">
            <h1 className="text-2xl font-bold mb-8">
                {isEdit ? 'Editar Galería' : 'Crear Nueva Galería'}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                        {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear galería'}
                    </button>
                </div>

                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-lg">
                            Imágenes ({images.length})
                        </h2>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white text-black' : 'bg-zinc-800'}`}
                            >
                                Cuadrícula
                            </button>

                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white text-black' : 'bg-zinc-800'}`}
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

                        {uploadingNewImages && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                                <CircularProgress />
                            </div>
                        )}

                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((img, index) => (
                                    <ImageCard
                                        key={`${img.filename}-${index}`}
                                        img={img}
                                        index={index}
                                        replaceImage={replaceImage}
                                        removeImage={removeImage}
                                        loading={loadingImage === index}
                                        isEdit={isEdit}
                                    />
                                ))}
                            </div>
                        )}

                        {viewMode === 'list' && (
                            <div className="space-y-4">
                                {images.map((img, index) => (
                                    <div
                                        key={`${img.filename}-${index}`}
                                        className="flex items-center gap-4 bg-zinc-900 rounded-lg p-3"
                                    >
                                        <img
                                            src={img.url}
                                            className="w-32 h-20 object-cover rounded"
                                        />

                                        <div className="flex-1 text-sm">
                                            {img.filename}
                                        </div>

                                        <button
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                removeImage(index)
                                            }}
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
    isEdit: boolean
}

const ImageCard = ({ img, index, replaceImage, removeImage, loading, isEdit }: ImageCardProps) => (
    <div className="relative group rounded-lg overflow-hidden bg-zinc-900" onClick={(event) => event.stopPropagation()}>
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                opacity: loading ? 1 : 0,
                transition: 'opacity 0.3s',
                zIndex: loading ? 10 : 0
            }}
        >
            <CircularProgress style={{ zIndex: 99 }} />
        </div>

        <Image src={img.url} alt={`Imagen ${index}`} width={400} height={160} className="w-full h-40 object-cover" />

        {img.isNew && (
            <div className="absolute top-2 left-2 bg-green-600 text-xs px-2 py-1 rounded">
                Nueva
            </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            {isEdit && (
                <label className="bg-white text-black text-xs px-3 py-1 rounded cursor-pointer">
                    Cambiar
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                            if (event.target.files?.[0]) {
                                replaceImage(index, event.target.files[0])
                            }
                        }}
                    />
                </label>
            )}

            <button
                onClick={() => removeImage(index)}
                className="bg-red-600 text-white text-xs px-3 py-1 rounded cursor-pointer"
            >
                Eliminar
            </button>
        </div>
    </div>
)

export default GalleryForm
