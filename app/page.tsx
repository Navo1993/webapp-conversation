'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Globe,
  ChevronRight,
  Monitor,
  Cpu,
  ShieldCheck,
  FileText,
  Lock,
  ArrowRight,
  Calendar,
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

    news: {
      title: '最新动态',
      viewAll: '查看全部',
      featured: {
        date: '2026.05.15',
        tag: '技术发布',
        title: 'Smart Guard v2.0 正式发布：引入多模态故障感知引擎',
        desc: '全新版本整合视觉与振动传感器数据，实现毫秒级异常预警，故障识别准确率提升至 98.7%，已在广州、深圳多个商业楼宇完成先行部署。',
        color: 'blue' as const,
      },
      highlight: {
        date: '2026.05.08',
        tag: '行业合作',
        title: '与默纳克控制系统达成深度战略合作，共建电梯智能运维标准',
        desc: '双方将联合制定行业数据交换协议，推动城市垂直交通数字化转型。',
        color: 'cyan' as const,
      },
      grid: [
        {
          date: '2026.04.28',
          tag: '展会',
          title: '广交会专题展示：Smart Guard 现场演示吸引逾千名参观者',
          desc: '展台现场实时模拟电梯故障诊断全流程，多家物业企业表达合作意向。',
          img: 'expo',
        },
        {
          date: '2026.04.16',
          tag: '研究',
          title: 'RAG 知识库更新：收录 12,000+ 条电梯故障案例与解决方案',
          desc: '覆盖国内主流品牌控制器故障码，支持中英文混合检索，响应时间 < 200ms。',
          img: 'data',
        },
        {
          date: '2026.03.30',
          tag: '安全',
          title: '主动防御模块上线：AI 视觉识别不安全乘梯行为准确率达 94%',
          desc: '基于轻量化 YOLOv9 模型，可在边缘设备本地推理，无需上传用户影像。',
          img: 'ai',
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

    news: {
      title: '最新動態',
      viewAll: '查看全部',
      featured: {
        date: '2026.05.15',
        tag: '技術發布',
        title: 'Smart Guard v2.0 正式發布：引入多模態故障感知引擎',
        desc: '全新版本整合視覺與振動傳感器數據，實現毫秒級異常預警，故障識別準確率提升至 98.7%。',
        color: 'blue' as const,
      },
      highlight: {
        date: '2026.05.08',
        tag: '行業合作',
        title: '與默納克控制系統達成深度戰略合作，共建電梯智能運維標準',
        desc: '雙方將聯合制定行業數據交換協議，推動城市垂直交通數字化轉型。',
        color: 'cyan' as const,
      },
      grid: [
        {
          date: '2026.04.28',
          tag: '展會',
          title: '廣交會專題展示：Smart Guard 現場演示吸引逾千名參觀者',
          desc: '展台現場實時模擬電梯故障診斷全流程，多家物業企業表達合作意向。',
          img: 'expo',
        },
        {
          date: '2026.04.16',
          tag: '研究',
          title: 'RAG 知識庫更新：收錄 12,000+ 條電梯故障案例與解決方案',
          desc: '覆蓋國內主流品牌控制器故障碼，支持中英文混合檢索。',
          img: 'data',
        },
        {
          date: '2026.03.30',
          tag: '安全',
          title: '主動防禦模組上線：AI 視覺識別不安全乘梯行為準確率達 94%',
          desc: '基於輕量化 YOLOv9 模型，可在邊緣設備本地推理。',
          img: 'ai',
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

    news: {
      title: 'Latest Updates',
      viewAll: 'View All',
      featured: {
        date: '2026.05.15',
        tag: 'Release',
        title: 'Smart Guard v2.0 Launches with Multi-modal Fault Detection Engine',
        desc: 'The new version integrates visual and vibration sensor data for millisecond anomaly alerts, boosting fault detection accuracy to 98.7% across commercial deployments in Guangzhou and Shenzhen.',
        color: 'blue' as const,
      },
      highlight: {
        date: '2026.05.08',
        tag: 'Partnership',
        title: 'Strategic partnership with Monarch Control Systems to co-build smart elevator maintenance standards',
        desc: 'The two parties will jointly develop industry data exchange protocols to drive digital transformation of urban vertical transportation.',
        color: 'cyan' as const,
      },
      grid: [
        {
          date: '2026.04.28',
          tag: 'Expo',
          title: 'Canton Fair Demo: Smart Guard Live Showcase Draws 1,000+ Visitors',
          desc: 'Real-time fault diagnosis simulation at the booth drew strong interest from property management firms.',
          img: 'expo',
        },
        {
          date: '2026.04.16',
          tag: 'Research',
          title: 'RAG Knowledge Base Update: 12,000+ Elevator Fault Cases Added',
          desc: 'Covers controller fault codes for all major domestic brands, with bilingual retrieval under 200ms.',
          img: 'data',
        },
        {
          date: '2026.03.30',
          tag: 'Safety',
          title: 'Proactive Defense Module Live: AI Vision Reaches 94% Detection Accuracy',
          desc: 'Powered by lightweight YOLOv9, infers locally on edge devices without uploading user footage.',
          img: 'ai',
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

/* -------- 新闻图片占位符 -------- */
const NewsPlaceholder = ({
  type,
  className = '',
}: {
  type: string
  className?: string
}) => {
  const configs: Record<string, { bg: string; pattern: React.ReactNode }> = {
    expo: {
      bg: 'from-slate-700 via-slate-800 to-slate-900',
      pattern: (
        <svg viewBox="0 0 400 240" className="w-full h-full opacity-20">
          <rect x="40" y="60" width="80" height="120" rx="4" fill="white" />
          <rect x="160" y="40" width="80" height="140" rx="4" fill="white" />
          <rect x="280" y="70" width="80" height="110" rx="4" fill="white" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="2" />
          <circle cx="200" cy="20" r="8" fill="white" />
          <path d="M 60 30 Q 200 0 340 30" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      ),
    },
    data: {
      bg: 'from-blue-900 via-blue-800 to-indigo-900',
      pattern: (
        <svg viewBox="0 0 400 240" className="w-full h-full opacity-25">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <circle cx={60 + i * 60} cy={120} r={30 + i * 8} fill="none" stroke="white" strokeWidth="0.8" />
            </g>
          ))}
          <line x1="0" y1="80" x2="400" y2="80" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="160" x2="400" y2="160" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
          <polyline points="20,180 80,100 140,130 200,70 260,110 320,60 380,90" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      ),
    },
    ai: {
      bg: 'from-violet-900 via-purple-800 to-fuchsia-900',
      pattern: (
        <svg viewBox="0 0 400 240" className="w-full h-full opacity-20">
          <circle cx="200" cy="120" r="70" fill="none" stroke="white" strokeWidth="1.5" />
          <circle cx="200" cy="120" r="45" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="200" cy="120" r="20" fill="white" opacity="0.3" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180
            return (
              <line
                key={angle}
                x1={200 + 70 * Math.cos(rad)}
                y1={120 + 70 * Math.sin(rad)}
                x2={200 + 100 * Math.cos(rad)}
                y2={120 + 100 * Math.sin(rad)}
                stroke="white"
                strokeWidth="1.5"
              />
            )
          })}
        </svg>
      ),
    },
  }

  const cfg = configs[type] || configs.expo

  return (
    <div className={`bg-gradient-to-br ${cfg.bg} flex items-center justify-center overflow-hidden ${className}`}>
      {cfg.pattern}
    </div>
  )
}

/* -------- Featured 大图占位符 -------- */
const FeaturedPlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-slate-800 flex items-center justify-center overflow-hidden">
    <svg viewBox="0 0 800 480" className="w-full h-full opacity-15">
      {/* 电梯井道示意 */}
      <rect x="300" y="40" width="200" height="400" rx="6" fill="none" stroke="white" strokeWidth="2" />
      <rect x="320" y="80" width="160" height="120" rx="4" fill="white" opacity="0.3" />
      <rect x="320" y="220" width="160" height="40" rx="3" fill="white" opacity="0.15" />
      <line x1="340" y1="40" x2="340" y2="80" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1="460" y1="40" x2="460" y2="80" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" />
      {/* IoT 信号环 */}
      {[60, 100, 140].map((r, i) => (
        <circle key={i} cx="600" cy="120" r={r} fill="none" stroke="white" strokeWidth="0.8" opacity={0.5 - i * 0.1} />
      ))}
      <circle cx="600" cy="120" r="12" fill="white" opacity="0.6" />
      {/* 连线 */}
      <line x1="500" y1="140" x2="540" y2="120" stroke="white" strokeWidth="1" strokeDasharray="4 3" />
      {/* 数据流动 */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={80 + i * 50} y={380 + (i % 2) * 20} width="30" height="8" rx="2" fill="white" opacity={0.2 + i * 0.05} />
      ))}
    </svg>
  </div>
)

