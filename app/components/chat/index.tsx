'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'

// ================================================================
// 🎙️ SECTION 1: 语音输入 Hook（完全独立模块，不影响任何现有逻辑）
// ================================================================

/**
 * useVoiceInput
 * 封装 MediaRecorder 录音 → Dify 文件上传 → 触发 onSend 的完整流程
 * 对外只暴露 4 个值，Chat 组件只需要调用这些即可
 */
function useVoiceInput(
  onSend: (message: string, files: VisionFile[]) => void,
  logError: (msg: string) => void,
) {
  const [isRecording, setIsRecording] = useState(false)
  const [isVoiceUploading, setIsVoiceUploading] = useState(false)

  // ref 版本的录音状态，用于在事件回调中读取最新值（避免闭包陷阱）
  const isRecordingRef = useRef(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  /** 将音频 Blob 上传到 Dify /files/upload，返回 file_id */
  const uploadAudio = useCallback(async (blob: Blob): Promise<string> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const appKey = process.env.NEXT_PUBLIC_APP_KEY
    if (!apiUrl || !appKey)
      throw new Error('环境变量 NEXT_PUBLIC_API_URL 或 NEXT_PUBLIC_APP_KEY 未配置')

    const formData = new FormData()
    // Dify 文件上传接口要求 file 字段，文件名决定 MIME 识别
    formData.append('file', blob, 'recording.webm')

    const res = await fetch(`${apiUrl}/files/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${appKey}` },
      body: formData,
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`上传失败 (${res.status}): ${errText}`)
    }

    const data = await res.json()
    if (!data.id)
      throw new Error('上传响应中未包含 file id')

    return data.id as string
  }, [])

  /**
   * stopAndSend
   * 停止 MediaRecorder → 等待 onstop 收齐所有 chunk → 上传 → 调用 onSend
   * 使用 isRecordingRef 防止 pointerUp + pointerLeave 双重触发
   */
  const stopAndSend = useCallback(() => {
    const recorder = mediaRecorderRef.current
    // 防御：未在录音 或 recorder 已停止时直接返回
    if (!recorder || recorder.state === 'inactive' || !isRecordingRef.current)
      return

    // 先标记为"停止中"，防止 pointerLeave 再次触发
    isRecordingRef.current = false
    setIsRecording(false)

    recorder.onstop = async () => {
      // 立即释放麦克风，避免浏览器一直占用设备
      recorder.stream.getTracks().forEach(t => t.stop())

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      audioChunksRef.current = []

      // 录音时间过短（< ~0.3s）产生的文件极小，直接忽略
      if (audioBlob.size < 3000) {
        logError('录音时间太短，请按住麦克风后再说话')
        return
      }

      setIsVoiceUploading(true)
      try {
        const fileId = await uploadAudio(audioBlob)

        /**
         * 用 'audio' 作为自定义 type 标记。
         * 父组件 handleSend 会识别此标记并将其转换为 Dify inputs 字段，
         * 而不是作为普通附件传给 files 参数。
         * 使用 `as any` 临时扩展联合类型，不修改全局 VisionFile 定义。
         */
        const audioVisionFile: VisionFile = {
          type: 'audio' as any,
          transfer_method: TransferMethod.local_file,
          url: '',
          upload_file_id: fileId,
        }

        // 传空字符串消息 + 一个 audio 类型的 VisionFile
        onSend('', [audioVisionFile])
      }
      catch (err: any) {
        logError(`语音上传失败：${err?.message ?? '未知错误，请重试'}`)
      }
      finally {
        setIsVoiceUploading(false)
      }
    }

    recorder.stop()
  }, [uploadAudio, onSend, logError])

  /**
   * startRecording
   * 请求麦克风权限 → 创建 MediaRecorder → 开始录音
   */
  const startRecording = useCallback(async () => {
    // 防止重复调用
    if (isRecordingRef.current)
      return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // 优先使用 opus 编码（更小体积，更好质量），不支持则降级
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const recorder = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []

      // 每 100ms 触发一次 ondataavailable，确保数据及时收集
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0)
          audioChunksRef.current.push(e.data)
      }

      recorder.start(100)
      mediaRecorderRef.current = recorder
      isRecordingRef.current = true
      setIsRecording(true)
    }
    catch (err: any) {
      // 精细化错误提示，帮助用户自助排查
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError')
        logError('麦克风权限被拒绝，请在浏览器地址栏设置中允许访问')
      else if (err?.name === 'NotFoundError')
        logError('未检测到麦克风设备，请检查硬件连接')
      else if (err?.name === 'NotSupportedError')
        logError('当前浏览器不支持录音功能，建议使用 Chrome')
      else
        logError(`无法启动录音：${err?.message ?? '未知错误'}`)
    }
  }, [logError])

  return { isRecording, isVoiceUploading, startRecording, stopAndSend }
}

