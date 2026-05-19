'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  ArrowLeft,
} from 'lucide-react'

import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

/* ================================================================
   多语言内容
================================================================ */
const content = {
  zh_cn: {
    nav: [
      {
        id: 'intro',
        label: '关于',
        columns: [
          { title: '项目概览', links: ['智能守护者简介', '技术演进', '广交会专题'] },
          { title: '互动实验室', links: ['智能维修挑战赛'] },
          { title: '核心团队', links: ['研发架构', '合作伙伴', '加入我们'] },
        ],
      },
      {
        id: 'tech',
        label: '技术',
        columns: [
          { title: '智能引擎', links: ['Dify AI 训练', '故障预测模型', 'RAG 知识库'] },
          { title: 'IoT 接入', links: ['默纳克系统协议', '传感器融合', '数字化改造'] },
        ],
      },
      {
        id: 'news',
        label: '动态',
        columns: [{ title: '最新消息', links: ['版本更新', '行业新闻', '展会回顾'] }],
      },
    ],
    common: {
      start: '立即体验',
      langName: '简体中文',
      more: '了解更多',
      learnMore: '了解详情',
    },
    carousel: [
      {
        eyebrow: 'Smart Guard AI · v2.0',
        title: '连接安全\n智能守护每一次出行',
        sub: '整合 IoT 传感器与 Dify AI 引擎，提供实时电梯故障诊断与主动防御预警。',
        visual: 'iot' as const,
      },
      {
        eyebrow: '多模态感知引擎',
        title: '预见故障\n在毫秒内做出决策',
        sub: '融合振动、温度与视觉数据，故障识别准确率达 98.7%，已在多个商业楼宇完成部署。',
        visual: 'ai' as const,
      },
      {
        eyebrow: '广交会 2026 专题',
        title: '连接世界\n展示中国智造实力',
        sub: '现场演示实时故障诊断全流程，展台三日内接待访客逾千名，多家合作意向已签署。',
        visual: 'expo' as const,
      },
    ],
    business: {
      label: '核心平台',
      tabs: [
        {
          id: 'iot',
          title: '连接设备与感知',
          sub: '构建城市垂直交通的神经网络',
          cards: [
            { label: 'IoT 传感器接入' },
            { label: '数字孪生平台' },
            { label: '实时运行监控' },
            { label: '边缘计算节点' },
          ],
        },
        {
          id: 'ai',
          title: '连接 AI 与决策',
          sub: '让每一行日志都产生价值',
          cards: [
            { label: 'Dify 智能引擎' },
            { label: 'RAG 知识库' },
            { label: '故障预测模型' },
            { label: '智能诊断报告' },
          ],
        },
        {
          id: 'safety',
          title: '连接人与安全',
          sub: '将风险消灭在萌芽状态',
          cards: [
            { label: '行为识别系统' },
            { label: '主动预警推送' },
            { label: '维保工单流程' },
            { label: '合规存档管理' },
          ],
        },
      ],
    },
    esg: {
      eyebrow: '责任与信任',
      title: '连接责任\n与未来',
      sub: '以技术促进城市安全，构建可持续的智慧楼宇生态，让每座建筑都能被更安全地守护。',
    },
    entrances: [
      { label: '解决方案' },
      { label: '技术生态' },
      { label: '办公据点' },
    ],
    features: {
      title: '重新定义电梯安全',
      list: [
        { icon: <Cpu />, t: '秒级响应', d: '基于 Dify 核心，故障码查询与解决方案生成仅在瞬息之间。' },
        { icon: <Monitor />, t: '数字孪生', d: '实时同步电梯运行参数，在虚拟空间构建精准的设备状态。' },
        { icon: <ShieldCheck />, t: '主动防御', d: '智能识别不安全乘梯行为，将事故隐患消灭在萌芽状态。' },
      ],
    },
    news: {
      title: '最新动态',
      viewAll: '查看全部',
      featured: {
        date: '2026.05.15',
        tag: '技术发布',
        title: 'Smart Guard v2.0 正式发布：引入多模态故障感知引擎',
        desc: '全新版本整合视觉与振动传感器数据，故障识别准确率提升至 98.7%，已在广州、深圳多个商业楼宇完成先行部署。',
      },
      highlight: {
        date: '2026.05.08',
        tag: '行业合作',
        title: '与默纳克控制系统达成深度战略合作，共建电梯智能运维标准',
        desc: '双方将联合制定行业数据交换协议，推动城市垂直交通数字化转型。',
      },
      grid: [
        { date: '2026.04.28', tag: '展会', title: '广交会专题：现场演示吸引逾千名参观者', desc: '多家物业企业现场表达合作意向。', img: 'expo' },
        { date: '2026.04.16', tag: '研究', title: 'RAG 知识库更新：12,000+ 故障案例收录完成', desc: '支持中英双语混合检索，响应时间 < 200ms。', img: 'data' },
        { date: '2026.03.30', tag: '安全', title: '主动防御模块上线：AI 视觉识别准确率达 94%', desc: '基于轻量化 YOLOv9，可在边缘设备本地推理。', img: 'ai' },
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
          { title: '項目概覽', links: ['智能守護者簡介', '技術演進', '廣交會專題'] },
          { title: '互動實驗室', links: ['智能維修挑戰賽'] },
          { title: '核心團隊', links: ['研發架構', '合作夥伴', '加入我們'] },
        ],
      },
      {
        id: 'tech',
        label: '技術',
        columns: [
          { title: '智能引擎', links: ['Dify AI 訓練', '故障預測模型', 'RAG 知識庫'] },
          { title: 'IoT 接入', links: ['默納克系統協議', '傳感器融合', '數位化改造'] },
        ],
      },
      {
        id: 'news',
        label: '動態',
        columns: [{ title: '最新消息', links: ['版本更新', '行業新聞', '展會回顧'] }],
      },
    ],
    common: { start: '立即體驗', langName: '繁體中文', more: '瞭解更多', learnMore: '瞭解詳情' },
    carousel: [
      { eyebrow: 'Smart Guard AI · v2.0', title: '連接安全\n智能守護每一次出行', sub: '整合 IoT 傳感器與 Dify AI 引擎，提供實時電梯故障診斷與主動防禦預警。', visual: 'iot' as const },
      { eyebrow: '多模態感知引擎', title: '預見故障\n在毫秒內做出決策', sub: '融合振動、溫度與視覺數據，故障識別準確率達 98.7%。', visual: 'ai' as const },
      { eyebrow: '廣交會 2026 專題', title: '連接世界\n展示中國智造實力', sub: '現場演示實時故障診斷全流程，展台三日內接待訪客逾千名。', visual: 'expo' as const },
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
        { icon: <Cpu />, t: '秒級響應', d: '基於 Dify 核心，故障碼查詢與解決方案生成僅在瞬息之間。' },
        { icon: <Monitor />, t: '數字孿生', d: '實時同步電梯運行參數，在虛擬空間構建精準的設備狀態。' },
        { icon: <ShieldCheck />, t: '主動防禦', d: '智能識別不安全乘梯行為，將事故隱患消滅在萌芽狀態。' },
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
      {
        id: 'intro',
        label: 'About',
        columns: [
          { title: 'Project', links: ['Introduction', 'Evolution', 'Canton Fair'] },
          { title: 'Lab', links: ['Maintenance Challenge'] },
          { title: 'Team', links: ['Architecture', 'Partners', 'Join Us'] },
        ],
      },
    ],
    common: { start: 'Get Started', langName: 'English', more: 'Learn More', learnMore: 'Learn More' },
    carousel: [
      { eyebrow: 'Smart Guard AI · v2.0', title: 'Secure Connection\nGuarding Every Journey', sub: 'Integrated IoT sensors and Dify AI for real-time elevator fault diagnosis and proactive safety alerts.', visual: 'iot' as const },
      { eyebrow: 'Multi-modal Detection', title: 'Predict Failures\nDecide in Milliseconds', sub: 'Fusing vibration, temperature, and visual data — 98.7% fault detection accuracy across deployments.', visual: 'ai' as const },
      { eyebrow: 'Canton Fair 2026', title: 'Connecting the World\nShowcasing Smart Manufacturing', sub: 'Live fault diagnosis demos drew 1,000+ visitors over three days with multiple partnerships signed on site.', visual: 'expo' as const },
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
        { icon: <Cpu />, t: 'Instant Response', d: 'Fault queries and solutions generated in milliseconds via Dify.' },
        { icon: <Monitor />, t: 'Digital Twin', d: 'Real-time synchronization of parameters for precise status mapping.' },
        { icon: <ShieldCheck />, t: 'Proactive Defense', d: 'AI-driven identification of unsafe behaviors to prevent risks.' },
      ],
    },
    news: {
      title: 'Latest Updates', viewAll: 'View All',
      featured: { date: '2026.05.15', tag: 'Release', title: 'Smart Guard v2.0 Launches with Multi-modal Fault Detection Engine', desc: 'New version integrates visual and vibration data, boosting fault detection to 98.7% across Guangzhou and Shenzhen deployments.' },
      highlight: { date: '2026.05.08', tag: 'Partnership', title: 'Strategic Partnership with Monarch Control Systems to Co-build Smart Elevator Maintenance Standards', desc: 'Joint data exchange protocol development to drive digital transformation of urban vertical transportation.' },
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
   SVG 占位图组件
================================================================ */

const CarouselBg = ({ visual }: { visual: 'iot' | 'ai' | 'expo' }) => {
  if (visual === 'iot') return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 1400 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="cg1" cx="65%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#162654" /><stop offset="100%" stopColor="#080c18" />
          </radialGradient>
        </defs>
        <rect width="1400" height="800" fill="url(#cg1)" />
        {Array.from({ length: 22 }).map((_, i) => (
          <rect key={i} x={i * 64} y="0" width="1.5" height="800" fill="white" opacity="0.03" />
        ))}
        <rect x="680" y="60" width="240" height="680" rx="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <rect x="700" y="130" width="200" height="150" rx="3" fill="rgba(0,82,217,0.2)" stroke="rgba(0,82,217,0.5)" strokeWidth="1" />
        {[[360,190],[990,280],[310,470],[1060,510],[560,590]].map(([x,y],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#0052D9" opacity="0.95" />
            <circle cx={x} cy={y} r="18" fill="none" stroke="#0052D9" strokeWidth="1" opacity="0.35" />
            <circle cx={x} cy={y} r="36" fill="none" stroke="#0052D9" strokeWidth="0.5" opacity="0.18" />
          </g>
        ))}
        {[[360,190,700,200],[990,280,880,200],[310,470,700,360],[1060,510,880,360],[560,590,700,560]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,82,217,0.25)" strokeWidth="1" strokeDasharray="5 4" />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
    </div>
  )

  if (visual === 'ai') return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 1400 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="cg2" cx="55%" cy="55%" r="65%">
            <stop offset="0%" stopColor="#120c28" /><stop offset="100%" stopColor="#050710" />
          </radialGradient>
        </defs>
        <rect width="1400" height="800" fill="url(#cg2)" />
        {[[180,180],[180,400],[180,620],[460,130],[460,340],[460,560],[740,240],[740,460],[1020,350],[1220,350]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={i>7?10:6} fill={i>7?'#0052D9':'rgba(90,130,255,0.65)'} />
        ))}
        {[[180,180,460,130],[180,180,460,340],[180,400,460,130],[180,400,460,340],[180,400,460,560],[180,620,460,340],[180,620,460,560],
          [460,130,740,240],[460,340,740,240],[460,340,740,460],[460,560,740,460],
          [740,240,1020,350],[740,460,1020,350],[1020,350,1220,350]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,82,217,0.18)" strokeWidth="1" />
        ))}
        <circle cx="1020" cy="350" r="75" fill="none" stroke="rgba(0,82,217,0.2)" strokeWidth="2" />
        <circle cx="1020" cy="350" r="130" fill="none" stroke="rgba(0,82,217,0.1)" strokeWidth="1.5" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
    </div>
  )

  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 1400 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d1520" /><stop offset="100%" stopColor="#0a1630" />
          </linearGradient>
        </defs>
        <rect width="1400" height="800" fill="url(#cg3)" />
        {[[980,700,65,280],[1055,700,52,240],[1125,700,72,310],[1220,700,58,195],[1295,700,48,270],[870,700,60,175],[790,700,75,235]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y-h} width={w} height={h} fill={`rgba(255,255,255,${0.04+i*0.008})`} rx="2" />
        ))}
        {Array.from({ length: 24 }).map((_, i) => (
          <circle key={i} cx={840+(i%6)*82+Math.sin(i)*18} cy={590-Math.floor(i/6)*38} r="1.5" fill="rgba(255,200,100,0.35)" />
        ))}
        <rect x="180" y="380" width="480" height="320" rx="8" fill="rgba(0,82,217,0.08)" stroke="rgba(0,82,217,0.25)" strokeWidth="1" />
        <text x="420" y="555" textAnchor="middle" fill="rgba(255,255,255,0.06)" fontSize="56" fontWeight="900" fontFamily="sans-serif">EXPO</text>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
    </div>
  )
}

