import { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { VIDEO_QUALITY_OPTIONS, buildCreateVideoPayload, buildVideoSearchParams } from '@/lib/videos/admin'
import { GalleryType, ModelType, TagType, VideoType } from '@/types/Types'

import submitCreateVideoDraft, { VideoDraftSubmission } from '../../lib/createVideoDraft'
import { createVideoFormInitialState, VideoFormInitialState, VideoFormMode } from './formConfig'
import uploadVideoAsset, { VideoAssetUploadStatus, VideoAssetUploadTask } from './uploadVideoAsset'
import { buildPreviewWindows, createPosterFromVideo, revokeObjectUrl } from './utils'

type FieldErrors = Partial<Record<
    'title' | 'time' | 'image' | 'video' | 'models' | 'tags' | 'quality',
    string
>>

type UploadKind = 'video' | 'manualCover' | 'generatedCover'
type SubmitStatus = 'idle' | 'success' | 'error'

interface UseVideoFormOptions {
    mode?: VideoFormMode
    initialVideo?: VideoType | null
}

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

const createPersistedUploadState = (url: string): AssetUploadState =>
    url
        ? {
            status: 'success',
            progress: 100,
            uploadedBytes: 0,
            totalBytes: 0,
            remainingBytes: 0,
            remoteUrl: url,
            error: ''
        }
        : createInitialUploadState()

const isAbortError = (error: unknown) =>
    error instanceof DOMException && error.name === 'AbortError'

export const useVideoForm = ({
    mode = 'create',
    initialVideo
}: UseVideoFormOptions = {}) => {
    const uploadTasksRef = useRef<Record<UploadKind, VideoAssetUploadTask | null>>({
        video: null,
        manualCover: null,
        generatedCover: null
    })
    const manualCoverUrlRef = useRef('')
    const generatedCoverUrlRef = useRef('')
    const videoPreviewUrlRef = useRef('')
    const videoSelectionRef = useRef(0)
    const initialStateRef = useRef(
        createVideoFormInitialState({
            mode,
            initialVideo
        })
    )
    const isEdit = mode === 'edit'

    const [title, setTitle] = useState(initialStateRef.current.title)
    const [time, setTime] = useState(initialStateRef.current.time)
    const [persistedCoverUrl, setPersistedCoverUrl] = useState(initialStateRef.current.persistedCoverUrl)
    const [persistedVideoUrl, setPersistedVideoUrl] = useState(initialStateRef.current.persistedVideoUrl)
    const [persistedDumpUrl, setPersistedDumpUrl] = useState(initialStateRef.current.persistedDumpUrl)
    const [manualCoverFile, setManualCoverFile] = useState<File | null>(null)
    const [manualCoverUrl, setManualCoverUrl] = useState('')
    const [generatedCoverFile, setGeneratedCoverFile] = useState<File | null>(null)
    const [generatedCoverUrl, setGeneratedCoverUrl] = useState('')
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [videoPreviewUrl, setVideoPreviewUrl] = useState('')
    const [videoDurationSeconds, setVideoDurationSeconds] = useState(initialStateRef.current.videoDurationSeconds)
    const [manualCoverUpload, setManualCoverUpload] = useState<AssetUploadState>(createInitialUploadState)
    const [generatedCoverUpload, setGeneratedCoverUpload] = useState<AssetUploadState>(createInitialUploadState)
    const [videoUpload, setVideoUpload] = useState<AssetUploadState>(createInitialUploadState)
    const [qualityPreset, setQualityPreset] = useState<(typeof VIDEO_QUALITY_OPTIONS)[number] | 'custom'>(
        initialStateRef.current.qualityPreset
    )
    const [customQuality, setCustomQuality] = useState(initialStateRef.current.customQuality)
    const [views, setViews] = useState(initialStateRef.current.views)
    const [lastViews, setLastViews] = useState(initialStateRef.current.lastViews)
    const [selectedModels, setSelectedModels] = useState<ModelType[]>(initialStateRef.current.selectedModels)
    const [selectedTags, setSelectedTags] = useState<TagType[]>(initialStateRef.current.selectedTags)
    const [selectedGaleries, setSelectedGaleries] = useState<GalleryType[]>(initialStateRef.current.selectedGaleries)
    const [manualSearchParams, setManualSearchParams] = useState<string[]>(initialStateRef.current.manualSearchParams)
    const [keywordInput, setKeywordInput] = useState('')
    const [errors, setErrors] = useState<FieldErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
    const [assetMessage, setAssetMessage] = useState('')
    const [lastPayloadPreview, setLastPayloadPreview] = useState<string | null>(null)

    const currentQuality = qualityPreset === 'custom' ? customQuality : qualityPreset
    const persistedCoverUpload = createPersistedUploadState(persistedCoverUrl)
    const persistedVideoUpload = createPersistedUploadState(persistedVideoUrl)
    const activeCoverUrl = manualCoverUrl || generatedCoverUrl || persistedCoverUrl
    const activeCoverUpload = manualCoverFile
        ? manualCoverUpload
        : generatedCoverFile
            ? generatedCoverUpload
            : persistedCoverUpload
    const activeCoverRemoteUrl = manualCoverFile
        ? manualCoverUpload.remoteUrl
        : generatedCoverFile
            ? generatedCoverUpload.remoteUrl
            : persistedCoverUrl
    const uploadedVideoUrl = videoUpload.remoteUrl || persistedVideoUrl
    const dumpRemoteUrl = videoUpload.remoteUrl || persistedDumpUrl || persistedVideoUrl
    const dumpUrl = videoPreviewUrl || dumpRemoteUrl
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
        dump: dumpRemoteUrl,
        quality: currentQuality,
        selectedModels,
        selectedTags,
        selectedGaleries,
        views,
        lastViews,
        manualSearchParams
    })

    const draftSubmission: VideoDraftSubmission = {
        mode,
        videoId: initialStateRef.current.videoId,
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
                    : activeCoverRemoteUrl
                        ? {
                            name: 'persisted-cover',
                            size: 0,
                            type: 'remote',
                            source: 'manual',
                            previewUrl: activeCoverUrl,
                            uploadedUrl: activeCoverRemoteUrl,
                            uploadStatus: 'success'
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
                : uploadedVideoUrl
                    ? {
                        name: 'persisted-video',
                        size: 0,
                        type: 'remote',
                        previewUrl: dumpUrl,
                        uploadedUrl: uploadedVideoUrl,
                        uploadStatus: 'success'
                    }
                    : null,
            dump: dumpUrl
                ? {
                    source: 'derived-from-video',
                    previewUrl: dumpUrl,
                    uploadedUrl: dumpRemoteUrl,
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
        manualCoverUrlRef.current = manualCoverUrl
    }, [manualCoverUrl])

    useEffect(() => {
        generatedCoverUrlRef.current = generatedCoverUrl
    }, [generatedCoverUrl])

    useEffect(() => {
        videoPreviewUrlRef.current = videoPreviewUrl
    }, [videoPreviewUrl])

    useEffect(() => {
        return () => {
            revokeObjectUrl(manualCoverUrlRef.current)
            revokeObjectUrl(generatedCoverUrlRef.current)
            revokeObjectUrl(videoPreviewUrlRef.current)
        }
    }, [])

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

    const buildCurrentBaseState = (): VideoFormInitialState => ({
        videoId: initialStateRef.current.videoId,
        title: payloadPreview.title,
        time: payloadPreview.time,
        persistedCoverUrl: activeCoverRemoteUrl,
        persistedVideoUrl: uploadedVideoUrl,
        persistedDumpUrl: dumpRemoteUrl,
        videoDurationSeconds,
        qualityPreset,
        customQuality,
        views,
        lastViews,
        selectedModels: [...selectedModels],
        selectedTags: [...selectedTags],
        selectedGaleries: [...selectedGaleries],
        manualSearchParams: [...manualSearchParams]
    })

    const clearManualCover = () => {
        abortUpload('manualCover')
        revokeObjectUrl(manualCoverUrl)
        setManualCoverFile(null)
        setManualCoverUrl('')
        setManualCoverUpload(createInitialUploadState())
    }

    const clearVideoSelection = () => {
        const baseState = initialStateRef.current

        videoSelectionRef.current += 1
        abortUpload('video')
        abortUpload('generatedCover')
        revokeObjectUrl(videoPreviewUrl)
        revokeObjectUrl(generatedCoverUrl)
        setVideoFile(null)
        setVideoPreviewUrl('')
        setGeneratedCoverFile(null)
        setGeneratedCoverUrl('')
        setVideoDurationSeconds(baseState.videoDurationSeconds)
        setTime(baseState.time)
        setIsGeneratingPreview(false)
        setVideoUpload(createInitialUploadState())
        setGeneratedCoverUpload(createInitialUploadState())
    }

    const applyBaseState = ({
        nextBaseState,
        nextSubmitMessage = '',
        nextSubmitStatus = 'idle',
        nextLastPayloadPreview = null
    }: {
        nextBaseState?: VideoFormInitialState
        nextSubmitMessage?: string
        nextSubmitStatus?: SubmitStatus
        nextLastPayloadPreview?: string | null
    } = {}) => {
        const targetBaseState = nextBaseState ?? initialStateRef.current

        initialStateRef.current = targetBaseState

        clearManualCover()
        clearVideoSelection()

        setPersistedCoverUrl(targetBaseState.persistedCoverUrl)
        setPersistedVideoUrl(targetBaseState.persistedVideoUrl)
        setPersistedDumpUrl(targetBaseState.persistedDumpUrl)
        setTitle(targetBaseState.title)
        setTime(targetBaseState.time)
        setVideoDurationSeconds(targetBaseState.videoDurationSeconds)
        setQualityPreset(targetBaseState.qualityPreset)
        setCustomQuality(targetBaseState.customQuality)
        setViews(targetBaseState.views)
        setLastViews(targetBaseState.lastViews)
        setSelectedModels([...targetBaseState.selectedModels])
        setSelectedTags([...targetBaseState.selectedTags])
        setSelectedGaleries([...targetBaseState.selectedGaleries])
        setManualSearchParams([...targetBaseState.manualSearchParams])
        setKeywordInput('')
        setErrors({})
        setSubmitMessage(nextSubmitMessage)
        setSubmitStatus(nextSubmitStatus)
        setAssetMessage('')
        setLastPayloadPreview(nextLastPayloadPreview)
    }

    const resetForm = () => {
        applyBaseState()
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

        let task: VideoAssetUploadTask | null = null

        task = uploadVideoAsset({
            file,
            assetType,
            onProgress: (snapshot) => {
                if (task && uploadTasksRef.current[kind] && uploadTasksRef.current[kind] !== task) {
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
                if (task && uploadTasksRef.current[kind] && uploadTasksRef.current[kind] !== task) {
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
                if (!task || uploadTasksRef.current[kind] !== task) {
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
                if (!task || uploadTasksRef.current[kind] !== task) {
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
                if (task && uploadTasksRef.current[kind] === task) {
                    uploadTasksRef.current[kind] = null
                }
            })
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
            setVideoDurationSeconds(initialStateRef.current.videoDurationSeconds)
            setTime(initialStateRef.current.time)
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
        if (videoFile && !videoUpload.remoteUrl.trim()) {
            nextErrors.video = videoFile
                ? 'Espera a que el video termine de subirse.'
                : 'Carga o conserva un video principal valido.'
        } else if (!uploadedVideoUrl.trim()) {
            nextErrors.video = 'Carga o conserva un video principal valido.'
        }

        if (!activeCoverUrl.trim()) {
            nextErrors.image = 'Carga una portada o genera una desde el video.'
        } else if ((manualCoverFile || generatedCoverFile) && !activeCoverUpload.remoteUrl.trim()) {
            nextErrors.image = activeCoverUpload.status === 'uploading' || activeCoverUpload.status === 'processing'
                ? 'Espera a que la portada termine de subirse.'
                : 'La portada nueva aun no tiene una URL remota valida.'
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
            setSubmitStatus('error')
            setSubmitMessage('Revisa los campos marcados antes de actualizar el video.')
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

            if (isEdit) {
                const nextBaseState = response.video
                    ? createVideoFormInitialState({
                        mode: 'edit',
                        initialVideo: response.video
                    })
                    : buildCurrentBaseState()

                applyBaseState({
                    nextBaseState,
                    nextSubmitMessage: response.message,
                    nextSubmitStatus: 'success'
                })
            } else {
                applyBaseState({
                    nextBaseState: createVideoFormInitialState({ mode: 'create' }),
                    nextSubmitMessage: response.message,
                    nextSubmitStatus: 'success'
                })
            }
        } catch (error) {
            console.error('Error preparando el payload del video:', error)
            setSubmitStatus('error')
            setSubmitMessage(
                isEdit
                    ? 'No se pudo actualizar el video.'
                    : 'No se pudo guardar el video.'
            )
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
            videoUpload: videoFile ? videoUpload : persistedVideoUpload,
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
            mode,
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
            videoUpload: videoFile ? videoUpload : persistedVideoUpload,
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
