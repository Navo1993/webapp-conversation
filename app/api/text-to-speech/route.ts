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

    if (!res.ok) {
      const err = await res.text()
      return new Response(err, { status: res.status })
    }

    // ✅ 直接把音频流 pipe 给前端，不读取 arrayBuffer
    return new Response(res.body, {
      status: 200,
      headers: {
        ...setSession(sessionId),
        'Content-Type': res.headers.get('Content-Type') || 'audio/wav',
        'Transfer-Encoding': 'chunked',
      },
    })
  }
  catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
