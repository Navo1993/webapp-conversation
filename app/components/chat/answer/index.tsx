'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, MessageRating, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline'
import React, { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import Tooltip from '@/app/components/base/tooltip'
import WorkflowProcess from '@/app/components/workflow/workflow-process'
import { randomString } from '@/utils/string'
import ImageGallery from '../../base/image-gallery'
import LoadingAnim from '../loading-anim'
import s from '../style.module.css'
import Thought from '../thought'

function OperationBtn({
  innerContent,
  onClick,
  className,
}: {
  innerContent: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <div
      className={`relative box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-white cursor-pointer text-gray-500 hover:text-gray-800 ${className ?? ''}`}
      style={{ boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)' }}
      onClick={onClick}
    >
      {innerContent}
    </div>
  )
}

const RatingIcon: FC<{ isLike: boolean }> = ({ isLike }) =>
  isLike ? <HandThumbUpIcon className="w-4 h-4" /> : <HandThumbDownIcon className="w-4 h-4" />

/* ── 🔊 TTS 图标 ──────────────────────────────────────────── */

/** 播放（喇叭）图标 */
const SpeakerIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
)

/** 停止图标 */
const StopIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
)

/** 加载 Spinner */
const SpinnerIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin ${className ?? ''}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
)

const IconWrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg h-6 w-6 flex items-center justify-center hover:bg-gray-100">
    {children}
  </div>
)

/* ── 🔊 useTTS Hook ───────────────────────────────────────── */

type TTSState = 'idle' | 'loading' | 'playing'

function useTTS() {
  const [ttsState, setTtsState] = useState<TTSState>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setTtsState('idle')
  }, [])

  const playTTS = useCallback(async (messageId: string, text: string) => {
    // 如果正在播放，点击则停止
    if (ttsState === 'playing' || ttsState === 'loading') {
      stopAudio()
      return
    }

    setTtsState('loading')
    try {
      const res = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, text }),
      })

      if (!res.ok)
        throw new Error(`TTS 请求失败 (${res.status})`)

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)

      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        URL.revokeObjectURL(url)
        setTtsState('idle')
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        setTtsState('idle')
      }

      await audio.play()
      setTtsState('playing')
    }
    catch {
      setTtsState('idle')
    }
  }, [ttsState, stopAudio])

  return { ttsState, playTTS, stopAudio }
}

/* ── Answer 主组件 ────────────────────────────────────────── */

interface IAnswerProps {
  item: ChatItem
  feedbackDisabled: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  suggestionClick?: (suggestion: string) => void
}

