import type { NextRequest } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const { user, sessionId } = getInfo(request)

    // 重新构造 FormData，避免转发时 boundary 丢失
    const incomingForm = await request.formData()
    const file = incomingForm.get('file')
    if (!file)
      return Response.json({ error: '没有收到音频文件' }, { status: 400 })

    const newFormData = new FormData()
    newFormData.append('file', file as Blob, 'recording.webm')
    newFormData.append('user', user)

    const res = await fetch(`${API_URL}/audio-to-text`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        // 不设置 Content-Type，让 fetch 自动生成带 boundary 的 multipart
      },
      body: newFormData,
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
