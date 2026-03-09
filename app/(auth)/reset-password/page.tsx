'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('비밀번호 변경에 실패했어요')
      setLoading(false)
      return
    }

    router.push('/home')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">새 비밀번호 설정</h1>
        <p className="text-gray-500 text-sm mb-6">새로운 비밀번호를 입력해주세요</p>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="새 비밀번호 (6자 이상)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </div>
      </div>
    </div>
  )
}