const Answer: FC<IAnswerProps> = ({
  item,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  allToolIcons,
  suggestionClick = () => {},
}) => {
  const { id, content, feedback, agent_thoughts, workflowProcess, suggestedQuestions = [] } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0
  const { t } = useTranslation()

  // 🔊 TTS
  const { ttsState, playTTS } = useTTS()

  const renderFeedbackRating = (rating: MessageRating | undefined) => {
    if (!rating) return null
    const isLike = rating === 'like'
    const ratingIconClassname = isLike
      ? 'text-primary-600 bg-primary-100 hover:bg-primary-200'
      : 'text-red-600 bg-red-100 hover:bg-red-200'
    return (
      <Tooltip
        selector={`user-feedback-${randomString(16)}`}
        content={isLike ? '取消赞同' : '取消反对'}
      >
        <div
          className="relative box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-white cursor-pointer text-gray-500 hover:text-gray-800"
          style={{ boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)' }}
          onClick={async () => { await onFeedback?.(id, { rating: null }) }}
        >
          <div className={`${ratingIconClassname} rounded-lg h-6 w-6 flex items-center justify-center`}>
            <RatingIcon isLike={isLike} />
          </div>
        </div>
      </Tooltip>
    )
  }

  const renderItemOperation = () => {
    const userOperation = () => {
      return feedback?.rating
        ? null
        : (
          <div className="flex gap-1">
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.like') as string}>
              {OperationBtn({
                innerContent: <IconWrapper><RatingIcon isLike={true} /></IconWrapper>,
                onClick: () => onFeedback?.(id, { rating: 'like' }),
              })}
            </Tooltip>
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.dislike') as string}>
              {OperationBtn({
                innerContent: <IconWrapper><RatingIcon isLike={false} /></IconWrapper>,
                onClick: () => onFeedback?.(id, { rating: 'dislike' }),
              })}
            </Tooltip>
          </div>
        )
    }

    return (
      <div className={`${s.itemOperation} flex gap-2`}>
        {userOperation()}
      </div>
    )
  }

  const getImgs = (list?: VisionFile[]) => {
    if (!list) return []
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  const agentModeAnswer = (
    <div>
      {agent_thoughts?.map((item, index) => (
        <div key={index}>
          {item.thought && <StreamdownMarkdown content={item.thought} />}
          {!!item.tool && (
            <Thought
              thought={item}
              allToolIcons={allToolIcons || {}}
              isFinished={!!item.observation || !isResponding}
            />
          )}
          {getImgs(item.message_files).length > 0 && (
            <ImageGallery srcs={getImgs(item.message_files).map(item => item.url)} />
          )}
        </div>
      ))}
    </div>
  )

  // 🔊 TTS 按钮（回答完成后才显示）
  const renderTTSButton = () => {
    if (isResponding || !content) return null

    const tooltipText = ttsState === 'playing'
      ? '停止播放'
      : ttsState === 'loading'
        ? '加载中...'
        : '朗读回答'

    const icon = ttsState === 'loading'
      ? <SpinnerIcon className="w-4 h-4" />
      : ttsState === 'playing'
        ? <StopIcon className="w-3.5 h-3.5 text-blue-500" />
        : <SpeakerIcon className="w-4 h-4" />

    return (
      <Tooltip selector={`tts-${id}`} content={tooltipText}>
        {OperationBtn({
          innerContent: <IconWrapper>{icon}</IconWrapper>,
          onClick: () => playTTS(id, content),
          className: ttsState === 'playing' ? 'text-blue-500' : '',
        })}
      </Tooltip>
    )
  }

  return (
    <div key={id}>
      <div className="flex items-start">
        <div className={`${s.answerIcon} w-10 h-10 shrink-0`}>
          {isResponding && (
            <div className={s.typeingIcon}>
              <LoadingAnim type="avatar" />
            </div>
          )}
        </div>
        <div className={`${s.answerWrap} max-w-[calc(100%-3rem)]`}>
          <div className={`${s.answer} relative text-sm text-gray-900`}>
            <div className={`ml-2 py-3 px-4 bg-gray-100 rounded-tr-2xl rounded-b-2xl ${workflowProcess && 'min-w-[480px]'}`}>
              {workflowProcess && <WorkflowProcess data={workflowProcess} hideInfo />}
              {(isResponding && (isAgentMode
                ? (!content && (agent_thoughts || []).filter(item => !!item.thought || !!item.tool).length === 0)
                : !content))
                ? (
                  <div className="flex items-center justify-center w-6 h-5">
                    <LoadingAnim type="text" />
                  </div>
                )
                : (isAgentMode
                  ? agentModeAnswer
                  : <StreamdownMarkdown content={content} />
                )}
              {suggestedQuestions.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {suggestedQuestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Button className="text-sm" type="link" onClick={() => suggestionClick(suggestion)}>
                          {suggestion}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 操作按钮区：点赞/点踩 + 🔊 朗读 */}
            <div className="absolute top-[-14px] right-[-14px] flex flex-row justify-end gap-1">
              {!feedbackDisabled && !item.feedbackDisabled && renderItemOperation()}
              {!feedbackDisabled && renderFeedbackRating(feedback?.rating)}
              {/* 🔊 TTS 按钮，始终显示（不受 feedbackDisabled 影响） */}
              {renderTTSButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Answer)

