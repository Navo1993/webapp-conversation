import type { NextRequest } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const { user, sessionId } = getInfo(request)
    const body = await request.json()
    const { message_id, text } = body

    const baseUrl = API_URL.replace(/\/+$/, '')
    const targetUrl = `${baseUrl}/text-to-audio`

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message_id, text, user }),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(
        JSON.stringify({ error: err, url: targetUrl }),
        { status: res.status, headers: { 'Content-Type': 'text/plain' } },
      )
    }

    // 获取音频内容类型
    const contentType = res.headers.get('Content-Type') || 'audio/wav'

    // 读取音频数据
    const audioData = await res.arrayBuffer()

    return new Response(audioData, {
      status: 200,
      headers: {
        ...setSession(sessionId),
        'Content-Type': contentType,
        'Content-Length': String(audioData.byteLength),
      },
    })
  }
  catch (e: any) {
    return new Response(
      e.message,
      { status: 500, headers: { 'Content-Type': 'text/plain' } },
    )
  }
}
