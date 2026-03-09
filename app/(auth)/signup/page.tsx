'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async () => {
    setLoading(true)
    setError('')

    if (username.length < 2) {
      setError('닉네임은 2자 이상이어야 해요')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/home')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">시작하기</h1>
        <p className="text-gray-500 text-sm mb-6">계정을 만들어보세요</p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="닉네임"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-black font-medium underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
