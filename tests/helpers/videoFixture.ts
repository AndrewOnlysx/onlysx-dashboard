import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const VIDEO_FIXTURE_PATH = path.join(
    process.cwd(),
    'database/content/6583402-uhd_4096_2160_25fps.mp4'
)

const appendRandomIdToFilename = (filename: string) => {
    const extension = path.extname(filename)
    const basename = path.basename(filename, extension)

    return `${basename}-${randomUUID()}${extension}`
}

export const createUniqueVideoFixture = async () => {
    const buffer = await readFile(VIDEO_FIXTURE_PATH)

    return new File(
        [buffer],
        appendRandomIdToFilename(path.basename(VIDEO_FIXTURE_PATH)),
        { type: 'video/mp4' }
    )
}

export const createUniqueCoverFixture = (label = 'video-cover') => {
    const filename = appendRandomIdToFilename(`${label}.svg`)
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" fill="none">
            <rect width="1280" height="720" rx="32" fill="#141414"/>
            <rect x="64" y="64" width="1152" height="592" rx="24" fill="#242424"/>
            <circle cx="250" cy="360" r="92" fill="#ff4fa4"/>
            <rect x="384" y="274" width="452" height="54" rx="27" fill="#f4f4f5"/>
            <rect x="384" y="366" width="292" height="34" rx="17" fill="#a1a1aa"/>
        </svg>
    `.trim()

    return new File([svg], filename, { type: 'image/svg+xml' })
}