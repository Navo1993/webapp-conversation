'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Globe, ChevronRight } from 'lucide-react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

// --- 多語言與菜單數據字典 ---
const content = {
  zh_cn: {
    nav: [
      { id: 'intro', label: '介绍', columns: [
        { title: '關於我們', links: ['項目簡介', '核心團隊', '發展里程碑'] },
        { title: '技術架構', links: ['Dify AI 接入', 'IoT 監控協議', '安全加密'] }
      ]},
      { id: 'business', label: '业务', columns: [
        { title: '解決方案', links: ['住宅電梯', '商場自動扶梯', '老舊梯改造'] },
        { title: '硬件配套', links: ['智能網關', '傳感器套件'] }
      ]},
      { id: 'support', label: '支持', columns: [
        { title: '資源中心', links: ['技術文檔', '故障碼庫', '演示視頻'] }
      ]}
    ],
    common: { start: '立即体验', langName: '简' },
    hero: { title1: '智能電梯守護者', title2: '技術支持平台', sub: '專為廣交會演示開發。整合 IoT 與 AI，提供實時電梯故障診斷。' },
    why: { title: '為什麼選擇該系統？', item1: '秒級響應', desc1: '基於 Dify 引擎，故障碼查詢零延遲。', item2: 'IoT 聯動', desc2: '實時監測電梯運行狀態，異常即時預警。' },
    faq: { title: '常見問題', q1: '支持哪些電梯系統？', a1: '目前深度優化默納克 NICE 3000 系列，支持主流控制櫃。' },
    footer: { copy: '© 2026 項目組', demo: '演示專用版' }
  },
  zh_tw: {
    nav: [
      { id: 'intro', label: '介紹', columns: [
        { title: '關於我們', links: ['項目簡介', '核心團隊', '發展里程碑'] },
        { title: '技術架構', links: ['Dify AI 接入', 'IoT 監控協議', '安全加密'] }
      ]},
      { id: 'business', label: '業務', columns: [
        { title: '解決方案', links: ['住宅電梯', '商場自動扶梯', '老舊梯改造'] },
        { title: '硬體配套', links: ['智能網關', '傳感器套件'] }
      ]},
      { id: 'support', label: '支持', columns: [
        { title: '資源中心', links: ['技術文檔', '故障碼庫', '演示視頻'] }
      ]}
    ],
    common: { start: '立即體驗', langName: '繁' },
    hero: { title1: '智能電梯守護者', title2: '技術支持平台', sub: '專為廣交會演示開發。整合 IoT 與 AI，提供即時電梯故障診斷。' },
    why: { title: '為什麼選擇該系統？', item1: '秒級響應', desc1: '基於 Dify 引擎，故障碼查詢零延遲。', item2: 'IoT 聯動', desc2: '實時監測電梯運行狀態，異常即時預警。' },
    faq: { title: '常見問題', q1: '支持哪些電梯系統？', a1: '目前深度優化默納克 NICE 3000 系列，支持主流控制櫃。' },
    footer: { copy: '© 2026 項目組', demo: '演示專用版' }
  },
  en: {
    nav: [
      { id: 'intro', label: 'Intro', columns: [
        { title: 'About', links: ['Project Info', 'Core Team', 'Milestones'] },
        { title: 'Tech', links: ['Dify AI', 'IoT Protocols', 'Security'] }
      ]},
      { id: 'business', label: 'Business', columns: [
        { title: 'Solutions', links: ['Residential', 'Escalator', 'Modernization'] },
        { title: 'Hardware', links: ['Smart Gateway', 'Sensors'] }
      ]},
      { id: 'support', label: 'Support', columns: [
        { title: 'Resources', links: ['Docs', 'Fault Codes', 'Demo Videos'] }
      ]}
    ],
    common: { start: 'Get Started', langName: 'EN' },
    hero: { title1: 'Smart Guard AI', title2: 'Tech Support', sub: 'Developed for Canton Fair. Integrating IoT and AI for real-time diagnosis.' },
    why: { title: 'Why Choose Us?', item1: 'Fast Response', desc1: 'Zero latency for fault code queries via Dify.', item2: 'IoT Sync', desc2: 'Real-time monitoring with instant alerts.' },
    faq: { title: 'FAQ', q1: 'Supported Systems?', a1: 'Optimized for Monarch NICE 3000 and mainstream controllers.' },
    footer: { copy: '© 2026 Team', demo: 'Demo Version' }
  }
}

