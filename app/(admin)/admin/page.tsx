import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: userCount },
    { count: cardCount },
    { count: reportCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('cards').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const { data: recentCards } = await supabase
    .from('cards')
    .select('*, profiles(username)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: '전체 유저', value: userCount || 0, icon: '👤' },
    { label: '전체 카드', value: cardCount || 0, icon: '📚' },
    { label: '처리 대기 신고', value: reportCount || 0, icon: '🚨' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">대시보드</h1>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold mb-4">최근 카드</h2>
        <div className="space-y-3">
          {recentCards?.map((card: any) => (
            <div key={card.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium">{card.ai_title}</p>
                <p className="text-xs text-gray-400">{card.profiles?.username} · {new Date(card.created_at).toLocaleDateString('ko-KR')}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                card.visibility === 'public' ? 'bg-green-100 text-green-700' :
                card.visibility === 'link' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {card.visibility}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
