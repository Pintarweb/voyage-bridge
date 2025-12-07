import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
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

    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // Allow access to these pages regardless of status
    const publicPaths = [
        '/',
        '/approval-pending',
        '/rejected',
        '/auth/agent',
        '/auth/supplier',
        '/auth/register',
        '/register-agent',
    ]

    // If on a public path, allow access
    if (publicPaths.some(p => path === p || path.startsWith('/api/'))) {
        return response
    }

    // If no user, allow access (auth pages will handle login)
    if (!user) {
        return response
    }

    // Check for Agent Profile
    const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('verification_status, role')
        .eq('id', user.id)
        .single()

    if (agentProfile) {
        // Admins bypass all approval checks
        if (agentProfile.role === 'admin') {
            return response
        }

        const status = agentProfile.verification_status

        if (status === 'pending') {
            return NextResponse.redirect(new URL('/approval-pending', request.url))
        }
        if (status === 'rejected') {
            return NextResponse.redirect(new URL('/rejected', request.url))
        }
        // If approved, allow access
        return response
    }

    // Check for Supplier Profile
    const { data: supplierProfile } = await supabase
        .from('suppliers')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

    if (supplierProfile) {
        const status = supplierProfile.subscription_status

        if (status === 'pending' || status === 'pending_payment') {
            return NextResponse.redirect(new URL('/approval-pending', request.url))
        }
        if (status === 'rejected') {
            return NextResponse.redirect(new URL('/rejected', request.url))
        }
        // If active/approved, allow access
    }

    // Protected Route: /portal (Agents)
    if (path.startsWith('/portal')) {
        if (!agentProfile) {
            // Not an agent
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Protected Route: /supplier/dashboard (Suppliers)
    if (path.startsWith('/supplier/dashboard')) {
        if (!supplierProfile) {
            // Not a supplier, redirect to portal
            return NextResponse.redirect(new URL('/portal', request.url))
        }
    }

    return response
}

export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
