'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronRight, ArrowRight, Monitor, Cpu, ShieldCheck } from 'lucide-react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

// --- 數據與多語言配置 ---
const content = {
  zh_cn: {
    nav: [
      { id: 'intro', label: '关于', columns: [
        { title: '项目概览', links: ['智能守护者简介', '技术演进', '广交会专题'] },
        { title: '核心团队', links: ['研发架构', '合作伙伴'] }
      ]},
      { id: 'tech', label: '技术', columns: [
        { title: '智能引擎', links: ['Dify AI 训练', '故障预测模型'] },
        { title: 'IoT 接入', links: ['默纳克系统协议', '传感器融合'] }
      ]},
      { id: 'news', label: '动态', columns: [
        { title: '最新消息', links: ['版本更新', '行业新闻'] }
      ]}
    ],
    common: { start: '立即体验', langName: '简', more: '了解更多' },
    hero: { title1: '连接安全', title2: '预见未来智能', sub: '专为广交会演示开发。整合 IoT 与 AI，提供实时电梯故障诊断与维护建议。' },
    features: {
      title: '重新定义电梯安全',
      list: [
        { icon: <Cpu />, t: '秒级响应', d: '基于 Dify 核心，故障码查询与解决方案生成仅在瞬息之间。' },
        { icon: <Monitor />, t: '数字孪生', d: '实时同步电梯运行参数，在虚拟空间构建精准的设备状态。' },
        { icon: <ShieldCheck />, t: '主动防御', d: '智能识别不安全乘梯行为，将隐患消灭在萌芽状态。' }
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

  if (isChatting) return <Main params={params} />

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased selection:bg-blue-100 selection:text-blue-700">
      
      {/* --- 1. 騰訊級導航欄 --- */}
      <nav 
        className={`fixed w-full z-[100] transition-all duration-700 ease-in-out ${
          scrolled || activeMenu ? 'bg-white/95 backdrop-blur-2xl py-4 shadow-sm' : 'bg-transparent py-6'
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-[1600px] mx-auto px-12 flex justify-between items-center">
          <div className="flex items-center gap-16">
            <div className="text-[22px] font-[900] text-[#0052D9] tracking-tighter uppercase cursor-pointer">
              Smart Guard <span className="text-gray-300 font-light">|</span> <span className="text-sm tracking-widest text-gray-500 font-bold">AI</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-10">
              {t.nav.map((item) => (
                <div 
                  key={item.id} 
                  className="relative cursor-pointer py-2 group"
                  onMouseEnter={() => setActiveMenu(item.id)}
                >
                  <span className={`text-[15px] font-bold transition-all duration-300 ${activeMenu === item.id ? 'text-[#0052D9]' : 'text-gray-600 hover:text-[#0052D9]'}`}>
                    {item.label}
                  </span>
                  {activeMenu === item.id && (
                    <motion.div layoutId="nav-line" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0052D9]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-[#0052D9] transition-all">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-tighter">EN</span>
             </div>
             <button 
                onClick={() => setIsChatting(true)}
                className="bg-[#0052D9] text-white px-8 py-3 rounded-full text-xs font-black hover:bg-[#0042b3] hover:shadow-[0_10px_20px_rgba(0,82,217,0.2)] transition-all active:scale-95"
             >
               {t.common.start}
             </button>
          </div>
        </div>

        {/* 巨型菜單動畫 */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-full left-0 w-full bg-white/98 backdrop-blur-3xl border-t border-gray-100 shadow-2xl"
            >
              <div className="max-w-[1600px] mx-auto px-12 py-20 grid grid-cols-4 gap-16 text-left">
                {t.nav.find(n => n.id === activeMenu)?.columns.map((col, idx) => (
                  <div key={idx}>
                    <h3 className="text-[11px] font-black text-gray-400 mb-8 tracking-[0.2em] uppercase">{col.title}</h3>
                    <ul className="space-y-5 text-left">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx} className="text-[17px] font-medium text-gray-800 hover:text-[#0052D9] hover:translate-x-2 transition-all cursor-pointer flex items-center group">
                          {link} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 ml-2 transition-all" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- 2. Hero Section --- */}
      <section className="relative h-screen flex items-center justify-center bg-[#F8FAFF] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-blue-600/[0.02] select-none pointer-events-none">
          GUARD
        </div>
        
        <div className="relative z-10 text-center max-w-6xl px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="text-[72px] lg:text-[100px] font-[900] leading-[1.05] tracking-[-0.04em] text-[#1d1d1f] mb-10">
              {t.hero.title1}<span className="text-[#0052D9]">.</span><br />
              <span className="text-[#0052D9] italic font-serif opacity-90">{t.hero.title2}</span>
            </h1>
            <p className="text-[22px] text-gray-500 font-medium max-w-3xl mx-auto mb-16 leading-relaxed">
              {t.hero.sub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={() => setIsChatting(true)} className="bg-[#0052D9] text-white px-12 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-3">
                {t.common.start} <ChevronRight className="w-5 h-5" />
              </button>
              <button className="text-[#1d1d1f] px-12 py-5 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-all">
                {t.common.more}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 3. 核心功能 --- */}
      <section className="py-48 px-12 max-w-[1600px] mx-auto text-left">
        <div className="mb-32">
          <h2 className="text-5xl font-[900] tracking-tight mb-6">{t.features.title}</h2>
          <div className="w-20 h-1.5 bg-[#0052D9] rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {t.features.list.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group p-16 bg-white rounded-[48px] border border-gray-100 hover:border-blue-100 hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)] transition-all duration-700"
            >
              <div className="w-16 h-16 bg-blue-50 text-[#0052D9] rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110">
                {React.cloneElement(f.icon as React.ReactElement, { size: 28 })}
              </div>
              <h3 className="text-2xl font-black mb-6">{f.t}</h3>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 4. 頁腳 (騰訊美學核心修改) --- */}
      <footer className="bg-[#1b1e23] text-white pt-24 pb-12 px-12">
        <div className="max-w-[1600px] mx-auto">
          {/* 上部鏈接區 */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-20 border-b border-white/5 pb-16 mb-12">
            <div className="space-y-6">
              <div className="text-2xl font-[900] tracking-tighter italic text-[#0052D9] uppercase">
                Smart Guard AI
              </div>
              <p className="text-gray-500 max-w-sm text-sm leading-relaxed font-medium">
                致力於通過人工智能與物聯網技術，打造更安全、更智能的城市垂直交通。
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-24">
              <div className="space-y-6">
                <h4 className="text-white/30 font-black tracking-[0.2em] text-[10px] uppercase font-sans">產品與服務</h4>
                <ul className="space-y-4 text-gray-400 font-bold text-sm">
                  <li className="hover:text-white transition-colors cursor-pointer">故障預測系統</li>
                  <li className="hover:text-white transition-colors cursor-pointer">IoT 數據接入</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-white/30 font-black tracking-[0.2em] text-[10px] uppercase font-sans">關於我們</h4>
                <ul className="space-y-4 text-gray-400 font-bold text-sm">
                  <li className="hover:text-white transition-colors cursor-pointer">技術演進</li>
                  <li className="hover:text-white transition-colors cursor-pointer">合作夥伴</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 下部備案區 (騰訊標準樣式) */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4 text-[12px] text-gray-500 font-medium">
              <span className="hover:text-gray-300 transition-colors cursor-pointer font-bold">{t.footer.copy}</span>
              
              <a href="https://beian.miit.gov.cn/" target="_blank" className="hover:text-gray-300 transition-colors">
                粵ICP備20260501號
              </a>
              
              {/* 公安網備 - 使用 public/police.png */}
              <a 
                href="http://www.beian.gov.cn/" 
                target="_blank" 
                className="flex items-center gap-1.5 hover:text-gray-300 transition-colors group"
              >
                <img 
                  src="/police.png" 
                  alt="公安網備"
                  className="w-4 h-4 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <span>粵公網安備 44030502008888號</span>
              </a>
              
              <div className="flex gap-6 border-l border-white/10 pl-8 ml-2">
                <span className="hover:text-gray-300 cursor-pointer">法律聲明</span>
                <span className="hover:text-gray-300 cursor-pointer">隱私策略</span>
              </div>
            </div>

            {/* 右側演示標籤 */}
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 border border-white/10 rounded-sm text-white/30 text-[9px] font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                {t.footer.demo}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
