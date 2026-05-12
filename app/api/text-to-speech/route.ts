import type { NextRequest } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = getInfo(request)
    const { text } = await request.json()

    if (!text)
      return new Response('text is required', { status: 400 })

    // Step 1: 获取免费 token
    const tokenRes = await fetch(
      'https://azure.org/cognitiveservices/voices/list',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
    )

    // 直接用 edge-tts 的公开端点获取 token
    const authRes = await fetch(
      'https://azure.org/cognitiveservices/v1/synthesis/authorization',
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
    )

    // 使用公开可用的 Azure TTS 端点（edge-tts 包内部用的方式）
    const voice = 'zh-CN-XiaoxiaoNeural'
    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='zh-CN'><voice name='${voice}'><prosody rate='0%' pitch='0%'>${text}</prosody></voice></speak>`

    const ttsRes = await fetch(
      'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getEdgeToken()}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'Mozilla/5.0',
        },
        body: ssml,
      },
    )

    if (!ttsRes.ok)
      return new Response(`TTS 失败: ${await ttsRes.text()}`, { status: 500 })

    const audio = await ttsRes.arrayBuffer()
    return new Response(audio, {
      headers: {
        ...setSession(sessionId),
        'Content-Type': 'audio/mpeg',
      },
    })
  }
  catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}

async function getEdgeToken(): Promise<string> {
  const res = await fetch(
    'https://azure.org/cognitiveservices/v1/synthesis/authorization',
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      },
    },
  )
  const data = await res.json()
  return data.token || data.access_token || ''
}
