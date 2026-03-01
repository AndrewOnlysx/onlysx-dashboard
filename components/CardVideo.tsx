import { PRIMARYCOLOR } from '@/constant/Colors'
import { ModelType, TagType, VideoType } from '@/types/Types'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import Link from "next/link"

import relativeTime from "dayjs/plugin/relativeTime"
interface Props {
    video: VideoType

}
dayjs.extend(relativeTime)
function formatViews(views: number) {
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
    if (views >= 1_000) return (views / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
    return views.toString()
}
const CardVideo: NextPage<Props> = ({ video }) => {
    return <Link
        href={`/video/${video._id}`}
        key={video._id}
    >
        <div

            className="
                        custom-card-video
                            rounded-xl
                         
                            overflow-hidden
                            cursor-pointer
                       
                        "
        >
            {/* Thumbnail */}
            <div className="relative w-full h-0 pb-[56.25%] ">
                <img
                    style={{ borderRadius: 12 }}
                    src={video.image}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover "
                />

                {/* Duración overlay */}
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold">
                    {video.time}
                </span>
            </div>

            {/* Info */}
            <div className="flex flex-col mt-2 px-2">
                {/* Título */}
                <span className="font-medium line-clamp-2">{video.title}</span>

                {/* Modelo / Creador */}
                {video.models && video.models.length > 0 && (
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                        {(video.models as ModelType[]).slice(0, 1).map((model) => (
                            <div key={model._id} className="flex items-center gap-1">
                                <img
                                    src={model.image}
                                    alt={model.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                <span className="text-sm text-muted-foreground">{model.name}</span>
                            </div>
                        ))}
                    </div>
                )}


                {/* Vistas + Calidad */}
                <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                    <span>{formatViews(video.views ?? 0)} views • {dayjs(video.updatedAt).fromNow()}</span>
                    <span>{video.quality}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-1">
                    {video.tags?.slice(0, 3).map((tag) => (
                        <span
                            key={(tag as TagType)._id}
                            style={{ color: PRIMARYCOLOR }}
                            className=" rounded px-2 py-0.5 text-xs"
                        >
                            #{(tag as TagType).name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </Link>


}

export default CardVideo