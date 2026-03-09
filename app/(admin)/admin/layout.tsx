import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN') redirect('/home')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold">🔧 관리자</span>
          <div className="flex gap-2">
            {[
              { href: '/admin', label: '대시보드' },
              { href: '/admin/users', label: '유저' },
              { href: '/admin/cards', label: '카드' },
              { href: '/admin/reports', label: '신고' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/home" className="text-sm px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100">
              ← 앱으로
            </Link>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
