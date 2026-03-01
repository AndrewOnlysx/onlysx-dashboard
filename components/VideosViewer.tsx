import { PRIMARYCOLOR } from "@/constant/Colors"
import { ModelType, TagType, VideoType } from "@/types/Types"
import dayjs from "dayjs"
import { NextPage } from "next"

import relativeTime from "dayjs/plugin/relativeTime"
import { Card } from "@hugeicons-pro/core-stroke-rounded"
import CardVideo from "@/components/CardVideo"

dayjs.extend(relativeTime)


interface Props {
    videos: VideoType[]
}

const VideosViewer: NextPage<Props> = ({ videos }) => {
    return (
        <div className="w-full">
            <div className="
                grid
            

    grid-cols-[repeat(auto-fit,minmax(355px,1fr))]
            ">
                {videos.map((video) => (
                    <CardVideo key={video._id} video={video} />
                ))}
            </div>
        </div>
    )
}
export default VideosViewer
