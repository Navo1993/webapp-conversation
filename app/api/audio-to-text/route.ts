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

    // 🔍 打印看看实际收到的文件信息
    console.log('file name:', file.name)
    console.log('file type:', file.type)
    console.log('file size:', file.size)

    // 强制用 mp4 容器 + 正确文件名，Dify 对格式要求严格
    const newFormData = new FormData()
    newFormData.append('file', new Blob([await file.arrayBuffer()], { type: 'audio/mp4' }), 'recording.mp4')
    newFormData.append('user', user)

    console.log('sending to:', `${API_URL}/audio-to-text`)

    const res = await fetch(`${API_URL}/audio-to-text`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}` },
      body: newFormData,
    })

    const responseText = await res.text()
    console.log('dify response:', res.status, responseText)

    if (!res.ok)
      return Response.json({ error: responseText }, { status: res.status })

    const data = JSON.parse(responseText)
    return Response.json(
      { text: data.text },
      { headers: setSession(sessionId) },
    )
  }
  catch (e: any) {
    console.error('audio-to-text error:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}
