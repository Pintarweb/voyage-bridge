// /lib/emailSender.ts

import * as nodemailer from 'nodemailer';
import {
    getInviteLinkEmailHtml,
    getSupplierWelcomeEmailHtml,
    getRejectionEmailHtml,
    getPaymentConfirmationEmailHtml,
    getSubscriptionUpdateEmailHtml,
    getContactMemberEmail
} from './email-templates';

// 1. Create a Transporter (the connection to Mailpit/Mailtrap)
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT || '1025'),
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
    // Prevent hanging in local development - windows docker can be slow
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
});

/**
 * Generic email sender function with robust logging and fallback.
 */
export async function sendEmail(options: nodemailer.SendMailOptions) {
    const finalOptions = {
        from: options.from || 'no-reply@arkalliance.com',
        ...options
    }

    console.log(`[Email Sender] 📧 Attempting delivery to: ${finalOptions.to}`);
    console.log(`[Email Sender] Subject: ${finalOptions.subject}`);

    try {
        const info = await transporter.sendMail(finalOptions)
        console.log(`[Email Sender] ✅ Success! Message ID: ${info.messageId}`)
        return { success: true, messageId: info.messageId }
    } catch (error: any) {
        console.error(`[Email Sender] ❌ SMTP Failed: ${error.message}`)

        // Fallback for local development if SMTP fails
        const isLocal = process.env.NODE_ENV === 'development' ||
            process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost') ||
            process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('127.0.0.1');

        if (isLocal) {
            console.warn('[Email Sender] 🛡️ Development Fallback: Logging email payload to console.')
            console.log('================ EMAIL PREVIEW ================')
            console.log(`To: ${finalOptions.to}`)
            console.log(`Subject: ${finalOptions.subject}`)
            console.log('--- HTML CONTENT ---')
            console.log(finalOptions.html)
            console.log('===============================================')
            return { success: true, messageId: 'mock-dev-id' }
        }

        return { success: false, error: error.message };
    }
}

/**
 * Specific email wrappers
 */

export async function sendFeedbackFollowupEmail(recipientEmail: string, userName: string, feedbackContent: string, score: number | null) {
    const { subject, body } = getContactMemberEmail(userName, feedbackContent, score);
    const htmlBody = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; white-space: pre-line;">${body}</div>`;
    return sendEmail({ to: recipientEmail, subject, html: htmlBody });
}

export async function sendInviteLinkEmail(recipientEmail: string, inviteLink: string) {
    return sendEmail({ to: recipientEmail, subject: '🎉 ArkAlliance Account Approved: Set Your Password', html: getInviteLinkEmailHtml(inviteLink) });
}

export async function sendSupplierWelcomeEmail(recipientEmail: string, inviteLink: string) {
    return sendEmail({ to: recipientEmail, subject: '🚀 Welcome to ArkAlliance: Your Supplier Portal is Ready', html: getSupplierWelcomeEmailHtml(inviteLink) });
}

export async function sendRejectionEmail(recipientEmail: string, reason?: string) {
    return sendEmail({ to: recipientEmail, subject: 'Account Status Update - ArkAlliance', html: getRejectionEmailHtml(reason) });
}

export async function sendPaymentConfirmationEmail(recipientEmail: string, supplierName: string) {
    return sendEmail({ to: recipientEmail, subject: 'Payment Confirmed! Your ArkAlliance Supplier Profile is Under Review', html: getPaymentConfirmationEmailHtml(supplierName) });
}

export async function sendSubscriptionUpdateEmail(
    recipientEmail: string,
    updateType: 'plan_change' | 'pause' | 'resume' | 'cancel',
    details: { newSlotCount?: number, endDate?: string, companyName?: string }
) {
    const companyName = details.companyName || 'Valued Partner';
    const formattedDate = details.endDate ? new Date(details.endDate).toLocaleDateString() : 'the end of the billing cycle';
    let subject = 'Subscription Update - ArkAlliance';
    let content = '';

    switch (updateType) {
        case 'plan_change':
            subject = 'Plan Updated - ArkAlliance';
            content = `<p>Your subscription plan has been updated.</p><p><strong>New Slot Count:</strong> ${details.newSlotCount}</p>`;
            break;
        case 'pause':
            subject = 'Subscription Paused - ArkAlliance';
            content = `<p>Paused effective ${formattedDate}.</p>`;
            break;
        case 'resume':
            subject = 'Subscription Resumed - ArkAlliance';
            content = `<p>Active again.</p>`;
            break;
        case 'cancel':
            subject = 'Subscription Cancelled - ArkAlliance';
            content = `<p>Cancelled. Access until ${formattedDate}.</p>`;
            break;
    }

    return sendEmail({ to: recipientEmail, subject, html: getSubscriptionUpdateEmailHtml(companyName, content) });
}
