import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CardItem from '@/components/card/CardItem'
import Link from 'next/link'

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.username}의 인사이트 — Insight Drop`,
    description: `${params.username}이 모은 인사이트 모음`,
  }
}

export default async function UserProfilePage({ params }: Props) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) notFound()

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', profile.id)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
            {profile.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{profile.username}</h1>
            {profile.bio && <p className="text-sm text-gray-500">{profile.bio}</p>}
            <p className="text-xs text-gray-400 mt-1">공개 카드 {cards?.length || 0}개</p>
          </div>
        </div>

        {cards && cards.length > 0 ? (
          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            {cards.map((card: any) => (
              <div key={card.id} className="break-inside-avoid">
                <CardItem card={card} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">✨</p>
            <p>공개된 인사이트가 없어요</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/home" className="text-sm text-gray-500 hover:text-black">
            Insight Drop에서 나만의 인사이트 모으기 →
          </Link>
        </div>
      </div>
    </main>
  )
}