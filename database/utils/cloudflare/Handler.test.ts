import { describe, expect, it } from 'vitest'

import { buildPublicUrl, sanitizeUploadFilename } from './Handler'

describe('sanitizeUploadFilename', () => {
    it('reemplaza espacios en blanco por guiones', () => {
        const filename = sanitizeUploadFilename('Anie Darling Dressed For Sex #solo.mp4')

        expect(filename).toBe('Anie-Darling-Dressed-For-Sex-#solo.mp4')
    })
})

describe('buildPublicUrl', () => {
    it('codifica caracteres especiales del key sin romper los separadores de path', () => {
        const url = buildPublicUrl('page-content/videos-debug/video/mnaff45g-94d372d3-6e88-4f9a-a800-1cef75b6c4c3/Anie Darling Dressed For Sex #solo (Dress - 90) - [10-54] (07.04.2022) on SexyPorn.mp4')

        expect(url).toBe('https://cdn.onlysx.stream/page-content/videos-debug/video/mnaff45g-94d372d3-6e88-4f9a-a800-1cef75b6c4c3/Anie%20Darling%20Dressed%20For%20Sex%20%23solo%20(Dress%20-%2090)%20-%20%5B10-54%5D%20(07.04.2022)%20on%20SexyPorn.mp4')
    })
})