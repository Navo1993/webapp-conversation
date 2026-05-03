'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

const App: FC<IMainProps> = ({ params }: any) => {
  const [isChatting, setIsChatting] = useState(false)
  const [loading, setLoading] = useState(false)

  // 進入聊天界面的平滑過渡
  const handleEnterChat = () => {
    setLoading(true)
    setTimeout(() => {
      setIsChatting(true)
      setLoading(false)
    }, 600)
  }

  if (isChatting) {
    return <Main params={params} />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 selection:bg-blue-100">
      {/* 導航欄 */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0052D9] rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <span className="text-xl font-bold tracking-tighter text-[#0052D9]">Smart Guard AI</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-[#0052D9] transition">技術規格</a>
          <a href="https://github.com" target="_blank" className="hover:text-[#0052D9] transition">GitHub</a>
        </div>
        <button 
          onClick={handleEnterChat}
          disabled={loading}
          className="bg-[#0052D9] text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? '系統加載中...' : '立即體驗'}
        </button>
      </nav>

      {/* 主視覺區 */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6 animate-section">
            <div className="inline-block px-3 py-1 bg-blue-100 text-[#0052D9] text-xs font-bold rounded-full">
              2026 廣交會演示專用版本
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
              讓電梯更安全，<br />讓維保更智能。
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              整合 IoT 實時監測數據與 Dify AI 智能體，專為電梯安裝、現代化改造及安全管理提供的數字化解決方案。
            </p>
            <button 
              onClick={handleEnterChat}
              className="group bg-[#0052D9] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
            >
              啟動智能助手
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          
          <div className="md:w-1/2 animate-section" style={{ animationDelay: '0.2s' }}>
            <div className="relative p-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-900 aspect-video rounded-2xl p-6 font-mono text-xs flex flex-col gap-2">
                <p className="text-green-400">{'['}INFO{']'} IoT Node: Monarch NICE 3000 P3 Connected.</p>
                <p className="text-blue-400">{'['}SYSTEM{']'} Dify Workflow Initialized.</p>
                <p className="text-white/40 mt-auto">{'//'} 等待指令輸入...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 合規頁腳 (重點修改：去偽存真) */}
      <footer className="mt-auto bg-gray-50 border-t border-gray-200 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="space-y-4">
              <div className="text-lg font-bold text-gray-800">Smart Guard AI</div>
              <p className="text-sm text-gray-400 max-w-xs">致力於通過 AI 與 IoT 技術提升電梯垂直交通的安全性與現代化水平。</p>
            </div>
            <div className="grid grid-cols-2 gap-16 text-sm">
              <div className="space-y-4">
                <div className="font-bold">項目</div>
                <div className="text-gray-500 hover:text-[#0052D9] cursor-pointer">技術開發說明</div>
                <div className="text-gray-500 hover:text-[#0052D9] cursor-pointer">開源協議</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400">
            <div className="flex flex-wrap items-center gap-4">
              <span>© 2026 Elevator Smart Guard Project.</span>
              <span className="px-2 py-0.5 bg-gray-200 rounded text-gray-600 font-medium">DEMO MODE</span>
              <span className="flex items-center gap-1 hover:text-gray-600 transition cursor-help">
                <img src="/police.png" className="w-3 h-3 grayscale opacity-50" /> 
                粵公網安備 (演示專用)
              </span>
            </div>
            <div className="flex gap-6">
              <span className="hover:text-[#0052D9] cursor-pointer">廣交會技術支持站點</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
