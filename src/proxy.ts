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

    // Protected Route: /portal (Agents)
    if (request.nextUrl.pathname.startsWith('/portal')) {
        if (!user) {
            return NextResponse.redirect(new URL('/auth/agent', request.url))
        }

        const { data: profile } = await supabase
            .from('agent_profiles')
            .select('verification_status')
            .eq('id', user.id)
            .single()

        if (!profile) {
            // Not an agent (or profile not created yet)
            return NextResponse.redirect(new URL('/', request.url))
        }

        if (profile.verification_status === 'pending') {
            return NextResponse.redirect(new URL('/approval-pending', request.url))
        }

        if (profile.verification_status === 'rejected') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Protected Route: /supplier/dashboard (Suppliers)
    if (request.nextUrl.pathname.startsWith('/supplier/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/auth/supplier', request.url))
        }

        // Check metadata first
        if (user.user_metadata?.role === 'supplier') {
            return response
        }

        // Fallback: Check DB
        const { data: supplier } = await supabase
            .from('suppliers')
            .select('id')
            .eq('id', user.id)
            .single()

        if (!supplier) {
            // Not a supplier, redirect to portal (which will handle agent check)
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
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
