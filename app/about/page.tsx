'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, 
  Cpu, 
  Monitor, 
  ShieldCheck, 
  Plus, 
  ArrowRight,
  UserCheck,
  Zap,
  Globe,
  Award
} from 'lucide-react'

export default function AboutPage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  // 监听滚动，保持导航栏样式一致
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  }

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased">
      
      {/* --- 极简导航栏 (与主页呼应) --- */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? 'bg-white/90 backdrop-blur-2xl shadow-sm py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex justify-between items-center">
          <div 
            onClick={() => router.push('/')}
            className="text-[20px] font-[900] text-[#0052D9] tracking-tighter uppercase cursor-pointer flex items-center gap-2"
          >
            Smart Guard <span className="text-gray-300 font-light">|</span> <span className="text-[11px] tracking-[0.2em] text-gray-400">ABOUT</span>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="text-sm font-bold text-gray-600 hover:text-[#0052D9] transition-colors flex items-center gap-1"
          >
            返回首页 <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* --- Hero 视觉区 --- */}
      <section className="relative pt-40 pb-24 px-12 bg-[#F8FAFF] overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-[#0052D9] text-[12px] font-black tracking-[0.4em] uppercase mb-6 block">
              Great Country Craftsman
            </span>
            <h1 className="text-[56px] lg:text-[84px] font-[900] leading-[1.1] tracking-[-0.04em] mb-8">
              连接未来<span className="text-[#0052D9]">.</span><br />
              <span className="text-[#0052D9] italic font-serif opacity-90">预见智能时代</span>
            </h1>
            <p className="text-[22px] text-gray-400 font-medium max-w-3xl leading-relaxed">
              电梯工程技术专业 —— 致力于培养数字化、智能化浪潮下的“大国工匠”。我们不仅关注机械，更重塑安全。
            </p>
          </motion.div>
        </div>
        {/* 背景装饰大字 */}
        <div className="absolute -bottom-10 -right-20 text-[20rem] font-black text-blue-600/[0.02] select-none pointer-events-none">
          CRAFT
        </div>
      </section>

      {/* --- 专业核心优势 (Grid 布局) --- */}
      <section className="py-32 px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col items-start mb-20">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">专业概况</h2>
          <div className="w-16 h-1.5 bg-[#0052D9] rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Zap />, 
              title: "王牌专业", 
              desc: "学校核心建设专业，专注于物联网 (IoT) 与人工智能 (AI) 的深度融合教学模式。" 
            },
            { 
              icon: <Monitor />, 
              title: "实操基地", 
              desc: "配备主题文化车厢及默纳克 (Monarch) NICE 3000 New 全仿真控制系统实训室。" 
            },
            { 
              icon: <Award />, 
              title: "产教融合", 
              desc: "对接广交会演示标准，联合一线企业技术专家，实现从课堂到岗位的无缝衔接。" 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.1 }}
              className="group p-10 bg-[#FBFBFC] rounded-[40px] hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.03)] transition-all duration-500 border border-transparent hover:border-gray-100"
            >
              <div className="w-12 h-12 bg-white text-[#0052D9] rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#0052D9] group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed font-bold opacity-90">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 榜样力量 (Alumni Section) --- */}
      <section className="py-32 bg-[#1d1d1f] text-white">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="flex justify-between items-end mb-20">
            <div>
              <span className="text-[#0052D9] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">Role Models</span>
              <h2 className="text-[48px] font-black tracking-tight leading-none">榜样力量</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                name: "曹新平",
                tag: "行业技术骨干",
                desc: "凭借精湛的维保技艺与不断钻研的精神，从学徒成长为企业核心骨干。他的事迹践行了“一技在手，一生无忧”的职教真谛。"
              },
              {
                name: "王佳豪",
                tag: "数字化先锋",
                desc: "深耕电梯控制电路分析，现已成为企业技术先锋。他代表了新一代电梯人勇于探索 AI 诊断与数字化升级的工匠精神。"
              }
            ].map((person, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                className="relative p-12 bg-white/5 rounded-[48px] border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#0052D9] flex items-center justify-center">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black">{person.name}</h4>
                    <span className="text-sm text-[#0052D9] font-bold tracking-wider uppercase">{person.tag}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                  {person.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 底部呼吁 --- */}
      <section className="py-40 text-center px-12">
        <motion.div {...fadeInUp}>
          <h2 className="text-[42px] lg:text-[64px] font-black tracking-tight mb-10">
            准备好开启<br /><span className="text-[#0052D9]">智能守护之旅</span>了吗？
          </h2>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#0052D9] text-white px-12 py-5 rounded-2xl text-lg font-black hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-3 mx-auto"
          >
            立即体验系统 <ChevronRight />
          </button>
        </motion.div>
      </section>

      {/* --- 页脚 (与主页完全一致) --- */}
      <footer className="bg-[#1b1e23] text-white pt-24 pb-12 px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-[12px] text-gray-500 font-bold">
              <span className="text-gray-600">© 2026 Smart Guard Project. All Rights Reserved.</span>
              <span className="px-3 py-1 border border-white/5 rounded text-white/20 text-[9px] font-black tracking-widest uppercase">
                广交会演示专用版本
              </span>
            </div>
            <div className="text-[18px] font-black tracking-tighter italic text-[#0052D9] opacity-50">
              SMART GUARD AI
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
