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
 
/* ================================================================
   工具函数：把 webm Blob 转成 wav Blob（纯 Web Audio API，零依赖）
   ================================================================ */
async function convertWebmToWav(blob: Blob): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer()
  const audioCtx = new AudioContext({ sampleRate: 16000 })
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
 
  const sampleRate = audioBuffer.sampleRate
  const samples = audioBuffer.getChannelData(0) // 取第一声道（单声道）
  const length = samples.length
 
  // 构造 WAV 文件（44字节头 + PCM数据）
  const wavBuffer = new ArrayBuffer(44 + length * 2)
  const view = new DataView(wavBuffer)
 
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++)
      view.setUint8(offset + i, str.charCodeAt(i))
  }
 
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + length * 2, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)        // PCM chunk size
  view.setUint16(20, 1, true)         // PCM format
  view.setUint16(22, 1, true)         // 单声道
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)         // block align
  view.setUint16(34, 16, true)        // 16-bit
  writeStr(36, 'data')
  view.setUint32(40, length * 2, true)
 
  // 写入 PCM 采样
  let offset = 44
  for (let i = 0; i < length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    offset += 2
  }
 
  await audioCtx.close()
  return new Blob([wavBuffer], { type: 'audio/wav' })
}
 
/* ================================================================
   🎙️ 语音输入 Hook
   录音(webm) → 转换(wav) → 上传 → 转录文字 → onSend
   ================================================================ */
function useVoiceInput(
  onSend: (message: string, files: VisionFile[]) => void,
  logError: (msg: string) => void,
) {
  const [isRecording, setIsRecording] = useState(false)
  const [isVoiceUploading, setIsVoiceUploading] = useState(false)
  const recognitionRef = useRef<any>(null)

  const startRecording = useCallback(async () => {
    if (isRecording) return

    const SpeechRecognition = (window as any).SpeechRecognition
      || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      logError('当前浏览器不支持语音识别，建议使用 Chrome')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      if (text) onSend(text, [])
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed')
        logError('麦克风权限被拒绝，请在浏览器设置中允许访问')
      else if (event.error === 'no-speech')
        logError('没有检测到语音，请重试')
      else
        logError(`语音识别失败：${event.error}`)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isRecording, onSend, logError])

  const stopAndSend = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
  }, [])

  return { isRecording, isVoiceUploading, startRecording, stopAndSend }
}
 
/* ── 图标 ─────────────────────────────────────────────────── */
 
const MicIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8"  y1="22" x2="16" y2="22" />
  </svg>
)
 
const SpinnerIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={cn('animate-spin', className)} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
)
 
