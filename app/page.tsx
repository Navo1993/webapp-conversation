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
  Activity, Database, Zap, Users, Sparkles, ArrowUpRight,
  Layers, Wifi, Radio, BarChart3, Gauge, BrainCircuit,
} from 'lucide-react'

import Script from 'next/script'

import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

/* ================================================================
   多语言内容
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
        { id: 'iot', title: '连接设备与感知', sub: '构建城市垂直交通的神经网络', cards: [{ label: 'IoT 传感器接入', icon: <Radio /> }, { label: '数字孪生平台', icon: <Layers /> }, { label: '实时运行监控', icon: <BarChart3 /> }, { label: '边缘计算节点', icon: <Gauge /> }] },
        { id: 'ai', title: '连接 AI 与决策', sub: '让每一行日志都产生价值', cards: [{ label: 'Dify 智能引擎', icon: <BrainCircuit /> }, { label: 'RAG 知识库', icon: <Database /> }, { label: '故障预测模型', icon: <Activity /> }, { label: '智能诊断报告', icon: <FileText /> }] },
        { id: 'safety', title: '连接人与安全', sub: '将风险消灭在萌芽状态', cards: [{ label: '行为识别系统', icon: <Monitor /> }, { label: '主动预警推送', icon: <Zap /> }, { label: '维保工单流程', icon: <FileText /> }, { label: '合规存档管理', icon: <Lock /> }] },
      ],
    },
    esg: { eyebrow: '责任与信任', title: '连接责任\n与未来', sub: '以技术促进城市安全，构建可持续的智慧楼宇生态，让每座建筑都能被更安全地守护。' },
    entrances: [{ label: '解决方案', icon: <Sparkles /> }, { label: '技术生态', icon: <Cpu /> }, { label: '办公据点', icon: <Globe /> }],
    features: {
      title: '重新定义电梯安全',
      list: [
        { icon: <Cpu />, t: '秒级响应', d: '基于 Dify 核心，故障码查询与解决方案生成仅在瞬息之间。', accent: '#0052D9' },
        { icon: <Monitor />, t: '数字孪生', d: '实时同步电梯运行参数，在虚拟空间构建精准的设备状态。', accent: '#2563EB' },
        { icon: <ShieldCheck />, t: '主动防御', d: '智能识别不安全乘梯行为，将事故隐患消灭在萌芽状态。', accent: '#3B82F6' },
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
        { id: 'iot', title: '連接設備與感知', sub: '構建城市垂直交通的神經網絡', cards: [{ label: 'IoT 傳感器接入', icon: <Radio /> }, { label: '數字孿生平台', icon: <Layers /> }, { label: '實時運行監控', icon: <BarChart3 /> }, { label: '邊緣計算節點', icon: <Gauge /> }] },
        { id: 'ai', title: '連接 AI 與決策', sub: '讓每一行日誌都產生價值', cards: [{ label: 'Dify 智能引擎', icon: <BrainCircuit /> }, { label: 'RAG 知識庫', icon: <Database /> }, { label: '故障預測模型', icon: <Activity /> }, { label: '智能診斷報告', icon: <FileText /> }] },
        { id: 'safety', title: '連接人與安全', sub: '將風險消滅在萌芽狀態', cards: [{ label: '行為識別系統', icon: <Monitor /> }, { label: '主動預警推送', icon: <Zap /> }, { label: '維保工單流程', icon: <FileText /> }, { label: '合規存檔管理', icon: <Lock /> }] },
      ],
    },
    esg: { eyebrow: '責任與信任', title: '連接責任\n與未來', sub: '以技術促進城市安全，構建可持續的智慧樓宇生態。' },
    entrances: [{ label: '解決方案', icon: <Sparkles /> }, { label: '技術生態', icon: <Cpu /> }, { label: '辦公據點', icon: <Globe /> }],
    features: {
      title: '重新定義電梯安全',
      list: [
        { icon: <Cpu />, t: '秒級響應', d: '基於 Dify 核心，故障碼查詢與解決方案生成僅在瞬息之間。', accent: '#0052D9' },
        { icon: <Monitor />, t: '數字孿生', d: '實時同步電梯運行參數，在虛擬空間構建精準的設備狀態。', accent: '#2563EB' },
        { icon: <ShieldCheck />, t: '主動防禦', d: '智能識別不安全乘梯行為，將事故隱患消滅在萌芽狀態。', accent: '#3B82F6' },
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
      { id: 'tech', label: 'Tech', columns: [{ title: 'AI Engine', links: ['Dify AI Training', 'Fault Prediction', 'RAG Knowledge Base'] }, { title: 'IoT Integration', links: ['Monarch Protocol', 'Sensor Fusion', 'Digital Upgrade'] }] },
      { id: 'news', label: 'News', columns: [{ title: 'Latest', links: ['Releases', 'Industry News', 'Expo Recap'] }] },
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
        { id: 'iot', title: 'Connect Devices & Sensing', sub: 'Building the neural network of urban vertical transit', cards: [{ label: 'IoT Sensor Integration', icon: <Radio /> }, { label: 'Digital Twin Platform', icon: <Layers /> }, { label: 'Real-time Monitoring', icon: <BarChart3 /> }, { label: 'Edge Computing Nodes', icon: <Gauge /> }] },
        { id: 'ai', title: 'Connect AI & Decision', sub: 'Making every log line count', cards: [{ label: 'Dify AI Engine', icon: <BrainCircuit /> }, { label: 'RAG Knowledge Base', icon: <Database /> }, { label: 'Fault Prediction Model', icon: <Activity /> }, { label: 'Smart Diagnostic Reports', icon: <FileText /> }] },
        { id: 'safety', title: 'Connect People & Safety', sub: 'Eliminating risk before it escalates', cards: [{ label: 'Behavior Detection', icon: <Monitor /> }, { label: 'Proactive Alert System', icon: <Zap /> }, { label: 'Maintenance Workflow', icon: <FileText /> }, { label: 'Compliance Archiving', icon: <Lock /> }] },
      ],
    },
    esg: { eyebrow: 'Responsibility & Trust', title: 'Connecting\nResponsibility & Future', sub: 'Harnessing technology to advance urban safety and build a sustainable smart building ecosystem.' },
    entrances: [{ label: 'Solutions', icon: <Sparkles /> }, { label: 'Ecosystem', icon: <Cpu /> }, { label: 'Locations', icon: <Globe /> }],
    features: {
      title: 'Redefining Safety',
      list: [
        { icon: <Cpu />, t: 'Instant Response', d: 'Fault queries and solutions generated in milliseconds via Dify.', accent: '#0052D9' },
        { icon: <Monitor />, t: 'Digital Twin', d: 'Real-time synchronization of parameters for precise status mapping.', accent: '#2563EB' },
        { icon: <ShieldCheck />, t: 'Proactive Defense', d: 'AI-driven identification of unsafe behaviors to prevent risks.', accent: '#3B82F6' },
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

/** 数字滚动计数器 — 腾讯风格缓动 */
function useCountUp(target: number, duration = 2.0) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setVal(target % 1 !== 0 ? +v.toFixed(1) : Math.round(v)),
    })
    return controls.stop
  }, [inView, target, duration])

  return { val, ref }
}

/** 3D 倾斜卡片 — 腾讯风格柔和倾斜 */
const TiltCard = ({
  children, className = '', intensity = 8,
}: { children: React.ReactNode; className?: string; intensity?: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 24 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 24 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ================================================================
   SVG 背景视觉 — 腾讯科技感深色背景
================================================================ */
const CarouselBg = ({ visual }: { visual: 'iot' | 'ai' | 'expo' }) => {
  if (visual === 'iot') return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 腾讯蓝深色渐变 */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #060b1a 0%, #0a1430 30%, #0d1a3e 60%, #0f2048 100%)' }} />
      {/* 网格 */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      {/* 发光圆 */}
      <div className="absolute top-[20%] right-[15%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ background: 'radial-gradient(circle, #0052D9, transparent)' }} />
      <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-10" style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />
      {/* IoT 节点连线 */}
      <svg viewBox="0 0 1400 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        {[[320,160],[960,240],[280,440],[1020,490],[540,580],[760,200],[680,420],[900,350]].map(([x,y],i) => (
          <g key={i}>
            <motion.circle cx={x} cy={y} r="4" fill="#0052D9" opacity="0.9"
              animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }} />
            <circle cx={x} cy={y} r="16" fill="none" stroke="#0052D9" strokeWidth="0.8" opacity="0.25" />
            <circle cx={x} cy={y} r="32" fill="none" stroke="#0052D9" strokeWidth="0.4" opacity="0.1" />
          </g>
        ))}
        {[[320,160,680,420],[320,160,760,200],[960,240,680,420],[960,240,900,350],[280,440,680,420],[1020,490,900,350],[540,580,680,420]].map(([x1,y1,x2,y2],i) => (
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,82,217,0.12)" strokeWidth="0.8" strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -16] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
    </div>
  )
  if (visual === 'ai') return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a0820 0%, #0e1035 30%, #111845 60%, #0f1838 100%)' }} />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-[30%] right-[20%] w-[450px] h-[450px] rounded-full blur-[140px] opacity-15" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
      <div className="absolute bottom-[20%] left-[25%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-12" style={{ background: 'radial-gradient(circle, #0052D9, transparent)' }} />
      {/* 神经网络 */}
      <svg viewBox="0 0 1400 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        {[[160,180],[160,400],[160,620],[440,140],[440,360],[440,580],[720,250],[720,470],[1000,340],[1220,340]].map(([x,y],i) => (
          <motion.circle key={i} cx={x} cy={y} r={i>7?7:5} fill={i>7?'#0052D9':'rgba(99,102,241,0.5)'}
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
        {[[160,180,440,140],[160,180,440,360],[160,400,440,140],[160,400,440,360],[160,400,440,580],[160,620,440,360],[160,620,440,580],[440,140,720,250],[440,360,720,250],[440,360,720,470],[440,580,720,470],[720,250,1000,340],[720,470,1000,340],[1000,340,1220,340]].map(([x1,y1,x2,y2],i) => (
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,82,217,0.1)" strokeWidth="0.8"
            animate={{ opacity: [0.06, 0.15, 0.06] }} transition={{ duration: 3 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
        <circle cx="1000" cy="340" r="70" fill="none" stroke="rgba(0,82,217,0.15)" strokeWidth="1.5" />
        <circle cx="1000" cy="340" r="120" fill="none" stroke="rgba(0,82,217,0.06)" strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
    </div>
  )
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #060b18 0%, #0c1a30 40%, #081535 100%)' }} />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(-45deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full blur-[130px] opacity-12" style={{ background: 'radial-gradient(circle, #F59E0B, transparent)' }} />
      <div className="absolute bottom-[15%] left-[20%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-15" style={{ background: 'radial-gradient(circle, #0052D9, transparent)' }} />
      <svg viewBox="0 0 1400 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* 城市天际线 */}
        {[[980,700,55,260],[1050,700,48,220],[1110,700,65,290],[1200,700,52,180],[1280,700,44,250],[860,700,58,170],[780,700,70,210]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y-h} width={w} height={h} fill={`rgba(255,255,255,${0.03+i*0.006})`} rx="2" />
        ))}
        {/* 灯光 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.circle key={i} cx={830+(i%5)*78+Math.sin(i)*16} cy={580-Math.floor(i/5)*35} r="1.2" fill="rgba(255,200,100,0.25)"
            animate={{ opacity: [0.1, 0.35, 0.1] }} transition={{ duration: 2 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }} />
        ))}
        <rect x="160" y="370" width="500" height="340" rx="10" fill="rgba(0,82,217,0.04)" stroke="rgba(0,82,217,0.15)" strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
    </div>
  )
}

const BusinessCardBg = ({ label, icon, idx }: { label: string; icon: React.ReactNode; idx: number }) => {
  const palettes = [
    ['#0c1d40', '#14306e'],
    ['#0d1b38', '#0f2a5c'],
    ['#141035', '#221855'],
    ['#0a1c2c', '#0d2d45'],
  ]
  const [c1, c2] = palettes[idx % 4]
  return (
    <div className="relative w-full h-full overflow-hidden group" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
      {/* 网格纹理 */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      {/* 装饰圆 */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle, #0052D9, transparent)', transform: 'translate(40%, -40%)' }} />
      {/* 图标 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-15 transition-opacity duration-400">
        {icon && React.cloneElement(icon as React.ReactElement, { size: 48, className: 'text-white' })}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5">
        <span className="text-white/90 text-[14px] font-bold tracking-tight">{label}</span>
        <div className="mt-2 flex items-center gap-1 text-[#6baeff] text-[11px] font-bold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <span>了解更多</span><ArrowUpRight size={11} />
        </div>
      </div>
    </div>
  )
}

const NewsPlaceholder = ({ type, className = '' }: { type: string; className?: string }) => {
  const cfgs: Record<string, { from: string; to: string; el: React.ReactNode }> = {
    expo: { from: '#1a2135', to: '#0f1525', el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-15"><rect x="40" y="60" width="70" height="120" rx="4" fill="white" /><rect x="150" y="40" width="70" height="140" rx="4" fill="white" /><rect x="260" y="70" width="70" height="110" rx="4" fill="white" /><line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="2" /></svg> },
    data: { from: '#0c1e45', to: '#0d1630', el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-18"><polyline points="20,180 80,100 140,130 200,70 260,110 320,60 380,90" fill="none" stroke="white" strokeWidth="2" />{[80,140,200,260,320].map((x,i)=><circle key={i} cx={x} cy={[100,130,70,110,60][i]} r="4" fill="white"/>)}</svg> },
    ai: { from: '#180838', to: '#15083a', el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-15"><circle cx="200" cy="120" r="65" fill="none" stroke="white" strokeWidth="1.5"/><circle cx="200" cy="120" r="40" fill="none" stroke="white" strokeWidth="1"/><circle cx="200" cy="120" r="18" fill="white" opacity="0.25"/></svg> },
  }
  const cfg = cfgs[type] || cfgs.expo
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg,${cfg.from},${cfg.to})` }}>
      {cfg.el}
      {/* hover 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </div>
  )
}

const EsgPlaceholder = () => (
  <div className="w-full h-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8efff 30%, #dce6fc 60%, #f5f7ff 100%)' }}>
    <svg viewBox="0 0 600 700" className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="xMidYMid slice">
      <rect x="140" y="200" width="130" height="460" rx="4" fill="#b8ccee" opacity="0.6" />
      <rect x="290" y="110" width="170" height="550" rx="4" fill="#c0d4f0" opacity="0.7" />
      <rect x="480" y="250" width="100" height="410" rx="4" fill="#aabce8" opacity="0.5" />
      {Array.from({length:7}).map((_,row)=>[160,308,495].map((x,col)=>(
        <rect key={`${row}-${col}`} x={x} y={240+row*48} width={col===1?30:20} height={20} rx="2" fill="rgba(0,82,217,0.1)" />
      )))}
      <rect x="0" y="665" width="600" height="35" fill="#a0b8dc" opacity="0.35"/>
      <circle cx="190" cy="665" r="30" fill="#10B981" opacity="0.4"/>
      <circle cx="410" cy="660" r="42" fill="#059669" opacity="0.32"/>
    </svg>
    {/* 腾讯蓝装饰点 */}
    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-white/50">
      <p className="text-[10px] font-black text-[#0052D9] tracking-[0.2em] uppercase">Smart Building</p>
      <p className="text-[13px] font-bold text-gray-800 mt-0.5">2026 · ESG</p>
    </div>
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent px-7 py-6">
      <p className="text-white text-[14px] font-bold">智慧楼宇 · Smart Buildings</p>
      <p className="text-white/50 text-[12px] mt-1">可持续城市垂直交通解决方案</p>
    </div>
  </div>
)

/* ================================================================
   Stagger Reveal — 腾讯风格渐进式入场
================================================================ */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 36, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const StaggerGrid = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

const Reveal = ({ children, delay = 0, className = '', direction = 'up' }: { children: React.ReactNode; delay?: number; className?: string; direction?: 'up' | 'left' | 'right' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const dirMap = { up: { y: 28 }, left: { x: -28 }, right: { x: 28 } }
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}>
      {children}
    </motion.div>
  )
}

/* ================================================================
   数字统计 CountUp — 腾讯蓝风格
================================================================ */
const StatCard = ({ icon, value, suffix, prefix, label }: {
  icon: React.ReactNode; value: number; suffix: string; prefix?: string; label: string
}) => {
  const { val, ref } = useCountUp(value, 1.8)
  return (
    <motion.div ref={ref} variants={staggerItem}
      className="group flex flex-col items-center gap-4 px-6 py-10 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-[#0052D9]/25 transition-all duration-500 cursor-default hover:shadow-[0_8px_40px_rgba(0,82,217,0.15)]"
    >
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052D9]/25 to-[#0052D9]/10 text-[#6baeff] flex items-center justify-center group-hover:from-[#0052D9]/40 group-hover:to-[#0052D9]/20 group-hover:text-white transition-all duration-400"
      >
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </motion.div>
      <div className="text-[40px] font-[800] text-white tracking-tight leading-none tabular-nums">
        {prefix && <span className="text-[#6baeff] mr-1 text-[28px]">{prefix}</span>}
        {val.toLocaleString()}
        <span className="text-[#0052D9] ml-1 text-[24px]">{suffix}</span>
      </div>
      <p className="text-white/30 text-[13px] font-semibold tracking-wide text-center">{label}</p>
    </motion.div>
  )
}

/* ================================================================
   主组件 — 腾讯风格重构
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
  const heroTextY = useTransform(heroScroll, [0, 1], [0, 90])
  const heroOpacity = useTransform(heroScroll, [0, 0.55], [1, 0])
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.04])

  const t = content[lang]

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { document.title = 'Smart Guard AI - 连接安全 · 预见未来' }, [])

  // 注入 Dify 气泡
  useEffect(() => {
    if (!document.getElementById('dify-bubble-style')) {
      const style = document.createElement('style')
      style.id = 'dify-bubble-style'
      style.textContent =
        '#dify-chatbot-bubble-button{background-color:#0052D9!important;box-shadow:0 4px 20px rgba(0,82,217,0.4)!important}' +
        '#dify-chatbot-bubble-window{width:24rem!important;height:40rem!important;border-radius:16px!important;overflow:hidden!important}'
      document.head.appendChild(style)
    }
    ;(window as any).difyChatbotConfig = {
      token: 'uYxYNUj5uBiqYwhE',
      baseUrl: window.location.origin + '/dify-beta',
      inputs: {},
      systemVariables: {},
      userVariables: {},
    }
    if (!document.getElementById('uYxYNUj5uBiqYwhE')) {
      fetch(window.location.origin + '/dify-beta/embed.min.js')
        .then((r) => r.text())
        .then((code) => {
          const s = document.createElement('script')
          s.id = 'uYxYNUj5uBiqYwhE'
          s.textContent = code
          document.head.appendChild(s)
        })
        .catch((e) => console.error('[Dify] embed load failed', e))
    }
  }, [])

  /* 轮播计时 + 进度条 */
  const startCarousel = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    if (slideTimer.current) clearInterval(slideTimer.current)
    setSlideProgress(0)
    const total = 6000
    const tick = 50
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
        <div className="fixed top-0 left-0 right-0 z-[300] bg-gradient-to-r from-amber-50 via-amber-100/80 to-amber-50 border-b border-amber-200/60 text-amber-700 text-sm font-semibold px-4 py-2.5 text-center backdrop-blur-md">
          ⚠ 本页面内容由 AI 生成，仅供工业演示、教学交流与技术测试参考，不构成正式维保建议或商业交付。
        </div>
        <div className="pt-10"><Main params={params} /></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased selection:bg-[#0052D9]/20 selection:text-[#0052D9]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ============================================================
          导航栏 — 腾讯风格：简洁、半透明、左侧Logo + 右侧CTA
      ============================================================ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed w-full z-[100] transition-all duration-500 ${
          scrolled || activeMenu
            ? 'bg-white/85 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.05),0_4px_20px_rgba(0,0,0,0.03)]'
            : 'bg-transparent'
        }`}
        onMouseLeave={() => { setActiveMenu(null); setLangMenuOpen(false) }}
      >
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14 flex justify-between items-center relative z-[101] py-4">
          <div className="flex items-center gap-16">
            {/* Logo */}
            <motion.div onClick={() => router.push('/')}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0052D9] to-[#2563EB] flex items-center justify-center shadow-[0_2px_12px_rgba(0,82,217,0.4)]">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <div>
                <span className={`text-[17px] font-[800] tracking-tight transition-colors duration-300 ${scrolled || activeMenu ? 'text-[#0F172A]' : 'text-white'}`}>
                  Smart Guard
                </span>
                <span className={`text-[10px] tracking-[0.35em] font-black ml-2 transition-colors duration-300 ${scrolled || activeMenu ? 'text-[#0052D9]' : 'text-white/50'}`}>
                  AI
                </span>
              </div>
            </motion.div>

            {/* 导航链接 */}
            <div className="hidden lg:flex items-center gap-1">
              {t.nav.map((item) => (
                <div key={item.id} className="relative cursor-pointer px-4 py-2" onMouseEnter={() => setActiveMenu(item.id)}>
                  <span className={`text-[14px] font-semibold transition-all duration-300 ${
                    activeMenu === item.id
                      ? 'text-[#0052D9]'
                      : scrolled || activeMenu
                        ? 'text-[#475569] hover:text-[#0052D9]'
                        : 'text-white/75 hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                  {activeMenu === item.id && (
                    <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-2 right-2 h-[2px] bg-gradient-to-r from-[#0052D9] to-[#3B82F6] rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右侧 */}
          <div className="flex items-center gap-4">
            {/* Demo 标记 */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100/80 to-amber-50 border border-amber-200/50 text-amber-600 text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Demo
            </div>

            {/* 语言切换 */}
            <div className="relative">
              <button onMouseEnter={() => setLangMenuOpen(true)}
                className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10 ${
                  scrolled || activeMenu ? 'text-[#64748B] hover:text-[#0052D9]' : 'text-white/60 hover:text-white'
                }`}>
                <Globe size={14} />
                {t.common.langName}
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 mt-3 w-36 bg-white/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.12)] rounded-xl border border-gray-100 py-2 overflow-hidden"
                  >
                    {(['zh_cn', 'zh_tw', 'en'] as LangType[]).map((l) => (
                      <div key={l} onClick={() => { setLang(l); setLangMenuOpen(false); setBizTab(0) }}
                        className={`px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
                          lang === l
                            ? 'text-[#0052D9] bg-[#EDF2FD]'
                            : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0052D9]'
                        }`}>
                        {content[l].common.langName}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA 按钮 — 腾讯蓝渐变 */}
            <motion.button onClick={() => setIsChatting(true)}
              whileHover={{ scale: 1.03, boxShadow: '0 4px 24px rgba(0,82,217,0.45)' }}
              whileTap={{ scale: 0.96 }}
              className="relative bg-gradient-to-r from-[#0052D9] to-[#2563EB] text-white px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wide shadow-[0_2px_12px_rgba(0,82,217,0.3)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {t.common.start}
                <ArrowRight size={13} />
              </span>
              {/* shimmer 光泽 */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ skewX: '-20deg' }}
                animate={{ x: ['-150%', '150%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatDelay: 2 }}
              />
            </motion.button>
          </div>
        </div>

        {/* 下拉菜单 */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute top-full left-0 w-full bg-white/97 backdrop-blur-2xl border-t border-gray-100 overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
            >
              <div className="max-w-[1400px] mx-auto px-8 lg:px-14 py-10 grid grid-cols-4 gap-14">
                {t.nav.find((n) => n.id === activeMenu)?.columns.map((col, idx) => (
                  <div key={idx} className="space-y-5">
                    <h4 className="text-[11px] font-black text-[#94A3B8] tracking-[0.2em] uppercase">{col.title}</h4>
                    <ul className="space-y-3">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx} onClick={() => handleLinkClick(link)}
                          className="text-[15px] font-semibold text-[#334155] hover:text-[#0052D9] transition-all duration-200 flex items-center group cursor-pointer">
                          {link}
                          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-[#0052D9]" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ============================================================
          Hero 轮播区 — 腾讯科技深色背景 + 流畅切换
      ============================================================ */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden bg-[#060B1A]">
        {/* 背景切换 */}
        <AnimatePresence initial={false} custom={slideDir}>
          <motion.div key={slide} custom={slideDir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '5%' : '-5%', opacity: 0, scale: 1.03 }),
              center: { x: 0, opacity: 1, scale: 1 },
              exit: (d: number) => ({ x: d > 0 ? '-5%' : '5%', opacity: 0, scale: 0.98 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <CarouselBg visual={t.carousel[slide].visual} />
          </motion.div>
        </AnimatePresence>

        {/* 视差文字层 */}
        <motion.div style={{ y: heroTextY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-20 max-w-[720px]">
          <AnimatePresence mode="wait">
            <motion.div key={`txt-${slide}`}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* 眉标 */}
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12, duration: 0.5 }}
                className="flex items-center gap-3 mb-7"
              >
                <span className="w-10 h-[1.5px] bg-gradient-to-r from-[#0052D9] to-transparent rounded-full" />
                <span className="text-[#6baeff] text-[11px] font-black tracking-[0.3em] uppercase">
                  {t.carousel[slide].eyebrow}
                </span>
              </motion.div>

              {/* 大标题 */}
              <h1 className="text-white text-[52px] lg:text-[68px] font-[300] leading-[1.12] tracking-[-0.02em] mb-7 whitespace-pre-line"
                style={{ fontFamily: "'Inter', 'Noto Sans SC', sans-serif" }}>
                {t.carousel[slide].title}
              </h1>

              {/* 描述 */}
              <p className="text-white/35 text-[16px] leading-relaxed mb-12 max-w-[440px]">
                {t.carousel[slide].sub}
              </p>

              {/* CTA */}
              <motion.button onClick={() => setIsChatting(true)}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-white text-[15px] font-semibold group w-fit"
              >
                <motion.span
                  whileHover={{ scale: 1.1, borderColor: 'rgba(255,255,255,0.5)' }}
                  className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center bg-white/5 group-hover:bg-white/12 transition-all duration-300">
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.span>
                {t.common.start}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* 底部控制器 */}
        <div className="absolute bottom-10 left-12 lg:left-20 right-12 lg:right-20 z-20 flex items-end justify-between">
          <div className="flex items-center gap-2.5">
            <motion.button onClick={() => gotoSlide((slide - 1 + t.carousel.length) % t.carousel.length)}
              whileHover={{ scale: 1.1, borderColor: 'rgba(255,255,255,0.5)' }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all">
              <ArrowLeft size={14} />
            </motion.button>
            <motion.button onClick={() => gotoSlide((slide + 1) % t.carousel.length)}
              whileHover={{ scale: 1.1, borderColor: 'rgba(255,255,255,0.5)' }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all">
              <ArrowRight size={14} />
            </motion.button>
          </div>

          {/* 进度指示器 */}
          <div className="flex items-center gap-2.5">
            {t.carousel.map((_, i) => (
              <button key={i} onClick={() => gotoSlide(i)} className="relative flex items-center justify-center">
                {i === slide ? (
                  <div className="relative w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0052D9] to-[#3B82F6] rounded-full"
                      style={{ width: `${slideProgress * 100}%` }}
                      layout
                    />
                  </div>
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    i < slide ? 'bg-[#0052D9]/50' : 'bg-white/20 hover:bg-white/45'
                  }`} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 底部渐变线 */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0052D9]/20 to-transparent" />
      </section>

      {/* ============================================================
          功能三卡 — 腾讯风格：玻璃态 + 腾讯蓝渐变边框
      ============================================================ */}
      <section className="relative py-32 px-8 lg:px-14 max-w-[1400px] mx-auto">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-4 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #0052D9, transparent)' }} />

        <Reveal className="flex flex-col items-start mb-18">
          <h2 className="text-[36px] lg:text-[44px] font-[300] tracking-[-0.02em] text-[#0F172A] mb-4">
            {t.features.title}
          </h2>
          <div className="w-12 h-[3px] bg-gradient-to-r from-[#0052D9] to-transparent rounded-full" />
        </Reveal>

        <StaggerGrid className="grid md:grid-cols-3 gap-6">
          {t.features.list.map((f, i) => (
            <motion.div key={i} variants={staggerItem}>
              <TiltCard intensity={6} className="group h-full">
                <div className="relative h-full p-10 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0052D9]/20 hover:bg-white hover:shadow-[0_16px_60px_rgba(0,82,217,0.08)] transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  {/* 顶部渐变条 */}
                  <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#0052D9]/0 to-transparent group-hover:via-[#0052D9]/40 transition-all duration-700" />

                  {/* 背景光晕 */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-8 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${f.accent}, transparent)` }} />

                  {/* 图标 */}
                  <motion.div
                    whileHover={{ y: -4, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="w-14 h-14 bg-gradient-to-br from-[#EDF2FD] to-[#F8FAFC] rounded-2xl flex items-center justify-center mb-7 text-[#0052D9] group-hover:bg-gradient-to-br group-hover:from-[#0052D9] group-hover:to-[#2563EB] group-hover:text-white group-hover:shadow-[0_8px_30px_rgba(0,82,217,0.3)] transition-all duration-400 border border-[#E2E8F0] group-hover:border-transparent"
                    style={{ transformStyle: 'preserve-3d', translateZ: 25 }}
                  >
                    {React.cloneElement(f.icon as React.ReactElement, { size: 22 })}
                  </motion.div>

                  <h3 className="text-[20px] font-bold mb-3 tracking-tight text-[#0F172A]">{f.t}</h3>
                  <p className="text-[#64748B] text-[14px] leading-relaxed">{f.d}</p>

                  {/* 底部箭头 */}
                  <div className="mt-6 flex items-center gap-1.5 text-[#0052D9] text-[12px] font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {t.common.more} <ArrowRight size={12} />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </StaggerGrid>
      </section>

      {/* ============================================================
          数字统计条 — 深色腾讯蓝背景
      ============================================================ */}
      <section className="w-full bg-[#0F172A] py-16 px-8 lg:px-14 relative overflow-hidden">
        {/* 背景纹理 */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-8"
          style={{ background: 'radial-gradient(circle, #0052D9, transparent)' }} />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {t.stats.map((s, i) => (
              <StatCard key={i} icon={s.icon} value={s.value} suffix={s.suffix} prefix={s.prefix} label={s.label} />
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          业务板块 — Tab + 2×2 卡片网格
      ============================================================ */}
      <section className="w-full bg-[#0B1120] overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[420px_1fr] relative z-10">
          {/* 左：Tab 导航 */}
          <div className="flex flex-col justify-center px-12 lg:px-16 py-24">
            <Reveal direction="left">
              <p className="text-white/15 text-[10px] font-black tracking-[0.35em] uppercase mb-10">{t.business.label}</p>
            </Reveal>
            <div className="space-y-1">
              {t.business.tabs.map((tab, i) => (
                <Reveal key={tab.id} delay={i * 0.08} direction="left">
                  <motion.button onClick={() => setBizTab(i)}
                    whileHover={{ x: bizTab === i ? 0 : 5 }}
                    className={`w-full text-left px-6 py-5 rounded-xl transition-all duration-400 group flex flex-col ${
                      bizTab === i
                        ? 'bg-white/[0.06] border-l-[3px] border-[#0052D9] shadow-[0_4px_20px_rgba(0,82,217,0.08)]'
                        : 'border-l-[3px] border-transparent hover:bg-white/[0.03]'
                    }`}>
                    <span className={`text-[16px] font-bold leading-tight transition-all duration-300 ${
                      bizTab === i ? 'text-white' : 'text-white/35 group-hover:text-white/60'
                    }`}>
                      {tab.title}
                    </span>
                    <AnimatePresence>
                      {bizTab === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                          <span className="text-[12px] text-white/35 block mt-2">{tab.sub}</span>
                          <span className="flex items-center gap-2 text-[12px] text-[#6baeff] mt-3 font-bold">
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
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-2 min-h-[520px]"
            >
              {t.business.tabs[bizTab].cards.map((card, i) => (
                <motion.div key={i}
                  className="relative overflow-hidden group cursor-pointer border border-white/[0.04]"
                  whileHover={{ scale: 1.015, zIndex: 2 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <BusinessCardBg label={card.label} icon={card.icon} idx={i} />
                  {/* hover 扫光 */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 55%)' }}
                    animate={{}}
                    whileHover={{ backgroundPosition: ['200% 0', '-200% 0'] }}
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
      <section className="w-full bg-white">
        {/* 快速入口 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14 py-16">
          <StaggerGrid className="grid grid-cols-3 gap-5">
            {t.entrances.map((item, i) => {
              const colors = [
                'linear-gradient(135deg, #0052D9, #2563EB)',
                'linear-gradient(135deg, #1E3A5F, #0F2744)',
                'linear-gradient(135deg, #2D1B69, #1A1040)',
              ]
              return (
                <motion.div key={i} variants={staggerItem}>
                  <TiltCard intensity={5}>
                    <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="relative h-[160px] rounded-2xl overflow-hidden cursor-pointer group"
                      style={{ background: colors[i] }}
                    >
                      {/* 装饰 */}
                      <div className="absolute inset-0 opacity-[0.06]"
                        style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-20"
                        style={{ background: 'white', transform: 'translate(40%, -40%)' }} />

                      {/* 内容 */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="text-white/30 group-hover:text-white/60 transition-colors duration-300">
                          {React.cloneElement(item.icon as React.ReactElement, { size: 28 })}
                        </div>
                        <span className="text-white text-[17px] font-bold tracking-tight group-hover:scale-105 transition-transform duration-300">
                          {item.label}
                        </span>
                      </div>

                      {/* 箭头 */}
                      <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowUpRight size={12} className="text-white" />
                      </div>
                    </motion.div>
                  </TiltCard>
                </motion.div>
              )
            })}
          </StaggerGrid>
        </div>

        {/* 左图右文 — ESG */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14 pb-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="left">
              <motion.div
                whileHover={{ scale: 1.01 }} transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.08)] border border-[#E2E8F0]"
                style={{ height: 480 }}
              >
                <EsgPlaceholder />
              </motion.div>
            </Reveal>

            <Reveal delay={0.15} direction="right" className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-[2px] bg-gradient-to-r from-[#0052D9] to-transparent rounded-full" />
                <p className="text-[#0052D9] text-[11px] font-black tracking-[0.3em] uppercase">
                  {t.esg.eyebrow}
                </p>
              </div>
              <h2 className="text-[40px] lg:text-[50px] font-[300] leading-[1.16] tracking-[-0.02em] text-[#0F172A] mb-6 whitespace-pre-line">
                {t.esg.title}
              </h2>
              <p className="text-[#64748B] text-[16px] leading-relaxed mb-10 max-w-[420px]">{t.esg.sub}</p>
              <motion.button whileHover={{ x: 5 }} className="flex items-center gap-3 text-[#0052D9] text-[14px] font-bold group w-fit">
                <span className="w-10 h-10 rounded-full border border-[#0052D9]/25 flex items-center justify-center group-hover:bg-[#0052D9]/6 group-hover:border-[#0052D9]/50 transition-all">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                {t.common.learnMore}
              </motion.button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          最新动态 — 腾讯风格新闻卡片
      ============================================================ */}
      <section className="w-full bg-[#F8FAFC]">
        {/* 标题栏 */}
        <div className="bg-[#0F172A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="max-w-[1400px] mx-auto px-8 lg:px-14 py-10 flex items-center justify-between relative z-10">
            <Reveal direction="left">
              <h2 className="text-[26px] lg:text-[30px] font-bold text-white tracking-tight">{t.news.title}</h2>
            </Reveal>
            <Reveal delay={0.08} direction="right">
              <motion.button whileHover={{ x: 3 }} className="flex items-center gap-2 text-[13px] font-bold text-white/45 hover:text-white transition-colors group">
                {t.news.viewAll} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Reveal>
          </div>
        </div>

        {/* Featured 双栏 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14">
          <div className="grid lg:grid-cols-[1fr_400px] border-b border-[#E2E8F0]">
            {/* 大卡 */}
            <Reveal direction="left" className="group cursor-pointer border-r border-[#E2E8F0]">
              <motion.div whileHover={{ scale: 1.003 }} transition={{ duration: 0.4 }}>
                <div className="overflow-hidden h-[270px] lg:h-[340px]">
                  <motion.div className="w-full h-full" whileHover={{ scale: 1.06 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
                    <NewsPlaceholder type="data" className="w-full h-full" />
                  </motion.div>
                </div>
                <div className="p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/20 rounded-lg px-2.5 py-1 bg-[#EDF2FD]">
                      <Calendar size={9} /> {t.news.featured.date}
                    </span>
                    <span className="text-[10px] font-black text-[#94A3B8] tracking-widest uppercase">{t.news.featured.tag}</span>
                  </div>
                  <h3 className="text-[20px] lg:text-[22px] font-bold leading-tight text-[#0F172A] mb-3 group-hover:text-[#0052D9] transition-colors duration-300">
                    {t.news.featured.title}
                  </h3>
                  <p className="text-[#64748B] text-[14px] leading-relaxed max-w-2xl">{t.news.featured.desc}</p>
                  <motion.div whileHover={{ x: 3 }} className="mt-5 flex items-center gap-2 text-[#0052D9] text-[12px] font-bold">
                    {t.common.more} <ArrowRight size={11} />
                  </motion.div>
                </div>
              </motion.div>
            </Reveal>

            {/* 高亮卡 */}
            <Reveal delay={0.1} direction="right" className="group cursor-pointer">
              <motion.div whileHover={{ scale: 1.003 }} transition={{ duration: 0.4 }} className="h-full flex flex-col">
                <div className="overflow-hidden h-[200px]">
                  <motion.div className="w-full h-full" whileHover={{ scale: 1.07 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
                    <NewsPlaceholder type="expo" className="w-full h-full" />
                  </motion.div>
                </div>
                <div className="flex-1 p-7 bg-gradient-to-br from-[#EDF2FD] to-[#F0F5FF] group-hover:from-[#E5EFFD] group-hover:to-[#E8F0FE] transition-all duration-400">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/20 rounded-lg px-2 py-0.5 bg-white/60">
                      <Calendar size={9} /> {t.news.highlight.date}
                    </span>
                    <span className="text-[10px] font-black text-[#0052D9]/40 tracking-widest uppercase">{t.news.highlight.tag}</span>
                  </div>
                  <h3 className="text-[16px] font-bold leading-snug text-[#0C2D6B] mb-2 group-hover:text-[#0052D9] transition-colors">
                    {t.news.highlight.title}
                  </h3>
                  <p className="text-[#0052D9]/45 text-[13px] leading-relaxed">{t.news.highlight.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>

        {/* 三列小卡 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14 pb-24">
          <StaggerGrid className="grid md:grid-cols-3 border-b border-[#E2E8F0]">
            {t.news.grid.map((item, i) => (
              <motion.div key={i} variants={staggerItem}
                className={`group cursor-pointer ${i < 2 ? 'border-r border-[#E2E8F0]' : ''}`}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,82,217,0.06)' }}
                  transition={{ duration: 0.35 }}>
                  <div className="overflow-hidden h-[180px]">
                    <motion.div className="w-full h-full" whileHover={{ scale: 1.08 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
                      <NewsPlaceholder type={item.img} className="w-full h-full" />
                    </motion.div>
                  </div>
                  <div className="p-6 pb-7">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/15 rounded px-2 py-0.5 bg-[#EDF2FD]">
                        <Calendar size={7} /> {item.date}
                      </span>
                      <span className="text-[9px] font-black text-[#94A3B8] tracking-widest uppercase">{item.tag}</span>
                    </div>
                    <h4 className="text-[14px] font-bold leading-snug text-[#0F172A] mb-2 group-hover:text-[#0052D9] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[#64748B] text-[13px] leading-relaxed line-clamp-2">{item.desc}</p>
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

      {/* Dify 气泡由下方 useEffect 注入 */}

      {/* ============================================================
          页脚 — 腾讯风格深色页脚
      ============================================================ */}
      <footer className="bg-[#0B1120] text-white pt-20 pb-10 px-8 lg:px-14 relative overflow-hidden">
        {/* 顶部渐变装饰 */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0052D9]/30 to-transparent" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[120px] opacity-5"
          style={{ background: 'radial-gradient(circle, #0052D9, transparent)' }} />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-14 border-b border-white/[0.06] pb-14 mb-10">
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0052D9] to-[#2563EB] flex items-center justify-center">
                  <ShieldCheck size={18} className="text-white" />
                </div>
                <span className="text-[20px] font-black tracking-tight text-[#0052D9]">SMART GUARD AI</span>
              </div>
              <p className="text-[#64748B] max-w-xs text-[14px] leading-relaxed">
                连接安全，预见未来。致力于打造更智能、更透明的城市垂直交通监控体系。
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div className="space-y-4">
                <h4 className="text-white/15 font-black tracking-[0.25em] text-[10px] uppercase">合规文档</h4>
                <ul className="space-y-3 text-[#64748B] text-[13px]">
                  <li className="hover:text-white cursor-pointer flex items-center gap-2 transition-colors duration-200"><Lock size={12} />{t.footer.links[0]}</li>
                  <li className="hover:text-white cursor-pointer flex items-center gap-2 transition-colors duration-200"><FileText size={12} />{t.footer.links[1]}</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-white/15 font-black tracking-[0.25em] text-[10px] uppercase">快速链接</h4>
                <ul className="space-y-3 text-[#64748B] text-[13px]">
                  <li className="hover:text-white cursor-pointer transition-colors duration-200">关于我们</li>
                  <li className="hover:text-white cursor-pointer transition-colors duration-200">技术文档</li>
                  <li className="hover:text-white cursor-pointer transition-colors duration-200">加入我们</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-white/15 font-black tracking-[0.25em] text-[10px] uppercase">联系我们</h4>
                <ul className="space-y-3 text-[#64748B] text-[13px]">
                  <li className="hover:text-white cursor-pointer transition-colors duration-200">contact@smartguard.ai</li>
                  <li className="hover:text-white cursor-pointer transition-colors duration-200">技术支持</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-[12px] text-[#475569] leading-relaxed max-w-3xl mb-8">
            本系统为 AI 与 IoT 技术演示版本，当前用于工业场景研究、教学展示及展会交流。页面中的部分文本、诊断建议由人工智能模型生成，仅供参考。系统不直接参与电梯控制，不构成正式商业交付或维保依据。
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[#475569]">
              <span>{t.footer.copy}</span>
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">粤ICP备2026055050号</a>
              <a href="https://beian.mps.gov.cn/#/query/webSearch?code=44010602009999" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png" alt="公安备案" className="w-3.5 h-3.5 object-contain opacity-40" />
                粤公网安备 44010502004025号
              </a>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-white/[0.06] rounded-lg text-white/15 text-[10px] font-black tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-[#0052D9] rounded-full animate-pulse" />
              {t.footer.demo}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
