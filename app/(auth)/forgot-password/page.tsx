'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError('이메일 전송에 실패했어요')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm text-center">
          <p className="text-4xl mb-4">📧</p>
          <h1 className="text-xl font-bold mb-2">이메일을 확인해주세요</h1>
          <p className="text-sm text-gray-500">재설정 링크를 보냈어요</p>
          <Link href="/login" className="text-sm text-black underline mt-4 inline-block">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">비밀번호 찾기</h1>
        <p className="text-gray-500 text-sm mb-6">가입한 이메일을 입력해주세요</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? '전송 중...' : '재설정 링크 보내기'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="text-black font-medium underline">
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  )
}
