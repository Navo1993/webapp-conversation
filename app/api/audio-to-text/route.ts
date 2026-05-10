import type { NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const { user } = getInfo(request)
    formData.append('user', user)
    const res = await client.audioToText(formData)
    return Response.json({ text: res.data.text })
  }
  catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
