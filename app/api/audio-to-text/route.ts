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

    const wavBuffer = await file.arrayBuffer()
    const baseUrl = API_URL.replace(/\/+$/, '')

    // 最多重试 3 次，每次间隔 1.5 秒
    let lastError = ''
    for (let attempt = 1; attempt <= 3; attempt++) {
      const newFormData = new FormData()
      newFormData.append(
        'file',
        new Blob([wavBuffer], { type: 'audio/wav' }),
        'audio.wav',
      )
      newFormData.append('user', user)

      const res = await fetch(`${baseUrl}/audio-to-text`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${API_KEY}` },
        body: newFormData,
      })

      const responseText = await res.text()

      if (res.ok) {
        const data = JSON.parse(responseText)
        return Response.json(
          { text: data.text },
          { headers: setSession(sessionId) },
        )
      }

      lastError = responseText

      // 如果是负载饱和错误，等待后重试
      if (responseText.includes('饱和') || responseText.includes('count_token_failed')) {
        if (attempt < 3)
          await new Promise(resolve => setTimeout(resolve, 1500 * attempt))
        continue
      }

      // 其他错误直接返回，不重试
      break
    }

    return Response.json({ error: lastError }, { status: 400 })
  }
  catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
