import Link from 'next/link'

import { VideoFormMode } from './formConfig'
import {
    getVideoFormBadgeClassName,
    videoFormBodyTextClassName,
    videoFormInsetClassName,
    videoFormLabelClassName,
    videoFormPrimaryActionClassName,
    videoFormSecondaryActionClassName,
    videoFormSurfaceClassName
} from './videoFormUi'

interface Props {
    mode: VideoFormMode
    videoTitle?: string
    onReset: () => void
    readyAssets: number
    completedChecklist: number
    checklistTotal: number
    isUploadingAssets: boolean
}

const VideoFormHeader = ({
    mode,
    videoTitle,
    onReset,
    readyAssets,
    completedChecklist,
    checklistTotal,
    isUploadingAssets
}: Props) => {
    const isEdit = mode === 'edit'
    const syncStatusClassName = getVideoFormBadgeClassName(
        isUploadingAssets ? 'warning' : readyAssets === 2 ? 'success' : 'neutral'
    )
    const syncStatusLabel = isUploadingAssets
        ? 'Uploads en curso'
        : readyAssets === 2
            ? 'Assets resueltos'
            : 'Pendiente de assets'
    const checklistTone = completedChecklist === checklistTotal ? 'success' : 'warning'

    return (
        <section >
            <div className="flex flex-col gap-5">
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Link
                        href="/pageClients/videos"
                        className={videoFormSecondaryActionClassName}
                    >
                        Volver al listado
                    </Link>
                    <button
                        type="button"
                        onClick={onReset}
                        className={videoFormPrimaryActionClassName}
                    >
                        {isEdit ? 'Restaurar cambios' : 'Limpiar formulario'}
                    </button>
                </div>

            </div>
        </section>
    )
}

export default VideoFormHeader
