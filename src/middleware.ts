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

    // ---------------------------------------------------------
    // SYSTEM MAINTENANCE CHECK
    // ---------------------------------------------------------
    if (path !== '/maintenance' && !path.startsWith('/_next') && !path.startsWith('/static')) {
        try {
            const { data: setting } = await supabase
                .from('system_settings')
                .select('value')
                .eq('key', 'maintenance_mode')
                .single()

            // value is jsonb, so it comes as a primitive boolean if stored as such
            if (setting?.value === true) {
                // Allow auth pages so admins can log in
                // Also allow API routes for auth
                const isAuth = path.startsWith('/auth') || path.startsWith('/api/auth') || path === '/login'

                if (!isAuth) {
                    let isAdmin = false
                    if (user) {
                        // Check if user is admin
                        const { data: profile } = await supabase
                            .from('agent_profiles')
                            .select('role')
                            .eq('id', user.id)
                            .single()
                        if (profile?.role === 'admin') isAdmin = true
                    }

                    if (!isAdmin) {
                        return NextResponse.redirect(new URL('/maintenance', request.url))
                    }
                }
            }
        } catch (error) {
            // If table missing or RLS error, proceed as normal
            console.error('Middleware Maintenance Check Error:', error)
        }
    }
    // ---------------------------------------------------------

    // Allow access to these pages regardless of status
    const publicPaths = [
        '/',
        '/approval-pending',
        '/rejected',
        '/auth/agent',
        '/auth/supplier',
        '/auth/register',
        '/register-agent',
        '/auth/create-password',
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
        console.log(`[Middleware Proxy] User: ${user.email}, Status: ${status}, Approved: ${(agentProfile as any).is_approved}, Path: ${path}`)

        if (status === 'pending') {
            // RELAXED CHECK: If is_approved is TRUE in DB but status is 'pending', allow it.
            // This handles cases where the status column update might be lagging or inconsistent?
            // Actually, we should trust is_approved if it exists.
            if ((agentProfile as any).is_approved === true) {
                console.log(`[Middleware Proxy] Bypass pending status because is_approved=true`)
                return response
            }
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
        .select('subscription_status, supplier_type')
        .eq('id', user.id)
        .single()

    if (supplierProfile) {
        const status = supplierProfile.subscription_status
        const supplierType = supplierProfile.supplier_type?.toLowerCase() || ''
        const isAirline = supplierType.includes('airline') || supplierType.includes('flight')

        if (status === 'pending' || status === 'pending_payment') {
            // Allow access to payment-init page for pending suppliers so they can complete registration
            if (path === '/payment-init') {
                return response
            }
            // Allow Airline suppliers to access product creation (to see placeholder)
            if (isAirline && path === '/supplier/dashboard/products/create') {
                return response
            }
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

export default async function middleware(request: NextRequest) {
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
