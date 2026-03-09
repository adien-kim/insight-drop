'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type InputType = 'youtube' | 'text' | 'image'

export default function CardInput() {
  const [type, setType] = useState<InputType>('youtube')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [visibility, setVisibility] = useState('private')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('type', type)
    formData.append('visibility', visibility)

    if (type === 'youtube') {
      formData.append('url', url)
      formData.append('source_url', url)
    } else if (type === 'text') {
      formData.append('text', text)
      if (sourceUrl) formData.append('source_url', sourceUrl)
    } else if (type === 'image') {
      if (!image) { setError('이미지를 선택해주세요'); setLoading(false); return }
      formData.append('image', image)
      if (sourceUrl) formData.append('source_url', sourceUrl)
    }

    const res = await fetch('/api/cards/create', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || '오류가 발생했어요')
      setLoading(false)
      return
    }

    router.push('/library')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      {/* 타입 선택 */}
      <div className="flex gap-2">
        {(['youtube', 'text', 'image'] as InputType[]).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              type === t ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t === 'youtube' ? '📺 유튜브' : t === 'text' ? '📝 텍스트' : '📸 이미지'}
          </button>
        ))}
      </div>

      {/* 입력 영역 */}
      {type === 'youtube' && (
        <input
          type="url"
          placeholder="유튜브 링크를 붙여넣어요"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
        />
      )}

      {type === 'text' && (
        <>
          <textarea
            placeholder="텍스트를 붙여넣어요"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black resize-none"
          />
          <input
            type="url"
            placeholder="출처 링크 (선택)"
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </>
      )}

      {type === 'image' && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files?.[0] || null)}
            className="w-full border rounded-xl px-4 py-3 text-sm"
          />
          <input
            type="url"
            placeholder="원본 링크 (선택)"
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </>
      )}

      {/* 공개 범위 */}
      <select
        value={visibility}
        onChange={e => setVisibility(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
      >
        <option value="private">🔒 나만 보기</option>
        <option value="link">🔗 링크 공개</option>
        <option value="public">🌐 전체 공개</option>
      </select>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'AI가 분석 중이에요...' : '인사이트 카드 만들기 ✨'}
      </button>
    </div>
  )
}