/* -------- Scroll-reveal wrapper -------- */
const Reveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- 主组件 ---------------- */

const App: React.FC<IMainProps> = ({ params }: any) => {
  const router = useRouter()

  const [lang, setLang] = useState<LangType>('zh_cn')
  const [isChatting, setIsChatting] = useState(false)

  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const t = content[lang]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.title = 'Smart Guard - 连接安全 · 预见未来智能'
  }, [])

  const handleLinkClick = (linkName: string) => {
    if (
      ['智能维修挑战赛', '智能維修挑戰賽', 'Maintenance Challenge'].includes(linkName)
    ) {
      window.open('https://e4f6fc57-b90c-4aea-9156-248092f8900a.dev.coze.site/', '_blank')
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
              <span className="text-[11px] tracking-[0.3em] text-gray-400 font-black">AI</span>
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
                      activeMenu === item.id ? 'text-[#0052D9]' : 'text-gray-600 hover:text-[#0052D9]'
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

          <div className="flex items-center gap-6">
            <div className="hidden md:flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black tracking-widest uppercase">
              Demo / AI Generated
            </div>

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
                        onClick={() => { setLang(l); setLangMenuOpen(false) }}
                        className={`px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-blue-50 ${
                          lang === l ? 'text-[#0052D9]' : 'text-gray-600'
                        }`}
                      >
                        {content[l].common.langName}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsChatting(true)}
              className="bg-[#0052D9] text-white px-7 py-2.5 rounded-full text-[12px] font-black hover:bg-[#0042b3] transition-all"
            >
              {t.common.start}
            </button>
          </div>
        </div>

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
                {React.cloneElement(f.icon as React.ReactElement, { size: 24 })}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight text-gray-900">{f.t}</h3>
              <p className="text-gray-400 text-base leading-relaxed font-bold">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================ 最新动态 News Section ================ */}
      <section className="w-full">

        {/* ---- 深色标题横幅 ---- */}
        <div className="relative bg-[#1b1e23] overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 80px,
                  rgba(255,255,255,0.15) 80px,
                  rgba(255,255,255,0.15) 81px
                ), repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 80px,
                  rgba(255,255,255,0.15) 80px,
                  rgba(255,255,255,0.15) 81px
                )`
              }}
            />
          </div>
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-10 flex items-center justify-between relative z-10">
            <Reveal>
              <h2 className="text-[28px] lg:text-[32px] font-black text-white tracking-tight">
                {t.news.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <button className="flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-white transition-colors group">
                {t.news.viewAll}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Reveal>
          </div>
        </div>

        {/* ---- 精选两栏 ---- */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-0">
          <div className="grid lg:grid-cols-[1fr_420px] gap-0 border-b border-gray-100">

            {/* 左侧：大图 Featured */}
            <Reveal className="group cursor-pointer border-r border-gray-100">
              <div className="overflow-hidden h-[300px] lg:h-[360px]">
                <FeaturedPlaceholder />
              </div>
              <div className="p-8 lg:p-10 pb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/30 rounded px-2.5 py-1">
                    <Calendar size={10} />
                    {t.news.featured.date}
                  </span>
                  <span className="text-[11px] font-black text-gray-400 tracking-widest uppercase">
                    {t.news.featured.tag}
                  </span>
                </div>
                <h3 className="text-[22px] lg:text-[26px] font-black leading-tight tracking-tight text-gray-900 mb-4 group-hover:text-[#0052D9] transition-colors">
                  {t.news.featured.title}
                </h3>
                <p className="text-gray-400 text-[15px] leading-relaxed font-medium max-w-2xl">
                  {t.news.featured.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#0052D9] text-[13px] font-black group-hover:gap-3 transition-all">
                  {t.common.more}
                  <ArrowRight size={14} />
                </div>
              </div>
            </Reveal>

            {/* 右侧：高亮卡 Highlight */}
            <Reveal delay={0.15} className="group cursor-pointer">
              <div className="overflow-hidden h-[220px]">
                <NewsPlaceholder type="expo" className="w-full h-full" />
              </div>
              <div className="p-8 bg-[#E8F0FE] h-[calc(100%-220px)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/40 rounded px-2.5 py-1 bg-white/60">
                    <Calendar size={10} />
                    {t.news.highlight.date}
                  </span>
                  <span className="text-[11px] font-black text-[#0052D9]/60 tracking-widest uppercase">
                    {t.news.highlight.tag}
                  </span>
                </div>
                <h3 className="text-[18px] lg:text-[20px] font-black leading-tight tracking-tight text-[#0d2d6e] mb-3 group-hover:text-[#0052D9] transition-colors">
                  {t.news.highlight.title}
                </h3>
                <p className="text-[#0052D9]/60 text-[14px] leading-relaxed font-medium">
                  {t.news.highlight.desc}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ---- 三栏小卡片 ---- */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pb-20">
          <div className="grid md:grid-cols-3 gap-0 border-b border-gray-100">
            {t.news.grid.map((item, i) => (
              <Reveal
                key={i}
                delay={i * 0.1}
                className={`group cursor-pointer ${i < 2 ? 'border-r border-gray-100' : ''}`}
              >
                <div className="overflow-hidden h-[200px]">
                  <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NewsPlaceholder type={item.img} className="w-full h-full" />
                  </motion.div>
                </div>
                <div className="p-7 pb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/25 rounded px-2 py-0.5">
                      <Calendar size={9} />
                      {item.date}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="text-[16px] font-black leading-snug tracking-tight text-gray-900 mb-2 group-hover:text-[#0052D9] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-[13px] leading-relaxed font-medium line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[#0052D9] text-[12px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.common.more}
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {/* ================ /最新动态 ================ */}

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
                <h4 className="text-white/20 font-black tracking-[0.2em] text-[10px] uppercase">合规文档</h4>
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
            本系统为 AI 与 IoT 技术演示版本，当前用于工业场景研究、教学展示及展会交流。
            <br /><br />
            页面中的部分文本、诊断建议与内容由人工智能模型生成，仅供参考。
            <br /><br />
            系统不直接参与电梯控制，不替代专业维保人员决策，不构成正式商业交付或维保依据。
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mt-12">
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-[12px] text-gray-500 font-bold">
              <span>{t.footer.copy}</span>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  粤ICP备2026055050号
                </a>
                <a
                  href="https://beian.mps.gov.cn/#/query/webSearch?code=44010602009999"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <img
                    src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png"
                    alt="公安备案"
                    className="w-4 h-4 object-contain opacity-80"
                  />
                  <span>粤公网安备 44010502004025号</span>
                </a>
              </div>
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
    </div>
  )
}

export default React.memo(App)
