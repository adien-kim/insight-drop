export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export async function getYoutubeTranscript(url: string): Promise<string> {
  throw new Error('유튜브 자막 기능은 준비 중이에요. 텍스트로 내용을 직접 입력해주세요.')
}