import { createClient } from '@/lib/supabase/server'
import { analyzeText, analyzeYoutube, analyzeImage } from '@/lib/gemini'
import { getYoutubeTranscript } from '@/lib/youtube'
import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const type = formData.get('type') as string
    const sourceUrl = formData.get('source_url') as string || null
    const visibility = formData.get('visibility') as string || 'private'

    let aiResult
    let sourceImagePath = null

    if (type === 'youtube') {
      const url = formData.get('url') as string
      const transcript = await getYoutubeTranscript(url)
      aiResult = await analyzeYoutube(transcript)

    } else if (type === 'image') {
      const file = formData.get('image') as File
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      aiResult = await analyzeImage(base64, file.type)

      // Supabase Storage에 이미지 저장
      const fileName = `${user.id}/${nanoid()}.${file.type.split('/')[1]}`
      const { data } = await supabase.storage
        .from('card-images')
        .upload(fileName, file)
      sourceImagePath = data?.path || null

    } else {
      const text = formData.get('text') as string
      aiResult = await analyzeText(text)
    }

    // 카드 DB 저장
    const slug = nanoid(10)
    const { data: card, error } = await supabase
      .from('cards')
      .insert({
        slug,
        user_id: user.id,
        source_type: type,
        source_url: sourceUrl,
        source_image_path: sourceImagePath,
        ai_title: aiResult.title,
        ai_points: aiResult.points,
        ai_one_line: aiResult.one_line,
        tags: aiResult.tags,
        visibility,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ card })

  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
