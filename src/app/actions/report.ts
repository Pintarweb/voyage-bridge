'use server'

import { createClient } from '@/utils/supabase/server'
import { sendEmail } from '@/lib/emailSender'
import { getSystemReportEmail } from '@/lib/email-templates'

interface ReportParams {
    period: 'day' | 'week' | 'month'
    avgLoad: number
    peakUsers: number
    totalRequests: number
    saveToDb?: boolean // Optional flag
}

// Helper to generate smart insights
function generateSmartSummary(params: ReportParams) {
    let summary = ''
    let actions = []

    // Load Analysis
    if (params.avgLoad < 30) {
        summary = `System utilization was low (${params.avgLoad}%), indicating excess capacity. `
    } else if (params.avgLoad < 70) {
        summary = `System load was optimal (${params.avgLoad}%), handling requests efficiently. `
    } else {
        summary = `High system load detected (${params.avgLoad}%). Resources are under pressure. `
        actions.push('Review slow database queries')
        actions.push('Consider vertical scaling of API servers')
    }

    // User Analysis
    if (params.peakUsers > 1000) {
        summary += `User traffic is high with ${params.peakUsers} peak users. `
    } else {
        summary += `User traffic is stable. `
    }

    // Request Volume
    if (params.totalRequests > 1000000) {
        summary += `Request volume is significant (${(params.totalRequests / 1000000).toFixed(1)}M).`
        actions.push('Check cache hit rates')
    }

    if (actions.length === 0) actions.push('Continue monitoring - no immediate actions required.')

    return { summary, actions: actions.join('. ') }
}

export async function sendSystemReportEmail(params: ReportParams) {
    const supabase = await createClient()

    // Try to get current user (Manual Trigger)
    let { data: { user } } = await supabase.auth.getUser()
    let recipientEmail = user?.email
    let userId = user?.id

    // If no user (Cron/System Trigger), find an admin to send to
    if (!recipientEmail) {
        // Query for an admin email
        // Note: This requires the client to have permissions or be service_role. 
        // Since this is a Server Action or API route, we might need service_role for Cron.
        // But for now, let's assume standard client might fail if RLS blocks.
        // actually, createClient() in actions uses cookies.
        // allow public read of agent_profiles for admins? 
        // If called from API route with no auth, we need to handle this.
        // For now, let's assume API route handles the calling context or we use a hardcoded fallback if strictly needed.
        // BETTER: Fetch generic admin email if possible or fail if Unauthorized.

        // However, specifically for the CRON requirement:
        // The API route should probably function.
        // Let's use a workaround: If no user, we can't easily query 'agent_profiles' without a service key 
        // unless we use `supabase-admin` (which I don't have usually setup in actions).
        // I will return error for now if no user AND saveToDb is false.
        // But if saveToDb is true, we assume it's system.

        // Let's rely on params.recipientEmail if provided? No, interface doesn't have it.
        // Let's just fetch the first admin from public profile if possible?
        // Actually, user said "automatically be emailed".
        // Let's try to query agent_profiles.
        const { data: adminProfile } = await supabase
            .from('agent_profiles')
            .select('email, id') // Assuming email is in agent_profiles? 
            // Wait, email is usually in auth.users. agent_profiles has 'email' column? 
            // Let's check AdminCommandCenter... includes(u.email). Yes.
            .eq('role', 'admin')
            .limit(1)
            .single()

        if (adminProfile) {
            recipientEmail = adminProfile.email
            userId = undefined // System generated
        }
    }

    if (!recipientEmail) {
        return { success: false, error: 'No recipient email found' }
    }

    const { summary, actions } = generateSmartSummary(params)

    // A. Manual Trigger: Send Email ONLY (Don't Save)
    if (params.saveToDb === false) {
        try {
            const emailHtml = getSystemReportEmail({ ...params })
            await sendEmail({
                to: recipientEmail,
                subject: `[PREVIEW] System Report - ${params.period.toUpperCase()}`,
                html: emailHtml
            })
            return { success: true }
        } catch (error: any) {
            console.error('Email Send Error:', error)
            return { success: false, error: error.message }
        }
    }

    // B. System/Cron Trigger: Save Report + Email
    // 1. Save Report to DB
    const { data: report, error: dbError } = await supabase
        .from('system_reports')
        .insert({
            period: params.period,
            avg_load: params.avgLoad,
            peak_users: params.peakUsers,
            total_requests: params.totalRequests,
            status: 'generating',
            generated_by: userId || null,
            summary: summary,
            action_items: actions
        })
        .select()
        .single()

    if (dbError) {
        console.error('DB Insert Error:', dbError)
        return { success: false, error: 'Failed to save report to database.' }
    }

    try {
        // 2. Send Email
        const emailHtml = getSystemReportEmail(params)

        await sendEmail({
            to: recipientEmail,
            subject: `System Performance Report - ${params.period.toUpperCase()}`,
            html: emailHtml
        })

        // 3. Update DB (Success)
        await supabase
            .from('system_reports')
            .update({ status: 'emailed', email_sent: true })
            .eq('id', report.id)

        return { success: true, reportId: report.id }
    } catch (error: any) {
        console.error('Email Send Error:', error)

        // 3b. Update DB (Failure)
        await supabase
            .from('system_reports')
            .update({ status: 'failed_email' })
            .eq('id', report.id)

        return { success: false, error: 'Saved but failed to email: ' + error.message, reportId: report.id }
    }
}
