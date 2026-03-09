import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: { slug: string }
}

const sourceIcon: Record<string, string> = {
  youtube: '📺',
  image: '📸',
  text: '📝',
  url: '🔗',
}

export async function generateMetadata({ params }: Props) {
  const supabase = await createClient()
  const { data: card } = await supabase
    .from('cards')
    .select('*, profiles(username)')
    .eq('slug', params.slug)
    .single()

  if (!card) return { title: 'Insight Drop' }

  return {
    title: card.ai_title,
    description: card.ai_one_line,
    openGraph: {
      title: card.ai_title,
      description: card.ai_one_line,
      type: 'article',
    },
  }
}

export default async function CardPage({ params }: Props) {
  const supabase = await createClient()
  const { data: card } = await supabase
    .from('cards')
    .select('*, profiles(username)')
    .eq('slug', params.slug)
    .single()

  if (!card) notFound()

  if (card.visibility === 'private') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-gray-600">비공개 카드예요</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {card.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-xl font-bold">
            {sourceIcon[card.source_type]} {card.ai_title}
          </h1>

          <ul className="space-y-2">
            {card.ai_points.map((point: string, i: number) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-gray-400 shrink-0">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              by {card.profiles?.username || '익명'} · {new Date(card.created_at).toLocaleDateString('ko-KR')}
            </div>
            {card.source_url && (
              <a
                href={card.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-black underline"
              >
                자세히 보기 →
              </a>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/home" className="text-sm text-gray-500 hover:text-black">
            Insight Drop에서 나만의 인사이트 모으기 →
          </Link>
        </div>
      </div>
    </main>
  )
}
