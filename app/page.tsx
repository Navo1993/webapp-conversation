'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

// --- 多語言字典 ---
const content = {
  zh_cn: {
    nav: { home: '首頁', intro: '介紹', why: '優勢', faq: '常見問題', start: '立即體驗' },
    hero: { title1: '智能電梯守護者', title2: '技術支持平台', sub: '專為廣交會演示開發。整合 IoT 與 AI，提供實時電梯故障診斷。' },
    why: { title: '為什麼選擇該系統？', item1: '秒級響應', desc1: '基於 Dify 引擎，故障碼查詢零延遲。', item2: 'IoT 聯動', desc2: '實時監測電梯運行狀態，異常即時預警。' },
    faq: { title: '常見問題', q1: '支持哪些電梯系統？', a1: '目前深度優化默納克 NICE 3000 系列，支持主流控制櫃。' },
    footer: { copy: '© 2026 項目組', demo: '演示專用版' }
  },
  zh_tw: {
    nav: { home: '首頁', intro: '介紹', why: '優勢', faq: '常見問題', start: '立即體驗' },
    hero: { title1: '智能電梯守護者', title2: '技術支持平台', sub: '專為廣交會演示開發。整合 IoT 與 AI，提供即時電梯故障診斷。' },
    why: { title: '為什麼選擇該系統？', item1: '秒級響應', desc1: '基於 Dify 引擎，故障碼查詢零延遲。', item2: 'IoT 聯動', desc2: '實時監測電梯運行狀態，異常即時預警。' },
    faq: { title: '常見問題', q1: '支持哪些電梯系統？', a1: '目前深度優化默納克 NICE 3000 系列，支持主流控制櫃。' },
    footer: { copy: '© 2026 項目組', demo: '演示專用版' }
  },
  en: {
    nav: { home: 'Home', intro: 'Intro', why: 'Why Us', faq: 'FAQ', start: 'Get Started' },
    hero: { title1: 'Smart Guard AI', title2: 'Support Platform', sub: 'Developed for Canton Fair. Integrating IoT and AI for real-time elevator diagnosis.' },
    why: { title: 'Why Choose Us?', item1: 'Fast Response', desc1: 'Zero latency for fault code queries via Dify.', item2: 'IoT Sync', desc2: 'Real-time monitoring with instant alerts for anomalies.' },
    faq: { title: 'FAQ', q1: 'Which systems are supported?', a1: 'Optimized for Monarch NICE 3000 series and mainstream controllers.' },
    footer: { copy: '© 2026 Project Team', demo: 'Demo Version' }
  }
}

const App: React.FC<IMainProps> = ({ params }: any) => {
  const [lang, setLang] = useState<'zh_cn' | 'zh_tw' | 'en'>('zh_cn')
  const [isChatting, setIsChatting] = useState(false)
  const t = content[lang]

  // 動畫參數
  const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 } }

  if (isChatting) return <Main params={params} />

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* 1. 導航欄 (騰訊風格：固定+毛玻璃) */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-8 py-4">
        <div className="text-xl font-black text-[#0052D9] tracking-tighter italic">SMART GUARD</div>
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          <a href="#hero" className="hover:text-[#0052D9]">{t.nav.home}</a>
          <a href="#why" className="hover:text-[#0052D9]">{t.nav.why}</a>
          <a href="#faq" className="hover:text-[#0052D9]">{t.nav.faq}</a>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="text-xs bg-gray-50 border-none outline-none cursor-pointer"
            onChange={(e) => setLang(e.target.value as any)}
          >
            <option value="zh_cn">简</option>
            <option value="zh_tw">繁</option>
            <option value="en">EN</option>
          </select>
          <button onClick={() => setIsChatting(true)} className="bg-[#0052D9] text-white px-5 py-2 rounded-full text-xs font-bold hover:scale-105 transition">
            {t.nav.start}
          </button>
        </div>
      </nav>

      {/* 2. Hero Section (動畫效果參考視頻中的大圖滾動) */}
      <section id="hero" className="relative h-screen flex items-center justify-center bg-gray-50 px-8">
        <motion.div {...fadeInUp} className="text-center space-y-6 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter">
            {t.hero.title1} <br />
            <span className="text-[#0052D9]">{t.hero.title2}</span>
          </h1>
          <p className="text-xl text-gray-400 font-light">{t.hero.sub}</p>
          <button onClick={() => setIsChatting(true)} className="mt-8 bg-[#0052D9] text-white px-10 py-4 rounded-xl text-lg font-bold shadow-2xl hover:shadow-blue-200 transition">
            {t.nav.start}
          </button>
        </motion.div>
      </section>

      {/* 3. 為什麼使用 (卡片滑動動畫) */}
      <section id="why" className="py-32 px-8 max-w-6xl mx-auto">
        <motion.h2 {...fadeInUp} className="text-4xl font-bold mb-16 text-center">{t.why.title}</motion.h2>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div {...fadeInUp} className="p-10 bg-gray-50 rounded-3xl hover:shadow-xl transition group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-[#0052D9] mb-6 group-hover:scale-110 transition">⚡</div>
            <h3 className="text-2xl font-bold mb-4">{t.why.item1}</h3>
            <p className="text-gray-500">{t.why.desc1}</p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="p-10 bg-gray-50 rounded-3xl hover:shadow-xl transition group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition">📡</div>
            <h3 className="text-2xl font-bold mb-4">{t.why.item2}</h3>
            <p className="text-gray-500">{t.why.desc2}</p>
          </motion.div>
        </div>
      </section>

      {/* 4. FAQs (手風琴效果) */}
      <section id="faq" className="py-32 bg-gray-900 text-white px-8">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-4xl font-bold mb-16 text-center">{t.faq.title}</motion.h2>
          <div className="space-y-4">
            {[1].map((i) => (
              <motion.div key={i} {...fadeInUp} className="border-b border-white/10 pb-6">
                <h4 className="text-xl font-bold mb-2">Q: {t.faq.q1}</h4>
                <p className="text-gray-400">A: {t.faq.a1}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 騰訊風格頁腳 */}
      <footer className="py-20 px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[12px] text-gray-400 space-y-2">
            <p>{t.footer.copy}</p>
            <div className="flex gap-4">
              <span>粵ICP備20260501號</span>
              <span className="flex items-center gap-1">
                <img src="/police.png" className="w-3 h-3 opacity-30" /> 
                粵公網安備 (演示)
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="px-3 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.footer.demo}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
