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
  Layers, Radio, BarChart3, Gauge, BrainCircuit, Search, ShoppingCart, User,
} from 'lucide-react'

import Script from 'next/script'

import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

/* ================================================================
   HP DESIGN SYSTEM TOKENS
   Source: hp-DESIGN.md
================================================================ */
const HP = {
  colors: {
    primary: '#024ad8',
    primaryBright: '#296ef9',
    primaryDeep: '#0e3191',
    primarySoft: '#c9e0fc',
    ink: '#1a1a1a',
    inkDeep: '#000000',
    inkSoft: '#292929',
    onInk: '#ffffff',
    canvas: '#ffffff',
    paper: '#ffffff',
    cloud: '#f7f7f7',
    fog: '#e8e8e8',
    steel: '#c2c2c2',
    graphite: '#636363',
    charcoal: '#3d3d3d',
    hairline: '#e8e8e8',
    hairlineStrong: '#c2c2c2',
    bloomCoral: '#ff5050',
    bloomRose: '#f9d4d2',
    bloomDeep: '#b3262b',
    stormMist: '#8ebdce',
  },
  shadow: {
    softLift: '0 2px 8px rgba(26,26,26,0.08)',
    floatingModal: '0 8px 24px rgba(26,26,26,0.12)',
  },
}

