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
    const primaryModel = (video.models as ModelType[] | undefined)?.[0]
    const visibleTags = video.tags?.slice(0, 2) ?? []

    return (
        <Link
            href={`/video/${video._id}`}
            key={video._id}
            className="group block h-full"
        >
            <article className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[var(--border)] bg-[rgba(23,27,34,0.9)] transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-[1px] hover:border-white/14 hover:bg-[rgba(23,27,34,0.96)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
                <div className="relative aspect-video overflow-hidden border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
                    <img
                        src={video.image}
                        alt={video.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                    />

                    <span className="absolute bottom-2 right-2 rounded-md border border-white/10 bg-[rgba(15,18,24,0.82)] px-2 py-1 text-[11px] font-medium tracking-[0.01em] text-[var(--foreground)] backdrop-blur-sm">
                        {video.time}
                    </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-3.5">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-[15px] font-semibold leading-5 text-[var(--foreground)]">
                            {video.title}
                        </h3>
                        <span className="shrink-0 rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-[11px] font-medium tracking-[0.01em] text-[var(--muted-foreground)]">
                            {video.quality}
                        </span>
                    </div>

                    {primaryModel && (
                        <div className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                            <img
                                src={primaryModel.image}
                                alt={primaryModel.name}
                                className="h-7 w-7 rounded-full object-cover"
                            />
                            <span className="truncate">{primaryModel.name}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--muted-foreground)]">
                        <span>{formatViews(video.views ?? 0)} views</span>
                        <span className="h-1 w-1 rounded-full bg-[rgba(255,255,255,0.18)]" aria-hidden="true" />
                        <span>{dayjs(video.updatedAt).fromNow()}</span>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-1.5">
                        {visibleTags.map((tag) => (
                            <span
                                key={(tag as TagType)._id}
                                className="rounded-md border border-white/8 bg-white/[0.02] px-2 py-1 text-[11px] text-[var(--muted-foreground)]"
                            >
                                #{(tag as TagType).name}
                            </span>
                        ))}
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default CardVideo