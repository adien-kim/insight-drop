export async function crawlUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error('페이지를 가져올 수 없어요')

  const html = await res.text()

  // cheerio로 본문 추출
  const { load } = await import('cheerio')
  const $ = load(html)

  // 불필요한 태그 제거
  $('script, style, nav, footer, header, aside, iframe, img').remove()

  // 제목
  const title = $('title').text().trim() ||
    $('h1').first().text().trim() ||
    ''

  // 메타 설명
  const description = $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    ''

  // 본문 추출 (article > main > body 순서로 시도)
  let body = ''
  if ($('article').length) {
    body = $('article').text()
  } else if ($('main').length) {
    body = $('main').text()
  } else {
    body = $('body').text()
  }

  // 공백 정리
  body = body.replace(/\s+/g, ' ').trim().slice(0, 3000)

  const result = `제목: ${title}\n설명: ${description}\n본문: ${body}`
  console.log('크롤링 성공, 길이:', result.length)
  return result
}
