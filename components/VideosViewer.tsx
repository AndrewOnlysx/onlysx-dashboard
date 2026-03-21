import { NextPage } from "next"

import CardVideo from "@/components/CardVideo"
import { VideoType } from "@/types/Types"


interface Props {
    videos: VideoType[]
}

const VideosViewer: NextPage<Props> = ({ videos }) => {
    return (
        <div className="w-full">
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                {videos.map((video) => (
                    <CardVideo key={video._id} video={video} />
                ))}
            </div>
        </div>
    )
}
export default VideosViewer
