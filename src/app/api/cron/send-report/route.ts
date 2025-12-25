import { NextRequest, NextResponse } from 'next/server'
import { sendSystemReportEmail } from '@/app/actions/report'

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Simple security check (or omit for dev)
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await sendSystemReportEmail({
            period: 'day',
            avgLoad: 15,
            peakUsers: 142,
            totalRequests: 250000,
            saveToDb: true
        })
        return NextResponse.json({ success: true, message: 'Report sent' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
