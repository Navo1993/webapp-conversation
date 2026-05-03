'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronRight, ArrowRight, Monitor, Cpu, ShieldCheck } from 'lucide-react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

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
  const [lang, setLang] = useState<'zh_cn'>('zh_cn')
  const [isChatting, setIsChatting] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  
  const t = content[lang]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isChatting) return <Main params={params} />

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased selection:bg-blue-100 selection:text-blue-700">
      
      {/* --- 1. 高度精緻導航欄 --- */}
      <nav 
        className={`fixed w-full z-[100] transition-all duration-700 ease-in-out ${
          scrolled || activeMenu ? 'bg-white/95 backdrop-blur-2xl py-4 shadow-sm' : 'bg-transparent py-6'
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-16">
            <div className="text-[20px] font-[900] text-[#0052D9] tracking-tighter uppercase cursor-pointer flex items-center gap-3">
              Smart Guard <span className="w-[1px] h-4 bg-gray-200"></span> <span className="text-[11px] tracking-[0.3em] text-gray-400 font-black">AI</span>
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
                    <motion.div layoutId="nav-line" className="absolute -bottom-[22px] left-0 right-0 h-[3px] bg-[#0052D9]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-[#0052D9] transition-all">
                <Globe className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-tighter">EN</span>
             </div>
             <button 
                onClick={() => setIsChatting(true)}
                className="bg-[#0052D9] text-white px-7 py-2.5 rounded-full text-[12px] font-black hover:bg-[#0042b3] hover:shadow-[0_8px_20px_rgba(0,82,217,0.15)] transition-all active:scale-95"
             >
               {t.common.start}
             </button>
          </div>
        </div>

        {/* 騰訊風格下拉菜單 */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              <div className="max-w-[1400px] mx-auto px-12 py-16 grid grid-cols-12 gap-8">
                {/* 左側描述空間 (騰訊特色) */}
                <div className="col-span-3 border-r border-gray-50 pr-8">
                   <h2 className="text-2xl font-black text-[#0052D9] mb-4">
                     {t.nav.find(n => n.id === activeMenu)?.label}
                   </h2>
                   <p className="text-sm text-gray-400 leading-relaxed font-medium">
                     探索 Smart Guard 如何利用領先的 AI 技術重塑電梯維保生態。
                   </p>
                </div>
                {/* 鏈接群組 */}
                <div className="col-span-9 grid grid-cols-3 gap-12 pl-8">
                  {t.nav.find(n => n.id === activeMenu)?.columns.map((col, idx) => (
                    <div key={idx}>
                      <h3 className="text-[10px] font-black text-gray-300 mb-6 tracking-[0.2em] uppercase">{col.title}</h3>
                      <ul className="space-y-4">
                        {col.links.map((link, lIdx) => (
                          <li key={lIdx} className="text-[15px] font-bold text-gray-700 hover:text-[#0052D9] hover:translate-x-1 transition-all cursor-pointer flex items-center group">
                            {link} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ml-2 transition-all text-[#0052D9]" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- 2. Hero 主視覺 --- */}
      <section className="relative h-screen flex items-center justify-center bg-[#F8FAFF] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-blue-600/[0.015] select-none pointer-events-none uppercase">
          Guard
        </div>
        
        <div className="relative z-10 text-center max-w-6xl px-12 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="text-[64px] lg:text-[92px] font-[900] leading-[1.1] tracking-[-0.03em] text-[#1d1d1f] mb-8">
              {t.hero.title1}<span className="text-[#0052D9]">.</span><br />
              <span className="text-[#0052D9] italic font-serif opacity-90">{t.hero.title2}</span>
            </h1>
            <p className="text-[20px] text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              {t.hero.sub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={() => setIsChatting(true)} className="bg-[#0052D9] text-white px-10 py-4 rounded-xl text-base font-black hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
                {t.common.start} <ChevronRight className="w-5 h-5" />
              </button>
              <button className="text-[#1d1d1f] px-10 py-4 rounded-xl text-base font-black hover:bg-gray-100 transition-all">
                {t.common.more}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center gap-3">
          <span className="text-[9px] font-black tracking-[0.4em] text-gray-300 uppercase">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#0052D9] to-transparent" />
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

      {/* --- 4. 頁腳 (對齊錄屏中的極簡專業風格) --- */}
      <footer className="bg-[#1b1e23] text-white pt-24 pb-12 px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-white/5 pb-16 mb-12">
            <div className="lg:col-span-4 space-y-6">
              <div className="text-[22px] font-black tracking-tighter italic text-[#0052D9]">SMART GUARD AI</div>
              <p className="text-gray-500 max-w-xs text-sm leading-relaxed font-medium opacity-80">
                連接安全，預見未來。我們致力於打造更智能、更透明的城市垂直交通監控體系。
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-5">
                <h4 className="text-white/20 font-black tracking-[0.2em] text-[10px] uppercase">产品中心</h4>
                <ul className="space-y-3 text-gray-400 font-bold text-sm">
                  <li className="hover:text-white transition-colors cursor-pointer">故障诊断引擎</li>
                  <li className="hover:text-white transition-colors cursor-pointer">IoT 监控平台</li>
                </ul>
              </div>
              <div className="space-y-5">
                <h4 className="text-white/20 font-black tracking-[0.2em] text-[10px] uppercase">开发者</h4>
                <ul className="space-y-3 text-gray-400 font-bold text-sm">
                  <li className="hover:text-white transition-colors cursor-pointer">Dify 接入文档</li>
                  <li className="hover:text-white transition-colors cursor-pointer">API 接口说明</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-[12px] text-gray-500 font-bold">
              <span className="text-gray-600">{t.footer.copy}</span>
              <a href="#" className="hover:text-white transition-colors">粤ICP备20260501号</a>
              
              {/* 公安徽標區域 */}
              <a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors group">
                <img 
                  src="/police.png" 
                  alt="police" 
                  className="w-4 h-4 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                />
                <span>粤公网安备 44030502008888号</span>
              </a>
            </div>

            <div className="flex items-center gap-6">
              <div className="px-3 py-1 border border-white/5 rounded text-white/20 text-[9px] font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                {t.footer.demo}
              </div>
              <div className="flex items-center gap-4 text-gray-500">
                <Globe className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase">Mainland China</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
