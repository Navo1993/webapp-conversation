import type { NextRequest } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = getInfo(request)
    const { text } = await request.json()

    if (!text)
      return new Response('text is required', { status: 400 })

    // 微软 Edge TTS REST 接口，无需 API Key
    const voice = 'zh-CN-XiaoxiaoNeural'
    const ssml = `
      <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='zh-CN'>
        <voice name='${voice}'>${text}</voice>
      </speak>
    `.trim()

    // 获取 token
    const tokenRes = await fetch(
      'https://eastus.api.speech.microsoft.com/cognitiveservices/v1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'Mozilla/5.0',
          'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        },
        body: ssml,
      },
    )

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      return new Response(`Edge TTS 失败: ${err}`, { status: 500 })
    }

    const audioBuffer = await tokenRes.arrayBuffer()

    return new Response(audioBuffer, {
      status: 200,
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