const BusinessCardBg = ({ label, idx }: { label: string; idx: number }) => {
  const palettes = [
    ['#0a2050', '#163880'],
    ['#0e1e3a', '#0a3068'],
    ['#18103a', '#2a1a5c'],
    ['#0a2020', '#0e3434'],
  ]
  const [c1, c2] = palettes[idx % 4]
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="xMidYMid slice">
        <circle cx="320" cy="60" r="90" fill="none" stroke="white" strokeWidth="1" />
        <circle cx="320" cy="60" r="140" fill="none" stroke="white" strokeWidth="0.5" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="200" y1="0" x2="200" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
        <span className="text-white/90 text-[13px] font-bold">{label}</span>
      </div>
    </div>
  )
}

const NewsPlaceholder = ({ type, className = '' }: { type: string; className?: string }) => {
  const cfgs: Record<string, { from: string; to: string; el: React.ReactNode }> = {
    expo: {
      from: '#1e2535', to: '#111827',
      el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-20"><rect x="40" y="60" width="80" height="120" rx="4" fill="white" /><rect x="160" y="40" width="80" height="140" rx="4" fill="white" /><rect x="280" y="70" width="80" height="110" rx="4" fill="white" /><line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="2" /></svg>,
    },
    data: {
      from: '#0c1e4a', to: '#111830',
      el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-25"><polyline points="20,180 80,100 140,130 200,70 260,110 320,60 380,90" fill="none" stroke="white" strokeWidth="2" />{[80,140,200,260,320].map((x,i)=><circle key={i} cx={x} cy={[100,130,70,110,60][i]} r="5" fill="white"/>)}</svg>,
    },
    ai: {
      from: '#1a0838', to: '#200a40',
      el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-20"><circle cx="200" cy="120" r="70" fill="none" stroke="white" strokeWidth="1.5"/><circle cx="200" cy="120" r="45" fill="none" stroke="white" strokeWidth="1"/><circle cx="200" cy="120" r="20" fill="white" opacity="0.3"/></svg>,
    },
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
   Scroll Reveal
================================================================ */
const Reveal = ({
  children, delay = 0, className = '',
}: {
  children: React.ReactNode; delay?: number; className?: string
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
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
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const t = content[lang]

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    document.title = 'Smart Guard - 连接安全 · 预见未来智能'
  }, [])

  const scheduleNext = useCallback(() => {
    if (slideTimer.current) clearTimeout(slideTimer.current)
    slideTimer.current = setTimeout(() => {
      setSlideDir(1)
      setSlide((s) => (s + 1) % t.carousel.length)
    }, 5200)
  }, [t.carousel.length])

  useEffect(() => {
    scheduleNext()
    return () => { if (slideTimer.current) clearTimeout(slideTimer.current) }
  }, [slide, scheduleNext])

  const gotoSlide = (idx: number) => {
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

      {/* ================================================================
          导航栏
      ================================================================ */}
      <nav
        className={`fixed w-full z-[100] transition-all duration-500 ${
          scrolled || activeMenu ? 'bg-white/95 backdrop-blur-2xl shadow-sm' : 'bg-transparent'
        }`}
        onMouseLeave={() => { setActiveMenu(null); setLangMenuOpen(false) }}
      >
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex justify-between items-center relative z-[101] py-5">
          <div className="flex items-center gap-14">
            <div onClick={() => router.push('/')}
              className="text-[19px] font-[900] text-[#0052D9] tracking-tighter uppercase cursor-pointer flex items-center gap-3">
              Smart Guard
              <span className="w-[1px] h-4 bg-gray-200" />
              <span className="text-[11px] tracking-[0.3em] text-gray-400 font-black">AI</span>
            </div>
            <div className="hidden lg:flex items-center gap-10">
              {t.nav.map((item) => (
                <div key={item.id} className="relative cursor-pointer py-2" onMouseEnter={() => setActiveMenu(item.id)}>
                  <span className={`text-[14px] font-bold transition-colors duration-300 ${
                    activeMenu === item.id ? 'text-[#0052D9]' : scrolled || activeMenu ? 'text-gray-600 hover:text-[#0052D9]' : 'text-white/85 hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                  {activeMenu === item.id && (
                    <motion.div layoutId="nav-line" className="absolute -bottom-[22px] left-0 right-0 h-[3px] bg-[#0052D9]" />
                  )}
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
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-4 w-32 bg-white shadow-xl rounded-xl border border-gray-100 py-2">
                    {(['zh_cn', 'zh_tw', 'en'] as LangType[]).map((l) => (
                      <div key={l} onClick={() => { setLang(l); setLangMenuOpen(false); setBizTab(0) }}
                        className={`px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-blue-50 ${lang === l ? 'text-[#0052D9]' : 'text-gray-600'}`}>
                        {content[l].common.langName}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => setIsChatting(true)}
              className="bg-[#0052D9] text-white px-6 py-2.5 rounded-full text-[12px] font-black hover:bg-[#0042b3] transition-all">
              {t.common.start}
            </button>
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

      {/* ================================================================
          Hero 轮播  全屏 + 左侧文字 + 箭头 + 圆点
      ================================================================ */}
      <section className="relative w-full h-screen overflow-hidden bg-[#080c14]">
        <AnimatePresence initial={false} custom={slideDir}>
          <motion.div key={slide} custom={slideDir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '6%' : '-6%', opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? '-6%' : '6%', opacity: 0 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <CarouselBg visual={t.carousel[slide].visual} />
          </motion.div>
        </AnimatePresence>

        {/* 文字 */}
        <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-20" style={{ maxWidth: 680 }}>
          <AnimatePresence mode="wait">
            <motion.div key={`txt-${slide}`}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[#6baeff] text-[11px] font-black tracking-[0.28em] uppercase mb-6">
                {t.carousel[slide].eyebrow}
              </p>
              <h1 className="text-white text-[50px] lg:text-[62px] font-[300] leading-[1.18] tracking-[-0.01em] mb-6 whitespace-pre-line">
                {t.carousel[slide].title}
              </h1>
              <p className="text-white/45 text-[15px] leading-relaxed mb-10 max-w-[420px]">
                {t.carousel[slide].sub}
              </p>
              <button onClick={() => setIsChatting(true)}
                className="flex items-center gap-3 text-white text-[14px] font-medium group w-fit">
                <span className="w-8 h-8 rounded-full border border-white/35 flex items-center justify-center group-hover:bg-white/12 transition-all">
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                {t.common.start}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 底部控制 */}
        <div className="absolute bottom-8 left-12 lg:left-20 right-12 lg:right-20 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => gotoSlide((slide - 1 + t.carousel.length) % t.carousel.length)}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/55 hover:text-white hover:border-white/55 transition-all">
              <ArrowLeft size={14} />
            </button>
            <button onClick={() => gotoSlide((slide + 1) % t.carousel.length)}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/55 hover:text-white hover:border-white/55 transition-all">
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {t.carousel.map((_, i) => (
              <button key={i} onClick={() => gotoSlide(i)}
                className={`rounded-full transition-all duration-300 ${i === slide ? 'w-6 h-2 bg-[#0052D9]' : 'w-2 h-2 bg-white/28 hover:bg-white/55'}`} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </section>

      {/* ================================================================
          功能三卡
      ================================================================ */}
      <section className="py-28 px-12 max-w-[1400px] mx-auto">
        <Reveal className="flex flex-col items-start mb-16">
          <h2 className="text-[34px] lg:text-[42px] font-[300] tracking-[-0.02em] text-[#1d1d1f] mb-5">
            {t.features.title}
          </h2>
          <div className="w-10 h-[3px] bg-[#0052D9] rounded-full" />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {t.features.list.map((f, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="group p-10 bg-[#F7F9FE] rounded-3xl hover:bg-white hover:shadow-xl border border-transparent hover:border-gray-100 transition-all duration-500 cursor-pointer">
                <div className="w-11 h-11 bg-white text-[#0052D9] rounded-xl flex items-center justify-center mb-7 shadow-sm group-hover:bg-[#0052D9] group-hover:text-white transition-all">
                  {React.cloneElement(f.icon as React.ReactElement, { size: 20 })}
                </div>
                <h3 className="text-[19px] font-bold mb-3 tracking-tight text-gray-900">{f.t}</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================================================================
          业务板块  深色 + Tab + 2×2图网格
      ================================================================ */}
      <section className="w-full bg-[#1e2230] overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[400px_1fr]">

          {/* 左：Tab */}
          <div className="flex flex-col justify-center px-12 lg:px-14 py-20 lg:py-24">
            <Reveal>
              <p className="text-white/18 text-[10px] font-black tracking-[0.32em] uppercase mb-9">
                {t.business.label}
              </p>
            </Reveal>
            <div className="space-y-1.5">
              {t.business.tabs.map((tab, i) => (
                <Reveal key={tab.id} delay={i * 0.06}>
                  <button onClick={() => setBizTab(i)}
                    className={`w-full text-left px-5 py-5 rounded-xl transition-all duration-300 group flex flex-col ${
                      bizTab === i ? 'bg-white/5 border-l-[3px] border-[#0052D9]' : 'border-l-[3px] border-transparent hover:bg-white/[0.03]'
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
                  </button>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 右：2×2图 */}
          <AnimatePresence mode="wait">
            <motion.div key={`biz-${bizTab}`}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 min-h-[480px]"
            >
              {t.business.tabs[bizTab].cards.map((card, i) => (
                <div key={i} className="relative overflow-hidden group cursor-pointer border border-white/5 aspect-square">
                  <BusinessCardBg label={card.label} idx={i} />
                  <div className="absolute inset-0 bg-[#0052D9]/0 group-hover:bg-[#0052D9]/12 transition-all duration-300" />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ================================================================
          ESG / 责任  三联入口 + 左图右文
      ================================================================ */}
      <section className="w-full">
        {/* 三联快速入口 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-14">
          <div className="grid grid-cols-3 gap-4">
            {t.entrances.map((item, i) => {
              const colors = ['#0052D9', '#1e3060', '#2a2050']
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="relative h-[150px] rounded-2xl overflow-hidden cursor-pointer group"
                    style={{ background: colors[i] }}>
                    <svg viewBox="0 0 400 150" className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="xMidYMid slice">
                      <line x1="0" y1="75" x2="400" y2="75" stroke="white" strokeWidth="60" opacity="0.3" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-[17px] font-bold tracking-tight group-hover:scale-105 transition-transform">
                        {item.label}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-all" />
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* 左图右文 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pb-22">
          <div className="grid lg:grid-cols-2 gap-14 items-center pb-24">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden" style={{ height: 480 }}>
                <EsgPlaceholder />
              </div>
            </Reveal>
            <Reveal delay={0.14} className="flex flex-col justify-center">
              <p className="text-[#0052D9] text-[10px] font-black tracking-[0.32em] uppercase mb-5">
                {t.esg.eyebrow}
              </p>
              <h2 className="text-[38px] lg:text-[48px] font-[300] leading-[1.18] tracking-[-0.02em] text-[#1d1d1f] mb-6 whitespace-pre-line">
                {t.esg.title}
              </h2>
              <p className="text-gray-400 text-[15px] leading-relaxed mb-8 max-w-[400px]">
                {t.esg.sub}
              </p>
              <button className="flex items-center gap-3 text-[#0052D9] text-[13px] font-bold group w-fit">
                <span className="w-8 h-8 rounded-full border border-[#0052D9]/35 flex items-center justify-center group-hover:bg-[#0052D9]/8 transition-all">
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                {t.common.learnMore}
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================================================================
          最新动态
      ================================================================ */}
      <section className="w-full">
        {/* 深色标题横幅 */}
        <div className="bg-[#1b1e23]" style={{
          backgroundImage: `repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(255,255,255,0.022) 80px,rgba(255,255,255,0.022) 81px),repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(255,255,255,0.022) 80px,rgba(255,255,255,0.022) 81px)`,
        }}>
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 flex items-center justify-between">
            <Reveal>
              <h2 className="text-[25px] lg:text-[28px] font-bold text-white tracking-tight">{t.news.title}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <button className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-white transition-colors group">
                {t.news.viewAll} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Reveal>
          </div>
        </div>

        {/* Featured 双栏 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_390px] border-b border-gray-100">
            <Reveal className="group cursor-pointer border-r border-gray-100">
              <div className="h-[260px] lg:h-[320px] overflow-hidden">
                <NewsPlaceholder type="data" className="w-full h-full" />
              </div>
              <div className="p-8 lg:p-9">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/28 rounded px-2.5 py-1">
                    <Calendar size={8} /> {t.news.featured.date}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{t.news.featured.tag}</span>
                </div>
                <h3 className="text-[20px] lg:text-[22px] font-bold leading-tight text-gray-900 mb-3 group-hover:text-[#0052D9] transition-colors">
                  {t.news.featured.title}
                </h3>
                <p className="text-gray-400 text-[13px] leading-relaxed max-w-2xl">{t.news.featured.desc}</p>
                <div className="mt-5 flex items-center gap-2 text-[#0052D9] text-[11px] font-bold group-hover:gap-3 transition-all">
                  {t.common.more} <ArrowRight size={11} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="group cursor-pointer">
              <div className="h-[190px] overflow-hidden">
                <NewsPlaceholder type="expo" className="w-full h-full" />
              </div>
              <div className="p-7 bg-[#EDF2FD]">
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
            </Reveal>
          </div>
        </div>

        {/* 三列小卡 */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pb-20">
          <div className="grid md:grid-cols-3 border-b border-gray-100">
            {t.news.grid.map((item, i) => (
              <Reveal key={i} delay={i * 0.07} className={`group cursor-pointer ${i < 2 ? 'border-r border-gray-100' : ''}`}>
                <div className="overflow-hidden h-[175px]">
                  <motion.div className="w-full h-full" whileHover={{ scale: 1.04 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                    <NewsPlaceholder type={item.img} className="w-full h-full" />
                  </motion.div>
                </div>
                <div className="p-6 pb-7">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-[#0052D9] tracking-widest uppercase border border-[#0052D9]/18 rounded px-1.5 py-0.5">
                      <Calendar size={7} /> {item.date}
                    </span>
                    <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">{item.tag}</span>
                  </div>
                  <h4 className="text-[14px] font-bold leading-snug text-gray-900 mb-1.5 group-hover:text-[#0052D9] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-[12px] leading-relaxed line-clamp-2">{item.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-[#0052D9] text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.common.more} <ArrowRight size={10} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          页脚
      ================================================================ */}
      <footer className="bg-[#1b1e23] text-white pt-18 pb-12 px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 border-b border-white/5 pb-12 mb-10">
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
                  <li className="hover:text-white cursor-pointer flex items-center gap-2"><Lock size={12} />{t.footer.links[0]}</li>
                  <li className="hover:text-white cursor-pointer flex items-center gap-2"><FileText size={12} />{t.footer.links[1]}</li>
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
