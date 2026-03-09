import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CardItem from '@/components/card/CardItem'
import Link from 'next/link'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allTags = Array.from(new Set(cards?.flatMap((c: any) => c.tags) || []))

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">내 라이브러리</h1>
          <Link
            href="/home"
            className="bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800"
          >
            + 새 카드
          </Link>
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
                <CardItem card={card} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">✨</p>
            <p>아직 저장된 인사이트가 없어요</p>
            <Link href="/home" className="text-black underline text-sm mt-2 inline-block">
              첫 카드 만들기 →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}