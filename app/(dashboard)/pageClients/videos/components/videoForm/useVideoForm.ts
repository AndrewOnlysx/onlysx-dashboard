import { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { VIDEO_QUALITY_OPTIONS, buildCreateVideoPayload, buildVideoSearchParams } from '@/lib/videos/admin'
import { GalleryType, ModelType, TagType } from '@/types/Types'

import submitCreateVideoDraft, { VideoDraftSubmission } from '../../lib/createVideoDraft'
import uploadVideoAsset, { VideoAssetUploadStatus, VideoAssetUploadTask } from './uploadVideoAsset'
import { buildPreviewWindows, createPosterFromVideo, revokeObjectUrl } from './utils'

type FieldErrors = Partial<Record<
    'title' | 'time' | 'image' | 'video' | 'models' | 'tags' | 'quality',
    string
>>

type UploadKind = 'video' | 'manualCover' | 'generatedCover'
type SubmitStatus = 'idle' | 'success' | 'error'

export interface AssetUploadState {
    status: VideoAssetUploadStatus
    progress: number
    uploadedBytes: number
    totalBytes: number
    remainingBytes: number
    remoteUrl: string
    error: string
}

const createInitialUploadState = (): AssetUploadState => ({
    status: 'idle',
    progress: 0,
    uploadedBytes: 0,
    totalBytes: 0,
    remainingBytes: 0,
    remoteUrl: '',
    error: ''
})

const isAbortError = (error: unknown) =>
    error instanceof DOMException && error.name === 'AbortError'

export const useVideoForm = () => {
    const uploadTasksRef = useRef<Record<UploadKind, VideoAssetUploadTask | null>>({
        video: null,
        manualCover: null,
        generatedCover: null
    })
    const videoSelectionRef = useRef(0)

    const [title, setTitle] = useState('')
    const [time, setTime] = useState('')
    const [manualCoverFile, setManualCoverFile] = useState<File | null>(null)
    const [manualCoverUrl, setManualCoverUrl] = useState('')
    const [generatedCoverFile, setGeneratedCoverFile] = useState<File | null>(null)
    const [generatedCoverUrl, setGeneratedCoverUrl] = useState('')
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [videoPreviewUrl, setVideoPreviewUrl] = useState('')
    const [videoDurationSeconds, setVideoDurationSeconds] = useState(0)
    const [manualCoverUpload, setManualCoverUpload] = useState<AssetUploadState>(createInitialUploadState)
    const [generatedCoverUpload, setGeneratedCoverUpload] = useState<AssetUploadState>(createInitialUploadState)
    const [videoUpload, setVideoUpload] = useState<AssetUploadState>(createInitialUploadState)
    const [qualityPreset, setQualityPreset] = useState<(typeof VIDEO_QUALITY_OPTIONS)[number] | 'custom'>('1080p')
    const [customQuality, setCustomQuality] = useState('')
    const [views, setViews] = useState(0)
    const [lastViews, setLastViews] = useState('')
    const [selectedModels, setSelectedModels] = useState<ModelType[]>([])
    const [selectedTags, setSelectedTags] = useState<TagType[]>([])
    const [selectedGaleries, setSelectedGaleries] = useState<GalleryType[]>([])
    const [manualSearchParams, setManualSearchParams] = useState<string[]>([])
    const [keywordInput, setKeywordInput] = useState('')
    const [errors, setErrors] = useState<FieldErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
    const [assetMessage, setAssetMessage] = useState('')
    const [lastPayloadPreview, setLastPayloadPreview] = useState<string | null>(null)

    const currentQuality = qualityPreset === 'custom' ? customQuality : qualityPreset
    const activeCoverUrl = manualCoverUrl || generatedCoverUrl
    const activeCoverUpload = manualCoverFile ? manualCoverUpload : generatedCoverUpload
    const activeCoverRemoteUrl = manualCoverFile
        ? manualCoverUpload.remoteUrl
        : generatedCoverUpload.remoteUrl
    const uploadedVideoUrl = videoUpload.remoteUrl
    const dumpUrl = uploadedVideoUrl || videoPreviewUrl
    const previewWindows = buildPreviewWindows(videoDurationSeconds)
    const isUploadingAssets = [manualCoverUpload, generatedCoverUpload, videoUpload].some((upload) =>
        upload.status === 'uploading' || upload.status === 'processing'
    )

    const generatedSearchParams = buildVideoSearchParams({
        title,
        models: selectedModels,
        tags: selectedTags,
        manualSearchParams
    })

    const payloadPreview = buildCreateVideoPayload({
        title,
        time,
        image: activeCoverRemoteUrl,
        video: uploadedVideoUrl,
        dump: uploadedVideoUrl,
        quality: currentQuality,
        selectedModels,
        selectedTags,
        selectedGaleries,
        views,
        lastViews,
        manualSearchParams
    })

    const draftSubmission: VideoDraftSubmission = {
        payload: payloadPreview,
        assets: {
            cover: manualCoverFile
                ? {
                    name: manualCoverFile.name,
                    size: manualCoverFile.size,
                    type: manualCoverFile.type,
                    source: 'manual',
                    previewUrl: manualCoverUrl,
                    uploadedUrl: manualCoverUpload.remoteUrl,
                    uploadStatus: manualCoverUpload.status
                }
                : generatedCoverFile
                    ? {
                        name: generatedCoverFile.name,
                        size: generatedCoverFile.size,
                        type: generatedCoverFile.type,
                        source: 'generated-from-video',
                        previewUrl: generatedCoverUrl,
                        uploadedUrl: generatedCoverUpload.remoteUrl,
                        uploadStatus: generatedCoverUpload.status
                    }
                    : null,
            video: videoFile
                ? {
                    name: videoFile.name,
                    size: videoFile.size,
                    type: videoFile.type,
                    previewUrl: videoPreviewUrl,
                    uploadedUrl: videoUpload.remoteUrl,
                    uploadStatus: videoUpload.status
                }
                : null,
            dump: videoFile
                ? {
                    source: 'derived-from-video',
                    previewUrl: dumpUrl,
                    uploadedUrl: uploadedVideoUrl,
                    mode: 'snippet-preview',
                    windows: previewWindows
                }
                : null
        }
    }

    const checklist = [
        {
            label: 'Informacion base',
            done: Boolean(title.trim() && time.trim() && currentQuality.trim())
        },
        {
            label: 'Assets principales',
            done: Boolean(activeCoverRemoteUrl.trim() && uploadedVideoUrl.trim())
        },
        {
            label: 'Contexto editorial',
            done: selectedModels.length > 0 && selectedTags.length > 0
        },
        {
            label: 'Relacion con galerias',
            done: selectedGaleries.length > 0
        }
    ]

    const completedChecklist = checklist.filter((item) => item.done).length

    useEffect(() => {
        return () => {
            revokeObjectUrl(manualCoverUrl)
            revokeObjectUrl(generatedCoverUrl)
            revokeObjectUrl(videoPreviewUrl)
        }
    }, [generatedCoverUrl, manualCoverUrl, videoPreviewUrl])

    useEffect(() => {
        const uploadTasks = uploadTasksRef.current

        return () => {
            Object.values(uploadTasks).forEach((task) => task?.abort())
        }
    }, [])

    const abortUpload = (kind: UploadKind) => {
        const currentTask = uploadTasksRef.current[kind]
        uploadTasksRef.current[kind] = null
        currentTask?.abort()
    }

    const startUpload = ({
        kind,
        file,
        assetType
    }: {
        kind: UploadKind
        file: File
        assetType: 'cover' | 'video'
    }) => {
        const setUploadState = kind === 'video'
            ? setVideoUpload
            : kind === 'manualCover'
                ? setManualCoverUpload
                : setGeneratedCoverUpload

        abortUpload(kind)

        setUploadState({
            status: 'uploading',
            progress: 0,
            uploadedBytes: 0,
            totalBytes: file.size,
            remainingBytes: file.size,
            remoteUrl: '',
            error: ''
        })

        const task = uploadVideoAsset({
            file,
            assetType,
            onProgress: (snapshot) => {
                if (uploadTasksRef.current[kind] !== task) {
                    return
                }

                setUploadState((prev) => ({
                    ...prev,
                    status: 'uploading',
                    progress: snapshot.progress,
                    uploadedBytes: snapshot.uploadedBytes,
                    totalBytes: snapshot.totalBytes,
                    remainingBytes: snapshot.remainingBytes,
                    error: ''
                }))
            },
            onStatusChange: (status) => {
                if (uploadTasksRef.current[kind] !== task) {
                    return
                }

                setUploadState((prev) => ({
                    ...prev,
                    status,
                    progress: status === 'processing' || status === 'success'
                        ? 100
                        : prev.progress,
                    uploadedBytes: status === 'processing' || status === 'success'
                        ? file.size
                        : prev.uploadedBytes,
                    totalBytes: prev.totalBytes || file.size,
                    remainingBytes: status === 'processing' || status === 'success'
                        ? 0
                        : prev.remainingBytes,
                    error: status === 'error' ? prev.error : ''
                }))
            }
        })

        uploadTasksRef.current[kind] = task

        task.promise
            .then((uploadedAsset) => {
                if (uploadTasksRef.current[kind] !== task) {
                    return
                }

                setUploadState({
                    status: 'success',
                    progress: 100,
                    uploadedBytes: file.size,
                    totalBytes: file.size,
                    remainingBytes: 0,
                    remoteUrl: uploadedAsset.url,
                    error: ''
                })
            })
            .catch((error) => {
                if (uploadTasksRef.current[kind] !== task) {
                    return
                }

                if (isAbortError(error)) {
                    setUploadState(createInitialUploadState())
                    return
                }

                setUploadState((prev) => ({
                    ...prev,
                    status: 'error',
                    totalBytes: prev.totalBytes || file.size,
                    remainingBytes: 0,
                    error: error instanceof Error
                        ? error.message
                        : 'No se pudo completar la subida.'
                }))
            })
            .finally(() => {
                if (uploadTasksRef.current[kind] === task) {
                    uploadTasksRef.current[kind] = null
                }
            })
    }

    const clearManualCover = () => {
        abortUpload('manualCover')
        revokeObjectUrl(manualCoverUrl)
        setManualCoverFile(null)
        setManualCoverUrl('')
        setManualCoverUpload(createInitialUploadState())
    }

    const clearVideoSelection = () => {
        videoSelectionRef.current += 1
        abortUpload('video')
        abortUpload('generatedCover')
        revokeObjectUrl(videoPreviewUrl)
        revokeObjectUrl(generatedCoverUrl)
        setVideoFile(null)
        setVideoPreviewUrl('')
        setGeneratedCoverFile(null)
        setGeneratedCoverUrl('')
        setVideoDurationSeconds(0)
        setTime('')
        setIsGeneratingPreview(false)
        setVideoUpload(createInitialUploadState())
        setGeneratedCoverUpload(createInitialUploadState())
    }

    const resetForm = ({
        submitMessage: nextSubmitMessage = '',
        submitStatus: nextSubmitStatus = 'idle',
        lastPayloadPreview: nextLastPayloadPreview = null
    }: {
        submitMessage?: string
        submitStatus?: SubmitStatus
        lastPayloadPreview?: string | null
    } = {}) => {
        clearManualCover()
        clearVideoSelection()
        setTitle('')
        setQualityPreset('1080p')
        setCustomQuality('')
        setViews(0)
        setLastViews('')
        setSelectedModels([])
        setSelectedTags([])
        setSelectedGaleries([])
        setManualSearchParams([])
        setKeywordInput('')
        setErrors({})
        setSubmitMessage(nextSubmitMessage)
        setSubmitStatus(nextSubmitStatus)
        setAssetMessage('')
        setLastPayloadPreview(nextLastPayloadPreview)
    }

    const commitKeyword = () => {
        const normalizedKeyword = keywordInput.trim()

        if (!normalizedKeyword) {
            return
        }

        setManualSearchParams((prev) =>
            prev.includes(normalizedKeyword)
                ? prev
                : [...prev, normalizedKeyword]
        )
        setKeywordInput('')
    }

    const removeKeyword = (keyword: string) => {
        setManualSearchParams((prev) => prev.filter((item) => item !== keyword))
    }

    const handleCoverDrop = (acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]

        if (!selectedFile) {
            return
        }

        const nextCoverUrl = URL.createObjectURL(selectedFile)

        revokeObjectUrl(manualCoverUrl)
        setManualCoverFile(selectedFile)
        setManualCoverUrl(nextCoverUrl)
        setAssetMessage('')
        setSubmitMessage('')
        setSubmitStatus('idle')
        setErrors((prev) => ({ ...prev, image: undefined }))

        startUpload({
            kind: 'manualCover',
            file: selectedFile,
            assetType: 'cover'
        })
    }

    const handleVideoDrop = async (acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]

        if (!selectedFile) {
            return
        }

        videoSelectionRef.current += 1
        const currentSelectionId = videoSelectionRef.current
        const nextVideoUrl = URL.createObjectURL(selectedFile)

        abortUpload('video')
        abortUpload('generatedCover')
        revokeObjectUrl(videoPreviewUrl)
        revokeObjectUrl(generatedCoverUrl)

        setVideoFile(selectedFile)
        setVideoPreviewUrl(nextVideoUrl)
        setGeneratedCoverFile(null)
        setGeneratedCoverUrl('')
        setVideoDurationSeconds(0)
        setVideoUpload(createInitialUploadState())
        setGeneratedCoverUpload(createInitialUploadState())
        setIsGeneratingPreview(true)
        setAssetMessage('')
        setSubmitMessage('')
        setSubmitStatus('idle')
        setErrors((prev) => ({ ...prev, video: undefined, image: undefined, time: undefined }))

        startUpload({
            kind: 'video',
            file: selectedFile,
            assetType: 'video'
        })

        try {
            const { posterUrl, posterFile, durationLabel, durationSeconds } = await createPosterFromVideo(
                nextVideoUrl,
                selectedFile.name
            )

            if (videoSelectionRef.current !== currentSelectionId) {
                revokeObjectUrl(posterUrl)
                return
            }

            setGeneratedCoverFile(posterFile)
            setGeneratedCoverUrl(posterUrl)
            setVideoDurationSeconds(durationSeconds)
            setTime(durationLabel)

            startUpload({
                kind: 'generatedCover',
                file: posterFile,
                assetType: 'cover'
            })
        } catch (error) {
            console.error('Error generando preview desde el video:', error)

            if (videoSelectionRef.current !== currentSelectionId) {
                return
            }

            setGeneratedCoverFile(null)
            setGeneratedCoverUrl('')
            setVideoDurationSeconds(0)
            setTime('')
            setGeneratedCoverUpload(createInitialUploadState())
            setAssetMessage('No se pudo generar la portada automatica. Puedes cargar una portada manual.')
        } finally {
            if (videoSelectionRef.current === currentSelectionId) {
                setIsGeneratingPreview(false)
            }
        }
    }

    const validateForm = () => {
        const nextErrors: FieldErrors = {}

        if (!title.trim()) nextErrors.title = 'El titulo es obligatorio.'
        if (!time.trim()) nextErrors.time = 'La duracion es obligatoria.'
        if (!videoFile) {
            nextErrors.video = 'Carga un video principal.'
        } else if (!uploadedVideoUrl.trim()) {
            nextErrors.video = isUploadingAssets
                ? 'Espera a que el video termine de subirse.'
                : 'El video aun no tiene una URL remota valida.'
        }

        if (!activeCoverUrl.trim()) {
            nextErrors.image = 'Carga una portada o genera una desde el video.'
        } else if (!activeCoverRemoteUrl.trim()) {
            nextErrors.image = activeCoverUpload.status === 'uploading' || activeCoverUpload.status === 'processing'
                ? 'Espera a que la portada termine de subirse.'
                : 'La portada aun no tiene una URL remota valida.'
        }

        if (!currentQuality.trim()) nextErrors.quality = 'Define una calidad para el video.'
        if (selectedModels.length === 0) nextErrors.models = 'Selecciona al menos un modelo.'
        if (selectedTags.length === 0) nextErrors.tags = 'Selecciona al menos un tag.'

        return nextErrors
    }

    const handleSubmit = async () => {
        const nextErrors = validateForm()

        setErrors(nextErrors)
        setSubmitMessage('')
        setSubmitStatus('idle')

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        setIsSubmitting(true)

        try {
            const response = await submitCreateVideoDraft(draftSubmission)

            if (!response.ok) {
                setSubmitStatus('error')
                setSubmitMessage(response.message)
                setLastPayloadPreview(JSON.stringify(draftSubmission, null, 2))
                return
            }

            resetForm({
                submitMessage: response.message,
                submitStatus: 'success'
            })
        } catch (error) {
            console.error('Error preparando el payload del video:', error)
            setSubmitStatus('error')
            setSubmitMessage('No se pudo generar el payload del video.')
            setLastPayloadPreview(JSON.stringify(draftSubmission, null, 2))
        } finally {
            setIsSubmitting(false)
        }
    }

    const {
        getRootProps: getCoverRootProps,
        getInputProps: getCoverInputProps,
        isDragActive: isCoverDragActive
    } = useDropzone({
        onDrop: handleCoverDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        multiple: false,
        onDropRejected: () => setAssetMessage('La portada debe ser una imagen valida.')
    })

    const {
        getRootProps: getVideoRootProps,
        getInputProps: getVideoInputProps,
        isDragActive: isVideoDragActive
    } = useDropzone({
        onDrop: handleVideoDrop,
        accept: { 'video/*': [] },
        maxFiles: 1,
        multiple: false,
        onDropRejected: () => setAssetMessage('El archivo principal debe ser un video valido.')
    })

    return {
        basicInfo: {
            title,
            setTitle,
            time,
            setTime,
            qualityPreset,
            setQualityPreset,
            customQuality,
            setCustomQuality,
            qualityOptions: VIDEO_QUALITY_OPTIONS,
            errors
        },
        assets: {
            activeCoverUrl,
            activeCoverRemoteUrl,
            activeCoverUpload,
            manualCoverFile,
            manualCoverUpload,
            generatedCoverFile,
            generatedCoverUrl,
            generatedCoverUpload,
            videoFile,
            videoPreviewUrl,
            uploadedVideoUrl,
            videoUpload,
            dumpUrl,
            previewWindows,
            isGeneratingPreview,
            isUploadingAssets,
            assetMessage,
            errors,
            clearManualCover,
            clearVideoSelection,
            coverDropzone: {
                getRootProps: getCoverRootProps,
                getInputProps: getCoverInputProps,
                isDragActive: isCoverDragActive
            },
            videoDropzone: {
                getRootProps: getVideoRootProps,
                getInputProps: getVideoInputProps,
                isDragActive: isVideoDragActive
            }
        },
        relations: {
            selectedModels,
            setSelectedModels,
            selectedTags,
            setSelectedTags,
            selectedGaleries,
            setSelectedGaleries,
            errors
        },
        discoverability: {
            views,
            setViews,
            lastViews,
            setLastViews,
            manualSearchParams,
            keywordInput,
            setKeywordInput,
            commitKeyword,
            removeKeyword
        },
        preview: {
            title,
            time,
            views,
            currentQuality,
            activeCoverUrl,
            activeCoverRemoteUrl,
            activeCoverUpload,
            dumpUrl,
            previewWindows,
            manualCoverFile,
            generatedCoverFile,
            generatedCoverUrl,
            videoFile,
            uploadedVideoUrl,
            videoUpload,
            checklist,
            completedChecklist,
            generatedSearchParams,
            selectedModels,
            selectedTags,
            selectedGaleriesCount: selectedGaleries.length,
            draftSubmission,
            isUploadingAssets,
            submitMessage,
            submitStatus,
            lastPayloadPreview
        },
        actions: {
            resetForm,
            handleSubmit,
            isSubmitting,
            submitMessage,
            submitStatus
        }
    }
}

export type UseVideoFormResult = ReturnType<typeof useVideoForm>
