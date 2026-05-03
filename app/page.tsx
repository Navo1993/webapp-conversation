'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronRight, ArrowRight, Monitor, Cpu, ShieldCheck } from 'lucide-react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

// --- 國際化與菜單數據字典 ---
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
  },
  zh_tw: {
    nav: [
      { id: 'intro', label: '介紹', columns: [
        { title: '項目概覽', links: ['智能守護者簡介', '技術演進', '廣交會專題'] },
        { title: '核心團隊', links: ['研發架構', '合作夥伴'] }
      ]},
      { id: 'tech', label: '技術', columns: [
        { title: '智能引擎', links: ['Dify AI 訓練', '故障預測模型'] },
        { title: 'IoT 接入', links: ['默納克系統協議', '傳感器融合'] }
      ]},
      { id: 'news', label: '動態', columns: [
        { title: '最新消息', links: ['版本更新', '行業新聞'] }
      ]}
    ],
    common: { start: '立即體驗', langName: '繁', more: '了解更多' },
    hero: { title1: '連接安全', title2: '預見未來智能', sub: '專為廣交會演示開發。整合 IoT 與 AI，提供實時電梯故障診斷與維護建議。' },
    features: {
      title: '重新定義電梯安全',
      list: [
        { icon: <Cpu />, t: '秒級響應', d: '基於 Dify 核心，故障碼查詢與解決方案生成僅在瞬息之間。' },
        { icon: <Monitor />, t: '數字孿生', d: '實時同步電梯運行參數，在虛擬空間構建精準的設備狀態。' },
        { icon: <ShieldCheck />, t: '主動防禦', d: '智能識別不安全乘梯行為，將隱患消滅在萌芽狀態。' }
      ]
    },
    footer: { copy: '© 2026 Smart Guard Project. All Rights Reserved.', demo: '廣交會演示專用版本' }
  }
}

const App: React.FC<IMainProps> = ({ params }: any) => {
  const [lang, setLang] = useState<'zh_cn' | 'zh_tw'>('zh_cn')
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
          scrolled || activeMenu ? 'bg-white/90 backdrop-blur-2xl py-4 shadow-sm' : 'bg-transparent py-6'
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
             <div 
               className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-[#0052D9] transition-all"
               onClick={() => setLang(lang === 'zh_cn' ? 'zh_tw' : 'zh_cn')}
             >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-tighter">{t.common.langName}</span>
             </div>
             <button 
                onClick={() => setIsChatting(true)}
                className="bg-[#0052D9] text-white px-8 py-3 rounded-full text-xs font-black hover:bg-[#0042b3] hover:shadow-[0_10px_20px_rgba(0,82,217,0.2)] transition-all active:scale-95"
             >
               {t.common.start}
             </button>
          </div>
        </div>

        {/* 騰訊式巨型下拉菜單 */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-t border-gray-100 shadow-2xl overflow-hidden"
            >
              <div className="max-w-[1600px] mx-auto px-12 py-20 grid grid-cols-4 gap-16">
                {t.nav.find(n => n.id === activeMenu)?.columns.map((col, idx) => (
                  <div key={idx}>
                    <h3 className="text-[11px] font-black text-gray-400 mb-8 tracking-[0.2em] uppercase">{col.title}</h3>
                    <ul className="space-y-5">
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

      {/* --- 2. Hero 主視覺 --- */}
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

        <div className="absolute bottom-12 flex flex-col items-center gap-4">
          <span className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-blue-600 to-transparent" />
        </div>
      </section>

      {/* --- 3. 核心功能 --- */}
      <section className="py-48 px-12 max-w-[1600px] mx-auto">
        <div className="text-center mb-32">
          <h2 className="text-5xl font-[900] tracking-tight mb-6">{t.features.title}</h2>
          <div className="w-20 h-1.5 bg-[#0052D9] mx-auto rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {t.features.list.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-16 bg-white rounded-[48px] border border-gray-100 hover:border-blue-100 hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)] transition-all duration-700"
            >
              <div className="w-20 h-20 bg-blue-50 text-[#0052D9] rounded-[24px] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                {React.cloneElement(f.icon as React.ReactElement, { size: 32 })}
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">{f.t}</h3>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 4. 頁腳 (帶公安徽標細節) --- */}
      <footer className="bg-[#1b1e23] text-white py-24 px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-20 border-b border-white/5 pb-16 mb-16">
            <div className="space-y-6">
              <div className="text-2xl font-[900] tracking-tighter italic text-[#0052D9] uppercase">
                Smart Guard AI
              </div>
              <p className="text-gray-500 max-w-sm text-base leading-relaxed font-medium">
                致力於通過 AI 與 IoT 技術，為全球電梯用戶提供更安全、高效的垂直交通解決方案。
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-24">
              <div className="space-y-6">
                <h4 className="text-white/30 font-black tracking-[0.2em] text-[11px] uppercase">產品方案</h4>
                <ul className="space-y-4 text-gray-400 font-bold text-sm">
                  <li className="hover:text-[#0052D9] transition-colors cursor-pointer">NICE 3000 接入</li>
                  <li className="hover:text-[#0052D9] transition-colors cursor-pointer">故障診斷雲</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-white/30 font-black tracking-[0.2em] text-[11px] uppercase">開發資源</h4>
                <ul className="space-y-4 text-gray-400 font-bold text-sm">
                  <li className="hover:text-[#0052D9] transition-colors cursor-pointer">Dify API</li>
                  <li className="hover:text-[#0052D9] transition-colors cursor-pointer">技術手冊</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col xl:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center xl:justify-start items-center gap-x-8 gap-y-4 text-[12px] text-gray-500 font-bold">
              <span className="hover:text-white transition-colors cursor-pointer">{t.footer.copy}</span>
              <a href="https://beian.miit.gov.cn/" target="_blank" className="hover:text-white transition-colors">
                粵ICP備20260501號
              </a>
              
              <a 
                href="http://www.beian.gov.cn/" 
                target="_blank" 
                className="flex items-center gap-1.5 hover:text-white transition-colors group"
              >
                <img 
                  src="https://imgcache.qq.com/open_proj/proj_qcloud_v2/gateway/portal/pc/static/img/archive.33234472.png" 
                  alt="police-icon"
                  className="w-4 h-4 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                />
                <span>粵公網安備 44030502008888號</span>
              </a>
              
              <span className="hover:text-white transition-colors cursor-pointer">法律聲明</span>
              <span className="hover:text-white transition-colors cursor-pointer">隱私策略</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 border border-white/10 rounded text-white/30 text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
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
