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

    const targetUrl = `${API_URL}/audio-to-text`

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}` },
      body: newFormData,
    })

    const responseText = await res.text()

    // 🔍 不管成功失败，把所有信息返回前端方便排查
    return Response.json({
      debug: {
        targetUrl,
        apiKeyPrefix: API_KEY?.slice(0, 8) + '...',  // 只显示前8位
        fileInfo: { name: file.name, type: file.type, size: file.size },
        difyStatus: res.status,
        difyResponse: responseText,
      },
      text: res.ok ? JSON.parse(responseText).text : null,
      error: res.ok ? null : responseText,
    }, { status: res.ok ? 200 : res.status, headers: setSession(sessionId) })
  }
  catch (e: any) {
    return Response.json({ error: e.message, stack: e.stack }, { status: 500 })
  }
}
