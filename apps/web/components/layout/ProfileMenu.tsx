'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface ProfileMenuProps {
  userName: string
  userEmail: string
  isAdmin: boolean
}

export function ProfileMenu({ userName, userEmail, isAdmin }: ProfileMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
        aria-label="Account menu"
      >
        <span className="material-symbols-outlined text-[22px]">account_circle</span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 bg-surface-container-lowest rounded-2xl shadow-card py-2 w-48 z-50 border border-outline-variant/30">
          <div className="px-4 py-2.5">
            <p className="text-sm font-medium text-on-surface truncate">{userName}</p>
            <p className="text-xs text-on-surface-variant truncate">{userEmail}</p>
          </div>
          <div className="my-1 border-t border-surface-container" />
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
            Profile
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">admin_panel_settings</span>
              Admin
            </Link>
          )}
          <div className="my-1 border-t border-surface-container" />
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">logout</span>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
