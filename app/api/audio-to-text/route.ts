import type { NextRequest } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const { user, sessionId } = getInfo(request)
    const formData = await request.formData()
    formData.append('user', user)

    const res = await fetch(`${API_URL}/audio-to-text`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}` },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.text()
      return Response.json({ error: err }, { status: res.status })
    }

    const data = await res.json()
    return Response.json(
      { text: data.text },
      { headers: setSession(sessionId) },
    )
  }
  catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
