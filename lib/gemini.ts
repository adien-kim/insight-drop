import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export interface CardAIResult {
  title: string
  points: string[]
  tags: string[]
  one_line: string
}

const PROMPT_SUFFIX = `
다음 규칙을 따라 분석해주세요:
- title: 핵심 메시지를 담은 제목. 20자 이내
- points: 실제로 도움이 되는 핵심 인사이트. 내용 길이에 따라 3~5개. 각각 완전한 문장으로
- tags: 주제 태그 2~4개. 한 단어로
- one_line: 이걸 친구에게 추천할 때 한 마디로. 40자 이내

만약 내용이 너무 짧거나 의미 없으면 points를 빈 배열로, title에 "분석 불가"를 넣어주세요.
JSON만 출력하세요. 다른 텍스트나 마크다운 없이.
`

function parseResult(text: string): CardAIResult {
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
  return JSON.parse(clean)
}

// 텍스트 분석
export async function analyzeText(text: string): Promise<CardAIResult> {
  const prompt = `당신은 콘텐츠 큐레이터입니다.\n아래 텍스트를 분석해주세요:\n\n${text}\n\n${PROMPT_SUFFIX}`
  const result = await model.generateContent(prompt)
  return parseResult(result.response.text())
}

// 유튜브 자막 분석
export async function analyzeYoutube(transcript: string): Promise<CardAIResult> {
  const prompt = `당신은 콘텐츠 큐레이터입니다.\n아래는 유튜브 영상의 자막입니다:\n\n${transcript}\n\n${PROMPT_SUFFIX}`
  const result = await model.generateContent(prompt)
  return parseResult(result.response.text())
}

// 이미지 분석 (인스타 캡처)
export async function analyzeImage(imageBase64: string, mimeType: string): Promise<CardAIResult> {
  const prompt = `당신은 콘텐츠 큐레이터입니다.\n아래 이미지는 인스타그램 게시물 캡처입니다. 텍스트와 시각적 맥락을 함께 읽어주세요.\n\n${PROMPT_SUFFIX}`
  const result = await model.generateContent([
    prompt,
    { inlineData: { data: imageBase64, mimeType } }
  ])
  return parseResult(result.response.text())
}
