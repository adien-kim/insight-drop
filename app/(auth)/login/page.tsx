'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요')
      setLoading(false)
      return
    }

    router.push('/home')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Insight Drop</h1>
        <p className="text-gray-500 text-sm mb-6">인사이트를 모아 공유하세요</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-black font-medium underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
