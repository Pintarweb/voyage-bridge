// /lib/emailSender.ts

import * as nodemailer from 'nodemailer';
import {
    getInviteLinkEmailHtml,
    getRejectionEmailHtml,
    getPaymentConfirmationEmailHtml,
    getSubscriptionUpdateEmailHtml,
    getContactMemberEmail
} from './email-templates';

// 1. Create a Transporter (the connection to Mailtrap)
// The transporter is configured once and reused for all emails.
// It securely reads the credentials from your .env.local file.
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    // Port 587 uses STARTTLS, port 2525 is alternative, port 465 uses SSL/TLS
    port: parseInt(process.env.MAILTRAP_PORT || '587'),
    secure: false, // false for STARTTLS (587/2525), true for SSL/TLS (465)
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

/**
 * Sends a follow-up email regarding user feedback (Admin initiated).
 */
export async function sendFeedbackFollowupEmail(
    recipientEmail: string,
    userName: string,
    feedbackContent: string,
    score: number | null
) {
    // Generate the context-aware subject and body text
    const { subject, body } = getContactMemberEmail(userName, feedbackContent, score);

    // Convert newlines to HTML line breaks for the email
    const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; white-space: pre-line;">
            ${body}
        </div>
    `;

    const mailOptions = {
        from: 'no-reply@arkalliance.com',
        to: recipientEmail,
        subject: subject,
        html: htmlBody
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Feedback followup email sent to ${recipientEmail}. ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`Error sending feedback followup to ${recipientEmail}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Sends a custom email containing the secure invite link to the approved agent.
 */
export async function sendInviteLinkEmail(recipientEmail: string, inviteLink: string) {
    const mailOptions = {
        from: 'no-reply@arkalliance.com',
        to: recipientEmail,
        subject: '🎉 ArkAlliance Account Approved: Set Your Password',
        html: getInviteLinkEmailHtml(inviteLink)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Invite email sent successfully to ${recipientEmail}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`Error sending email to ${recipientEmail}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Sends a rejection email to the supplier.
 */
export async function sendRejectionEmail(recipientEmail: string, reason?: string) {
    const mailOptions = {
        from: 'no-reply@arkalliance.com',
        to: recipientEmail,
        subject: 'Account Status Update - ArkAlliance',
        html: getRejectionEmailHtml(reason)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Rejection email sent successfully to ${recipientEmail}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`Error sending rejection email to ${recipientEmail}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Sends a payment confirmation email to the supplier (Administrator Review Phase).
 */
export async function sendPaymentConfirmationEmail(recipientEmail: string, supplierName: string) {
    const mailOptions = {
        from: 'no-reply@arkalliance.com',
        to: recipientEmail,
        subject: 'Payment Confirmed! Your ArkAlliance Supplier Profile is Under Review',
        html: getPaymentConfirmationEmailHtml(supplierName)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Payment confirmation email sent locally to Mailtrap for ${recipientEmail}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`Error sending payment confirmation to ${recipientEmail}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Sends a subscription update notification to the supplier.
 */
export async function sendSubscriptionUpdateEmail(
    recipientEmail: string,
    updateType: 'plan_change' | 'pause' | 'resume' | 'cancel',
    details: { newSlotCount?: number, endDate?: string, companyName?: string }
) {
    const companyName = details.companyName || 'Valued Partner';
    let subject = 'Subscription Update - ArkAlliance';
    let content = '';

    const formattedDate = details.endDate ? new Date(details.endDate).toLocaleDateString() : 'the end of the billing cycle';

    switch (updateType) {
        case 'plan_change':
            subject = 'Plan Updated - ArkAlliance';
            content = `
                <p>Your subscription plan has been successfully updated.</p>
                <p><strong>New Slot Count:</strong> ${details.newSlotCount}</p>
                <p>Any prorated charges or credits will be applied to your next invoice.</p>
            `;
            break;
        case 'pause':
            subject = 'Subscription Paused - ArkAlliance';
            content = `
                <p>Your subscription has been scheduled to <strong>PAUSE</strong>.</p>
                <p><strong>Effective Date:</strong> ${formattedDate}</p>
                <p>Your products will remain visible until this date. After this date, your listings will be hidden and you will not be billed.</p>
                <p>You can resume your subscription at any time from your dashboard.</p>
            `;
            break;
        case 'resume':
            subject = 'Subscription Resumed - ArkAlliance';
            content = `
                <p>Great news! Your subscription has been <strong>RESUMED</strong>.</p>
                <p>Your listings are now active and visible on the marketplace.</p>
            `;
            break;
        case 'cancel':
            subject = 'Subscription Cancelled - ArkAlliance';
            content = `
                <p>Your subscription has been cancelled.</p>
                <p>Your access will continue until <strong>${formattedDate}</strong>.</p>
                <p>We're sorry to see you go. If you change your mind, you can resubscribe from your dashboard.</p>
            `;
            break;
    }

    const mailOptions = {
        from: 'no-reply@arkalliance.com',
        to: recipientEmail,
        subject: subject,
        html: getSubscriptionUpdateEmailHtml(companyName, content)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Subscription update email (${updateType}) sent to ${recipientEmail}. ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`Error sending subscription email to ${recipientEmail}:`, error);
        return { success: false, error: error.message };
    }
}
