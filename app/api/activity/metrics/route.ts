import { NextRequest, NextResponse } from 'next/server'

import { GetActivityMetrics, resolveActivityMetricsRange } from '@/database/actions/activity/GetActivityMetrics'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const rangeDays = resolveActivityMetricsRange(searchParams.get('days'))
    const result = await GetActivityMetrics(rangeDays)

    return NextResponse.json(result, {
        status: result.ok ? 200 : 500
    })
}