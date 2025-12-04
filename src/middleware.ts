import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // If user is not logged in, allow access (protected routes should handle their own redirects if needed, 
    // or we can add specific path checks here. For now, we focus on post-login redirection).
    if (!user) {
        return response
    }

    // Check for Agent Profile
    const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('verification_status')
        .eq('id', user.id)
        .single()

    if (agentProfile) {
        const status = agentProfile.verification_status
        const path = request.nextUrl.pathname

        // Allow access to approval/rejected pages to avoid loops
        if (path === '/approval-pending' || path === '/rejected') {
            return response
        }

        if (status === 'pending') {
            return NextResponse.redirect(new URL('/approval-pending', request.url))
        }
        if (status === 'rejected') {
            return NextResponse.redirect(new URL('/rejected', request.url))
        }
        // If approved, allow access (or redirect to portal if on root/auth pages?)
        // The requirement says: "If verification_status = 'approved', proceed to /auth/agent" (which likely means allow access or redirect to dashboard)
        // For now, we just don't block them.
    }

    // Check for Supplier Profile
    const { data: supplierProfile } = await supabase
        .from('suppliers')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

    if (supplierProfile) {
        const status = supplierProfile.subscription_status
        const path = request.nextUrl.pathname

        // Allow access to approval/rejected pages
        if (path === '/approval-pending' || path === '/rejected') {
            return response
        }

        if (status === 'pending' || status === 'pending_payment') {
            return NextResponse.redirect(new URL('/approval-pending', request.url))
        }
        if (status === 'rejected') {
            return NextResponse.redirect(new URL('/rejected', request.url))
        }
        // If approved/active, allow access.
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes - though we might want to protect some, usually handled by RLS/auth checks)
         * - auth (auth pages - login/register should be accessible, but maybe we want to redirect logged in users?)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
