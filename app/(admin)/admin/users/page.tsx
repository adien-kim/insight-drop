import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">유저 관리</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left text-xs text-gray-500 px-6 py-3">유저명</th>
              <th className="text-left text-xs text-gray-500 px-6 py-3">역할</th>
              <th className="text-left text-xs text-gray-500 px-6 py-3">공개 여부</th>
              <th className="text-left text-xs text-gray-500 px-6 py-3">가입일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users?.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{user.username}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'ADMIN' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.is_public ? '🌐 공개' : '🔒 비공개'}
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">
                  {new Date(user.created_at).toLocaleDateString('ko-KR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
