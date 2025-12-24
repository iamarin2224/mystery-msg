import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

export { default } from "next-auth/middleware"

export async function proxy(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl

    //redirect to dashboard if user is verified and trying to sign-in or sign-up
    if (token && (
        url.pathname.startsWith('/') ||
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify')
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    //if not verified still trying to go to dashboard
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}