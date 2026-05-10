import type { NextRequest } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const { user, sessionId } = getInfo(request)

    const incomingForm = await request.formData()
    const file = incomingForm.get('file') as File | null
    if (!file)
      return Response.json({ error: '没有收到音频文件' }, { status: 400 })

    const newFormData = new FormData()
    newFormData.append(
      'file',
      new Blob([await file.arrayBuffer()], { type: 'audio/mp4' }),
      'recording.mp4',
    )
    newFormData.append('user', user)

    // ✅ 去掉末尾斜杠再拼接，彻底避免双斜杠问题
    const baseUrl = API_URL.replace(/\/+$/, '')
    const targetUrl = `${baseUrl}/audio-to-text`

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}` },
      body: newFormData,
    })

    const responseText = await res.text()

    if (!res.ok)
      return Response.json({ error: responseText }, { status: res.status })

    const data = JSON.parse(responseText)
    return Response.json(
      { text: data.text },
      { headers: setSession(sessionId) },
    )
  }
  catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