const App: React.FC<IMainProps> = ({ params }: any) => {
  const [lang, setLang] = useState<'zh_cn' | 'zh_tw' | 'en'>('zh_cn')
  const [isChatting, setIsChatting] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  
  const t = content[lang]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 } }

  if (isChatting) return <Main params={params} />

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* 1. 導航欄 (對標騰訊影片動畫) */}
      <nav 
        className={`fixed w-full z-[100] transition-all duration-300 ${
          scrolled || activeMenu ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-[1440px] mx-auto px-10 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="text-2xl font-black text-[#0052D9] tracking-tighter italic cursor-pointer">SMART GUARD</div>
            
            {/* 桌面菜單項 */}
            <div className="hidden lg:flex items-center gap-10">
              {t.nav.map((item) => (
                <div 
                  key={item.id} 
                  className="relative h-full py-2 cursor-pointer group"
                  onMouseEnter={() => setActiveMenu(item.id)}
                >
                  <span className={`text-[15px] font-bold transition-colors ${activeMenu === item.id ? 'text-[#0052D9]' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                  {activeMenu === item.id && (
                    <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0052D9]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-[#0052D9]">
                <Globe className="w-4 h-4" />
                <select 
                  className="text-xs bg-transparent border-none outline-none font-bold cursor-pointer appearance-none"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                >
                  <option value="zh_cn">简</option>
                  <option value="zh_tw">繁</option>
                  <option value="en">EN</option>
                </select>
             </div>
             <button onClick={() => setIsChatting(true)} className="bg-[#0052D9] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:scale-105 transition shadow-lg shadow-blue-100">
               {t.common.start}
             </button>
          </div>
        </div>

        {/* 下拉巨型菜單動畫 */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl overflow-hidden"
            >
              <div className="max-w-[1440px] mx-auto px-10 py-12 grid grid-cols-4 gap-12">
                {t.nav.find(n => n.id === activeMenu)?.columns.map((col, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <h3 className="text-xs font-black text-gray-400 mb-6 tracking-widest uppercase">{col.title}</h3>
                    <ul className="space-y-4">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx} className="text-[15px] text-gray-700 hover:text-[#0052D9] hover:translate-x-1 transition-all cursor-pointer">
                          {link}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center bg-[#F5F8FF] px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <motion.div {...fadeInUp} className="relative z-10 text-center space-y-8 max-w-5xl">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-blue-50 text-[#0052D9] text-[10px] font-black tracking-widest rounded-full uppercase"
          >
            2026 Canton Fair Special Edition
          </motion.span>
          <h1 className="text-6xl md:text-[90px] font-black leading-[1.05] tracking-tighter text-gray-900">
            {t.hero.title1} <br />
            <span className="text-[#0052D9] italic font-serif">{t.hero.title2}</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">{t.hero.sub}</p>
          <div className="flex justify-center gap-4 pt-4">
            <button onClick={() => setIsChatting(true)} className="bg-[#0052D9] text-white px-10 py-4 rounded-xl text-lg font-bold shadow-2xl shadow-blue-200 hover:translate-y-[-2px] transition-all">
              {t.common.start}
            </button>
          </div>
        </motion.div>
      </section>

      {/* 3. 優勢介紹 */}
      <section id="why" className="py-32 px-10 max-w-7xl mx-auto">
        <motion.h2 {...fadeInUp} className="text-4xl font-black mb-20 text-center tracking-tight">{t.why.title}</motion.h2>
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div {...fadeInUp} className="p-12 bg-gray-50 rounded-[40px] hover:bg-white hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0052D9] mb-8 group-hover:rotate-12 transition-transform text-2xl">⚡</div>
            <h3 className="text-2xl font-bold mb-4">{t.why.item1}</h3>
            <p className="text-gray-500 text-lg leading-relaxed">{t.why.desc1}</p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="p-12 bg-gray-50 rounded-[40px] hover:bg-white hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-8 group-hover:rotate-12 transition-transform text-2xl">📡</div>
            <h3 className="text-2xl font-bold mb-4">{t.why.item2}</h3>
            <p className="text-gray-500 text-lg leading-relaxed">{t.why.desc2}</p>
          </motion.div>
        </div>
      </section>

      {/* 4. FAQs */}
      <section id="faq" className="py-32 bg-[#1b1e23] text-white px-10">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-4xl font-bold mb-20 text-center">{t.faq.title}</motion.h2>
          <div className="space-y-8">
             <motion.div {...fadeInUp} className="border-b border-white/10 pb-8 group cursor-pointer">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold group-hover:text-[#0052D9] transition-colors">Q: {t.faq.q1}</h4>
                  <ChevronRight className="w-5 h-5 opacity-30 group-hover:translate-x-2 transition-all" />
                </div>
                <p className="text-gray-400 leading-relaxed">A: {t.faq.a1}</p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-20 px-10 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-[13px] text-gray-400 space-y-3">
            <div className="text-[#0052D9] font-black text-xl mb-4 italic">SMART GUARD</div>
            <p>{t.footer.copy}</p>
            <div className="flex gap-6">
              <span>粵ICP備20260501號</span>
              <span className="flex items-center gap-1">粵公網安備 (演示)</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-gray-100 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              {t.footer.demo}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
