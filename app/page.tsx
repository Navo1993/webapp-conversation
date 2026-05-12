'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  ChevronRight,
  Monitor,
  Cpu,
  ShieldCheck,
  FileText,
  Lock,
} from 'lucide-react'

import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

/* ---------------- 多语言内容 ---------------- */

const content = {
  zh_cn: {
    nav: [
      {
        id: 'intro',
        label: '关于',
        columns: [
          {
            title: '项目概览',
            links: ['智能守护者简介', '技术演进', '广交会专题'],
          },
          {
            title: '互动实验室',
            links: ['智能维修挑战赛'],
          },
          {
            title: '核心团队',
            links: ['研发架构', '合作伙伴', '加入我们'],
          },
        ],
      },
      {
        id: 'tech',
        label: '技术',
        columns: [
          {
            title: '智能引擎',
            links: ['Dify AI 训练', '故障预测模型', 'RAG 知识库'],
          },
          {
            title: 'IoT 接入',
            links: ['默纳克系统协议', '传感器融合', '数字化改造'],
          },
        ],
      },
      {
        id: 'news',
        label: '动态',
        columns: [
          {
            title: '最新消息',
            links: ['版本更新', '行业新闻', '展会回顾'],
          },
        ],
      },
    ],

    common: {
      start: '立即体验',
      langName: '简体中文',
      more: '了解更多',
    },

    hero: {
      title1: '连接安全',
      title2: '预见未来智能',
      sub: '专为工业演示开发。整合 IoT 与 AI 技术，提供实时电梯故障诊断与专业维护建议。',
    },

    features: {
      title: '重新定义电梯安全',
      list: [
        {
          icon: <Cpu />,
          t: '秒级响应',
          d: '基于 Dify 核心，故障码查询与解决方案生成仅在瞬息之间。',
        },
        {
          icon: <Monitor />,
          t: '数字孪生',
          d: '实时同步电梯运行参数，在虚拟空间构建精准的设备状态。',
        },
        {
          icon: <ShieldCheck />,
          t: '主动防御',
          d: '智能识别不安全乘梯行为，将事故隐患消灭在萌芽状态。',
        },
      ],
    },

    footer: {
      copy: '© 2026 Smart Guard Project. 版权所有.',
      demo: '演示版本',
      links: ['隐私政策', '服务协议', '公安备案'],
    },
  },

  zh_tw: {
    nav: [
      {
        id: 'intro',
        label: '關於',
        columns: [
          {
            title: '項目概覽',
            links: ['智能守護者簡介', '技術演進', '廣交會專題'],
          },
          {
            title: '互動實驗室',
            links: ['智能維修挑戰賽'],
          },
          {
            title: '核心團隊',
            links: ['研發架構', '合作夥伴', '加入我們'],
          },
        ],
      },
      {
        id: 'tech',
        label: '技術',
        columns: [
          {
            title: '智能引擎',
            links: ['Dify AI 訓練', '故障預測模型', 'RAG 知識庫'],
          },
          {
            title: 'IoT 接入',
            links: ['默納克系統協議', '傳感器融合', '數位化改造'],
          },
        ],
      },
      {
        id: 'news',
        label: '動態',
        columns: [
          {
            title: '最新消息',
            links: ['版本更新', '行業新聞', '展會回顧'],
          },
        ],
      },
    ],

    common: {
      start: '立即體驗',
      langName: '繁體中文',
      more: '瞭解更多',
    },

    hero: {
      title1: '連接安全',
      title2: '預見未來智能',
      sub: '專為工業演示開發。整合 IoT 與 AI 技術，提供實時電梯故障診斷與專業維護建議。',
    },

    features: {
      title: '重新定義電梯安全',
      list: [
        {
          icon: <Cpu />,
          t: '秒級響應',
          d: '基於 Dify 核心，故障碼查詢與解決方案生成僅在瞬息之間。',
        },
        {
          icon: <Monitor />,
          t: '數字孿生',
          d: '實時同步電梯運行參數，在虛擬空間構建精準的設備狀態。',
        },
        {
          icon: <ShieldCheck />,
          t: '主動防禦',
          d: '智能識別不安全乘梯行為，將事故隱患消滅在萌芽狀態。',
        },
      ],
    },

    footer: {
      copy: '© 2026 Smart Guard Project. 版權所有.',
      demo: '演示版本',
      links: ['隱私政策', '服務協議', '公安備案'],
    },
  },

  en: {
    nav: [
      {
        id: 'intro',
        label: 'About',
        columns: [
          {
            title: 'Project',
            links: ['Introduction', 'Evolution', 'Canton Fair'],
          },
          {
            title: 'Lab',
            links: ['Maintenance Challenge'],
          },
          {
            title: 'Team',
            links: ['Architecture', 'Partners', 'Join Us'],
          },
        ],
      },
    ],

    common: {
      start: 'Get Started',
      langName: 'English',
      more: 'Learn More',
    },

    hero: {
      title1: 'Secure Connection',
      title2: 'Future Intelligence',
      sub: 'Developed for industrial demos. Integrated IoT & AI for real-time elevator diagnosis.',
    },

    features: {
      title: 'Redefining Safety',
      list: [
        {
          icon: <Cpu />,
          t: 'Instant Response',
          d: 'Fault queries and solutions generated in milliseconds via Dify.',
        },
        {
          icon: <Monitor />,
          t: 'Digital Twin',
          d: 'Real-time synchronization of parameters for precise status mapping.',
        },
        {
          icon: <ShieldCheck />,
          t: 'Proactive Defense',
          d: 'AI-driven identification of unsafe behaviors to prevent risks.',
        },
      ],
    },

    footer: {
      copy: '© 2026 Smart Guard Project. All Rights Reserved.',
      demo: 'Demo Version',
      links: ['Privacy', 'Terms', 'Security Filing'],
    },
  },
}

