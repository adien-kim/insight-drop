'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = [
    { href: '/home', label: '✨ 새 카드' },
    { href: '/library', label: '📚 라이브러리' },
    { href: '/explore', label: '🔍 탐색' },
  ]

  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/home" className="font-bold text-base">
          Insight Drop
        </Link>
        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-3 py-1.5 rounded-lg transition ${
                pathname === link.href
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 ml-2"
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  )
}
