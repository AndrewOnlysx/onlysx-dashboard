import { NextResponse } from 'next/server'

import { BackfillSlugs } from '@/database/actions/slugs/BackfillSlugs'

export const dynamic = 'force-dynamic'

const isDevelopmentEnvironment = process.env.NODE_ENV !== 'production'

export async function GET() {
    if (!isDevelopmentEnvironment) {
        return NextResponse.json(
            {
                ok: false,
                message: 'This endpoint is available only outside production.'
            },
            { status: 403 }
        )
    }

    const result = await BackfillSlugs()

    return NextResponse.json(result, {
        status: result.ok ? 200 : 500
    })
}