/* ================================================================
   Chat 主组件
   ================================================================ */
 
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
 
  const logError = useCallback((message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }, [notify])
 
  const valid = () => {
    if (!queryRef.current || queryRef.current.trim() === '') {
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
 
  /* 🎙️ 语音 Hook */
  const { isRecording, isVoiceUploading, startRecording, stopAndSend } =
    useVoiceInput(onSend, logError)
 
  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) return
 
    const hasPendingImg = files.some(f => f.progress !== -1 && f.progress < 100)
    const hasPendingAtt = attachmentFiles.some(f => f.progress !== -1 && f.progress < 100)
    if (hasPendingImg || hasPendingAtt) {
      logError(t('app.errorMessage.waitForFileUpload'))
      return
    }
 
    const imageFiles: VisionFile[] = files
      .filter(f => f.progress !== -1)
      .map(f => ({
        type: 'image',
        transfer_method: f.type,
        url: f.url,
        upload_file_id: f.fileId,
      }))
 
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    onSend(queryRef.current, [...imageFiles, ...docAndOtherFiles])
 
    if (!files.find(i => i.type === TransferMethod.local_file && !i.fileId)) {
      if (files.length) onClear()
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(i => i.transferMethod === TransferMethod.local_file && !i.uploadedId))
      setAttachmentFiles([])
  }
 
  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (!e.shiftKey && !isUseInputMethod.current) handleSend()
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
{/* 消息列表 */}
<div className="h-full space-y-[30px]">
  {chatList.map((item) => {
    if (item.isAnswer) {
      const isLast = item.id === chatList[chatList.length - 1].id

      return (
        <div key={item.id} className="space-y-3">

          {/* AI生成提示 */}
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-blue-100
              bg-[#f8fbff]
              backdrop-blur-xl
              px-5
              py-3
              shadow-sm
            "
          >
            {/* 顶部渐变线 */}
            <div
              className="
                absolute
                top-0
                left-0
                w-full
                h-[1px]
                bg-gradient-to-r
                from-transparent
                via-[#93c5fd]
                to-transparent
                opacity-70
              "
            />

            <div className="flex items-center gap-3">

              {/* AI状态点 */}
              <div
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-[#60a5fa]
                  animate-pulse
                "
              />

              {/* 提示文字 */}
              <div
                className="
                  text-[13px]
                  md:text-[14px]
                  italic
                  tracking-[0.08em]
                  text-gray-500
                  font-medium
                "
              >
                本回答由 AI 生成，内容仅供参考，请仔细甄别。
              </div>
            </div>
          </div>

          {/* AI回答 */}
          <Answer
            item={item}
            feedbackDisabled={feedbackDisabled}
            onFeedback={onFeedback}
            isResponding={isResponding && isLast}
            suggestionClick={suggestionClick}
          />
        </div>
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
 
      {/* 输入区域 */}
      {!isHideSendInput && (
        <div className="fixed z-10 bottom-0 left-1/2 transform -translate-x-1/2
          pc:ml-[122px] tablet:ml-[96px] mobile:ml-0
          pc:w-[794px] tablet:w-[794px] max-w-full mobile:w-full px-3.5 pb-3">
 
          <div className="p-[5.5px] max-h-[150px] bg-white border-[1.5px]
            border-gray-200 rounded-xl overflow-y-auto relative">
 
            {/* 图片上传 */}
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
 
            {/* 附件上传 */}
            {fileConfig?.enabled && (
              <div className={`${visionConfig?.enabled ? 'pl-[52px]' : ''} mb-1`}>
                <FileUploaderInAttachmentWrapper
                  fileConfig={fileConfig}
                  value={attachmentFiles}
                  onChange={setAttachmentFiles}
                />
              </div>
            )}
 
            {/* Textarea */}
            <Textarea
              className={cn(
                'block w-full px-2 pr-[158px] py-[7px] leading-5 max-h-none',
                'text-base text-gray-700 outline-none appearance-none resize-none',
                visionConfig?.enabled && 'pl-12',
              )}
              value={query}
              onChange={handleContentChange}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
              autoSize
            />
 
            {/* 右下角按钮区 */}
            <div className="absolute bottom-2 right-6 flex items-center gap-1 h-8">
 
              {/* 字符计数 */}
              <div className={cn(s.count, 'h-5 leading-5 text-sm bg-gray-50 text-gray-500 px-2 rounded')}>
                {query.trim().length}
              </div>
 
              {/* 🎙️ 麦克风按钮 */}
              <Tooltip
                selector="voice-input-tip"
                htmlContent={
                  <div className="text-xs whitespace-nowrap">
                    {isVoiceUploading
                      ? '正在识别语音...'
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
                    e.currentTarget.setPointerCapture(e.pointerId)
                    startRecording()
                  }}
                  onPointerUp={stopAndSend}
                  onPointerLeave={stopAndSend}
                  aria-label={isRecording ? '松开停止录音' : '按住说话'}
                  aria-pressed={isRecording}
                  className={cn(
                    'relative w-8 h-8 rounded-md flex items-center justify-center',
                    'select-none outline-none transition-colors duration-150',
                    isVoiceUploading
                      ? 'bg-gray-100 cursor-wait text-gray-300'
                      : isRecording
                        ? 'bg-red-500 text-white cursor-pointer'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer',
                  )}
                >
                  {isRecording && (
                    <span className="absolute inset-0 rounded-md bg-red-400 animate-ping opacity-50 pointer-events-none" />
                  )}
                  {isVoiceUploading
                    ? <SpinnerIcon className="w-4 h-4" />
                    : <MicIcon className="w-4 h-4 relative z-10" />
                  }
                </button>
              </Tooltip>
 
              {/* 发送按钮 */}
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
                  className={cn(s.sendBtn, 'w-8 h-8 cursor-pointer rounded-md')}
                  onClick={handleSend}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
 
export default React.memo(Chat)
