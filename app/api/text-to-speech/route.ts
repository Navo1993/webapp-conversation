import type { NextRequest } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const { user, sessionId } = getInfo(request)
    const { message_id, text } = await request.json()

    const baseUrl = API_URL.replace(/\/+$/, '')

    const res = await fetch(`${baseUrl}/text-to-audio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message_id, text, user }),
    })

    const audioBuffer = await res.arrayBuffer()

    // 🔍 临时调试：把 Dify 原始响应直接返回给前端
    const decoder = new TextDecoder()
    const responseText = decoder.decode(audioBuffer)

    return new Response(responseText, {
      status: res.status,
      headers: {
        ...setSession(sessionId),
        'Content-Type': 'text/plain',
      },
    })
  }
  catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
