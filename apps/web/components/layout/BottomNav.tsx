'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', icon: 'explore', label: 'Explore' },
  { href: '/dashboard', icon: 'map', label: 'Trips' },
  { href: '/trips/new', icon: 'add_circle', label: 'New' },
  { href: '/profile', icon: 'person', label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-t border-surface-container/50 rounded-t-3xl">
      <ul className="flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl mx-1 transition-all ${
                  isActive
                    ? 'bg-surface-container-high text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] ${isActive ? 'text-primary' : ''}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] font-label font-medium">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
