import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CardInput from '@/components/card/CardInput'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Insight Drop ✨</h1>
        <CardInput />
      </div>
    </main>
  )
}