type LangType = 'zh_cn' | 'zh_tw' | 'en'

/* ---------------- 主组件 ---------------- */

const App: React.FC<IMainProps> = ({ params }: any) => {
  const router = useRouter()

  const [lang, setLang] = useState<LangType>('zh_cn')
  const [isChatting, setIsChatting] = useState(false)

  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  /* ---------- 合规登录 ---------- */


  const t = content[lang]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (linkName: string) => {
    if (
      ['智能维修挑战赛', '智能維修挑戰賽', 'Maintenance Challenge'].includes(
        linkName,
      )
    ) {
      window.open(
        'https://e4f6fc57-b90c-4aea-9156-248092f8900a.dev.coze.site/',
        '_blank',
      )
    } else if (
      ['智能守护者简介', '智能守護者簡介', 'Introduction'].includes(linkName)
    ) {
      router.push('/about')
    }
  }

  /* ---------------- AI内容标识 ---------------- */

  if (isChatting) {
    return (
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 z-[300] bg-amber-50 border-b border-amber-200 text-amber-800 text-sm font-bold px-4 py-2 text-center">
          ⚠ 本页面内容由 AI 生成，仅供工业演示、教学交流与技术测试参考，
          不构成正式维保建议或商业交付。
        </div>

        <div className="pt-10">
          <Main params={params} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased">

      {/* ---------------- 导航栏 ---------------- */}

      <nav
        className={`fixed w-full z-[100] transition-all duration-500 ${
          scrolled || activeMenu
            ? 'bg-white/95 backdrop-blur-2xl shadow-sm'
            : 'bg-transparent'
        }`}
        onMouseLeave={() => {
          setActiveMenu(null)
          setLangMenuOpen(false)
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex justify-between items-center relative z-[101] py-6">

          <div className="flex items-center gap-16">

            <div
              onClick={() => router.push('/')}
              className="text-[20px] font-[900] text-[#0052D9] tracking-tighter uppercase cursor-pointer flex items-center gap-3"
            >
              Smart Guard

              <span className="w-[1px] h-4 bg-gray-200"></span>

              <span className="text-[11px] tracking-[0.3em] text-gray-400 font-black">
                AI
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-10">
              {t.nav.map((item) => (
                <div
                  key={item.id}
                  className="relative cursor-pointer py-2"
                  onMouseEnter={() => setActiveMenu(item.id)}
                >
                  <span
                    className={`text-[15px] font-bold transition-colors duration-300 ${
                      activeMenu === item.id
                        ? 'text-[#0052D9]'
                        : 'text-gray-600 hover:text-[#0052D9]'
                    }`}
                  >
                    {item.label}
                  </span>

                  {activeMenu === item.id && (
                    <motion.div
                      layoutId="nav-line"
                      className="absolute -bottom-[26px] left-0 right-0 h-[3px] bg-[#0052D9]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右侧按钮 */}

          <div className="flex items-center gap-6">

            {/* DEMO标识 */}

            <div className="hidden md:flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black tracking-widest uppercase">
              Demo / AI Generated
            </div>

            {/* 语言 */}

            <div className="relative">
              <button
                onMouseEnter={() => setLangMenuOpen(true)}
                className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-[#0052D9]"
              >
                <Globe size={16} />
                {t.common.langName}
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-32 bg-white shadow-xl rounded-xl border border-gray-100 py-2"
                  >
                    {(['zh_cn', 'zh_tw', 'en'] as LangType[]).map((l) => (
                      <div
                        key={l}
                        onClick={() => {
                          setLang(l)
                          setLangMenuOpen(false)
                        }}
                        className={`px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-blue-50 ${
                          lang === l
                            ? 'text-[#0052D9]'
                            : 'text-gray-600'
                        }`}
                      >
                        {content[l].common.langName}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 开始按钮 */}

            <button
onClick={() => setIsChatting(true)}
              className="bg-[#0052D9] text-white px-7 py-2.5 rounded-full text-[12px] font-black hover:bg-[#0042b3] transition-all"
            >
              {t.common.start}
            </button>
          </div>
        </div>

        {/* 下拉菜单 */}

        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-50 overflow-hidden shadow-2xl"
            >
              <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-12 grid grid-cols-4 gap-12">

                {t.nav
                  .find((n) => n.id === activeMenu)
                  ?.columns.map((col, idx) => (
                    <div key={idx} className="space-y-6">

                      <h4 className="text-[12px] font-black text-gray-400 tracking-widest uppercase">
                        {col.title}
                      </h4>

                      <ul className="space-y-4">
                        {col.links.map((link, lIdx) => (
                          <li
                            key={lIdx}
                            onClick={() => handleLinkClick(link)}
                            className="text-[16px] font-bold text-gray-700 hover:text-[#0052D9] transition-colors flex items-center group cursor-pointer"
                          >
                            {link}

                            <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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

      {/* ---------------- Hero ---------------- */}

      <section className="relative h-screen flex items-center justify-center bg-[#F8FAFF] overflow-hidden pt-20">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-blue-600/[0.015] select-none pointer-events-none uppercase">
          Guard
        </div>

        <div className="relative z-10 text-center max-w-6xl px-12">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >

            <h1 className="text-[64px] lg:text-[92px] font-[900] leading-[1.1] tracking-[-0.03em] text-[#1d1d1f] mb-8">
              {t.hero.title1}
              <span className="text-[#0052D9]">.</span>

              <br />

              <span className="text-[#0052D9] italic font-serif opacity-90">
                {t.hero.title2}
              </span>
            </h1>

            <p className="text-[20px] text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              {t.hero.sub}
            </p>

            <button
onClick={() => setIsChatting(true)}
              className="bg-[#0052D9] text-white px-10 py-4 rounded-xl text-base font-black hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
            >
              {t.common.start}

              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ---------------- 功能区 ---------------- */}

      <section className="py-40 px-12 max-w-[1400px] mx-auto">

        <div className="flex flex-col items-start mb-24">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">
            {t.features.title}
          </h2>

          <div className="w-16 h-1.5 bg-[#0052D9] rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {t.features.list.map((f, i) => (
            <div
              key={i}
              className="group p-12 bg-[#FBFBFC] rounded-[40px] hover:bg-white hover:shadow-xl transition-all duration-500"
            >

              <div className="w-14 h-14 bg-white text-[#0052D9] rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#0052D9] group-hover:text-white transition-all">
                {React.cloneElement(f.icon as React.ReactElement, {
                  size: 24,
                })}
              </div>

              <h3 className="text-2xl font-black mb-4 tracking-tight text-gray-900">
                {f.t}
              </h3>

              <p className="text-gray-400 text-base leading-relaxed font-bold">
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 页脚 ---------------- */}

      <footer className="bg-[#1b1e23] text-white pt-24 pb-12 px-8 lg:px-12">

        <div className="max-w-[1400px] mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-white/5 pb-16 mb-12">

            <div className="lg:col-span-4 space-y-6">

              <div className="text-[22px] font-black tracking-tighter italic text-[#0052D9]">
                SMART GUARD AI
              </div>

              <p className="text-gray-500 max-w-xs text-sm leading-relaxed font-medium">
                连接安全，预见未来。我们致力于打造更智能、更透明的城市垂直交通监控体系。
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">

              <div className="space-y-5">
                <h4 className="text-white/20 font-black tracking-[0.2em] text-[10px] uppercase">
                  合规文档
                </h4>

                <ul className="space-y-3 text-gray-400 font-bold text-sm">
                  <li className="hover:text-white cursor-pointer flex items-center gap-2">
                    <Lock size={14} />
                    {t.footer.links[0]}
                  </li>

                  <li className="hover:text-white cursor-pointer flex items-center gap-2">
                    <FileText size={14} />
                    {t.footer.links[1]}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 合规声明 */}

          <div className="mt-8 text-xs text-gray-500 leading-relaxed max-w-4xl">

            本系统为 AI 与 IoT 技术演示版本，
            当前用于工业场景研究、教学展示及展会交流。

            <br /><br />

            页面中的部分文本、诊断建议与内容由人工智能模型生成，
            仅供参考。

            <br /><br />

            系统不直接参与电梯控制，
            不替代专业维保人员决策，
            不构成正式商业交付或维保依据。
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mt-12">

            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-[12px] text-gray-500 font-bold">

              <span>{t.footer.copy}</span>

              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                粤ICP备2026055050号
              </a>
            </div>

            <div className="flex items-center gap-6">

              <div className="px-3 py-1 border border-white/5 rounded text-white/20 text-[9px] font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                {t.footer.demo}
              </div>
            </div>
          </div>
        </div>
      </footer>
          </div>  // <- 关闭最外层 div
  );       // <- 关闭 return
};         // <- 关闭 App 函数组件

export default React.memo(App);
