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
    // ✅ 直接传 File 对象，不转 arrayBuffer，避免二进制损耗
    newFormData.append('file', file, file.name || 'audio.webm')
    newFormData.append('user', user)

    const baseUrl = API_URL.replace(/\/+$/, '')
    const res = await fetch(`${baseUrl}/audio-to-text`, {
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
