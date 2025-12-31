"use client"

import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'
import { Button } from './ui/button'

function Navbar() {
  const { data: session } = useSession()
  const user: User | undefined = session?.user

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">

        {/* Desktop / Tablet */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="text-xl font-bold">
            Mystery Message
          </Link>

          {/* Welcome */}
          {session && (
            <span className="text-lg font-semibold text-gray-300">
              Welcome, {user?.username || user?.email}
            </span>
          )}

          {/* Auth Button */}
          {session ? (
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="h-8 px-3 text-sm bg-slate-100 text-black"
            >
              Sign Out
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="h-8 px-3 text-sm bg-slate-100 text-black"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-1 sm:hidden">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-bold">
              Mystery Msg
            </Link>

            {session ? (
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="h-8 px-3 text-sm bg-slate-100 text-black"
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="h-8 px-3 text-sm bg-slate-100 text-black"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Welcome text below */}
          {session && (
            <div className="text-sm text-gray-300">
              Welcome, {user?.username || user?.email}
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar
