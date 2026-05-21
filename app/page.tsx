'use client'

import React, {
  useState, useEffect, useRef, useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  motion, AnimatePresence, useInView,
  useScroll, useTransform, useMotionValue, useSpring,
  animate,
} from 'framer-motion'
import {
  Globe, ChevronRight, Monitor, Cpu, ShieldCheck,
  FileText, Lock, ArrowRight, Calendar, ArrowLeft,
  Activity, Database, Zap, Users,
} from 'lucide-react'

import Script from 'next/script'

import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

/* ================================================================
   多语言内容 (unchanged from previous version)
================================================================ */
const content = {
  zh_cn: {
    nav: [
      {
        id: 'intro', label: '关于',
        columns: [
          { title: '项目概览', links: ['智能守护者简介', '技术演进', '广交会专题'] },
          { title: '互动实验室', links: ['智能维修挑战赛'] },
          { title: '核心团队', links: ['研发架构', '合作伙伴', '加入我们'] },
        ],
      },
      {
        id: 'tech', label: '技术',
        columns: [
          { title: '智能引擎', links: ['Dify AI 训练', '故障预测模型', 'RAG 知识库'] },
          { title: 'IoT 接入', links: ['默纳克系统协议', '传感器融合', '数字化改造'] },
        ],
      },
      {
        id: 'news', label: '动态',
        columns: [{ title: '最新消息', links: ['版本更新', '行业新闻', '展会回顾'] }],
      },
    ],
    common: { start: '立即体验', langName: '简体中文', more: '了解更多', learnMore: '了解详情' },
    carousel: [
      { eyebrow: 'Smart Guard AI · v2.0', title: '连接安全\n智能守护每一次出行', sub: '整合 IoT 传感器与 Dify AI 引擎，提供实时电梯故障诊断与主动防御预警。', visual: 'iot' as const },
      { eyebrow: '多模态感知引擎', title: '预见故障\n在毫秒内做出决策', sub: '融合振动、温度与视觉数据，故障识别准确率达 98.7%，已在多个商业楼宇完成部署。', visual: 'ai' as const },
      { eyebrow: '广交会 2026 专题', title: '连接世界\n展示中国智造实力', sub: '现场演示实时故障诊断全流程，展台三日内接待访客逾千名，多家合作意向已签署。', visual: 'expo' as const },
    ],
    stats: [
      { icon: <Activity />, value: 98.7, suffix: '%', label: '故障识别准确率' },
      { icon: <Database />, value: 12000, suffix: '+', label: '知识库故障案例' },
      { icon: <Zap />, value: 200, suffix: 'ms', label: '平均响应时间', prefix: '<' },
      { icon: <Users />, value: 1000, suffix: '+', label: '广交会现场访客' },
    ],
    business: {
      label: '核心平台',
      tabs: [
        { id: 'iot', title: '连接设备与感知', sub: '构建城市垂直交通的神经网络', cards: [{ label: 'IoT 传感器接入' }, { label: '数字孪生平台' }, { label: '实时运行监控' }, { label: '边缘计算节点' }] },
        { id: 'ai', title: '连接 AI 与决策', sub: '让每一行日志都产生价值', cards: [{ label: 'Dify 智能引擎' }, { label: 'RAG 知识库' }, { label: '故障预测模型' }, { label: '智能诊断报告' }] },
        { id: 'safety', title: '连接人与安全', sub: '将风险消灭在萌芽状态', cards: [{ label: '行为识别系统' }, { label: '主动预警推送' }, { label: '维保工单流程' }, { label: '合规存档管理' }] },
      ],
    },
    esg: { eyebrow: '责任与信任', title: '连接责任\n与未来', sub: '以技术促进城市安全，构建可持续的智慧楼宇生态，让每座建筑都能被更安全地守护。' },
    entrances: [{ label: '解决方案' }, { label: '技术生态' }, { label: '办公据点' }],
    features: {
      title: '重新定义电梯安全',
      list: [
        { icon: <Cpu />, t: '秒级响应', d: '基于 Dify 核心，故障码查询与解决方案生成仅在瞬息之间。', accent: '#0052D9' },
        { icon: <Monitor />, t: '数字孪生', d: '实时同步电梯运行参数，在虚拟空间构建精准的设备状态。', accent: '#0066ff' },
        { icon: <ShieldCheck />, t: '主动防御', d: '智能识别不安全乘梯行为，将事故隐患消灭在萌芽状态。', accent: '#0080ff' },
      ],
    },
    news: {
      title: '最新动态', viewAll: '查看全部',
      featured: { date: '2026.05.15', tag: '技术发布', title: 'Smart Guard v2.0 正式发布：引入多模态故障感知引擎', desc: '全新版本整合视觉与振动传感器数据，故障识别准确率提升至 98.7%，已在广州、深圳多个商业楼宇完成先行部署。' },
      highlight: { date: '2026.05.08', tag: '行业合作', title: '与默纳克控制系统达成深度战略合作，共建电梯智能运维标准', desc: '双方将联合制定行业数据交换协议，推动城市垂直交通数字化转型。' },
      grid: [
        { date: '2026.04.28', tag: '展会', title: '广交会专题：现场演示吸引逾千名参观者', desc: '多家物业企业现场表达合作意向。', img: 'expo' },
        { date: '2026.04.16', tag: '研究', title: 'RAG 知识库更新：12,000+ 故障案例收录完成', desc: '支持中英双语混合检索，响应时间 < 200ms。', img: 'data' },
        { date: '2026.03.30', tag: '安全', title: '主动防御模块上线：AI 视觉识别准确率达 94%', desc: '基于轻量化 YOLOv9，可在边缘设备本地推理。', img: 'ai' },
      ],
    },
    footer: { copy: '© 2026 Smart Guard Project. 版权所有.', demo: '演示版本', links: ['隐私政策', '服务协议', '公安备案'] },
  },

  zh_tw: {
    nav: [
      { id: 'intro', label: '關於', columns: [{ title: '項目概覽', links: ['智能守護者簡介', '技術演進', '廣交會專題'] }, { title: '互動實驗室', links: ['智能維修挑戰賽'] }, { title: '核心團隊', links: ['研發架構', '合作夥伴', '加入我們'] }] },
      { id: 'tech', label: '技術', columns: [{ title: '智能引擎', links: ['Dify AI 訓練', '故障預測模型', 'RAG 知識庫'] }, { title: 'IoT 接入', links: ['默納克系統協議', '傳感器融合', '數位化改造'] }] },
      { id: 'news', label: '動態', columns: [{ title: '最新消息', links: ['版本更新', '行業新聞', '展會回顧'] }] },
    ],
    common: { start: '立即體驗', langName: '繁體中文', more: '瞭解更多', learnMore: '瞭解詳情' },
    carousel: [
      { eyebrow: 'Smart Guard AI · v2.0', title: '連接安全\n智能守護每一次出行', sub: '整合 IoT 傳感器與 Dify AI 引擎，提供實時電梯故障診斷與主動防禦預警。', visual: 'iot' as const },
      { eyebrow: '多模態感知引擎', title: '預見故障\n在毫秒內做出決策', sub: '融合振動、溫度與視覺數據，故障識別準確率達 98.7%。', visual: 'ai' as const },
      { eyebrow: '廣交會 2026 專題', title: '連接世界\n展示中國智造實力', sub: '現場演示實時故障診斷全流程，展台三日內接待訪客逾千名。', visual: 'expo' as const },
    ],
    stats: [
      { icon: <Activity />, value: 98.7, suffix: '%', label: '故障識別準確率' },
      { icon: <Database />, value: 12000, suffix: '+', label: '知識庫故障案例' },
      { icon: <Zap />, value: 200, suffix: 'ms', label: '平均響應時間', prefix: '<' },
      { icon: <Users />, value: 1000, suffix: '+', label: '廣交會現場訪客' },
    ],
    business: {
      label: '核心平台',
      tabs: [
        { id: 'iot', title: '連接設備與感知', sub: '構建城市垂直交通的神經網絡', cards: [{ label: 'IoT 傳感器接入' }, { label: '數字孿生平台' }, { label: '實時運行監控' }, { label: '邊緣計算節點' }] },
        { id: 'ai', title: '連接 AI 與決策', sub: '讓每一行日誌都產生價值', cards: [{ label: 'Dify 智能引擎' }, { label: 'RAG 知識庫' }, { label: '故障預測模型' }, { label: '智能診斷報告' }] },
        { id: 'safety', title: '連接人與安全', sub: '將風險消滅在萌芽狀態', cards: [{ label: '行為識別系統' }, { label: '主動預警推送' }, { label: '維保工單流程' }, { label: '合規存檔管理' }] },
      ],
    },
    esg: { eyebrow: '責任與信任', title: '連接責任\n與未來', sub: '以技術促進城市安全，構建可持續的智慧樓宇生態。' },
    entrances: [{ label: '解決方案' }, { label: '技術生態' }, { label: '辦公據點' }],
    features: {
      title: '重新定義電梯安全',
      list: [
        { icon: <Cpu />, t: '秒級響應', d: '基於 Dify 核心，故障碼查詢與解決方案生成僅在瞬息之間。', accent: '#0052D9' },
        { icon: <Monitor />, t: '數字孿生', d: '實時同步電梯運行參數，在虛擬空間構建精準的設備狀態。', accent: '#0066ff' },
        { icon: <ShieldCheck />, t: '主動防禦', d: '智能識別不安全乘梯行為，將事故隱患消滅在萌芽狀態。', accent: '#0080ff' },
      ],
    },
    news: {
      title: '最新動態', viewAll: '查看全部',
      featured: { date: '2026.05.15', tag: '技術發布', title: 'Smart Guard v2.0 正式發布：引入多模態故障感知引擎', desc: '全新版本整合視覺與振動傳感器數據，故障識別準確率提升至 98.7%。' },
      highlight: { date: '2026.05.08', tag: '行業合作', title: '與默納克控制系統達成深度戰略合作', desc: '雙方將聯合制定行業數據交換協議，推動城市垂直交通數字化轉型。' },
      grid: [
        { date: '2026.04.28', tag: '展會', title: '廣交會專題：現場演示吸引逾千名參觀者', desc: '多家物業企業現場表達合作意向。', img: 'expo' },
        { date: '2026.04.16', tag: '研究', title: 'RAG 知識庫更新：12,000+ 故障案例收錄完成', desc: '支持中英雙語混合檢索。', img: 'data' },
        { date: '2026.03.30', tag: '安全', title: '主動防禦模組上線：AI 識別準確率達 94%', desc: '基於輕量化 YOLOv9，可在邊緣設備本地推理。', img: 'ai' },
      ],
    },
    footer: { copy: '© 2026 Smart Guard Project. 版權所有.', demo: '演示版本', links: ['隱私政策', '服務協議', '公安備案'] },
  },

  en: {
    nav: [
      { id: 'intro', label: 'About', columns: [{ title: 'Project', links: ['Introduction', 'Evolution', 'Canton Fair'] }, { title: 'Lab', links: ['Maintenance Challenge'] }, { title: 'Team', links: ['Architecture', 'Partners', 'Join Us'] }] },
    ],
    common: { start: 'Get Started', langName: 'English', more: 'Learn More', learnMore: 'Learn More' },
    carousel: [
      { eyebrow: 'Smart Guard AI · v2.0', title: 'Secure Connection\nGuarding Every Journey', sub: 'Integrated IoT sensors and Dify AI for real-time elevator fault diagnosis and proactive safety alerts.', visual: 'iot' as const },
      { eyebrow: 'Multi-modal Detection', title: 'Predict Failures\nDecide in Milliseconds', sub: 'Fusing vibration, temperature, and visual data — 98.7% fault detection accuracy.', visual: 'ai' as const },
      { eyebrow: 'Canton Fair 2026', title: 'Connecting the World\nShowcasing Smart Manufacturing', sub: 'Live fault diagnosis demos drew 1,000+ visitors over three days with multiple partnerships signed.', visual: 'expo' as const },
    ],
    stats: [
      { icon: <Activity />, value: 98.7, suffix: '%', label: 'Fault Detection Accuracy' },
      { icon: <Database />, value: 12000, suffix: '+', label: 'Knowledge Base Cases' },
      { icon: <Zap />, value: 200, suffix: 'ms', label: 'Avg Response Time', prefix: '<' },
      { icon: <Users />, value: 1000, suffix: '+', label: 'Expo Visitors' },
    ],
    business: {
      label: 'Core Platform',
      tabs: [
        { id: 'iot', title: 'Connect Devices & Sensing', sub: 'Building the neural network of urban vertical transit', cards: [{ label: 'IoT Sensor Integration' }, { label: 'Digital Twin Platform' }, { label: 'Real-time Monitoring' }, { label: 'Edge Computing Nodes' }] },
        { id: 'ai', title: 'Connect AI & Decision', sub: 'Making every log line count', cards: [{ label: 'Dify AI Engine' }, { label: 'RAG Knowledge Base' }, { label: 'Fault Prediction Model' }, { label: 'Smart Diagnostic Reports' }] },
        { id: 'safety', title: 'Connect People & Safety', sub: 'Eliminating risk before it escalates', cards: [{ label: 'Behavior Detection' }, { label: 'Proactive Alert System' }, { label: 'Maintenance Workflow' }, { label: 'Compliance Archiving' }] },
      ],
    },
    esg: { eyebrow: 'Responsibility & Trust', title: 'Connecting\nResponsibility & Future', sub: 'Harnessing technology to advance urban safety and build a sustainable smart building ecosystem.' },
    entrances: [{ label: 'Solutions' }, { label: 'Ecosystem' }, { label: 'Locations' }],
    features: {
      title: 'Redefining Safety',
      list: [
        { icon: <Cpu />, t: 'Instant Response', d: 'Fault queries and solutions generated in milliseconds via Dify.', accent: '#0052D9' },
        { icon: <Monitor />, t: 'Digital Twin', d: 'Real-time synchronization of parameters for precise status mapping.', accent: '#0066ff' },
        { icon: <ShieldCheck />, t: 'Proactive Defense', d: 'AI-driven identification of unsafe behaviors to prevent risks.', accent: '#0080ff' },
      ],
    },
    news: {
      title: 'Latest Updates', viewAll: 'View All',
      featured: { date: '2026.05.15', tag: 'Release', title: 'Smart Guard v2.0 Launches with Multi-modal Fault Detection Engine', desc: 'New version integrates visual and vibration data, boosting fault detection to 98.7% across Guangzhou and Shenzhen deployments.' },
      highlight: { date: '2026.05.08', tag: 'Partnership', title: 'Strategic Partnership with Monarch Control Systems', desc: 'Joint data exchange protocol development to drive digital transformation of urban vertical transportation.' },
      grid: [
        { date: '2026.04.28', tag: 'Expo', title: 'Canton Fair: Live Demo Draws 1,000+ Visitors', desc: 'Multiple property management firms expressed partnership interest.', img: 'expo' },
        { date: '2026.04.16', tag: 'Research', title: 'RAG Knowledge Base: 12,000+ Fault Cases Added', desc: 'Bilingual retrieval support, response time under 200ms.', img: 'data' },
        { date: '2026.03.30', tag: 'Safety', title: 'Proactive Defense Module Live: 94% AI Vision Accuracy', desc: 'Lightweight YOLOv9 inference runs locally on edge devices.', img: 'ai' },
      ],
    },
    footer: { copy: '© 2026 Smart Guard Project. All Rights Reserved.', demo: 'Demo Version', links: ['Privacy', 'Terms', 'Security Filing'] },
  },
}

type LangType = 'zh_cn' | 'zh_tw' | 'en'

/* ================================================================
   动画辅助 Hook
================================================================ */

/** 数字滚动计数器 */
function useCountUp(target: number, duration = 1.8) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(target % 1 !== 0 ? +v.toFixed(1) : Math.round(v)),
    })
    return controls.stop
  }, [inView, target, duration])

  return { val, ref }
}

/** 3D 倾斜卡片 */
const TiltCard = ({
  children, className = '', intensity = 10,
}: { children: React.ReactNode; className?: string; intensity?: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 260, damping: 28 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 260, damping: 28 })
  const glowX = useTransform(x, [-0.5, 0.5], ['30%', '70%'])
  const glowY = useTransform(y, [-0.5, 0.5], ['30%', '70%'])

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 800 }}
      className={`relative ${className}`}
    >
      {/* 动态光晕 */}
      <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: useTransform([glowX, glowY], ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(0,82,217,0.12) 0%, transparent 65%)`) }}
      />
      {children}
    </motion.div>
  )
}

/* ================================================================
   SVG 占位图
================================================================ */
const CarouselBg = ({ visual }: { visual: 'iot' | 'ai' | 'expo' }) => {
  if (visual === 'iot') return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 1400 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="cg1" cx="65%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#162654" /><stop offset="100%" stopColor="#060a14" />
          </radialGradient>
        </defs>
        <rect width="1400" height="800" fill="url(#cg1)" />
        {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={i * 64} y="0" width="1.5" height="800" fill="white" opacity="0.025" />)}
        <rect x="680" y="60" width="240" height="680" rx="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <rect x="700" y="130" width="200" height="150" rx="3" fill="rgba(0,82,217,0.18)" stroke="rgba(0,82,217,0.45)" strokeWidth="1" />
        {[[360,190],[990,280],[310,470],[1060,510],[560,590]].map(([x,y],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#0052D9" opacity="0.9" />
            <circle cx={x} cy={y} r="18" fill="none" stroke="#0052D9" strokeWidth="1" opacity="0.3" />
            <circle cx={x} cy={y} r="36" fill="none" stroke="#0052D9" strokeWidth="0.5" opacity="0.15" />
          </g>
        ))}
        {[[360,190,700,200],[990,280,880,200],[310,470,700,360],[1060,510,880,360],[560,590,700,560]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,82,217,0.2)" strokeWidth="1" strokeDasharray="5 4" />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
    </div>
  )
  if (visual === 'ai') return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 1400 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="cg2" cx="55%" cy="55%" r="65%">
            <stop offset="0%" stopColor="#120c28" /><stop offset="100%" stopColor="#040610" />
          </radialGradient>
        </defs>
        <rect width="1400" height="800" fill="url(#cg2)" />
        {[[180,180],[180,400],[180,620],[460,130],[460,340],[460,560],[740,240],[740,460],[1020,350],[1220,350]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={i>7?10:6} fill={i>7?'#0052D9':'rgba(80,120,255,0.6)'} />
        ))}
        {[[180,180,460,130],[180,180,460,340],[180,400,460,130],[180,400,460,340],[180,400,460,560],[180,620,460,340],[180,620,460,560],[460,130,740,240],[460,340,740,240],[460,340,740,460],[460,560,740,460],[740,240,1020,350],[740,460,1020,350],[1020,350,1220,350]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,82,217,0.15)" strokeWidth="1" />
        ))}
        <circle cx="1020" cy="350" r="80" fill="none" stroke="rgba(0,82,217,0.18)" strokeWidth="2" />
        <circle cx="1020" cy="350" r="140" fill="none" stroke="rgba(0,82,217,0.08)" strokeWidth="1.5" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
    </div>
  )
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 1400 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c1520" /><stop offset="100%" stopColor="#081230" />
          </linearGradient>
        </defs>
        <rect width="1400" height="800" fill="url(#cg3)" />
        {[[980,700,65,280],[1055,700,52,240],[1125,700,72,310],[1220,700,58,195],[1295,700,48,270],[870,700,60,175],[790,700,75,235]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y-h} width={w} height={h} fill={`rgba(255,255,255,${0.04+i*0.007})`} rx="2" />
        ))}
        {Array.from({ length: 24 }).map((_, i) => (
          <circle key={i} cx={840+(i%6)*82+Math.sin(i)*18} cy={585-Math.floor(i/6)*38} r="1.5" fill="rgba(255,200,100,0.32)" />
        ))}
        <rect x="180" y="380" width="480" height="320" rx="8" fill="rgba(0,82,217,0.07)" stroke="rgba(0,82,217,0.2)" strokeWidth="1" />
        <text x="420" y="555" textAnchor="middle" fill="rgba(255,255,255,0.05)" fontSize="56" fontWeight="900" fontFamily="sans-serif">EXPO</text>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
    </div>
  )
}

const BusinessCardBg = ({ label, idx }: { label: string; idx: number }) => {
  const palettes = [['#0a2050','#163880'],['#0e1e3a','#0a3068'],['#18103a','#2a1a5c'],['#0a2020','#0e3434']]
  const [c1, c2] = palettes[idx % 4]
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-12" preserveAspectRatio="xMidYMid slice">
        <circle cx="320" cy="60" r="90" fill="none" stroke="white" strokeWidth="1" />
        <circle cx="320" cy="60" r="145" fill="none" stroke="white" strokeWidth="0.5" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="200" y1="0" x2="200" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-4">
        <span className="text-white/88 text-[13px] font-bold">{label}</span>
      </div>
    </div>
  )
}

const NewsPlaceholder = ({ type, className = '' }: { type: string; className?: string }) => {
  const cfgs: Record<string, { from: string; to: string; el: React.ReactNode }> = {
    expo: { from: '#1e2535', to: '#111827', el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-18"><rect x="40" y="60" width="80" height="120" rx="4" fill="white" /><rect x="160" y="40" width="80" height="140" rx="4" fill="white" /><rect x="280" y="70" width="80" height="110" rx="4" fill="white" /><line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="2" /></svg> },
    data: { from: '#0c1e4a', to: '#0e1830', el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-22"><polyline points="20,180 80,100 140,130 200,70 260,110 320,60 380,90" fill="none" stroke="white" strokeWidth="2" />{[80,140,200,260,320].map((x,i)=><circle key={i} cx={x} cy={[100,130,70,110,60][i]} r="5" fill="white"/>)}</svg> },
    ai: { from: '#1a0838', to: '#180840', el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-18"><circle cx="200" cy="120" r="70" fill="none" stroke="white" strokeWidth="1.5"/><circle cx="200" cy="120" r="45" fill="none" stroke="white" strokeWidth="1"/><circle cx="200" cy="120" r="20" fill="white" opacity="0.3"/></svg> },
  }
  const cfg = cfgs[type] || cfgs.expo
  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg,${cfg.from},${cfg.to})` }}>
      {cfg.el}
    </div>
  )
}

