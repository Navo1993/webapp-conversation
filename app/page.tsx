'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  ChevronRight, 
  ArrowRight, 
  Monitor, 
  Cpu, 
  ShieldCheck, 
  Plus, 
  Minus,
  ExternalLink
} from 'lucide-react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

// 內容配置：包含導航菜單結構、Hero、功能區與 FAQ
const content = {
  zh_cn: {
    nav: [
      { id: 'intro', label: '关于', columns: [
        { title: '项目概览', links: ['智能守护者简介', '技术演进', '广交会专题'] },
        { title: '核心团队', links: ['研发架构', '合作伙伴', '加入我们'] }
      ]},
      { id: 'tech', label: '技术', columns: [
        { title: '智能引擎', links: ['Dify AI 训练', '故障预测模型', 'RAG 知识库'] },
        { title: 'IoT 接入', links: ['默纳克系统协议', '传感器融合', 'E-bike 检测'] }
      ]},
      { id: 'news', label: '动态', columns: [
        { title: '最新消息', links: ['版本更新', '行业新闻', '展会回顾'] }
      ]}
    ],
    common: { start: '立即体验', langName: '简', more: '了解更多' },
    hero: { 
      title1: '连接安全', 
      title2: '预见未来智能', 
      sub: '专为广交会演示开发。整合 IoT 与 AI，提供实时电梯故障诊断与维护建议。' 
    },
    features: {
      title: '重新定义电梯安全',
      list: [
        { icon: <Cpu />, t: '秒级响应', d: '基于 Dify 核心，故障码查询与解决方案生成仅在瞬息之间。' },
        { icon: <Monitor />, t: '数字孪生', d: '实时同步电梯运行参数，在虚拟空间构建精准的设备状态。' },
        { icon: <ShieldCheck />, t: '主动防御', d: '智能识别不安全乘梯行为，将隐患消滅在萌芽状态。' }
      ]
    },
    faq: {
      title: '常見問題',
      subtitle: 'FAQs',
      items: [
        { q: 'Smart Guard 如何確保數據的實時性？', a: '我們通過自主研發的 IoT 網關直接對接默納克 NICE 3000 New 控制系統，實現毫秒級的數據採集與雲端同步。' },
        { q: 'AI 診斷模型是如何訓練的？', a: '模型基於數萬條真實電梯故障日誌，通過 Dify 平台進行檢索增強生成（RAG）訓練，確保技術建議的專業與準確。' },
        { q: '系統是否支持遠程控制電梯？', a: '出於安全規範，目前系統僅提供監測、預警與診斷建議功能，不直接參與電梯的運行控制決策。' },
        { q: '如何獲取廣交會演示版的訪問權限？', a: '您可以點擊導航欄的「立即體驗」進入 AI 知識庫網站進行交互演示。' }
      ]
    },
    footer: { copy: '© 2026 Smart Guard Project. All Rights Reserved.', demo: '广交会演示专用版本' }
  }
}

