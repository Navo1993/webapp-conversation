import type { NextRequest } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = getInfo(request)

    const incomingForm = await request.formData()
    const file = incomingForm.get('file') as File | null
    if (!file)
      return Response.json({ error: '没有收到音频文件' }, { status: 400 })

    const appId = process.env.VOLC_TTS_APP_ID
    const token = process.env.VOLC_TTS_TOKEN
    if (!appId || !token)
      return Response.json({ error: '火山引擎环境变量未配置' }, { status: 500 })

    // 把 wav 转成 base64
    const audioBuffer = await file.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    const res = await fetch('https://openspeech.bytedance.com/api/v3/asr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer;${token}`,
      },
      body: JSON.stringify({
        app: {
          appid: appId,
          token,
          cluster: 'volcengine_streaming_common',
        },
        user: { uid: 'webapp_user' },
        audio: {
          format: 'wav',
          encode: 'base64',
          data: base64Audio,
          sample_rate: 16000,
          bits: 16,
          channel: 1,
        },
        request: {
          reqid: `req_${Date.now()}`,
          workflow: 'audio_in,resample,partition,vad,fe,decode',
          result_type: 'full',
          sequence: -1,
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return Response.json({ error: `火山 ASR 失败: ${err}` }, { status: 500 })
    }

    const data = await res.json()

    // 提取识别文字
    const text = data?.result?.text
      || data?.result?.[0]?.text
      || data?.utterances?.[0]?.text
      || ''

    if (!text)
      return Response.json({ error: `识别结果为空: ${JSON.stringify(data)}` }, { status: 500 })

    return Response.json(
      { text },
      { headers: setSession(sessionId) },
    )
  }
  catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
