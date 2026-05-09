import type { AppInfo } from '@/types/app'

export const APP_ID  = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

export const APP_INFO: AppInfo = {
  title: '电梯专业智能体',   // ← 改回正确标题
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans',
  disable_session_same_site: false,
}

export const isShowPrompt = false
export const promptTemplate = ''

export const API_PREFIX = '/api'
export const LOCALE_COOKIE_NAME = 'locale'
export const DEFAULT_VALUE_MAX_LEN = 48