const App: React.FC<IMainProps> = ({ params }: any) => {
  const [isChatting, setIsChatting] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  
  const t = content.zh_cn

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 如果進入聊天模式，切換到組件 Main
  if (isChatting) return <Main params={params} />

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased selection:bg-blue-100 selection:text-blue-700">
      
      {/* --- 1. 騰訊風格導航欄 --- */}
      <nav 
        className={`fixed w-full z-[100] transition-all duration-500 ease-in-out ${
          scrolled || activeMenu ? 'bg-white/95 backdrop-blur-2xl shadow-sm' : 'bg-transparent'
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex justify-between items-center relative z-[101] py-6">
          <div className="flex items-center gap-16">
            <div className="text-[20px] font-[900] text-[#0052D9] tracking-tighter uppercase cursor-pointer flex items-center gap-3">
              Smart Guard <span className="w-[1px] h-4 bg-gray-200"></span> <span className="text-[11px] tracking-[0.3em] text-gray-400 font-black">AI</span>
            </div>
            
            {/* 一級導航項 */}
            <div className="hidden lg:flex items-center gap-10">
              {t.nav.map((item) => (
                <div 
                  key={item.id} 
                  className="relative cursor-pointer py-2"
                  onMouseEnter={() => setActiveMenu(item.id)}
                >
                  <span className={`text-[15px] font-bold transition-colors duration-300 ${
                    activeMenu === item.id ? 'text-[#0052D9]' : 'text-gray-600 hover:text-[#0052D9]'
                  }`}>
                    {item.label}
                  </span>
                  {/* 選中橫線動畫 */}
                  {activeMenu === item.id && (
                    <motion.div 
                      layoutId="nav-line" 
                      className="absolute -bottom-[26px] left-0 right-0 h-[3px] bg-[#0052D9]" 
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setIsChatting(true)} 
            className="bg-[#0052D9] text-white px-7 py-2.5 rounded-full text-[12px] font-black hover:bg-[#0042b3] hover:shadow-[0_8px_20px_rgba(0,82,217,0.15)] transition-all active:scale-95"
          >
            {t.common.start}
          </button>
        </div>

        {/* 下拉面板動畫 (仿 Desktop 2026.05.03 - 14.17.25.03_2.mp4) */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-50 overflow-hidden shadow-2xl"
            >
              <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-12 grid grid-cols-4 gap-12">
                {t.nav.find(n => n.id === activeMenu)?.columns.map((col, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 + 0.1 }}
                    className="space-y-6"
                  >
                    <h4 className="text-[12px] font-black text-gray-400 tracking-widest uppercase">
                      {col.title}
                    </h4>
                    <ul className="space-y-4">
                      {col.links.map((link, lIdx) => (
                        <li 
                          key={lIdx} 
                          className="text-[16px] font-bold text-gray-700 hover:text-[#0052D9] cursor-pointer transition-colors flex items-center group"
                        >
                          {link}
                          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
                
                {/* 右側視覺展示區塊 */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="col-span-1 bg-gray-50 rounded-2xl p-8 flex flex-col justify-between border border-gray-100"
                >
                  <div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-[#0052D9] mb-4">
                      <ExternalLink size={20} />
                    </div>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">
                      探索 Smart Guard 如何利用 Dify RAG 技術提升電梯維修效率。
                    </p>
                  </div>
                  <div className="text-[#0052D9] font-black text-xs cursor-pointer flex items-center gap-1 hover:gap-2 transition-all">
                    了解技術細節 <ArrowRight size={14} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- 2. Hero 主視覺 --- */}
      <section className="relative h-screen flex items-center justify-center bg-[#F8FAFF] overflow-hidden pt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-blue-600/[0.015] select-none pointer-events-none uppercase">Guard</div>
        <div className="relative z-10 text-center max-w-6xl px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}>
            <h1 className="text-[64px] lg:text-[92px] font-[900] leading-[1.1] tracking-[-0.03em] text-[#1d1d1f] mb-8">
              {t.hero.title1}<span className="text-[#0052D9]">.</span><br />
              <span className="text-[#0052D9] italic font-serif opacity-90">{t.hero.title2}</span>
            </h1>
            <p className="text-[20px] text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              {t.hero.sub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => setIsChatting(true)} 
                className="bg-[#0052D9] text-white px-10 py-4 rounded-xl text-base font-black hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
              >
                {t.common.start} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 3. 核心功能 --- */}
      <section className="py-40 px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col items-start mb-24">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">{t.features.title}</h2>
          <div className="w-16 h-1.5 bg-[#0052D9] rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {t.features.list.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }} 
              className="group p-12 bg-[#FBFBFC] rounded-[40px] hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.03)] transition-all duration-500"
            >
              <div className="w-14 h-14 bg-white text-[#0052D9] rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-[#0052D9] group-hover:text-white transition-all duration-500">
                {React.cloneElement(f.icon as React.ReactElement, { size: 24 })}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight text-gray-900">{f.t}</h3>
              <p className="text-gray-400 text-base leading-relaxed font-bold">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 4. FAQ Section (仿截圖 2026-05-03 142105.png) --- */}
      <section className="py-40 bg-gradient-to-b from-white via-[#F8FAFF] to-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-12 relative z-10">
          <div className="text-center mb-24">
            <motion.span className="text-[#0052D9] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">
              {t.faq.subtitle}
            </motion.span>
            <h2 className="text-[56px] font-black tracking-tight text-gray-900 leading-none">
              {t.faq.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.faq.items.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-10 lg:p-12 rounded-[32px] border border-gray-100 hover:border-blue-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,82,217,0.05)] transition-all duration-500 group cursor-default"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-[20px] lg:text-[22px] font-black text-gray-900 leading-snug group-hover:text-[#0052D9] transition-colors duration-300">
                    {item.q}
                  </h3>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#0052D9] group-hover:text-white transition-all duration-500 transform group-hover:rotate-45 shrink-0 ml-4">
                    <Plus size={18} />
                  </div>
                </div>
                <p className="text-gray-400 text-base leading-relaxed font-bold opacity-80">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. 頁腳 --- */}
      <footer className="bg-[#1b1e23] text-white pt-24 pb-12 px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-white/5 pb-16 mb-12">
            <div className="lg:col-span-4 space-y-6">
              <div className="text-[22px] font-black tracking-tighter italic text-[#0052D9]">SMART GUARD AI</div>
              <p className="text-gray-500 max-w-xs text-sm leading-relaxed font-medium">連接安全，預見未來。我們致力於打造更智能、更透明的城市垂直交通監控體系。</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-5">
                <h4 className="text-white/20 font-black tracking-[0.2em] text-[10px] uppercase">产品中心</h4>
                <ul className="space-y-3 text-gray-400 font-bold text-sm">
                  <li className="hover:text-white cursor-pointer transition-colors">故障诊断引擎</li>
                  <li className="hover:text-white cursor-pointer transition-colors">IoT 监控平台</li>
                </ul>
              </div>
              <div className="space-y-5">
                <h4 className="text-white/20 font-black tracking-[0.2em] text-[10px] uppercase">开发者</h4>
                <ul className="space-y-3 text-gray-400 font-bold text-sm">
                  <li className="hover:text-white cursor-pointer transition-colors">Dify 接入文档</li>
                  <li className="hover:text-white cursor-pointer transition-colors">API 接口说明</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 text-[12px] text-gray-500 font-bold">
            <span>{t.footer.copy}</span>
            <div className="flex gap-6 uppercase tracking-widest text-[10px]">
              <span className="text-white/20">{t.footer.demo}</span>
              <a href="#" className="hover:text-white transition-colors tracking-normal">粤ICP备20260501号</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