const EsgPlaceholder = () => (
  <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
    <svg viewBox="0 0 600 700" className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="xMidYMid slice">
      <rect x="140" y="190" width="130" height="480" rx="4" fill="#b8ccee" opacity="0.6" />
      <rect x="290" y="100" width="170" height="570" rx="4" fill="#c0d4f0" opacity="0.7" />
      <rect x="480" y="240" width="100" height="430" rx="4" fill="#aabce8" opacity="0.5" />
      {Array.from({length:8}).map((_,row)=>[160,308,495].map((x,col)=>(
        <rect key={`${row}-${col}`} x={x} y={230+row*52} width={col===1?32:22} height={22} rx="2" fill="rgba(0,82,217,0.12)" />
      )))}
      <rect x="0" y="665" width="600" height="35" fill="#a0b8dc" opacity="0.4"/>
      <circle cx="190" cy="665" r="32" fill="#5a9e3c" opacity="0.45"/>
      <circle cx="410" cy="660" r="44" fill="#3e8a28" opacity="0.38"/>
    </svg>
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent px-7 py-6">
      <p className="text-white text-[13px] font-bold">智慧楼宇 · Smart Buildings</p>
      <p className="text-white/55 text-[11px] mt-1">可持续城市垂直交通解决方案</p>
    </div>
  </div>
)

