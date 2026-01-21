/**
 * Centralized repository for all email templates used in the application.
 * This file contains pure functions that return email subject and body content.
 * It is safe to use in both Server and Client components.
 */

// ============================================================================
// CLIENT-SIDE TEMPLATES (e.g. mailto: links)
// ============================================================================

export const getContactMemberEmail = (
    userName: string,
    feedbackContent: string,
    score: number | null
): { subject: string; body: string } => {
    const subject = 'Regarding your recent feedback on ArkAlliance'
    let body = ''

    if (score !== null && score <= 2) {
        // Low Score - Apology / High Friction
        body = `Dear ${userName},

I hope this email finds you well.

I am writing to personally apologize for the difficulties you experienced recently, as mentioned in your feedback: "${feedbackContent || ''}".

We take your feedback seriously and are actively looking into this issue to ensure a better experience for you and all our partners. We would love to hear more if you have additional details to share.

Thank you for helping us improve ArkAlliance.

Best regards,
The ArkAlliance Team`
    } else if (score !== null && score >= 4) {
        // High Score - Appreciation
        body = `Dear ${userName},

I hope you're having a great week!

I wanted to reach out and say thank you for your recent feedback: "${feedbackContent || ''}".

We're thrilled to hear that things are working well for you. Your support means a lot to us as we continue to build ArkAlliance.

If you have any other ideas or suggestions, please don't hesitate to reach out.

Best regards,
The ArkAlliance Team`
    } else {
        // Neutral / No Score / Feature Request
        body = `Dear ${userName},

I hope this email finds you well.

Thank you for your recent feedback: "${feedbackContent || ''}".

We appreciate you taking the time to share your perspective. We carefully review all input to guide our future updates for ArkAlliance.

If you have any further context or specific requests, we'd love to hear them.

Best regards,
The ArkAlliance Team`
    }

    return { subject, body }
}

// ============================================================================
// SERVER-SIDE TRANSACTIONAL EMAILS (HTML)
// ============================================================================

export const getInviteLinkEmailHtml = (inviteLink: string) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>Welcome to ArkAlliance!</h1>
        <p>Your account has been **approved** by our administration team. You can now set your permanent password and log in to the portal.</p>
        
        <p>Click the secure link below to proceed:</p>
        
        <a href="${inviteLink}" 
           style="display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Set Your Password & Login
        </a>
        
        <p style="margin-top: 20px;">The link is **single-use** and valid for a short time. If you have trouble, please contact support.</p>
    </div>
`

export const getSupplierWelcomeEmailHtml = (inviteLink: string) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fbbf24; margin: 0; font-size: 28px;">Welcome to the Inner Circle</h1>
            <p style="color: #94a3b8; font-size: 16px; margin-top: 10px;">Your ArkAlliance Supplier Status is Now <strong>ACTIVE</strong></p>
        </div>

        <p>Congratulations! Your application has been fully verified and approved by our partners team. You are now officially part of the ArkAlliance ecosystem.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0;">
            <h2 style="margin-top: 0; font-size: 18px; color: #0f172a;">Next Steps to Launch:</h2>
            <ul style="padding-left: 20px;">
                <li style="margin-bottom: 10px;"><strong>Finalize Access:</strong> Click the button below to set your secure password.</li>
                <li style="margin-bottom: 10px;"><strong>Complete Profile:</strong> Update your company bio and high-quality images.</li>
                <li style="margin-bottom: 10px;"><strong>Upload Inventory:</strong> List your first active product to start receiving discovery interest.</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 35px 0;">
            <a href="${inviteLink}" 
               style="display: inline-block; background: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.2);">
                Activate Account & Login
            </a>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 15px;">This secure link is valid for one-time use only.</p>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #64748b;">If you encounter any issues during the onboarding process, please don't hesitate to reach out to our dedicated priority support team.</p>
        
        <p style="font-size: 14px; font-weight: bold; color: #0f172a;">Best regards,<br/>The ArkAlliance Onboarding Team</p>
    </div>
`

export const getRejectionEmailHtml = (reason?: string) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>Account Application Update</h1>
        <p>Thank you for your interest in ArkAlliance. We have reviewed your supplier application.</p>
        <p>Unfortunately, we are unable to approve your account at this time.</p>
        
        ${reason ? `<div style="background-color: #f8f9fa; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;"><strong>Reason:</strong><br/>${reason}</div>` : ''}

        <p><strong>Refund Status:</strong> A full refund for your subscription payment has been initiated. It may take 5-10 business days to appear on your statement.</p>
        
        <p>If you believe this decision was made in error or if you have addressed the issues mentioned, please contact our support team.</p>
    </div>
`

export const getPaymentConfirmationEmailHtml = (supplierName: string) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>Payment Confirmed</h1>
        <p>Dear ${supplierName},</p>
        <p>Thank you! We have successfully processed your payment for the Supplier Subscription.</p>
        
        <p><strong>Note:</strong> Your official payment receipt will be sent to this email address directly from Stripe once your account is fully activated and out of testing mode.</p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

        <h2>What Happens Next?</h2>
        <p>Your registration has now moved into our manual administrative review queue. Our team will verify your details within <strong>48 hours</strong>.</p>
        
        <p>You do not need to take any further action at this time.</p>

        <p><strong>Access to Portal:</strong><br/>
        Once your profile is approved, you will receive a separate email containing your final login link. You will not be able to access the portal until this approval is complete.</p>
        
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">If you have any questions, please reply to this email.</p>
    </div>
`

export const getSubscriptionUpdateEmailHtml = (
    companyName: string,
    content: string,
    siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || ''
) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1>Subscription Update</h1>
        <p>Dear ${companyName},</p>
        ${content}
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.9em; color: #666;">
            Manage your subscription: <a href="${siteUrl}/supplier/dashboard">Supplier Dashboard</a>
        </p>
    </div>
`

export const getSystemReportEmail = (data: { period: string, avgLoad: number, peakUsers: number, totalRequests: number }) => {
    const periodLabel = data.period.charAt(0).toUpperCase() + data.period.slice(1)

    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); padding: 15px; border-radius: 12px; display: inline-block;">
                <h2 style="color: white; margin: 0; font-size: 20px;">ArkCommand Report</h2>
            </div>
            <p style="color: #64748b; margin-top: 10px;">System Performance Overview - <strong>${periodLabel}</strong></p>
        </div>

        <div style="background-color: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Executive Summary</h3>
            
            <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
                <tr>
                    <td style="color: #64748b;">Average System Load</td>
                    <td style="text-align: right; font-weight: bold; color: ${data.avgLoad > 70 ? '#ef4444' : '#22d3ee'};">
                        ${data.avgLoad}%
                    </td>
                </tr>
                <tr>
                    <td style="color: #64748b;">Peak Concurrent Users</td>
                    <td style="text-align: right; font-weight: bold; color: #1e293b;">
                        ${data.peakUsers}
                    </td>
                </tr>
                 <tr>
                    <td style="color: #64748b;">Total Request Volume</td>
                    <td style="text-align: right; font-weight: bold; color: #1e293b;">
                        ${data.totalRequests.toLocaleString()}
                    </td>
                </tr>
                <tr>
                    <td style="color: #64748b;">System Health Status</td>
                    <td style="text-align: right; font-weight: bold; color: #22c55e;">
                        OPTIMAL
                    </td>
                </tr>
            </table>
        </div>

        <div style="text-align: center;">
             <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard?tab=system&view=history" 
               style="display: inline-block; background-color: #0f172a; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                View Full Analytics
            </a>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">
                Generated automatically by ArkCommand System.
            </p>
        </div>
    </div>
    `
}
