
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'
    const code = searchParams.get('code') // Standard PKCE code

    const allCookies = request.cookies.getAll().map(c => c.name).join(', ')
    console.log('Auth Callback Hit:', { token_hash: !!token_hash, type, next, code: !!code })
    console.log('Available Cookies:', allCookies)

    // Case 1: Standard PKCE 'code' (Magic Link / OAuth)
    if (code) {
        const supabase = createClient()
        const { error } = await (await supabase).auth.exchangeCodeForSession(code)

        if (!error) {
            console.log('Code exchange successful, redirecting to:', next)
            return NextResponse.redirect(new URL(next, request.url))
        } else {
            console.log('Code exchange failed:', error)
        }
    }

    // Case 2: Implicit/Token Hash (if used)
    if (token_hash && type) {
        const supabase = createClient()

        const { error } = await (await supabase).auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            console.log('OTP Verify successful, redirecting to:', next)
            return NextResponse.redirect(new URL(next, request.url))
        } else {
            console.log('OTP Verify failed:', error)
        }
    }

    // Fallback / Error
    console.error('Auth callback failed or no code/token provided')
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