/* ================================================================
   Stagger Reveal — 子项逐一进入
================================================================ */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
}

const StaggerGrid = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-55px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}>
      {children}
    </motion.div>
  )
}

/* ================================================================
   数字统计 CountUp 组件
================================================================ */
const StatCard = ({ icon, value, suffix, prefix, label }: {
  icon: React.ReactNode; value: number; suffix: string; prefix?: string; label: string
}) => {
  const { val, ref } = useCountUp(value, 1.6)
  return (
    <motion.div ref={ref} variants={staggerItem}
      className="group flex flex-col items-center gap-3 px-6 py-8 rounded-2xl bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/15 transition-all duration-400 cursor-default"
    >
      <div className="w-10 h-10 rounded-xl bg-[#0052D9]/20 text-[#6baeff] flex items-center justify-center mb-1 group-hover:bg-[#0052D9]/35 transition-all">
        {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      </div>
      <div className="text-[36px] font-[900] text-white tracking-tight leading-none tabular-nums">
        {prefix && <span className="text-[#6baeff] mr-0.5">{prefix}</span>}
        {val.toLocaleString()}
        <span className="text-[#0052D9] ml-0.5">{suffix}</span>
      </div>
      <p className="text-white/35 text-[12px] font-bold tracking-wide text-center">{label}</p>
    </motion.div>
  )
}

/* ================================================================
   主组件
================================================================ */
const App: React.FC<IMainProps> = ({ params }: any) => {
  const router = useRouter()
  const [lang, setLang] = useState<LangType>('zh_cn')
  const [isChatting, setIsChatting] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [slideDir, setSlideDir] = useState(1)
  const [bizTab, setBizTab] = useState(0)
  const [slideProgress, setSlideProgress] = useState(0)
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  /* Parallax */
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroTextY = useTransform(heroScroll, [0, 1], [0, 80])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])

  const t = content[lang]

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { document.title = 'Smart Guard - 连接安全 · 预见未来智能' }, [])

  /* 轮播计时 + 进度条 */
  const startCarousel = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    if (slideTimer.current) clearInterval(slideTimer.current)
    setSlideProgress(0)
    const total = 5200
    const tick = 60
    let elapsed = 0
    progressTimer.current = setInterval(() => {
      elapsed += tick
      setSlideProgress(Math.min(elapsed / total, 1))
    }, tick)
    slideTimer.current = setTimeout(() => {
      setSlideDir(1)
      setSlide((s) => (s + 1) % t.carousel.length)
    }, total) as any
  }, [t.carousel.length])

  useEffect(() => {
    startCarousel()
    return () => {
      if (slideTimer.current) clearTimeout(slideTimer.current as any)
      if (progressTimer.current) clearInterval(progressTimer.current)
    }
  }, [slide, startCarousel])

  const gotoSlide = (idx: number) => {
    if (slideTimer.current) clearTimeout(slideTimer.current as any)
    if (progressTimer.current) clearInterval(progressTimer.current)
    setSlideDir(idx > slide ? 1 : -1)
    setSlide(idx)
  }

  const handleLinkClick = (linkName: string) => {
    if (['智能维修挑战赛', '智能維修挑戰賽', 'Maintenance Challenge'].includes(linkName)) {
      window.open('https://e4f6fc57-b90c-4aea-9156-248092f8900a.dev.coze.site/', '_blank')
    } else if (['智能守护者简介', '智能守護者簡介', 'Introduction'].includes(linkName)) {
      router.push('/about')
    }
  }

  if (isChatting) {
    return (
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 z-[300] bg-amber-50 border-b border-amber-200 text-amber-800 text-sm font-bold px-4 py-2 text-center">
          ⚠ 本页面内容由 AI 生成，仅供工业演示、教学交流与技术测试参考，不构成正式维保建议或商业交付。
        </div>
        <div className="pt-10"><Main params={params} /></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans antialiased">

      {/* ============================================================
          导航栏
      ============================================================ */}
      <nav
        className={`fixed w-full z-[100] transition-all duration-500 ${
          scrolled || activeMenu ? 'bg-white/96 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-transparent'
        }`}
        onMouseLeave={() => { setActiveMenu(null); setLangMenuOpen(false) }}
      >
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex justify-between items-center relative z-[101] py-5">
          <div className="flex items-center gap-14">
            <motion.div onClick={() => router.push('/')}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="text-[19px] font-[900] text-[#0052D9] tracking-tighter uppercase cursor-pointer flex items-center gap-3">
              Smart Guard
              <span className="w-[1px] h-4 bg-gray-200" />
              <span className="text-[11px] tracking-[0.3em] text-gray-400 font-black">AI</span>
            </motion.div>
            <div className="hidden lg:flex items-center gap-10">
              {t.nav.map((item) => (
                <div key={item.id} className="relative cursor-pointer py-2" onMouseEnter={() => setActiveMenu(item.id)}>
                  <span className={`text-[14px] font-bold transition-colors duration-300 ${
                    activeMenu === item.id ? 'text-[#0052D9]' : scrolled || activeMenu ? 'text-gray-600 hover:text-[#0052D9]' : 'text-white/85 hover:text-white'
                  }`}>{item.label}</span>
                  {activeMenu === item.id && <motion.div layoutId="nav-line" className="absolute -bottom-[22px] left-0 right-0 h-[3px] bg-[#0052D9]" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black tracking-widest uppercase">
              Demo / AI Generated
            </div>
            <div className="relative">
              <button onMouseEnter={() => setLangMenuOpen(true)}
                className={`flex items-center gap-2 text-[13px] font-bold transition-colors ${scrolled || activeMenu ? 'text-gray-500 hover:text-[#0052D9]' : 'text-white/65 hover:text-white'}`}>
                <Globe size={15} />{t.common.langName}
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 mt-4 w-32 bg-white shadow-2xl rounded-xl border border-gray-100 py-2 overflow-hidden">
                    {(['zh_cn', 'zh_tw', 'en'] as LangType[]).map((l) => (
                      <div key={l} onClick={() => { setLang(l); setLangMenuOpen(false); setBizTab(0) }}
                        className={`px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-blue-50 transition-colors ${lang === l ? 'text-[#0052D9]' : 'text-gray-600'}`}>
                        {content[l].common.langName}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 闪光CTA按钮 */}
            <motion.button onClick={() => setIsChatting(true)}
              whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(0,82,217,0.4)' }}
              whileTap={{ scale: 0.96 }}
              className="relative bg-[#0052D9] text-white px-6 py-2.5 rounded-full text-[12px] font-black overflow-hidden"
            >
              <span className="relative z-10">{t.common.start}</span>
              {/* shimmer */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{ translateX: ['−100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.5 }}
              />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {activeMenu && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-50 overflow-hidden shadow-2xl">
              <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-10 grid grid-cols-4 gap-12">
                {t.nav.find((n) => n.id === activeMenu)?.columns.map((col, idx) => (
                  <div key={idx} className="space-y-5">
                    <h4 className="text-[11px] font-black text-gray-400 tracking-widest uppercase">{col.title}</h4>
                    <ul className="space-y-3">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx} onClick={() => handleLinkClick(link)}
                          className="text-[15px] font-bold text-gray-700 hover:text-[#0052D9] transition-colors flex items-center group cursor-pointer">
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

      {/* ============================================================
          Hero 轮播  (视差 + 进度条)
      ============================================================ */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden bg-[#060a12]">
        <AnimatePresence initial={false} custom={slideDir}>
          <motion.div key={slide} custom={slideDir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '7%' : '-7%', opacity: 0, scale: 1.04 }),
              center: { x: 0, opacity: 1, scale: 1 },
              exit: (d: number) => ({ x: d > 0 ? '-7%' : '7%', opacity: 0, scale: 0.97 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <CarouselBg visual={t.carousel[slide].visual} />
          </motion.div>
        </AnimatePresence>

        {/* 视差文字 */}
        <motion.div style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-20" style2={{ maxWidth: 700 }}>
          <AnimatePresence mode="wait">
            <motion.div key={`txt-${slide}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[640px]"
            >
              <motion.p
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                className="text-[#6baeff] text-[11px] font-black tracking-[0.28em] uppercase mb-6 flex items-center gap-3"
              >
                <span className="w-8 h-[1px] bg-[#0052D9]" />
                {t.carousel[slide].eyebrow}
              </motion.p>
              <h1 className="text-white text-[50px] lg:text-[64px] font-[300] leading-[1.16] tracking-[-0.01em] mb-6 whitespace-pre-line">
                {t.carousel[slide].title}
              </h1>
              <p className="text-white/42 text-[15px] leading-relaxed mb-10 max-w-[420px]">
                {t.carousel[slide].sub}
              </p>
              <motion.button onClick={() => setIsChatting(true)}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 text-white text-[14px] font-medium group w-fit"
              >
                <span className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/12 group-hover:border-white/60 transition-all">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                {t.common.start}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* 底部控制 + 进度条 */}
        <div className="absolute bottom-8 left-12 lg:left-20 right-12 lg:right-20 z-20 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <motion.button onClick={() => gotoSlide((slide - 1 + t.carousel.length) % t.carousel.length)}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/55 transition-all">
              <ArrowLeft size={14} />
            </motion.button>
            <motion.button onClick={() => gotoSlide((slide + 1) % t.carousel.length)}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/55 transition-all">
              <ArrowRight size={14} />
            </motion.button>
          </div>

          {/* 进度圆点组 */}
          <div className="flex items-center gap-3">
            {t.carousel.map((_, i) => (
              <button key={i} onClick={() => gotoSlide(i)} className="relative flex items-center justify-center">
                {i === slide ? (
                  <div className="relative w-8 h-2 rounded-full bg-white/15 overflow-hidden">
                    <motion.div className="absolute inset-y-0 left-0 bg-[#0052D9] rounded-full"
                      style={{ width: `${slideProgress * 100}%` }} />
                  </div>
                ) : (
                  <div className={`rounded-full transition-all duration-300 w-2 h-2 ${i < slide ? 'bg-[#0052D9]/60' : 'bg-white/25 hover:bg-white/50'}`} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </section>

      {/* ============================================================
          功能三卡 (3D 倾斜 + 光晕边框)
      ============================================================ */}
      <section className="py-28 px-12 max-w-[1400px] mx-auto">
        <Reveal className="flex flex-col items-start mb-16">
          <h2 className="text-[34px] lg:text-[42px] font-[300] tracking-[-0.02em] text-[#1d1d1f] mb-5">
            {t.features.title}
          </h2>
          <div className="w-10 h-[3px] bg-[#0052D9] rounded-full" />
        </Reveal>

        <StaggerGrid className="grid md:grid-cols-3 gap-5">
          {t.features.list.map((f, i) => (
            <motion.div key={i} variants={staggerItem}>
              <TiltCard intensity={8} className="group h-full">
                <div className="relative h-full p-10 bg-[#F7F9FE] rounded-3xl border border-transparent
                  hover:border-[#0052D9]/15 hover:bg-white hover:shadow-[0_8px_40px_rgba(0,82,217,0.1)]
                  transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  {/* 顶部光晕条 */}
                  <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#0052D9]/0 to-transparent group-hover:via-[#0052D9]/60 transition-all duration-700" />

                  {/* 角落装饰 */}
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full blur-2xl bg-[#0052D9]/0 group-hover:bg-[#0052D9]/8 transition-all duration-500" />

                  <motion.div
                    whileHover={{ y: -3, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-12 h-12 bg-white text-[#0052D9] rounded-xl flex items-center justify-center mb-7
                      shadow-sm group-hover:bg-[#0052D9] group-hover:text-white group-hover:shadow-[0_4px_20px_rgba(0,82,217,0.35)]
                      transition-all duration-400"
                    style={{ transformStyle: 'preserve-3d', translateZ: 20 }}
                  >
                    {React.cloneElement(f.icon as React.ReactElement, { size: 20 })}
                  </motion.div>

                  <h3 className="text-[20px] font-bold mb-3 tracking-tight text-gray-900">{f.t}</h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed">{f.d}</p>

                  {/* 底部箭头 */}
                  <div className="mt-6 flex items-center gap-1.5 text-[#0052D9] text-[12px] font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {t.common.more} <ArrowRight size={11} />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </StaggerGrid>
      </section>

      {/* ============================================================
          数字统计条
      ============================================================ */}
      <section className="w-full bg-[#1b1f2e] py-14 px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.stats.map((s, i) => (
              <StatCard key={i} icon={s.icon} value={s.value} suffix={s.suffix} prefix={s.prefix} label={s.label} />
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          业务板块  (Tab + 2×2 卡片网格)
      ============================================================ */}
      <section className="w-full bg-[#1e2230] overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[400px_1fr]">

          {/* 左：Tab */}
          <div className="flex flex-col justify-center px-12 lg:px-14 py-20 lg:py-24">
            <Reveal>
              <p className="text-white/18 text-[10px] font-black tracking-[0.32em] uppercase mb-9">{t.business.label}</p>
            </Reveal>
            <div className="space-y-1.5">
              {t.business.tabs.map((tab, i) => (
                <Reveal key={tab.id} delay={i * 0.06}>
                  <motion.button onClick={() => setBizTab(i)}
                    whileHover={{ x: bizTab === i ? 0 : 4 }}
                    className={`w-full text-left px-5 py-5 rounded-xl transition-all duration-300 group flex flex-col ${
                      bizTab === i
                        ? 'bg-white/[0.06] border-l-[3px] border-[#0052D9]'
                        : 'border-l-[3px] border-transparent hover:bg-white/[0.03]'
                    }`}>
                    <span className={`text-[16px] font-bold leading-tight transition-colors ${bizTab === i ? 'text-white' : 'text-white/38 group-hover:text-white/65'}`}>
                      {tab.title}
                    </span>
                    <AnimatePresence>
                      {bizTab === i && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28 }}>
                          <span className="text-[12px] text-white/38 block mt-1.5">{tab.sub}</span>
                          <span className="flex items-center gap-2 text-[11px] text-[#6baeff] mt-3 font-bold">
                            {t.common.learnMore} <ArrowRight size={11} />
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 右：2×2 图片网格 */}
          <AnimatePresence mode="wait">
            <motion.div key={`biz-${bizTab}`}
              initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 min-h-[480px]"
            >
              {t.business.tabs[bizTab].cards.map((card, i) => (
                <motion.div key={i}
                  className="relative overflow-hidden group cursor-pointer border border-white/[0.04]"
                  whileHover={{ scale: 1.01, zIndex: 2 }}
                  transition={{ duration: 0.3 }}
                >
                  <BusinessCardBg label={card.label} idx={i} />
                  {/* hover 覆盖层 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0052D9]/0 to-[#0052D9]/0 group-hover:from-[#0052D9]/10 group-hover:to-[#003aaa]/15 transition-all duration-400" />
                  {/* 扫光 */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%', y: '-100%' }}
                    whileHover={{ x: '100%', y: '100%' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================================
          三联快速入口 + ESG 左图右文
      ============================================================ */}
      <section className="w-full">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-14">
          <StaggerGrid className="grid grid-cols-3 gap-4">
            {t.entrances.map((item, i) => {
              const colors = ['#0052D9', '#1e3060', '#2a2050']
              return (
                <motion.div key={i} variants={staggerItem}>
                  <TiltCard intensity={6}>
                    <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="relative h-[150px] rounded-2xl overflow-hidden cursor-pointer group"
                      style={{ background: colors[i] }}
                    >
                      <svg viewBox="0 0 400 150" className="absolute inset-0 w-full h-full opacity-[0.08]" preserveAspectRatio="xMidYMid slice">
                        <line x1="0" y1="75" x2="400" y2="75" stroke="white" strokeWidth="70" opacity="0.3" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-[17px] font-bold tracking-tight group-hover:scale-105 transition-transform duration-300">
                          {item.label}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full border border-white/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={11} className="text-white" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    </motion.div>
                  </TiltCard>
                </motion.div>
              )
            })}
          </StaggerGrid>
        </div>

        {/* 左图右文 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pb-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <motion.div
                whileHover={{ scale: 1.01 }} transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.12)]" style={{ height: 480 }}
              >
                <EsgPlaceholder />
                {/* 角落徽章 */}
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg">
                  <p className="text-[10px] font-black text-[#0052D9] tracking-widest uppercase">Smart Building</p>
                  <p className="text-[13px] font-bold text-gray-900 mt-0.5">2026 · ESG</p>
                </div>
              </motion.div>
            </Reveal>

            <Reveal delay={0.15} className="flex flex-col justify-center">
              <p className="text-[#0052D9] text-[10px] font-black tracking-[0.32em] uppercase mb-5 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-[#0052D9]" />
                {t.esg.eyebrow}
              </p>
              <h2 className="text-[38px] lg:text-[48px] font-[300] leading-[1.18] tracking-[-0.02em] text-[#1d1d1f] mb-6 whitespace-pre-line">
                {t.esg.title}
              </h2>
              <p className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-[400px]">{t.esg.sub}</p>
              <motion.button whileHover={{ x: 5 }} className="flex items-center gap-3 text-[#0052D9] text-[13px] font-bold group w-fit">
                <span className="w-9 h-9 rounded-full border border-[#0052D9]/30 flex items-center justify-center group-hover:bg-[#0052D9]/8 group-hover:border-[#0052D9]/60 transition-all">
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                {t.common.learnMore}
              </motion.button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          最新动态 (带 hover 图片缩放 + 卡片上浮)
      ============================================================ */}
      <section className="w-full">
        {/* 深色横幅 */}
        <div className="bg-[#1b1e23]" style={{
          backgroundImage: `repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(255,255,255,0.02) 80px,rgba(255,255,255,0.02) 81px),repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(255,255,255,0.02) 80px,rgba(255,255,255,0.02) 81px)`,
        }}>
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 flex items-center justify-between">
            <Reveal>
              <h2 className="text-[25px] lg:text-[28px] font-bold text-white tracking-tight">{t.news.title}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <motion.button whileHover={{ x: 3 }} className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-white transition-colors group">
                {t.news.viewAll} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Reveal>
          </div>
        </div>

        {/* Featured 双栏 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_390px] border-b border-gray-100">

            {/* 大卡 */}
            <Reveal className="group cursor-pointer border-r border-gray-100">
              <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.4 }}>
                <div className="overflow-hidden h-[260px] lg:h-[320px]">
                  <motion.div className="w-full h-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    <NewsPlaceholder type="data" className="w-full h-full" />
                  </motion.div>
                </div>
                <div className="p-8 lg:p-9">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/28 rounded px-2.5 py-1 bg-[#EDF2FD]">
                      <Calendar size={8} /> {t.news.featured.date}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{t.news.featured.tag}</span>
                  </div>
                  <h3 className="text-[20px] lg:text-[22px] font-bold leading-tight text-gray-900 mb-3 group-hover:text-[#0052D9] transition-colors duration-300">
                    {t.news.featured.title}
                  </h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed max-w-2xl">{t.news.featured.desc}</p>
                  <motion.div whileHover={{ x: 3 }} className="mt-5 flex items-center gap-2 text-[#0052D9] text-[11px] font-bold">
                    {t.common.more} <ArrowRight size={11} />
                  </motion.div>
                </div>
              </motion.div>
            </Reveal>

            {/* 高亮卡 */}
            <Reveal delay={0.1} className="group cursor-pointer">
              <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.4 }} className="h-full flex flex-col">
                <div className="overflow-hidden h-[190px]">
                  <motion.div className="w-full h-full" whileHover={{ scale: 1.06 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    <NewsPlaceholder type="expo" className="w-full h-full" />
                  </motion.div>
                </div>
                <div className="flex-1 p-7 bg-[#EDF2FD] group-hover:bg-[#e5ecfb] transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/28 rounded px-2 py-0.5 bg-white/55">
                      <Calendar size={8} /> {t.news.highlight.date}
                    </span>
                    <span className="text-[10px] font-black text-[#0052D9]/45 tracking-widest uppercase">{t.news.highlight.tag}</span>
                  </div>
                  <h3 className="text-[16px] font-bold leading-snug text-[#0d2d6e] mb-2 group-hover:text-[#0052D9] transition-colors">
                    {t.news.highlight.title}
                  </h3>
                  <p className="text-[#0052D9]/50 text-[12px] leading-relaxed">{t.news.highlight.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>

        {/* 三列小卡 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pb-20">
          <StaggerGrid className="grid md:grid-cols-3 border-b border-gray-100">
            {t.news.grid.map((item, i) => (
              <motion.div key={i} variants={staggerItem}
                className={`group cursor-pointer ${i < 2 ? 'border-r border-gray-100' : ''}`}>
                <motion.div whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,82,217,0.08)' }} transition={{ duration: 0.35 }}>
                  <div className="overflow-hidden h-[175px]">
                    <motion.div className="w-full h-full" whileHover={{ scale: 1.07 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                      <NewsPlaceholder type={item.img} className="w-full h-full" />
                    </motion.div>
                  </div>
                  <div className="p-6 pb-7">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/18 rounded px-1.5 py-0.5 bg-[#EDF2FD]">
                        <Calendar size={7} /> {item.date}
                      </span>
                      <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">{item.tag}</span>
                    </div>
                    <h4 className="text-[14px] font-bold leading-snug text-gray-900 mb-1.5 group-hover:text-[#0052D9] transition-colors line-clamp-2">{item.title}</h4>
                    <p className="text-gray-400 text-[12px] leading-relaxed line-clamp-2">{item.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-[#0052D9] text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-all">
                      {t.common.more} <ArrowRight size={10} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          Dify 内嵌聊天机器人
      ============================================================ */}
      <Script id="dify-config" strategy="beforeInteractive">
        {`
          window.difyChatbotConfig = {
            token: 'uYxYNUj5uBiqYwhE',
            baseUrl: 'http://159.75.185.246',
            inputs: {},
            systemVariables: {},
            userVariables: {},
          }
        `}
      </Script>
      <Script
        src="http://159.75.185.246/embed.min.js"
        id="uYxYNUj5uBiqYwhE"
        strategy="afterInteractive"
        defer
      />
      <style>{`
        #dify-chatbot-bubble-button {
          background-color: #0052D9 !important;
        }
        #dify-chatbot-bubble-window {
          width: 24rem !important;
          height: 40rem !important;
        }
      `}</style>

      {/* ============================================================
          页脚
      ============================================================ */}
      <footer className="bg-[#1b1e23] text-white pt-18 pb-12 px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-14 border-b border-white/5 pb-12 mb-10">
            <div className="lg:col-span-4 space-y-5">
              <div className="text-[19px] font-black tracking-tighter italic text-[#0052D9]">SMART GUARD AI</div>
              <p className="text-gray-500 max-w-xs text-[13px] leading-relaxed">
                连接安全，预见未来。致力于打造更智能、更透明的城市垂直交通监控体系。
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div className="space-y-4">
                <h4 className="text-white/18 font-black tracking-[0.2em] text-[10px] uppercase">合规文档</h4>
                <ul className="space-y-3 text-gray-400 text-[13px]">
                  <li className="hover:text-white cursor-pointer flex items-center gap-2 transition-colors"><Lock size={12} />{t.footer.links[0]}</li>
                  <li className="hover:text-white cursor-pointer flex items-center gap-2 transition-colors"><FileText size={12} />{t.footer.links[1]}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-gray-600 leading-relaxed max-w-3xl">
            本系统为 AI 与 IoT 技术演示版本，当前用于工业场景研究、教学展示及展会交流。页面中的部分文本、诊断建议由人工智能模型生成，仅供参考。系统不直接参与电梯控制，不构成正式商业交付或维保依据。
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-5 mt-9">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-gray-600">
              <span>{t.footer.copy}</span>
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">粤ICP备2026055050号</a>
              <a href="https://beian.mps.gov.cn/#/query/webSearch?code=44010602009999" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png" alt="公安备案" className="w-3.5 h-3.5 object-contain opacity-55" />
                粤公网安备 44010502004025号
              </a>
            </div>
            <div className="px-3 py-1 border border-white/5 rounded text-white/18 text-[9px] font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
              {t.footer.demo}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