/* ================================================================
   多语言内容
================================================================ */
const content = {
  zh_cn: {
    utilityStrip: ['为企业', '为个人', '登录', '购物车'],
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
    common: { start: '立即体验', langName: '简体中文', more: '了解更多', learnMore: '了解详情', shopNow: '立即选购', compare: '对比' },
    hero: {
      eyebrow: 'Smart Guard AI · v2.0',
      title: '连接安全\n智能守护每一次出行',
      sub: '整合 IoT 传感器与 Dify AI 引擎，提供实时电梯故障诊断与主动防御预警。',
      badge: '新品发布',
      priceLine: '从 ¥12,800 起',
    },
    carousel: [
      { eyebrow: 'Smart Guard AI · v2.0', title: '连接安全\n智能守护每一次出行', sub: '整合 IoT 传感器与 Dify AI 引擎，提供实时电梯故障诊断与主动防御预警。', visual: 'iot' as const },
      { eyebrow: '多模态感知引擎', title: '预见故障\n在毫秒内做出决策', sub: '融合振动、温度与视觉数据，故障识别准确率达 98.7%，已在多个商业楼宇完成部署。', visual: 'ai' as const },
      { eyebrow: '广交会 2026 专题', title: '连接世界\n展示中国智造实力', sub: '现场演示实时故障诊断全流程，展台三日内接待访客逾千名，多家合作意向已签署。', visual: 'expo' as const },
    ],
    categories: [
      { label: '故障诊断', icon: <Activity /> },
      { label: '数字孪生', icon: <Monitor /> },
      { label: '主动防御', icon: <ShieldCheck /> },
      { label: 'IoT 接入', icon: <Radio /> },
      { label: 'AI 引擎', icon: <BrainCircuit /> },
      { label: '企业方案', icon: <Layers /> },
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
    testimonial: {
      eyebrow: '客户案例',
      title: '他们选择了 Smart Guard',
      items: [
        { quote: '故障响应时间从 4 小时降至 12 分钟，维保成本下降了 40%。', name: '张总监', role: '广州某商业地产集团 · 设施总监' },
        { quote: '接入 RAG 知识库后，现场工程师无需翻手册，扫码即得诊断建议。', name: '李工', role: '深圳楼宇智能化服务商 · 首席工程师' },
        { quote: '广交会看到演示后当场签约，IoT 数据可视化让客户一目了然。', name: '王总', role: '华南区电梯代理商 · 总经理' },
      ],
    },
    esg: { eyebrow: '责任与信任', title: '连接责任\n与未来', sub: '以技术促进城市安全，构建可持续的智慧楼宇生态，让每座建筑都能被更安全地守护。' },
    features: {
      title: '重新定义电梯安全',
      list: [
        { icon: <Cpu />, t: '秒级响应', d: '基于 Dify 核心，故障码查询与解决方案生成仅在瞬息之间。' },
        { icon: <Monitor />, t: '数字孪生', d: '实时同步电梯运行参数，在虚拟空间构建精准的设备状态。' },
        { icon: <ShieldCheck />, t: '主动防御', d: '智能识别不安全乘梯行为，将事故隐患消灭在萌芽状态。' },
      ],
    },
    news: {
      title: '最新动态', viewAll: '查看全部',
      featured: { date: '2026.05.15', tag: '技术发布', title: 'Smart Guard v2.0 正式发布：引入多模态故障感知引擎', desc: '全新版本整合视觉与振动传感器数据，故障识别准确率提升至 98.7%，已在广州、深圳多个商业楼宇完成先行部署。' },
      grid: [
        { date: '2026.05.08', tag: '行业合作', title: '与默纳克控制系统达成深度战略合作', desc: '双方将联合制定行业数据交换协议，推动城市垂直交通数字化转型。', type: 'expo' },
        { date: '2026.04.28', tag: '展会', title: '广交会：现场演示吸引逾千名参观者', desc: '多家物业企业现场表达合作意向。', type: 'expo' },
        { date: '2026.04.16', tag: '研究', title: 'RAG 知识库更新：12,000+ 故障案例收录完成', desc: '支持中英双语混合检索，响应时间 < 200ms。', type: 'data' },
        { date: '2026.03.30', tag: '安全', title: '主动防御模块上线：AI 视觉识别准确率达 94%', desc: '基于轻量化 YOLOv9，可在边缘设备本地推理。', type: 'ai' },
      ],
    },
    helpBand: {
      title: '我们能为您做什么？',
      tabs: ['浏览方案', '在线咨询', '联系我们', '故障诊断', '订单状态'],
    },
    footer: {
      copy: '© 2026 Smart Guard Project. 版权所有.',
      demo: '演示版本',
      columns: [
        { title: '公司', links: ['关于我们', '技术文档', '广交会专题', '加入我们'] },
        { title: '产品', links: ['故障诊断系统', 'IoT 监控平台', '数字孪生', '主动防御'] },
        { title: '支持', links: ['技术支持', '知识库', '培训中心', '合规文档'] },
        { title: '资源', links: ['行业白皮书', '案例研究', '博客动态', 'API 文档'] },
        { title: '联系', links: ['contact@smartguard.ai', '技术热线', '商务合作', '媒体资询'] },
      ],
      legal: ['隐私政策', '服务协议', '粤ICP备2026055050号'],
    },
  },

  zh_tw: {
    utilityStrip: ['為企業', '為個人', '登入', '購物車'],
    nav: [
      { id: 'intro', label: '關於', columns: [{ title: '項目概覽', links: ['智能守護者簡介', '技術演進', '廣交會專題'] }, { title: '互動實驗室', links: ['智能維修挑戰賽'] }, { title: '核心團隊', links: ['研發架構', '合作夥伴', '加入我們'] }] },
      { id: 'tech', label: '技術', columns: [{ title: '智能引擎', links: ['Dify AI 訓練', '故障預測模型', 'RAG 知識庫'] }, { title: 'IoT 接入', links: ['默納克系統協議', '傳感器融合', '數位化改造'] }] },
      { id: 'news', label: '動態', columns: [{ title: '最新消息', links: ['版本更新', '行業新聞', '展會回顧'] }] },
    ],
    common: { start: '立即體驗', langName: '繁體中文', more: '瞭解更多', learnMore: '瞭解詳情', shopNow: '立即選購', compare: '比較' },
    hero: { eyebrow: 'Smart Guard AI · v2.0', title: '連接安全\n智能守護每一次出行', sub: '整合 IoT 傳感器與 Dify AI 引擎，提供實時電梯故障診斷與主動防禦預警。', badge: '新品發布', priceLine: '從 NT$160,000 起' },
    carousel: [
      { eyebrow: 'Smart Guard AI · v2.0', title: '連接安全\n智能守護每一次出行', sub: '整合 IoT 傳感器與 Dify AI 引擎，提供實時電梯故障診斷與主動防禦預警。', visual: 'iot' as const },
      { eyebrow: '多模態感知引擎', title: '預見故障\n在毫秒內做出決策', sub: '融合振動、溫度與視覺數據，故障識別準確率達 98.7%。', visual: 'ai' as const },
      { eyebrow: '廣交會 2026 專題', title: '連接世界\n展示中國智造實力', sub: '現場演示實時故障診斷全流程，展台三日內接待訪客逾千名。', visual: 'expo' as const },
    ],
    categories: [
      { label: '故障診斷', icon: <Activity /> },
      { label: '數字孿生', icon: <Monitor /> },
      { label: '主動防禦', icon: <ShieldCheck /> },
      { label: 'IoT 接入', icon: <Radio /> },
      { label: 'AI 引擎', icon: <BrainCircuit /> },
      { label: '企業方案', icon: <Layers /> },
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
    testimonial: {
      eyebrow: '客戶案例',
      title: '他們選擇了 Smart Guard',
      items: [
        { quote: '故障響應時間從 4 小時降至 12 分鐘，維保成本下降了 40%。', name: '張總監', role: '廣州某商業地產集團 · 設施總監' },
        { quote: '接入 RAG 知識庫後，現場工程師無需翻手冊，掃碼即得診斷建議。', name: '李工', role: '深圳樓宇智能化服務商 · 首席工程師' },
        { quote: '廣交會看到演示後當場簽約，IoT 數據可視化讓客戶一目了然。', name: '王總', role: '華南區電梯代理商 · 總經理' },
      ],
    },
    esg: { eyebrow: '責任與信任', title: '連接責任\n與未來', sub: '以技術促進城市安全，構建可持續的智慧樓宇生態。' },
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
      grid: [
        { date: '2026.05.08', tag: '行業合作', title: '與默納克控制系統達成深度戰略合作', desc: '雙方將聯合制定行業數據交換協議。', type: 'expo' },
        { date: '2026.04.28', tag: '展會', title: '廣交會：現場演示吸引逾千名參觀者', desc: '多家物業企業現場表達合作意向。', type: 'expo' },
        { date: '2026.04.16', tag: '研究', title: 'RAG 知識庫更新：12,000+ 故障案例收錄完成', desc: '支持中英雙語混合檢索。', type: 'data' },
        { date: '2026.03.30', tag: '安全', title: '主動防禦模組上線：AI 識別準確率達 94%', desc: '基於輕量化 YOLOv9。', type: 'ai' },
      ],
    },
    helpBand: { title: '我們能為您做什麼？', tabs: ['瀏覽方案', '線上諮詢', '聯絡我們', '故障診斷', '訂單狀態'] },
    footer: {
      copy: '© 2026 Smart Guard Project. 版權所有.',
      demo: '演示版本',
      columns: [
        { title: '公司', links: ['關於我們', '技術文件', '廣交會專題', '加入我們'] },
        { title: '產品', links: ['故障診斷系統', 'IoT 監控平台', '數字孿生', '主動防禦'] },
        { title: '支援', links: ['技術支援', '知識庫', '培訓中心', '合規文件'] },
        { title: '資源', links: ['行業白皮書', '案例研究', '部落格', 'API 文件'] },
        { title: '聯絡', links: ['contact@smartguard.ai', '技術熱線', '商務合作', '媒體資訊'] },
      ],
      legal: ['隱私政策', '服務協議', '粵ICP備2026055050號'],
    },
  },

  en: {
    utilityStrip: ['For Business', 'For Home', 'Sign In', 'Cart'],
    nav: [
      { id: 'intro', label: 'About', columns: [{ title: 'Project', links: ['Introduction', 'Evolution', 'Canton Fair'] }, { title: 'Lab', links: ['Maintenance Challenge'] }, { title: 'Team', links: ['Architecture', 'Partners', 'Join Us'] }] },
      { id: 'tech', label: 'Tech', columns: [{ title: 'AI Engine', links: ['Dify AI Training', 'Fault Prediction', 'RAG Knowledge Base'] }, { title: 'IoT Integration', links: ['Monarch Protocol', 'Sensor Fusion', 'Digital Upgrade'] }] },
      { id: 'news', label: 'News', columns: [{ title: 'Latest', links: ['Releases', 'Industry News', 'Expo Recap'] }] },
    ],
    common: { start: 'Get Started', langName: 'English', more: 'Learn more', learnMore: 'Learn more', shopNow: 'Shop now', compare: 'Compare' },
    hero: { eyebrow: 'Smart Guard AI · v2.0', title: 'Secure Connection\nGuarding Every Journey', sub: 'Integrated IoT sensors and Dify AI for real-time elevator fault diagnosis and proactive safety alerts.', badge: 'New Release', priceLine: 'Starting at $1,799' },
    carousel: [
      { eyebrow: 'Smart Guard AI · v2.0', title: 'Secure Connection\nGuarding Every Journey', sub: 'Integrated IoT sensors and Dify AI for real-time elevator fault diagnosis and proactive safety alerts.', visual: 'iot' as const },
      { eyebrow: 'Multi-modal Detection', title: 'Predict Failures\nDecide in Milliseconds', sub: 'Fusing vibration, temperature, and visual data — 98.7% fault detection accuracy.', visual: 'ai' as const },
      { eyebrow: 'Canton Fair 2026', title: 'Connecting the World\nShowcasing Smart Manufacturing', sub: 'Live fault diagnosis demos drew 1,000+ visitors over three days with multiple partnerships signed.', visual: 'expo' as const },
    ],
    categories: [
      { label: 'Fault Diagnosis', icon: <Activity /> },
      { label: 'Digital Twin', icon: <Monitor /> },
      { label: 'Proactive Defense', icon: <ShieldCheck /> },
      { label: 'IoT Integration', icon: <Radio /> },
      { label: 'AI Engine', icon: <BrainCircuit /> },
      { label: 'Enterprise', icon: <Layers /> },
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
    testimonial: {
      eyebrow: 'Customer Stories',
      title: 'See what our customers say',
      items: [
        { quote: 'Fault response time dropped from 4 hours to 12 minutes. Maintenance costs fell by 40%.', name: 'Director Zhang', role: 'Guangzhou Commercial Real Estate Group · Facilities Director' },
        { quote: 'With the RAG knowledge base, engineers get diagnostic advice instantly by scanning a QR code — no more manuals.', name: 'Engineer Li', role: 'Shenzhen Smart Building Services · Chief Engineer' },
        { quote: 'Signed the contract on the spot at Canton Fair. The IoT data visualization made everything crystal clear.', name: 'GM Wang', role: 'South China Elevator Distributor · General Manager' },
      ],
    },
    esg: { eyebrow: 'Responsibility & Trust', title: 'Connecting\nResponsibility & Future', sub: 'Harnessing technology to advance urban safety and build a sustainable smart building ecosystem.' },
    features: {
      title: 'Redefining Elevator Safety',
      list: [
        { icon: <Cpu />, t: 'Instant Response', d: 'Fault queries and solutions generated in milliseconds via Dify.' },
        { icon: <Monitor />, t: 'Digital Twin', d: 'Real-time synchronization of parameters for precise status mapping.' },
        { icon: <ShieldCheck />, t: 'Proactive Defense', d: 'AI-driven identification of unsafe behaviors to prevent risks.' },
      ],
    },
    news: {
      title: 'Latest from Smart Guard', viewAll: 'View all',
      featured: { date: '2026.05.15', tag: 'Release', title: 'Smart Guard v2.0 Launches with Multi-modal Fault Detection Engine', desc: 'New version integrates visual and vibration data, boosting fault detection to 98.7% across Guangzhou and Shenzhen deployments.' },
      grid: [
        { date: '2026.05.08', tag: 'Partnership', title: 'Strategic Partnership with Monarch Control Systems', desc: 'Joint data exchange protocol development to drive digital transformation.', type: 'expo' },
        { date: '2026.04.28', tag: 'Expo', title: 'Canton Fair: Live Demo Draws 1,000+ Visitors', desc: 'Multiple property management firms expressed partnership interest.', type: 'expo' },
        { date: '2026.04.16', tag: 'Research', title: 'RAG Knowledge Base: 12,000+ Fault Cases Added', desc: 'Bilingual retrieval support, response under 200ms.', type: 'data' },
        { date: '2026.03.30', tag: 'Safety', title: 'Proactive Defense Module Live: 94% AI Vision Accuracy', desc: 'Lightweight YOLOv9 runs locally on edge devices.', type: 'ai' },
      ],
    },
    helpBand: { title: 'How can we help?', tabs: ['Browse Topics', 'Live Chat', 'Contact', 'Diagnose', 'Order Status'] },
    footer: {
      copy: '© 2026 Smart Guard Project. All Rights Reserved.',
      demo: 'Demo Version',
      columns: [
        { title: 'Company', links: ['About Us', 'Technical Docs', 'Canton Fair', 'Join Us'] },
        { title: 'Shop', links: ['Fault Diagnosis', 'IoT Platform', 'Digital Twin', 'Proactive Defense'] },
        { title: 'Support', links: ['Technical Support', 'Knowledge Base', 'Training', 'Compliance Docs'] },
        { title: 'Resources', links: ['White Papers', 'Case Studies', 'Blog', 'API Docs'] },
        { title: 'Connect', links: ['contact@smartguard.ai', 'Tech Hotline', 'Business Dev', 'Media Inquiry'] },
      ],
      legal: ['Privacy', 'Terms', 'Security Filing'],
    },
  },
}

type LangType = 'zh_cn' | 'zh_tw' | 'en'

/* ================================================================
   Animation Hooks
================================================================ */
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

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
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
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay }}>
      {children}
    </motion.div>
  )
}