// ================================================================
// 🎙️ SECTION 2: 图标组件（纯 SVG，零依赖）
// ================================================================

/** 麦克风图标 */
const MicIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
)

/** 上传中 Spinner */
const SpinnerIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('animate-spin', className)}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
)

// ================================================================
// Chat 主组件（改动最小化：仅加 Hook 调用 + 麦克风按钮 + pr 扩宽）
// ================================================================

export interface IChatProps {
  chatList: ChatItem[]
  feedbackDisabled?: boolean
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => {},
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])

  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  // ── 🎙️ [新增] 挂载语音 Hook，logError 和 onSend 均来自当前作用域 ──
  const { isRecording, isVoiceUploading, startRecording, stopAndSend } = useVoiceInput(
    onSend,
    logError,
  )
  // ─────────────────────────────────────────────────────────────────

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend()))
      return

    const hasPendingImageUploads = files.some(
      file => file.progress !== -1 && file.progress < 100,
    )
    const hasPendingAttachmentUploads = attachmentFiles.some(
      file => file.progress !== -1 && file.progress < 100,
    )
    if (hasPendingImageUploads || hasPendingAttachmentUploads) {
      logError(t('app.errorMessage.waitForFileUpload'))
      return
    }

    const imageFiles: VisionFile[] = files
      .filter(file => file.progress !== -1)
      .map(fileItem => ({
        type: 'image',
        transfer_method: fileItem.type,
        url: fileItem.url,
        upload_file_id: fileItem.fileId,
      }))

    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]

    onSend(queryRef.current, combinedFiles)

    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length)
        onClear()
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (
      !attachmentFiles.find(
        item => item.transferMethod === TransferMethod.local_file && !item.uploadedId,
      )
    )
      setAttachmentFiles([])
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (!e.shiftKey && !isUseInputMethod.current)
        handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full')}>
      {/* Chat List */}
      <div className="h-full space-y-[30px]">
        {chatList.map((item) => {
          if (item.isAnswer) {
            const isLast = item.id === chatList[chatList.length - 1].id
            return (
              <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && isLast}
                suggestionClick={suggestionClick}
              />
            )
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              useCurrentUserAvatar={useCurrentUserAvatar}
              imgSrcs={
                item.message_files && item.message_files.length > 0
                  ? item.message_files.map(f => f.url)
                  : []
              }
            />
          )
        })}
      </div>

      {!isHideSendInput && (
        <div className="fixed z-10 bottom-0 left-1/2 transform -translate-x-1/2 pc:ml-[122px] tablet:ml-[96px] mobile:ml-0 pc:w-[794px] tablet:w-[794px] max-w-full mobile:w-full px-3.5">
          <div className="p-[5.5px] max-h-[150px] bg-white border-[1.5px] border-gray-200 rounded-xl overflow-y-auto">

            {visionConfig?.enabled && (
              <>
                <div className="absolute bottom-2 left-2 flex items-center">
                  <ChatImageUploader
                    settings={visionConfig}
                    onUpload={onUpload}
                    disabled={files.length >= visionConfig.number_limits}
                  />
                  <div className="mx-1 w-[1px] h-4 bg-black/5" />
                </div>
                <div className="pl-[52px]">
                  <ImageList
                    list={files}
                    onRemove={onRemove}
                    onReUpload={onReUpload}
                    onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                    onImageLinkLoadError={onImageLinkLoadError}
                  />
                </div>
              </>
            )}

            {fileConfig?.enabled && (
              <div className={`${visionConfig?.enabled ? 'pl-[52px]' : ''} mb-1`}>
                <FileUploaderInAttachmentWrapper
                  fileConfig={fileConfig}
                  value={attachmentFiles}
                  onChange={setAttachmentFiles}
                />
              </div>
            )}

            {/*
              🎙️ [改动] pr 从 pr-[118px] → pr-[158px]
              原来: 字符计数(~44px) + 间距(4px) + 发送按钮(32px) + 右边距(24px) = 104px + padding ≈ 118px
              现在: 字符计数(~44px) + 间距(4px) + 麦克风按钮(32px) + 间距(4px) + 发送按钮(32px) + 右边距(24px) ≈ 158px
            */}
            <Textarea
              className={cn(
                'block w-full px-2 pr-[158px] py-[7px] leading-5 max-h-none text-base text-gray-700 outline-none appearance-none resize-none',
                visionConfig?.enabled && 'pl-12',
              )}
              value={query}
              onChange={handleContentChange}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
              autoSize
            />

            {/* ── 右下角按钮区 ───────────────────────────────────────── */}
            <div className="absolute bottom-2 right-6 flex items-center gap-1 h-8">

              {/* 字符计数（原样保留，仅移除 mr-3，改为 gap-1 统一间距） */}
              <div className={`${s.count} h-5 leading-5 text-sm bg-gray-50 text-gray-500 px-2 rounded`}>
                {query.trim().length}
              </div>

              {/* ─────────────────────────────────────────────────────
                🎙️ [新增] 麦克风按钮
                交互设计：
                  - onPointerDown：开始录音，同时 setPointerCapture 确保
                    手指/鼠标移出后 pointerup 事件仍能被本元素捕获
                  - onPointerUp：正常松开 → 停止并上传
                  - onPointerLeave：意外滑出 → 同样停止并上传，防止卡录音
                  - disabled：上传中禁用，防止重复操作
                ───────────────────────────────────────────────────── */}
              <Tooltip
                selector="voice-input-tip"
                htmlContent={
                  <div className="text-xs whitespace-nowrap">
                    {isVoiceUploading
                      ? '正在上传语音...'
                      : isRecording
                        ? '松开 停止录音'
                        : '按住 开始说话'}
                  </div>
                }
              >
                <button
                  type="button"
                  disabled={isVoiceUploading}
                  onPointerDown={(e) => {
                    // setPointerCapture 确保 pointerup/pointerleave 即使鼠标
                    // 快速移出按钮范围也能正确触发在此元素上
                    e.currentTarget.setPointerCapture(e.pointerId)
                    startRecording()
                  }}
                  onPointerUp={stopAndSend}
                  onPointerLeave={stopAndSend}
                  className={cn(
                    // 基础样式
                    'relative w-8 h-8 rounded-md flex items-center justify-center',
                    'transition-colors duration-150 select-none outline-none',
                    'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500',
                    // 三种状态的动态样式
                    isVoiceUploading
                      ? 'bg-gray-100 cursor-wait text-gray-300'      // 上传中：置灰禁用
                      : isRecording
                        ? 'bg-red-500 text-white cursor-pointer'      // 录音中：红色
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer', // 待机
                  )}
                  aria-label={isRecording ? '松开停止录音' : '按住说话'}
                  aria-pressed={isRecording}
                >
                  {/* 录音中的脉冲光晕动画（Tailwind animate-ping） */}
                  {isRecording && (
                    <span
                      className="absolute inset-0 rounded-md bg-red-400 animate-ping opacity-50 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}

                  {/* 图标：上传中显示 Spinner，其余显示麦克风 */}
                  {isVoiceUploading
                    ? <SpinnerIcon className="w-4 h-4" />
                    : <MicIcon className="w-4 h-4 relative z-10" />
                  }
                </button>
              </Tooltip>
              {/* ─────────────────────────────────────────────────────── */}

              {/* 发送按钮（原样保留） */}
              <Tooltip
                selector="send-tip"
                htmlContent={
                  <div>
                    <div>{t('common.operation.send')} Enter</div>
                    <div>{t('common.operation.lineBreak')} Shift Enter</div>
                  </div>
                }
              >
                <div
                  className={`${s.sendBtn} w-8 h-8 cursor-pointer rounded-md`}
                  onClick={handleSend}
                />
              </Tooltip>
            </div>
            {/* ─────────────────────────────────────────────────────────── */}

          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(Chat)
