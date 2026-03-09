import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CardItem from '@/components/card/CardItem'

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: cards } = await supabase
    .from('cards')
    .select('*, profiles(username, avatar_url)')
    .eq('visibility', 'public')
    .neq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const allTags = Array.from(new Set(cards?.flatMap((c: any) => c.tags) || []))

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">탐색</h1>
            <p className="text-sm text-gray-500 mt-1">다른 사람들의 인사이트를 둘러봐요</p>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            <span className="text-xs bg-black text-white px-3 py-1 rounded-full">전체</span>
            {allTags.map((tag: any) => (
              <span key={tag} className="text-xs bg-white border px-3 py-1 rounded-full cursor-pointer hover:bg-gray-50">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {cards && cards.length > 0 ? (
          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            {cards.map((card: any) => (
              <div key={card.id} className="break-inside-avoid">
                <div className="mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {card.profiles?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-xs text-gray-500">{card.profiles?.username || '익명'}</span>
                </div>
                <CardItem card={card} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p>아직 공개된 인사이트가 없어요</p>
            <p className="text-sm mt-2">카드를 만들고 전체 공개로 설정해봐요</p>
          </div>
        )}
      </div>
    </main>
  )
}