/* ================================================================
   HP Chevron Decoration — signature angular blue slash motif
================================================================ */
const ChevronDecoration = ({ side, height = 400 }: { side: 'left' | 'right'; height?: number }) => {
  const w = 48
  const skew = 20
  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none hidden lg:block"
      style={{
        [side]: -w - 8,
        width: w,
        top: '10%',
        bottom: '10%',
        height: '80%',
      }}
    >
      {/* Two parallel HP-blue slash marks */}
      {[0, 20].map((offset, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: offset,
            top: 0,
            bottom: 0,
            width: 18,
            backgroundColor: HP.colors.primary,
            transform: `skewX(-${skew}deg)`,
            borderRadius: 0,
          }}
        />
      ))}
    </div>
  )
}

/* ================================================================
   Hero Visual Backgrounds — clean, photo-ready minimal treatment
================================================================ */
const HeroBg = ({ visual }: { visual: 'iot' | 'ai' | 'expo' }) => {
  // HP uses {rounded.xl} photo frames, fog/cloud sections, no heavy glow
  if (visual === 'iot') return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #f7f7f7 0%, #e8e8e8 50%, #ffffff 100%)' }}>
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'linear-gradient(rgba(26,26,26,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.15) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <svg viewBox="0 0 1400 800" className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="xMidYMid slice">
        {[[320,160],[960,240],[280,440],[1020,490],[540,580],[760,200],[680,420],[900,350]].map(([x,y],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill={HP.colors.primary} opacity="0.7" />
            <circle cx={x} cy={y} r="18" fill="none" stroke={HP.colors.primary} strokeWidth="1" opacity="0.3" />
          </g>
        ))}
        {[[320,160,680,420],[960,240,680,420],[280,440,680,420],[1020,490,900,350],[540,580,680,420]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={HP.colors.primary} strokeWidth="0.8" strokeDasharray="6 6" opacity="0.2" />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
    </div>
  )
  if (visual === 'ai') return (
    <div className="absolute inset-0" style={{ background: '#f7f7f7' }}>
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(26,26,26,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <svg viewBox="0 0 1400 800" className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="xMidYMid slice">
        {[[160,180],[160,400],[160,620],[440,140],[440,360],[440,580],[720,250],[720,470],[1000,340]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={i>6?8:5} fill={i>6 ? HP.colors.primary : HP.colors.charcoal} opacity={i>6?0.8:0.4} />
        ))}
        {[[160,180,440,140],[160,400,440,360],[440,360,720,250],[720,250,1000,340],[720,470,1000,340]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={HP.colors.steel} strokeWidth="1" />
        ))}
        <circle cx="1000" cy="340" r="60" fill="none" stroke={HP.colors.primary} strokeWidth="1.5" opacity="0.4" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
    </div>
  )
  return (
    <div className="absolute inset-0" style={{ background: '#ffffff' }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(45deg, rgba(26,26,26,0.2) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <svg viewBox="0 0 1400 800" className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="xMidYMid slice">
        {[[980,700,55,260],[1050,700,48,220],[1110,700,65,290],[1200,700,52,180],[1280,700,44,250]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y-h} width={w} height={h} fill={HP.colors.charcoal} rx="1" opacity={0.5+i*0.05} />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/50 to-transparent" />
    </div>
  )
}

/* ================================================================
   News placeholder visuals — HP cloud-band treatment
================================================================ */
const NewsVisual = ({ type, className = '' }: { type: string; className?: string }) => {
  const cfgs: Record<string, { bg: string; el: React.ReactNode }> = {
    expo: {
      bg: HP.colors.cloud,
      el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-20"><rect x="50" y="70" width="60" height="110" rx="2" fill={HP.colors.ink}/><rect x="160" y="50" width="70" height="130" rx="2" fill={HP.colors.ink}/><rect x="280" y="80" width="60" height="100" rx="2" fill={HP.colors.ink}/><line x1="0" y1="195" x2="400" y2="195" stroke={HP.colors.ink} strokeWidth="2"/></svg>,
    },
    data: {
      bg: HP.colors.primarySoft,
      el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-30"><polyline points="20,190 80,120 140,145 200,80 260,120 320,70 380,100" fill="none" stroke={HP.colors.primary} strokeWidth="2.5"/>{[80,140,200,260,320].map((x,i)=><circle key={i} cx={x} cy={[120,145,80,120,70][i]} r="5" fill={HP.colors.primary}/>)}</svg>,
    },
    ai: {
      bg: HP.colors.fog,
      el: <svg viewBox="0 0 400 240" className="w-full h-full opacity-20"><circle cx="200" cy="120" r="60" fill="none" stroke={HP.colors.ink} strokeWidth="1.5"/><circle cx="200" cy="120" r="36" fill="none" stroke={HP.colors.ink} strokeWidth="1"/><circle cx="200" cy="120" r="15" fill={HP.colors.ink} opacity="0.2"/></svg>,
    },
  }
  const cfg = cfgs[type] || cfgs.expo
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`} style={{ backgroundColor: cfg.bg }}>
      {cfg.el}
    </div>
  )
}

/* ================================================================
   Stat Card — HP cloud-band treatment, no glow
================================================================ */
const StatCard = ({ icon, value, suffix, prefix, label }: { icon: React.ReactNode; value: number; suffix: string; prefix?: string; label: string }) => {
  const { val, ref } = useCountUp(value, 1.8)
  return (
    <motion.div ref={ref} variants={staggerItem}
      className="flex flex-col items-center gap-4 px-6 py-10 rounded-none"
      // HP: section bands are flat (no shadow), stats inside a dark ink slab
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
      <div className="text-[48px] font-[500] text-white leading-none tabular-nums tracking-tight">
        {prefix && <span className="text-[32px] mr-0.5 opacity-70">{prefix}</span>}
        {val.toLocaleString()}
        <span className="ml-1 text-[28px]" style={{ color: HP.colors.primaryBright }}>{suffix}</span>
      </div>
      <p className="text-white/60 text-[14px] font-[400] text-center leading-[1.5]">{label}</p>
    </motion.div>
  )
}

/* ================================================================
   Main Component
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
  const [helpTab, setHelpTab] = useState(0)
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const t = content[lang]

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 64)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { document.title = 'Smart Guard AI — Secure Connection' }, [])

  useEffect(() => {
    if (!document.getElementById('dify-bubble-style')) {
      const style = document.createElement('style')
      style.id = 'dify-bubble-style'
      style.textContent = '#dify-chatbot-bubble-button{background-color:#024ad8!important}'
      document.head.appendChild(style)
    }
    ;(window as any).difyChatbotConfig = {
      token: 'uYxYNUj5uBiqYwhE',
      baseUrl: window.location.origin + '/dify-beta',
    }
    if (!document.getElementById('uYxYNUj5uBiqYwhE')) {
      fetch(window.location.origin + '/dify-beta/embed.min.js')
        .then(r => r.text()).then(code => {
          const s = document.createElement('script')
          s.id = 'uYxYNUj5uBiqYwhE'
          s.textContent = code
          document.head.appendChild(s)
        }).catch(e => console.error('[Dify] embed load failed', e))
    }
  }, [])

  const startCarousel = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    if (slideTimer.current) clearInterval(slideTimer.current)
    setSlideProgress(0)
    const total = 6000; const tick = 50; let elapsed = 0
    progressTimer.current = setInterval(() => { elapsed += tick; setSlideProgress(Math.min(elapsed / total, 1)) }, tick)
    slideTimer.current = setTimeout(() => { setSlideDir(1); setSlide(s => (s + 1) % t.carousel.length) }, total) as any
  }, [t.carousel.length])

  useEffect(() => {
    startCarousel()
    return () => { if (slideTimer.current) clearTimeout(slideTimer.current as any); if (progressTimer.current) clearInterval(progressTimer.current) }
  }, [slide, startCarousel])

  const gotoSlide = (idx: number) => {
    if (slideTimer.current) clearTimeout(slideTimer.current as any)
    if (progressTimer.current) clearInterval(progressTimer.current)
    setSlideDir(idx > slide ? 1 : -1); setSlide(idx)
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
        <div className="fixed top-0 left-0 right-0 z-[300] text-sm font-medium px-4 py-2.5 text-center"
          style={{ backgroundColor: HP.colors.cloud, color: HP.colors.charcoal, borderBottom: `1px solid ${HP.colors.hairline}` }}>
          ⚠ 本页面内容由 AI 生成，仅供工业演示、教学交流与技术测试参考，不构成正式维保建议或商业交付。
        </div>
        <div className="pt-10"><Main params={params} /></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: HP.colors.canvas, color: HP.colors.ink }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Manrope', Arial, -apple-system, sans-serif; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ============================================================
          Utility Strip — HP: ink background, 36px height
      ============================================================ */}
      <div className="w-full flex items-center justify-end gap-6 px-8 text-[14px] font-[400]"
        style={{ backgroundColor: HP.colors.ink, color: HP.colors.onInk, height: 36 }}>
        {t.utilityStrip.slice(0, 2).map((item, i) => (
          <button key={i} className="transition-opacity hover:opacity-80">{item}</button>
        ))}
        <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <button className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
          <User size={13} />{t.utilityStrip[2]}
        </button>
        <button className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
          <ShoppingCart size={13} />{t.utilityStrip[3]}
        </button>
        {/* Demo badge */}
        <div className="flex items-center gap-1.5 ml-4 px-2.5 py-0.5 rounded-sm text-[11px] font-[700] tracking-wider uppercase"
          style={{ backgroundColor: HP.colors.bloomCoral, color: '#ffffff' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Demo
        </div>
      </div>

      {/* ============================================================
          Top Nav — HP: white canvas, 64px, hairline bottom border
      ============================================================ */}
      <motion.nav
        initial={{ y: -100 }} animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-[100] w-full"
        style={{
          backgroundColor: HP.colors.canvas,
          borderBottom: `1px solid ${HP.colors.hairline}`,
          boxShadow: scrolled ? HP.shadow.floatingModal : 'none',
          height: 64,
        }}
        onMouseLeave={() => { setActiveMenu(null); setLangMenuOpen(false) }}
      >
        <div className="max-w-[1366px] mx-auto px-8 flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div onClick={() => router.push('/')} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: HP.colors.primary }}>
              <ShieldCheck size={18} color="#ffffff" />
            </div>
            <span className="text-[18px] font-[700] tracking-tight" style={{ color: HP.colors.inkDeep }}>Smart Guard</span>
            <span className="text-[11px] font-[700] tracking-[0.3em] uppercase ml-1" style={{ color: HP.colors.primary }}>AI</span>
          </motion.div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center">
            {t.nav.map(item => (
              <div key={item.id} onMouseEnter={() => setActiveMenu(item.id)}
                className="relative px-4 py-2 cursor-pointer flex items-center h-[64px]">
                <span className="text-[16px] font-[400] transition-colors duration-200"
                  style={{ color: activeMenu === item.id ? HP.colors.primary : HP.colors.ink }}>
                  {item.label}
                </span>
                {/* HP: 2px primary underline for active nav */}
                {activeMenu === item.id && (
                  <motion.div layoutId="hp-nav-indicator"
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-none"
                    style={{ backgroundColor: HP.colors.primary }} />
                )}
              </div>
            ))}
          </div>

          {/* Right: search + lang + CTA */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 h-10 rounded-[4px] border text-[14px]"
              style={{ backgroundColor: HP.colors.canvas, borderColor: HP.colors.steel, color: HP.colors.graphite }}>
              <Search size={14} />
              <span>Search</span>
            </div>

            {/* Language */}
            <div className="relative">
              <button onMouseEnter={() => setLangMenuOpen(true)}
                className="flex items-center gap-1.5 text-[14px] font-[400] px-2 py-1.5 rounded transition-colors"
                style={{ color: HP.colors.graphite }}>
                <Globe size={14} />
                {t.common.langName}
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-1 w-36 py-1 rounded-[4px] border overflow-hidden z-50"
                    style={{ backgroundColor: HP.colors.canvas, borderColor: HP.colors.hairline, boxShadow: HP.shadow.floatingModal }}>
                    {(['zh_cn', 'zh_tw', 'en'] as LangType[]).map(l => (
                      <div key={l} onClick={() => { setLang(l); setLangMenuOpen(false); setBizTab(0) }}
                        className="px-4 py-2.5 text-[14px] cursor-pointer transition-colors"
                        style={{ color: lang === l ? HP.colors.primary : HP.colors.ink, backgroundColor: lang === l ? HP.colors.primarySoft : 'transparent' }}>
                        {content[l].common.langName}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary CTA — HP Electric Blue, rounded.md=4px, uppercase button-md */}
            <motion.button onClick={() => setIsChatting(true)}
              whileTap={{ scale: 0.97 }}
              className="text-[14px] font-[600] tracking-[0.7px] uppercase flex items-center gap-2 transition-colors"
              style={{ backgroundColor: HP.colors.primary, color: HP.colors.onInk, height: 44, padding: '0 24px', borderRadius: 4 }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = HP.colors.primaryDeep)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = HP.colors.primary)}
            >
              {t.common.start}
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>

        {/* Mega-menu dropdown — HP: white canvas, hairline bottom */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute left-0 w-full overflow-hidden"
              style={{ backgroundColor: HP.colors.canvas, borderBottom: `1px solid ${HP.colors.hairline}`, boxShadow: HP.shadow.floatingModal, top: 64 }}>
              <div className="max-w-[1366px] mx-auto px-8 py-8 grid grid-cols-4 gap-12">
                {t.nav.find(n => n.id === activeMenu)?.columns.map((col, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-[12px] font-[700] tracking-[0.2em] uppercase" style={{ color: HP.colors.graphite }}>
                      {col.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx} onClick={() => handleLinkClick(link)}
                          className="text-[16px] font-[400] flex items-center group cursor-pointer transition-colors"
                          style={{ color: HP.colors.ink }}
                          onMouseEnter={e => (e.currentTarget.style.color = HP.colors.primary)}
                          onMouseLeave={e => (e.currentTarget.style.color = HP.colors.ink)}>
                          {link}
                          <ChevronRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all duration-200" />
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
          Hero Carousel — HP: hero-promo-card, chevron-decoration flanking
          White canvas background, ink headlines, blue CTA pair
      ============================================================ */}
      <section className="relative w-full overflow-hidden" style={{ backgroundColor: HP.colors.canvas, minHeight: '90vh' }}>
        {/* Background visual */}
        <AnimatePresence initial={false} custom={slideDir}>
          <motion.div key={slide} custom={slideDir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '3%' : '-3%', opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? '-3%' : '3%', opacity: 0 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0">
            <HeroBg visual={t.carousel[slide].visual} />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 max-w-[1366px] mx-auto px-8 lg:px-14 flex items-center" style={{ minHeight: '90vh' }}>
          {/* Hero promo card — HP: white canvas, rounded.xl=16px, padding.xxl=32px */}
          <div className="relative w-full lg:w-auto lg:max-w-[600px]">
            {/* HP chevron decorations */}
            <ChevronDecoration side="left" />

            <div className="rounded-[16px] p-8 lg:p-10" style={{ backgroundColor: HP.colors.canvas, boxShadow: HP.shadow.softLift }}>
              <AnimatePresence mode="wait">
                <motion.div key={`hero-${slide}`}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}>
                  {/* Eyebrow with sale badge */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[14px] font-[500]" style={{ color: HP.colors.graphite }}>
                      {t.carousel[slide].eyebrow}
                    </span>
                    <span className="text-[14px] font-[700] px-2 py-0.5 rounded-[3px]"
                      style={{ backgroundColor: HP.colors.bloomCoral, color: '#ffffff' }}>
                      New
                    </span>
                  </div>

                  {/* Headline — HP: display-xxl, weight 500, line-height 1.0 */}
                  <h1 className="font-[500] leading-none mb-5 whitespace-pre-line tracking-[-0.01em]"
                    style={{ fontSize: 56, color: HP.colors.inkDeep }}>
                    {t.carousel[slide].title}
                  </h1>

                  {/* Body */}
                  <p className="text-[18px] font-[400] leading-[1.33] mb-8" style={{ color: HP.colors.charcoal, maxWidth: 420 }}>
                    {t.carousel[slide].sub}
                  </p>

                  {/* CTA Pair — HP: primary blue + outline-ink */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <motion.button onClick={() => setIsChatting(true)}
                      whileTap={{ scale: 0.97 }}
                      className="text-[14px] font-[600] tracking-[0.7px] uppercase transition-colors"
                      style={{ backgroundColor: HP.colors.primary, color: '#ffffff', height: 44, padding: '0 24px', borderRadius: 4 }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = HP.colors.primaryDeep)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = HP.colors.primary)}>
                      {t.common.shopNow}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="text-[14px] font-[600] tracking-[0.7px] uppercase border transition-colors"
                      style={{ backgroundColor: HP.colors.canvas, color: HP.colors.ink, borderColor: HP.colors.ink, height: 44, padding: '0 24px', borderRadius: 4 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = HP.colors.ink; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = HP.colors.canvas; (e.currentTarget as HTMLButtonElement).style.color = HP.colors.ink }}>
                      {t.common.compare}
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <ChevronDecoration side="right" />
          </div>
        </div>

        {/* Carousel Controls — bottom */}
        <div className="absolute bottom-8 left-8 lg:left-14 right-8 lg:right-14 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => gotoSlide((slide - 1 + t.carousel.length) % t.carousel.length)}
              className="w-9 h-9 flex items-center justify-center border rounded-[4px] transition-colors"
              style={{ borderColor: HP.colors.hairlineStrong, color: HP.colors.graphite }}>
              <ArrowLeft size={14} />
            </button>
            <button onClick={() => gotoSlide((slide + 1) % t.carousel.length)}
              className="w-9 h-9 flex items-center justify-center border rounded-[4px] transition-colors"
              style={{ borderColor: HP.colors.hairlineStrong, color: HP.colors.graphite }}>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {t.carousel.map((_, i) => (
              <button key={i} onClick={() => gotoSlide(i)}>
                {i === slide ? (
                  <div className="relative w-10 h-[3px] rounded-none overflow-hidden" style={{ backgroundColor: HP.colors.fog }}>
                    <div className="absolute inset-y-0 left-0 transition-all"
                      style={{ width: `${slideProgress * 100}%`, backgroundColor: HP.colors.primary }} />
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-none transition-colors"
                    style={{ backgroundColor: i < slide ? HP.colors.primary : HP.colors.steel }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* hairline at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ backgroundColor: HP.colors.hairline }} />
      </section>

      {/* ============================================================
          Product Categories — HP: cloud band, card-category-icon
      ============================================================ */}
      <section style={{ backgroundColor: HP.colors.cloud, padding: '80px 0' }}>
        <div className="max-w-[1366px] mx-auto px-8 lg:px-14">
          <StaggerGrid className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {t.categories.map((cat, i) => (
              <motion.div key={i} variants={staggerItem}>
                {/* card-category-icon: white canvas, rounded.lg=8px, padding.md=16px */}
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-[8px] cursor-pointer border transition-all duration-200"
                  style={{ backgroundColor: HP.colors.canvas, borderColor: HP.colors.hairline, boxShadow: HP.shadow.softLift }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = HP.colors.primary }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = HP.colors.hairline }}>
                  <div className="w-12 h-12 flex items-center justify-center" style={{ color: HP.colors.primary }}>
                    {React.cloneElement(cat.icon as React.ReactElement, { size: 24 })}
                  </div>
                  <span className="text-[16px] font-[500] text-center leading-[1.38]" style={{ color: HP.colors.ink }}>{cat.label}</span>
                </motion.div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          Feature Cards — HP: white canvas, card-product-feature layout
      ============================================================ */}
      <section style={{ backgroundColor: HP.colors.canvas, padding: '80px 0' }}>
        <div className="max-w-[1366px] mx-auto px-8 lg:px-14">
          <Reveal className="mb-12">
            <h2 className="font-[500] leading-none mb-4" style={{ fontSize: 44, color: HP.colors.inkDeep }}>
              {t.features.title}
            </h2>
            <div className="w-10 h-[2px]" style={{ backgroundColor: HP.colors.primary }} />
          </Reveal>

          <StaggerGrid className="grid md:grid-cols-3 gap-6">
            {t.features.list.map((f, i) => (
              <motion.div key={i} variants={staggerItem}>
                {/* card-product: white canvas, rounded.xl=16px, padding.xl=24px, Soft Lift */}
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}
                  className="p-6 rounded-[16px] border h-full flex flex-col"
                  style={{ backgroundColor: HP.colors.canvas, borderColor: HP.colors.hairline, boxShadow: HP.shadow.softLift }}>
                  <div className="w-12 h-12 rounded-[8px] flex items-center justify-center mb-6"
                    style={{ backgroundColor: HP.colors.primarySoft }}>
                    {React.cloneElement(f.icon as React.ReactElement, { size: 22, color: HP.colors.primary })}
                  </div>
                  <h3 className="text-[20px] font-[500] mb-3 leading-none" style={{ color: HP.colors.inkDeep }}>{f.t}</h3>
                  <p className="text-[16px] font-[400] leading-[1.38] flex-1" style={{ color: HP.colors.charcoal }}>{f.d}</p>
                  <div className="mt-5">
                    <button className="text-[16px] font-[500] transition-colors flex items-center gap-1"
                      style={{ color: HP.colors.primary }}
                      onMouseEnter={e => (e.currentTarget.style.color = HP.colors.primaryDeep)}
                      onMouseLeave={e => (e.currentTarget.style.color = HP.colors.primary)}>
                      {t.common.learnMore} <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          Stats Band — HP: ink dark slab
      ============================================================ */}
      <section style={{ backgroundColor: HP.colors.ink, padding: '64px 0' }}>
        <div className="max-w-[1366px] mx-auto px-8 lg:px-14">
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {t.stats.map((s, i) => (
              <StatCard key={i} icon={s.icon} value={s.value} suffix={s.suffix} prefix={s.prefix} label={s.label} />
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          Business Platform — HP: cloud band + category-tab sub-nav
      ============================================================ */}
      <section style={{ backgroundColor: HP.colors.cloud, padding: '80px 0' }}>
        <div className="max-w-[1366px] mx-auto px-8 lg:px-14">
          <Reveal className="mb-10">
            <p className="text-[12px] font-[700] tracking-[0.2em] uppercase mb-3" style={{ color: HP.colors.graphite }}>
              {t.business.label}
            </p>
          </Reveal>

          {/* Category tabs — HP: pill tabs, ink when active */}
          <div className="flex items-center gap-2 mb-10 flex-wrap">
            {t.business.tabs.map((tab, i) => (
              <button key={tab.id} onClick={() => setBizTab(i)}
                className="text-[16px] font-[500] transition-all rounded-full"
                style={{
                  padding: '8px 20px',
                  backgroundColor: bizTab === i ? HP.colors.ink : HP.colors.canvas,
                  color: bizTab === i ? HP.colors.onInk : HP.colors.ink,
                  border: `1px solid ${bizTab === i ? HP.colors.ink : HP.colors.hairlineStrong}`,
                }}>
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div key={`biz-${bizTab}`}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}>
              <p className="text-[18px] font-[400] leading-[1.33] mb-8" style={{ color: HP.colors.charcoal }}>
                {t.business.tabs[bizTab].sub}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {t.business.tabs[bizTab].cards.map((card, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="p-6 rounded-[16px] border flex flex-col items-start gap-4 cursor-pointer transition-all duration-200 group"
                    style={{ backgroundColor: HP.colors.canvas, borderColor: HP.colors.hairline, boxShadow: HP.shadow.softLift }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = HP.colors.primary }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = HP.colors.hairline }}>
                    <div className="w-10 h-10 rounded-[8px] flex items-center justify-center"
                      style={{ backgroundColor: HP.colors.primarySoft }}>
                      {React.cloneElement(card.icon as React.ReactElement, { size: 18, color: HP.colors.primary })}
                    </div>
                    <span className="text-[16px] font-[500] leading-[1.38]" style={{ color: HP.colors.inkDeep }}>{card.label}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: HP.colors.primary }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================================
          Customer Stories — HP: card-customer-story, ink slab heading
      ============================================================ */}
      <section style={{ backgroundColor: HP.colors.canvas, padding: '80px 0' }}>
        <div className="max-w-[1366px] mx-auto px-8 lg:px-14">
          {/* Section header on ink slab — HP: promo-strip-dark */}
          <Reveal className="mb-12">
            <div className="rounded-[16px] p-8 lg:p-12 mb-12" style={{ backgroundColor: HP.colors.ink }}>
              <p className="text-[12px] font-[700] tracking-[0.2em] uppercase mb-3" style={{ color: HP.colors.primaryBright }}>
                {t.testimonial.eyebrow}
              </p>
              <h2 className="font-[500] leading-none" style={{ fontSize: 44, color: HP.colors.onInk }}>
                {t.testimonial.title}
              </h2>
            </div>
          </Reveal>

          <StaggerGrid className="grid md:grid-cols-3 gap-6">
            {t.testimonial.items.map((item, i) => (
              <motion.div key={i} variants={staggerItem}>
                {/* card-customer-story: white canvas, rounded.xl=16px, padding.md=16px, Soft Lift */}
                <div className="rounded-[16px] overflow-hidden border" style={{ backgroundColor: HP.colors.canvas, borderColor: HP.colors.hairline, boxShadow: HP.shadow.softLift }}>
                  {/* 16:9 photo placeholder in rounded.xl frame */}
                  <div className="rounded-[16px] overflow-hidden m-4" style={{ aspectRatio: '16/9', backgroundColor: HP.colors.primarySoft }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Users size={32} style={{ color: HP.colors.primary, opacity: 0.4 }} />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <blockquote className="text-[16px] font-[400] leading-[1.38] mb-4 pt-2" style={{ color: HP.colors.charcoal }}>
                      "{item.quote}"
                    </blockquote>
                    <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: HP.colors.hairline }}>
                      <div className="w-8 h-8 rounded-[4px] flex items-center justify-center text-[12px] font-[700]"
                        style={{ backgroundColor: HP.colors.ink, color: '#ffffff' }}>
                        {item.name.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-[14px] font-[500] leading-none" style={{ color: HP.colors.inkDeep }}>{item.name}</p>
                        <p className="text-[12px] font-[400] leading-[1.33] mt-0.5" style={{ color: HP.colors.graphite }}>{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          ESG / About — HP: cloud band, left photo right copy
      ============================================================ */}
      <section style={{ backgroundColor: HP.colors.cloud, padding: '80px 0' }}>
        <div className="max-w-[1366px] mx-auto px-8 lg:px-14">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              {/* Photo frame — HP: rounded.xl=16px, no circular masks */}
              <div className="rounded-[16px] overflow-hidden border"
                style={{ height: 440, backgroundColor: HP.colors.fog, borderColor: HP.colors.hairline }}>
                {/* City / building visual placeholder */}
                <svg viewBox="0 0 600 440" className="w-full h-full" style={{ opacity: 0.25 }}>
                  <rect x="100" y="180" width="90" height="220" rx="2" fill={HP.colors.ink}/>
                  <rect x="220" y="120" width="120" height="280" rx="2" fill={HP.colors.ink}/>
                  <rect x="380" y="200" width="80" height="200" rx="2" fill={HP.colors.ink}/>
                  <rect x="0" y="400" width="600" height="40" fill={HP.colors.ink}/>
                  {/* HP blue accent — windows */}
                  {[130,150,170].map((x,i) => [220,260,300,340].map((y,j) => (
                    <rect key={`${i}-${j}`} x={x} y={y} width={20} height={14} rx="1" fill={HP.colors.primary} opacity={0.4}/>
                  )))}
                </svg>
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-[4px] text-[12px] font-[700] tracking-wider uppercase"
                  style={{ backgroundColor: HP.colors.canvas, color: HP.colors.primary }}>
                  ESG 2026
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-[12px] font-[700] tracking-[0.2em] uppercase mb-4" style={{ color: HP.colors.primary }}>
                {t.esg.eyebrow}
              </p>
              <h2 className="font-[500] leading-none mb-6 whitespace-pre-line" style={{ fontSize: 44, color: HP.colors.inkDeep }}>
                {t.esg.title}
              </h2>
              <p className="text-[18px] font-[400] leading-[1.33] mb-8" style={{ color: HP.colors.charcoal, maxWidth: 420 }}>
                {t.esg.sub}
              </p>
              <div className="flex items-center gap-3">
                <motion.button onClick={() => setIsChatting(true)}
                  whileTap={{ scale: 0.97 }}
                  className="text-[14px] font-[600] tracking-[0.7px] uppercase transition-colors"
                  style={{ backgroundColor: HP.colors.primary, color: '#ffffff', height: 44, padding: '0 24px', borderRadius: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = HP.colors.primaryDeep)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = HP.colors.primary)}>
                  {t.common.learnMore}
                </motion.button>
                <button className="text-[16px] font-[500] transition-colors flex items-center gap-1"
                  style={{ color: HP.colors.primary }}
                  onMouseEnter={e => (e.currentTarget.style.color = HP.colors.primaryDeep)}
                  onMouseLeave={e => (e.currentTarget.style.color = HP.colors.primary)}>
                  {t.common.more} <ArrowRight size={14} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          News — HP: white canvas, card-article-tile grid
      ============================================================ */}
      <section style={{ backgroundColor: HP.colors.canvas, padding: '80px 0' }}>
        {/* News header — ink-strip style */}
        <div style={{ backgroundColor: HP.colors.ink, padding: '40px 0', marginBottom: 48 }}>
          <div className="max-w-[1366px] mx-auto px-8 lg:px-14 flex items-center justify-between">
            <Reveal>
              <h2 className="font-[500] leading-none" style={{ fontSize: 32, color: HP.colors.onInk }}>{t.news.title}</h2>
            </Reveal>
            <button className="text-[16px] font-[500] flex items-center gap-2 transition-opacity hover:opacity-80"
              style={{ color: HP.colors.primaryBright }}>
              {t.news.viewAll} <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="max-w-[1366px] mx-auto px-8 lg:px-14">
          {/* Featured large card */}
          <Reveal className="mb-8">
            {/* card-product-feature: cloud bg, rounded.xl=16px, padding.xxl=32px, photo left, copy right */}
            <div className="rounded-[16px] overflow-hidden cursor-pointer group border"
              style={{ backgroundColor: HP.colors.cloud, borderColor: HP.colors.hairline }}>
              <div className="grid md:grid-cols-2">
                <div style={{ aspectRatio: '16/9' }}>
                  <NewsVisual type="data" className="w-full h-full" />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[12px] font-[700] tracking-wider uppercase px-2 py-1 rounded-[3px]"
                      style={{ backgroundColor: HP.colors.primary, color: '#ffffff' }}>
                      {t.news.featured.tag}
                    </span>
                    <span className="text-[14px] font-[400]" style={{ color: HP.colors.graphite }}>
                      <Calendar size={12} className="inline mr-1" />{t.news.featured.date}
                    </span>
                  </div>
                  <h3 className="font-[500] leading-[1.17] mb-4 transition-colors"
                    style={{ fontSize: 24, color: HP.colors.inkDeep }}
                    onMouseEnter={e => (e.currentTarget.style.color = HP.colors.primary)}
                    onMouseLeave={e => (e.currentTarget.style.color = HP.colors.inkDeep)}>
                    {t.news.featured.title}
                  </h3>
                  <p className="text-[16px] font-[400] leading-[1.38] mb-6" style={{ color: HP.colors.charcoal }}>
                    {t.news.featured.desc}
                  </p>
                  <button className="text-[16px] font-[500] flex items-center gap-1 transition-colors w-fit"
                    style={{ color: HP.colors.primary }}
                    onMouseEnter={e => (e.currentTarget.style.color = HP.colors.primaryDeep)}
                    onMouseLeave={e => (e.currentTarget.style.color = HP.colors.primary)}>
                    {t.common.more} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Four-up article grid */}
          <StaggerGrid className="grid md:grid-cols-4 gap-5">
            {t.news.grid.map((item, i) => (
              <motion.div key={i} variants={staggerItem}>
                {/* card-article-tile: white canvas, rounded.xl=16px, padding.md=16px, Soft Lift */}
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }}
                  className="rounded-[16px] overflow-hidden border cursor-pointer group"
                  style={{ backgroundColor: HP.colors.canvas, borderColor: HP.colors.hairline, boxShadow: HP.shadow.softLift }}>
                  <div style={{ aspectRatio: '16/9' }}>
                    <NewsVisual type={item.type} className="w-full h-full" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[12px] font-[400]" style={{ color: HP.colors.graphite }}>
                        <Calendar size={10} className="inline mr-1" />{item.date}
                      </span>
                      <span className="text-[12px] font-[400]" style={{ color: HP.colors.graphite }}>· {item.tag}</span>
                    </div>
                    <h4 className="text-[16px] font-[500] leading-[1.38] mb-2 line-clamp-2 transition-colors"
                      style={{ color: HP.colors.inkDeep }}
                      onMouseEnter={e => (e.currentTarget.style.color = HP.colors.primary)}
                      onMouseLeave={e => (e.currentTarget.style.color = HP.colors.inkDeep)}>
                      {item.title}
                    </h4>
                    <p className="text-[14px] font-[400] leading-[1.5] mb-3 line-clamp-2" style={{ color: HP.colors.charcoal }}>
                      {item.desc}
                    </p>
                    <button className="text-[16px] font-[500] flex items-center gap-1 transition-colors"
                      style={{ color: HP.colors.primary }}
                      onMouseEnter={e => (e.currentTarget.style.color = HP.colors.primaryDeep)}
                      onMouseLeave={e => (e.currentTarget.style.color = HP.colors.primary)}>
                      {t.common.more}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          Help Band — HP: help-band-dark, chip category tabs centered
      ============================================================ */}
      <section style={{ backgroundColor: HP.colors.ink, padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Low-opacity lifestyle photo suggestion */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 opacity-5"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${HP.colors.primaryBright}, transparent 70%)` }} />

        <div className="relative z-10 max-w-[1366px] mx-auto px-8 lg:px-14 text-center">
          <Reveal>
            <h2 className="font-[500] leading-none mb-10" style={{ fontSize: 44, color: HP.colors.onInk }}>
              {t.helpBand.title}
            </h2>
          </Reveal>

          {/* Chip category tabs */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {t.helpBand.tabs.map((tab, i) => (
              <button key={i} onClick={() => setHelpTab(i)}
                className="text-[16px] font-[500] transition-all rounded-full"
                style={{
                  padding: '8px 20px',
                  backgroundColor: helpTab === i ? '#ffffff' : 'rgba(255,255,255,0.08)',
                  color: helpTab === i ? HP.colors.ink : HP.colors.onInk,
                  border: `1px solid ${helpTab === i ? '#ffffff' : 'rgba(255,255,255,0.2)'}`,
                }}>
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-10">
            <motion.button onClick={() => setIsChatting(true)}
              whileTap={{ scale: 0.97 }}
              className="text-[14px] font-[600] tracking-[0.7px] uppercase transition-colors"
              style={{ backgroundColor: HP.colors.primary, color: '#ffffff', height: 44, padding: '0 24px', borderRadius: 4 }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = HP.colors.primaryBright)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = HP.colors.primary)}>
              {t.common.start} <ArrowRight size={14} className="inline ml-2" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ============================================================
          Footer — HP: footer-dark, 5-column link grid
      ============================================================ */}
      <footer style={{ backgroundColor: HP.colors.ink, color: HP.colors.onInk, padding: '64px 0 0' }}>
        <div className="max-w-[1366px] mx-auto px-8 lg:px-14">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: HP.colors.primary }}>
              <ShieldCheck size={18} color="#ffffff" />
            </div>
            <span className="text-[18px] font-[700]" style={{ color: '#ffffff' }}>SMART GUARD AI</span>
          </div>

          {/* 5-column link grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {t.footer.columns.map((col, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-[16px] font-[500] leading-[1.38]" style={{ color: '#ffffff' }}>{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <button className="text-[14px] font-[400] leading-[1.5] text-left transition-colors"
                        style={{ color: HP.colors.steel }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                        onMouseLeave={e => (e.currentTarget.style.color = HP.colors.steel)}>
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div className="py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-[12px] font-[400] leading-[1.33]" style={{ color: HP.colors.graphite }}>
                {t.footer.copy}
              </span>
              {t.footer.legal.map((link, i) => (
                <button key={i} className="text-[12px] font-[400] leading-[1.33] transition-colors"
                  style={{ color: HP.colors.graphite }}
                  onMouseEnter={e => (e.currentTarget.style.color = HP.colors.steel)}
                  onMouseLeave={e => (e.currentTarget.style.color = HP.colors.graphite)}>
                  {link}
                </button>
              ))}
              {lang === 'zh_cn' && (
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer"
                  className="text-[12px] font-[400] leading-[1.33] transition-colors"
                  style={{ color: HP.colors.graphite }}
                  onMouseEnter={e => (e.currentTarget.style.color = HP.colors.steel)}
                  onMouseLeave={e => (e.currentTarget.style.color = HP.colors.graphite)}>
                  粤ICP备2026055050号
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-[4px] text-[12px] font-[700] tracking-widest uppercase"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: HP.colors.primary }} />
              {t.footer.demo}
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="pb-8">
            <p className="text-[12px] font-[400] leading-[1.33]" style={{ color: HP.colors.graphite, maxWidth: 720 }}>
              本系统为 AI 与 IoT 技术演示版本，用于工业场景研究、教学展示及展会交流。页面中的部分文本、诊断建议由人工智能模型生成，仅供参考，不构成正式商业交付或维保依据。
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
