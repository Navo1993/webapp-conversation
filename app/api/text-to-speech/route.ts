import type { NextRequest } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = getInfo(request)
    const { text } = await request.json()

    if (!text)
      return new Response('text is required', { status: 400 })

    const appId = process.env.VOLC_TTS_APP_ID
    const token = process.env.VOLC_TTS_TOKEN

    if (!appId || !token)
      return new Response('TTS 环境变量未配置', { status: 500 })

    const res = await fetch('https://openspeech.bytedance.com/api/v1/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer;${token}`,
      },
      body: JSON.stringify({
        app: {
          appid: appId,
          token,
          cluster: 'volcano_tts',
        },
        user: { uid: 'webapp_user' },
        audio: {
          voice_type: 'zh_female_yuanqinvyou_moon_bigtts',
          encoding: 'mp3',
          speed_ratio: 1.0,
          volume_ratio: 1.0,
          pitch_ratio: 1.0,
        },
        request: {
          reqid: `req_${Date.now()}`,
          text,
          text_type: 'plain',
          operation: 'query',
          with_frontend: 1,
          frontend_type: 'unitTson',
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(`火山 TTS 失败: ${err}`, { status: 500 })
    }

    const data = await res.json()

    // 火山返回 base64 编码的音频
    if (!data?.data) {
      return new Response(`TTS 返回为空: ${JSON.stringify(data)}`, { status: 500 })
    }

    const audioBuffer = Buffer.from(data.data, 'base64')

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...setSession(sessionId),
        'Content-Type': 'audio/mpeg',
      },
    })
  }
  catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
