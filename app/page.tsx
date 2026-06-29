'use client'

import React, {
  useState, useEffect, useRef, useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  motion, AnimatePresence, useInView, animate,
} from 'framer-motion'
import {
  Globe, ChevronRight, Monitor, Cpu, ShieldCheck,
  FileText, Lock, ArrowRight, Calendar,
  Activity, Database, Zap, Users, Sparkles, ArrowUpRight,
  Layers, Radio, BarChart3, Gauge, BrainCircuit,
  Search, User, ChevronDown,
} from 'lucide-react'

import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

/* ================================================================
   IBM CARBON DESIGN SYSTEM TOKENS
   Source: ibm-DESIGN.md
================================================================ */
const C = {
  // Colors
  primary:         '#0f62fe',
  onPrimary:       '#ffffff',
  ink:             '#161616',
  inkMuted:        '#525252',
  inkSubtle:       '#8c8c8c',
  canvas:          '#ffffff',
  surface1:        '#f4f4f4',
  surface2:        '#e0e0e0',
  inverseCanvas:   '#161616',
  inverseSurface1: '#262626',
  inverseInk:      '#ffffff',
  inverseInkMuted: '#c6c6c6',
  hairline:        '#e0e0e0',
  hairlineStrong:  '#161616',
  blue60:          '#0043ce',
  blue80:          '#002d9c',
  blueHover:       '#0050e6',
  success:         '#24a148',
  warning:         '#f1c21b',
  error:           '#da1e28',
  // Spacing
  sp: { xxs:4, xs:8, sm:12, md:16, lg:24, xl:32, xxl:48, section:96 },
} as const

/* ================================================================
   Carbon Button — rounded.none (0px), weight 400, tracking 0.16px
================================================================ */
const BtnPrimary = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.98 }}
    className={`inline-flex items-center gap-2 text-[14px] font-[400] leading-[1.29] tracking-[0.16px] text-white transition-colors ${className}`}
    style={{ backgroundColor: C.primary, padding: '12px 16px', borderRadius: 0 }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.blueHover)}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.primary)}
  >
    {children}
  </motion.button>
)

const BtnSecondary = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.98 }}
    className={`inline-flex items-center gap-2 text-[14px] font-[400] leading-[1.29] tracking-[0.16px] text-white transition-colors ${className}`}
    style={{ backgroundColor: C.ink, padding: '12px 16px', borderRadius: 0 }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.inverseSurface1)}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.ink)}
  >
    {children}
  </motion.button>
)

const BtnTertiary = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.98 }}
    className={`inline-flex items-center gap-2 text-[14px] font-[400] leading-[1.29] tracking-[0.16px] transition-colors border ${className}`}
    style={{ backgroundColor: C.canvas, color: C.primary, borderColor: C.primary, padding: '12px 16px', borderRadius: 0 }}
    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.surface1 }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.canvas }}
  >
    {children}
  </motion.button>
)

const BtnGhost = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1 text-[14px] font-[400] leading-[1.29] tracking-[0.16px] transition-colors ${className}`}
    style={{ color: C.primary, padding: '12px 0', borderRadius: 0, backgroundColor: 'transparent' }}
    onMouseEnter={e => (e.currentTarget.style.color = C.blue60)}
    onMouseLeave={e => (e.currentTarget.style.color = C.primary)}
  >
    {children}
  </button>
)

/* ================================================================
   多语言内容
================================================================ */
const content = {
  zh_cn: {
    utilityBar: ['中国大陆', '联系我们', '支持中心'],
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
    hero: {
      eyebrow: 'Smart Guard AI · v2.0',
      title: '连接安全，智能守护\n每一次出行',
      sub: '整合 IoT 传感器与 Dify AI 引擎，提供实时电梯故障诊断与主动防御预警——从感知到决策，在毫秒内完成。',
    },
    logos: ['默纳克控制', '广州某地产集团', '深圳楼宇服务', '华南电梯代理', '广交会 2026', '物联科技'],
    features: {
      eyebrow: '核心能力',
      title: '重新定义电梯安全',
      list: [
        { icon: <Cpu />, t: '秒级响应', d: '基于 Dify 核心，故障码查询与解决方案生成仅在瞬息之间。支持自然语言与结构化双模检索。' },
        { icon: <Monitor />, t: '数字孪生', d: '实时同步电梯运行参数，在虚拟空间构建精准的设备状态镜像，实现全生命周期管理。' },
        { icon: <ShieldCheck />, t: '主动防御', d: '智能识别不安全乘梯行为，将事故隐患消灭在萌芽状态。AI 视觉识别准确率达 94%。' },
        { icon: <Database />, t: 'RAG 知识库', d: '12,000+ 故障案例收录，支持中英双语混合检索，响应时间 < 200ms。' },
      ],
    },
    stats: [
      { value: 98.7, suffix: '%', label: '故障识别准确率' },
      { value: 12000, suffix: '+', label: '知识库故障案例' },
      { value: 200, suffix: 'ms', label: '平均响应时间', prefix: '<' },
      { value: 1000, suffix: '+', label: '广交会现场访客' },
    ],
    platform: {
      eyebrow: '核心平台',
      title: '三层架构，全栈覆盖',
      tabs: [
        { id: 'iot', label: '连接设备与感知', desc: '构建城市垂直交通的神经网络', cards: [{ label: 'IoT 传感器接入', icon: <Radio /> }, { label: '数字孪生平台', icon: <Layers /> }, { label: '实时运行监控', icon: <BarChart3 /> }, { label: '边缘计算节点', icon: <Gauge /> }] },
        { id: 'ai',  label: '连接 AI 与决策', desc: '让每一行日志都产生价值', cards: [{ label: 'Dify 智能引擎', icon: <BrainCircuit /> }, { label: 'RAG 知识库', icon: <Database /> }, { label: '故障预测模型', icon: <Activity /> }, { label: '智能诊断报告', icon: <FileText /> }] },
        { id: 'safety', label: '连接人与安全', desc: '将风险消灭在萌芽状态', cards: [{ label: '行为识别系统', icon: <Monitor /> }, { label: '主动预警推送', icon: <Zap /> }, { label: '维保工单流程', icon: <FileText /> }, { label: '合规存档管理', icon: <Lock /> }] },
      ],
    },
    testimonial: {
      eyebrow: '客户案例',
      title: '来自现场的声音',
      items: [
        { quote: '故障响应时间从 4 小时降至 12 分钟，维保成本下降了 40%。', name: '张总监', role: '广州某商业地产集团 · 设施总监' },
        { quote: '接入 RAG 知识库后，现场工程师无需翻手册，扫码即得诊断建议。', name: '李工', role: '深圳楼宇智能化服务商 · 首席工程师' },
        { quote: '广交会看到演示后当场签约，IoT 数据可视化让客户一目了然。', name: '王总', role: '华南区电梯代理商 · 总经理' },
      ],
    },
    news: {
      eyebrow: '最新动态',
      title: '来自 Smart Guard',
      viewAll: '查看全部',
      items: [
        { date: '2026.05.15', tag: '技术发布', title: 'Smart Guard v2.0 正式发布：引入多模态故障感知引擎', desc: '全新版本整合视觉与振动传感器数据，故障识别准确率提升至 98.7%，已在广州、深圳多个商业楼宇完成先行部署。', type: 'data' },
        { date: '2026.05.08', tag: '行业合作', title: '与默纳克控制系统达成深度战略合作，共建电梯智能运维标准', desc: '双方将联合制定行业数据交换协议，推动城市垂直交通数字化转型。', type: 'expo' },
        { date: '2026.04.28', tag: '展会', title: '广交会专题：现场演示吸引逾千名参观者', desc: '多家物业企业现场表达合作意向，三日访客逾千名。', type: 'expo' },
        { date: '2026.04.16', tag: '研究', title: 'RAG 知识库更新：12,000+ 故障案例收录完成', desc: '支持中英双语混合检索，响应时间 < 200ms。', type: 'ai' },
      ],
    },
    cta: {
      title: '准备好开始了吗？',
      sub: '立即体验 Smart Guard AI，连接安全，预见未来。',
      primary: '立即体验',
      secondary: '联系我们',
    },
    newsletter: {
      label: '保持连接',
      placeholder: '输入您的电子邮箱',
      submit: '订阅',
    },
    footer: {
      copy: '© 2026 Smart Guard Project. 版权所有.',
      demo: '演示版本',
      columns: [
        { title: '公司', links: ['关于我们', '广交会专题', '技术文档', '加入我们'] },
        { title: '产品', links: ['故障诊断系统', 'IoT 监控平台', '数字孪生', '主动防御'] },
        { title: '支持', links: ['技术支持', '知识库', '培训中心', '合规文档'] },
        { title: '资源', links: ['行业白皮书', '案例研究', '博客动态', 'API 文档'] },
        { title: '联系', links: ['contact@smartguard.ai', '技术热线', '商务合作', '媒体资询'] },
      ],
      legal: ['隐私政策', '服务协议', '粤ICP备2026055050号'],
      disclaimer: '本系统为 AI 与 IoT 技术演示版本，用于工业场景研究、教学展示及展会交流。页面中的部分文本、诊断建议由人工智能模型生成，仅供参考，不构成正式商业交付或维保依据。',
    },
  },

  zh_tw: {
    utilityBar: ['台灣地區', '聯絡我們', '支援中心'],
    nav: [
      { id: 'intro', label: '關於', columns: [{ title: '項目概覽', links: ['智能守護者簡介', '技術演進', '廣交會專題'] }, { title: '互動實驗室', links: ['智能維修挑戰賽'] }, { title: '核心團隊', links: ['研發架構', '合作夥伴', '加入我們'] }] },
      { id: 'tech', label: '技術', columns: [{ title: '智能引擎', links: ['Dify AI 訓練', '故障預測模型', 'RAG 知識庫'] }, { title: 'IoT 接入', links: ['默納克系統協議', '傳感器融合', '數位化改造'] }] },
      { id: 'news', label: '動態', columns: [{ title: '最新消息', links: ['版本更新', '行業新聞', '展會回顧'] }] },
    ],
    common: { start: '立即體驗', langName: '繁體中文', more: '瞭解更多', learnMore: '瞭解詳情' },
    hero: { eyebrow: 'Smart Guard AI · v2.0', title: '連接安全，智能守護\n每一次出行', sub: '整合 IoT 傳感器與 Dify AI 引擎，提供實時電梯故障診斷與主動防禦預警——從感知到決策，在毫秒內完成。' },
    logos: ['默納克控制', '廣州某地產集團', '深圳樓宇服務', '華南電梯代理', '廣交會 2026', '物聯科技'],
    features: {
      eyebrow: '核心能力',
      title: '重新定義電梯安全',
      list: [
        { icon: <Cpu />, t: '秒級響應', d: '基於 Dify 核心，故障碼查詢與解決方案生成僅在瞬息之間。支持自然語言與結構化雙模檢索。' },
        { icon: <Monitor />, t: '數字孿生', d: '實時同步電梯運行參數，在虛擬空間構建精準的設備狀態鏡像，實現全生命週期管理。' },
        { icon: <ShieldCheck />, t: '主動防禦', d: '智能識別不安全乘梯行為，將事故隱患消滅在萌芽狀態。AI 視覺識別準確率達 94%。' },
        { icon: <Database />, t: 'RAG 知識庫', d: '12,000+ 故障案例收錄，支持中英雙語混合檢索，響應時間 < 200ms。' },
      ],
    },
    stats: [
      { value: 98.7, suffix: '%', label: '故障識別準確率' },
      { value: 12000, suffix: '+', label: '知識庫故障案例' },
      { value: 200, suffix: 'ms', label: '平均響應時間', prefix: '<' },
      { value: 1000, suffix: '+', label: '廣交會現場訪客' },
    ],
    platform: {
      eyebrow: '核心平台',
      title: '三層架構，全棧覆蓋',
      tabs: [
        { id: 'iot', label: '連接設備與感知', desc: '構建城市垂直交通的神經網絡', cards: [{ label: 'IoT 傳感器接入', icon: <Radio /> }, { label: '數字孿生平台', icon: <Layers /> }, { label: '實時運行監控', icon: <BarChart3 /> }, { label: '邊緣計算節點', icon: <Gauge /> }] },
        { id: 'ai',  label: '連接 AI 與決策', desc: '讓每一行日誌都產生價值', cards: [{ label: 'Dify 智能引擎', icon: <BrainCircuit /> }, { label: 'RAG 知識庫', icon: <Database /> }, { label: '故障預測模型', icon: <Activity /> }, { label: '智能診斷報告', icon: <FileText /> }] },
        { id: 'safety', label: '連接人與安全', desc: '將風險消滅在萌芽狀態', cards: [{ label: '行為識別系統', icon: <Monitor /> }, { label: '主動預警推送', icon: <Zap /> }, { label: '維保工單流程', icon: <FileText /> }, { label: '合規存檔管理', icon: <Lock /> }] },
      ],
    },
    testimonial: {
      eyebrow: '客戶案例',
      title: '來自現場的聲音',
      items: [
        { quote: '故障響應時間從 4 小時降至 12 分鐘，維保成本下降了 40%。', name: '張總監', role: '廣州某商業地產集團 · 設施總監' },
        { quote: '接入 RAG 知識庫後，現場工程師無需翻手冊，掃碼即得診斷建議。', name: '李工', role: '深圳樓宇智能化服務商 · 首席工程師' },
        { quote: '廣交會看到演示後當場簽約，IoT 數據可視化讓客戶一目了然。', name: '王總', role: '華南區電梯代理商 · 總經理' },
      ],
    },
    news: {
      eyebrow: '最新動態',
      title: '來自 Smart Guard',
      viewAll: '查看全部',
      items: [
        { date: '2026.05.15', tag: '技術發布', title: 'Smart Guard v2.0 正式發布：引入多模態故障感知引擎', desc: '全新版本整合視覺與振動傳感器數據，故障識別準確率提升至 98.7%。', type: 'data' },
        { date: '2026.05.08', tag: '行業合作', title: '與默納克控制系統達成深度戰略合作', desc: '雙方將聯合制定行業數據交換協議。', type: 'expo' },
        { date: '2026.04.28', tag: '展會', title: '廣交會：現場演示吸引逾千名參觀者', desc: '多家物業企業現場表達合作意向。', type: 'expo' },
        { date: '2026.04.16', tag: '研究', title: 'RAG 知識庫更新：12,000+ 故障案例收錄完成', desc: '支持中英雙語混合檢索，響應時間 < 200ms。', type: 'ai' },
      ],
    },
    cta: { title: '準備好開始了嗎？', sub: '立即體驗 Smart Guard AI，連接安全，預見未來。', primary: '立即體驗', secondary: '聯絡我們' },
    newsletter: { label: '保持連接', placeholder: '輸入您的電子郵箱', submit: '訂閱' },
    footer: {
      copy: '© 2026 Smart Guard Project. 版權所有.',
      demo: '演示版本',
      columns: [
        { title: '公司', links: ['關於我們', '廣交會專題', '技術文件', '加入我們'] },
        { title: '產品', links: ['故障診斷系統', 'IoT 監控平台', '數字孿生', '主動防禦'] },
        { title: '支援', links: ['技術支援', '知識庫', '培訓中心', '合規文件'] },
        { title: '資源', links: ['行業白皮書', '案例研究', '部落格', 'API 文件'] },
        { title: '聯絡', links: ['contact@smartguard.ai', '技術熱線', '商務合作', '媒體資訊'] },
      ],
      legal: ['隱私政策', '服務協議', '粵ICP備2026055050號'],
      disclaimer: '本系統為 AI 與 IoT 技術演示版本，用於工業場景研究、教學展示及展會交流。頁面中的部分文本、診斷建議由人工智能模型生成，僅供參考，不構成正式商業交付或維保依據。',
    },
  },

  en: {
    utilityBar: ['United States', 'Contact', 'Support'],
    nav: [
      { id: 'intro', label: 'About', columns: [{ title: 'Project', links: ['Introduction', 'Evolution', 'Canton Fair'] }, { title: 'Lab', links: ['Maintenance Challenge'] }, { title: 'Team', links: ['Architecture', 'Partners', 'Join Us'] }] },
      { id: 'tech',  label: 'Technology', columns: [{ title: 'AI engine', links: ['Dify AI training', 'Fault prediction', 'RAG knowledge base'] }, { title: 'IoT integration', links: ['Monarch protocol', 'Sensor fusion', 'Digital upgrade'] }] },
      { id: 'news',  label: 'News', columns: [{ title: 'Latest', links: ['Releases', 'Industry news', 'Expo recap'] }] },
    ],
    common: { start: 'Get started', langName: 'English', more: 'Learn more', learnMore: 'Learn more' },
    hero: { eyebrow: 'Smart Guard AI · v2.0', title: 'Secure connection. Intelligent\nguardianship for every journey.', sub: 'Integrated IoT sensors and Dify AI engine deliver real-time elevator fault diagnosis and proactive safety alerts — from sensing to decision in milliseconds.' },
    logos: ['Monarch Controls', 'GZ Real Estate Group', 'SZ Smart Buildings', 'South China Elevator', 'Canton Fair 2026', 'IoT Systems Co.'],
    features: {
      eyebrow: 'Core capabilities',
      title: 'Redefining elevator safety',
      list: [
        { icon: <Cpu />, t: 'Instant response', d: 'Fault queries and solutions generated in milliseconds via Dify. Supports both natural language and structured dual-mode retrieval.' },
        { icon: <Monitor />, t: 'Digital twin', d: 'Real-time sync of elevator parameters to build a precise virtual device state mirror for full lifecycle management.' },
        { icon: <ShieldCheck />, t: 'Proactive defense', d: 'AI identification of unsafe elevator behaviors eliminates risk before it escalates. AI vision accuracy reaches 94%.' },
        { icon: <Database />, t: 'RAG knowledge base', d: '12,000+ fault cases indexed with bilingual retrieval support and sub-200ms response time.' },
      ],
    },
    stats: [
      { value: 98.7, suffix: '%', label: 'Fault detection accuracy' },
      { value: 12000, suffix: '+', label: 'Knowledge base cases' },
      { value: 200, suffix: 'ms', label: 'Avg response time', prefix: '<' },
      { value: 1000, suffix: '+', label: 'Expo visitors' },
    ],
    platform: {
      eyebrow: 'Core platform',
      title: 'Three-layer architecture. Full-stack coverage.',
      tabs: [
        { id: 'iot', label: 'Connect devices & sensing', desc: 'Building the neural network of urban vertical transit', cards: [{ label: 'IoT sensor integration', icon: <Radio /> }, { label: 'Digital twin platform', icon: <Layers /> }, { label: 'Real-time monitoring', icon: <BarChart3 /> }, { label: 'Edge computing nodes', icon: <Gauge /> }] },
        { id: 'ai',  label: 'Connect AI & decision', desc: 'Making every log line count', cards: [{ label: 'Dify AI engine', icon: <BrainCircuit /> }, { label: 'RAG knowledge base', icon: <Database /> }, { label: 'Fault prediction model', icon: <Activity /> }, { label: 'Smart diagnostic reports', icon: <FileText /> }] },
        { id: 'safety', label: 'Connect people & safety', desc: 'Eliminating risk before it escalates', cards: [{ label: 'Behavior detection', icon: <Monitor /> }, { label: 'Proactive alert system', icon: <Zap /> }, { label: 'Maintenance workflow', icon: <FileText /> }, { label: 'Compliance archiving', icon: <Lock /> }] },
      ],
    },
    testimonial: {
      eyebrow: 'Customer stories',
      title: 'From the field',
      items: [
        { quote: 'Fault response time dropped from 4 hours to 12 minutes. Maintenance costs fell by 40%.', name: 'Director Zhang', role: 'GZ Commercial Real Estate · Facilities Director' },
        { quote: 'With the RAG knowledge base, engineers get diagnostic advice instantly by scanning a QR code — no more manuals.', name: 'Engineer Li', role: 'SZ Smart Building Services · Chief Engineer' },
        { quote: 'Signed the contract on the spot at Canton Fair. The IoT data visualization made everything crystal clear.', name: 'GM Wang', role: 'South China Elevator Distributor · General Manager' },
      ],
    },
    news: {
      eyebrow: 'Latest news',
      title: 'From Smart Guard',
      viewAll: 'View all',
      items: [
        { date: '2026.05.15', tag: 'Release', title: 'Smart Guard v2.0 launches with multi-modal fault detection engine', desc: 'New version integrates visual and vibration data, boosting fault detection to 98.7% across Guangzhou and Shenzhen deployments.', type: 'data' },
        { date: '2026.05.08', tag: 'Partnership', title: 'Strategic partnership with Monarch Control Systems to co-build elevator smart maintenance standards', desc: 'Joint data exchange protocol to drive digital transformation of urban vertical transportation.', type: 'expo' },
        { date: '2026.04.28', tag: 'Expo', title: 'Canton Fair: live demo draws 1,000+ visitors', desc: 'Multiple property firms expressed partnership interest over three days.', type: 'expo' },
        { date: '2026.04.16', tag: 'Research', title: 'RAG knowledge base update: 12,000+ fault cases indexed', desc: 'Bilingual retrieval support, response under 200ms.', type: 'ai' },
      ],
    },
    cta: { title: 'Ready to get started?', sub: 'Experience Smart Guard AI — connect safety, foresee the future.', primary: 'Get started', secondary: 'Contact us' },
    newsletter: { label: 'Stay connected', placeholder: 'Enter your email address', submit: 'Subscribe' },
    footer: {
      copy: '© 2026 Smart Guard Project. All rights reserved.',
      demo: 'Demo version',
      columns: [
        { title: 'Company', links: ['About us', 'Canton Fair', 'Technical docs', 'Join us'] },
        { title: 'Products', links: ['Fault diagnosis', 'IoT platform', 'Digital twin', 'Proactive defense'] },
        { title: 'Support', links: ['Technical support', 'Knowledge base', 'Training', 'Compliance docs'] },
        { title: 'Resources', links: ['White papers', 'Case studies', 'Blog', 'API docs'] },
        { title: 'Connect', links: ['contact@smartguard.ai', 'Tech hotline', 'Business dev', 'Media inquiry'] },
      ],
      legal: ['Privacy', 'Terms of use', 'Security filing'],
      disclaimer: 'This system is an AI and IoT technology demonstration for industrial research, educational display, and exhibition. Some text and diagnostic suggestions are AI-generated and for reference only. This does not constitute a formal commercial delivery or maintenance basis.',
    },
  },
}

type LangType = 'zh_cn' | 'zh_tw' | 'en'

/* ================================================================
   Animation helpers
================================================================ */
function useCountUp(target: number, duration = 2.0) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  useEffect(() => {
    if (!inView) return
    const ctl = animate(0, target, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: v => setVal(target % 1 !== 0 ? +v.toFixed(1) : Math.round(v)),
    })
    return ctl.stop
  }, [inView, target, duration])
  return { val, ref }
}

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay }}>
      {children}
    </motion.div>
  )
}

const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } } }
const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const StaggerGrid = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

/* ================================================================
   Stat counter
================================================================ */
const StatBlock = ({ value, suffix, prefix, label }: { value: number; suffix: string; prefix?: string; label: string }) => {
  const { val, ref } = useCountUp(value, 1.8)
  return (
    <div ref={ref} className="flex flex-col gap-2 py-10 px-8 border-l" style={{ borderColor: C.hairline }}>
      <div className="text-[60px] font-[300] leading-[1.17] tracking-[-0.4px]" style={{ color: C.ink }}>
        {prefix && <span className="text-[42px] mr-0.5" style={{ color: C.inkMuted }}>{prefix}</span>}
        {val.toLocaleString()}
        <span className="text-[32px] ml-1" style={{ color: C.primary }}>{suffix}</span>
      </div>
      <p className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px]" style={{ color: C.inkMuted }}>{label}</p>
    </div>
  )
}

/* ================================================================
   Hero illustration — abstract geometric mesh, IBM-style
================================================================ */
const HeroIllustration = ({ visual }: { visual: 'iot' | 'ai' | 'expo' }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Soft blue-to-white wash — IBM's documented soft gradient backdrop */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #f4f4f4 50%, #ffffff 100%)', opacity: 0.6 }} />
    {/* Abstract geometric mesh */}
    <svg viewBox="0 0 800 600" className="absolute right-0 top-0 w-1/2 h-full opacity-[0.12]" preserveAspectRatio="xMidYMid slice">
      {/* Dotted grid pattern */}
      {Array.from({ length: 12 }).map((_, row) =>
        Array.from({ length: 16 }).map((_, col) => (
          <circle key={`${row}-${col}`} cx={col * 52 + 4} cy={row * 52 + 4} r="2" fill={C.primary} />
        ))
      )}
      {/* Geometric accent lines */}
      <line x1="0" y1="0" x2="800" y2="600" stroke={C.primary} strokeWidth="0.5" />
      <line x1="400" y1="0" x2="400" y2="600" stroke={C.primary} strokeWidth="0.5" />
      <line x1="0" y1="300" x2="800" y2="300" stroke={C.primary} strokeWidth="0.5" />
      <rect x="150" y="100" width="500" height="400" fill="none" stroke={C.primary} strokeWidth="0.8" />
      <rect x="250" y="150" width="300" height="300" fill="none" stroke={C.primary} strokeWidth="0.5" />
    </svg>
    {/* IBM primary blue accent square — top-right corner motif */}
    <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: C.primary, opacity: 0.15 }} />
  </div>
)

/* ================================================================
   Main Component
================================================================ */
const App: React.FC<IMainProps> = ({ params }: any) => {
  const router = useRouter()
  const [lang, setLang] = useState<LangType>('zh_cn')
  const [isChatting, setIsChatting] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [platformTab, setPlatformTab] = useState(0)
  const [email, setEmail] = useState('')

  const t = content[lang]

  useEffect(() => {
    document.title = 'Smart Guard AI — 连接安全，预见未来'
  }, [])

  useEffect(() => {
    if (!document.getElementById('dify-bubble-style')) {
      const style = document.createElement('style')
      style.id = 'dify-bubble-style'
      style.textContent = `#dify-chatbot-bubble-button { background-color: ${C.primary} !important; border-radius: 0 !important; }`
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

  const handleLinkClick = (linkName: string) => {
    if (['智能维修挑战赛', '智能維修挑戰賽', 'Maintenance Challenge'].includes(linkName)) {
      window.open('https://e4f6fc57-b90c-4aea-9156-248092f8900a.dev.coze.site/', '_blank')
    } else if (['智能守护者简介', '智能守護者簡介', 'Introduction'].includes(linkName)) {
      router.push('/about')
    }
  }

  if (isChatting) {
    return (
      <div>
        <div className="fixed top-0 left-0 right-0 z-[300] flex items-center justify-center px-4 text-[14px] font-[400] tracking-[0.16px]"
          style={{ backgroundColor: C.warning, color: C.ink, height: 32 }}>
          ⚠ 本页面内容由 AI 生成，仅供工业演示参考，不构成正式维保建议或商业交付。
        </div>
        <div className="pt-8"><Main params={params} /></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.canvas, color: C.ink, fontFamily: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ============================================================
          Utility bar — surface-1 (#f4f4f4), 32px, caption 12px
      ============================================================ */}
      <div className="w-full flex items-center justify-between px-8"
        style={{ backgroundColor: C.surface1, color: C.inkMuted, height: 32, fontSize: 12, fontWeight: 400, lineHeight: '1.33', letterSpacing: '0.32px' }}>
        <div className="flex items-center gap-6">
          {t.utilityBar.map((item, i) => (
            <button key={i} className="transition-colors" style={{ color: C.inkMuted }}
              onMouseEnter={e => (e.currentTarget.style.color = C.ink)}
              onMouseLeave={e => (e.currentTarget.style.color = C.inkMuted)}>
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5"
          style={{ backgroundColor: C.error + '18', color: C.error, fontSize: 11, fontWeight: 600, letterSpacing: '0.16px' }}>
          Demo version
        </div>
      </div>

      {/* ============================================================
          Top nav — canvas, 48px, body-sm 14px, 1px hairline bottom
      ============================================================ */}
      <nav className="sticky top-0 z-[100] w-full" style={{ backgroundColor: C.canvas, borderBottom: `1px solid ${C.hairline}`, height: 48 }}
        onMouseLeave={() => { setActiveMenu(null); setLangMenuOpen(false) }}>
        <div className="max-w-[1584px] mx-auto px-8 flex items-center justify-between h-full">

          {/* Logo */}
          <button onClick={() => router.push('/')} className="flex items-center gap-3 h-full">
            {/* IBM-style square logo mark — flat 0px radius */}
            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: C.primary }}>
              <ShieldCheck size={16} color="#ffffff" />
            </div>
            <span className="text-[14px] font-[600] leading-[1.29] tracking-[0.16px]" style={{ color: C.ink }}>
              Smart Guard AI
            </span>
          </button>

          {/* Nav links */}
          <div className="hidden lg:flex items-center h-full">
            {t.nav.map(item => (
              <div key={item.id} onMouseEnter={() => setActiveMenu(item.id)}
                className="relative flex items-center h-full px-5 cursor-pointer">
                <span className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] transition-colors"
                  style={{ color: activeMenu === item.id ? C.primary : C.ink }}>
                  {item.label}
                </span>
                {/* Carbon: 2px primary underline for selected nav */}
                {activeMenu === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: C.primary }} />
                )}
              </div>
            ))}
          </div>

          {/* Right: search + lang + sign-in */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button className="w-10 h-10 flex items-center justify-center transition-colors"
              style={{ color: C.inkMuted }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surface1)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <Search size={16} />
            </button>

            {/* Language */}
            <div className="relative">
              <button onMouseEnter={() => setLangMenuOpen(true)}
                className="flex items-center gap-1 h-10 px-3 text-[14px] font-[400] leading-[1.29] tracking-[0.16px] transition-colors"
                style={{ color: C.inkMuted }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.surface1; setLangMenuOpen(true) }}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <Globe size={14} />
                {t.common.langName}
                <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-50 w-40 border py-1"
                    style={{ top: 48, backgroundColor: C.canvas, borderColor: C.hairline }}>
                    {(['zh_cn', 'zh_tw', 'en'] as LangType[]).map(l => (
                      <button key={l} onClick={() => { setLang(l); setLangMenuOpen(false); setPlatformTab(0) }}
                        className="w-full text-left px-4 py-2.5 text-[14px] font-[400] leading-[1.29] tracking-[0.16px] transition-colors"
                        style={{ color: lang === l ? C.primary : C.ink, backgroundColor: lang === l ? C.surface1 : 'transparent' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surface1)}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = lang === l ? C.surface1 : 'transparent')}>
                        {content[l].common.langName}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign in */}
            <button className="flex items-center gap-1.5 h-10 px-3 text-[14px] font-[400] leading-[1.29] tracking-[0.16px] transition-colors"
              style={{ color: C.inkMuted }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.surface1 }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}>
              <User size={14} />
              Sign in
            </button>

            {/* Primary CTA — button-primary: blue, 0px radius, 12px/16px padding */}
            <BtnPrimary onClick={() => setIsChatting(true)} className="ml-2">
              {t.common.start} <ArrowRight size={14} />
            </BtnPrimary>
          </div>
        </div>

        {/* Mega-menu dropdown — canvas, hairline border, 0px radius */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute left-0 w-full overflow-hidden"
              style={{ top: 48, backgroundColor: C.canvas, borderBottom: `1px solid ${C.hairline}` }}>
              <div className="max-w-[1584px] mx-auto px-8 py-8 grid grid-cols-4 gap-10">
                {t.nav.find(n => n.id === activeMenu)?.columns.map((col, idx) => (
                  <div key={idx}>
                    {/* Carbon: sentence case 14px eyebrow */}
                    <h4 className="text-[14px] font-[600] leading-[1.29] tracking-[0.16px] mb-4" style={{ color: C.ink }}>
                      {col.title}
                    </h4>
                    <ul className="space-y-3">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx}>
                          <button onClick={() => handleLinkClick(link)}
                            className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] flex items-center gap-1 transition-colors text-left"
                            style={{ color: C.inkMuted }}
                            onMouseEnter={e => (e.currentTarget.style.color = C.primary)}
                            onMouseLeave={e => (e.currentTarget.style.color = C.inkMuted)}>
                            {link}
                            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100" />
                          </button>
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
          Hero — hero-card: canvas, 0px radius, padding 48px
          display-xl: 76px weight 300, soft blue gradient behind illustration
      ============================================================ */}
      <section className="relative w-full" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <HeroIllustration visual="iot" />
        <div className="relative z-10 max-w-[1584px] mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            {/* Eyebrow — Carbon: sentence case 14px, NOT all-caps */}
            <p className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] mb-6" style={{ color: C.inkMuted }}>
              {t.hero.eyebrow}
            </p>
            {/* display-xl: 76px weight 300 letterSpacing -0.5px — IBM's signature light headline */}
            <h1 className="font-[300] leading-[1.17] mb-8 whitespace-pre-line"
              style={{ fontSize: 'clamp(42px, 5vw, 76px)', letterSpacing: '-0.5px', color: C.ink }}>
              {t.hero.title}
            </h1>
            {/* body-lg: 18px weight 400 lineHeight 1.50 */}
            <p className="text-[18px] font-[400] leading-[1.50] mb-10" style={{ color: C.inkMuted, maxWidth: 520 }}>
              {t.hero.sub}
            </p>
            {/* CTA pair */}
            <div className="flex items-center gap-0 flex-wrap">
              <BtnPrimary onClick={() => setIsChatting(true)}>
                {t.common.start} <ArrowRight size={14} />
              </BtnPrimary>
              <BtnTertiary onClick={() => setIsChatting(true)} className="border-l-0">
                {t.common.learnMore}
              </BtnTertiary>
            </div>
          </div>

          {/* Right: abstract product visual — flat image frame, 0px radius */}
          <div className="hidden lg:block">
            <div className="w-full border" style={{ aspectRatio: '4/3', backgroundColor: C.surface1, borderColor: C.hairline }}>
              <svg viewBox="0 0 640 480" className="w-full h-full">
                {/* Abstract IBM-style product illustration — geometric mesh + nodes */}
                <rect x="0" y="0" width="640" height="480" fill={C.surface1} />
                {/* Grid lines */}
                {[80,160,240,320,400,480,560].map(x => (
                  <line key={x} x1={x} y1="0" x2={x} y2="480" stroke={C.hairline} strokeWidth="1" />
                ))}
                {[60,120,180,240,300,360,420].map(y => (
                  <line key={y} x1="0" y1={y} x2="640" y2={y} stroke={C.hairline} strokeWidth="1" />
                ))}
                {/* Node constellation */}
                {[[160,120],[320,80],[480,160],[400,300],[240,280],[120,340],[560,260]].map(([x,y],i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="8" fill={C.primary} opacity="0.9" />
                    <circle cx={x} cy={y} r="20" fill="none" stroke={C.primary} strokeWidth="1" opacity="0.3" />
                  </g>
                ))}
                {/* Connector lines */}
                {[[160,120,320,80],[320,80,480,160],[480,160,400,300],[400,300,240,280],[240,280,120,340],[320,80,400,300]].map(([x1,y1,x2,y2],i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.primary} strokeWidth="1" opacity="0.2" />
                ))}
                {/* IBM Blue accent bar — left edge */}
                <rect x="0" y="0" width="4" height="480" fill={C.primary} />
                {/* Labels */}
                <text x="24" y="472" fontSize="12" fill={C.inkSubtle} fontFamily="IBM Plex Sans, Arial">
                  Smart Guard AI · IoT Network Visualization
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom 1px hairline */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ backgroundColor: C.hairline }} />
      </section>

      {/* ============================================================
          Customer logo marquee — customer-logo-tile
          canvas background, 1px hairline borders, caption 12px
      ============================================================ */}
      <section style={{ backgroundColor: C.canvas, borderBottom: `1px solid ${C.hairline}` }}>
        <div className="max-w-[1584px] mx-auto px-8 py-10">
          <p className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] mb-6" style={{ color: C.inkMuted }}>
            Trusted by
          </p>
          <div className="flex items-center border-t border-l" style={{ borderColor: C.hairline }}>
            {t.logos.map((logo, i) => (
              <div key={i} className="flex items-center justify-center border-r border-b flex-1 min-w-[120px]"
                style={{ borderColor: C.hairline, padding: '24px 16px', height: 72 }}>
                <span className="text-[12px] font-[400] leading-[1.33] tracking-[0.32px] text-center"
                  style={{ color: C.inkSubtle }}>
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Feature cards — surface-1 band, feature-card: 0px radius, 1px hairline, 24px padding
      ============================================================ */}
      <section style={{ backgroundColor: C.surface1, padding: '96px 0' }}>
        <div className="max-w-[1584px] mx-auto px-8">
          <Reveal className="mb-12">
            {/* Eyebrow — sentence case 14px */}
            <p className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] mb-4" style={{ color: C.inkMuted }}>
              {t.features.eyebrow}
            </p>
            {/* display-md: 42px weight 300 lineHeight 1.20 */}
            <h2 className="font-[300] leading-[1.20]" style={{ fontSize: 42, color: C.ink }}>
              {t.features.title}
            </h2>
          </Reveal>

          <StaggerGrid className="grid md:grid-cols-4 border-t border-l" style={{ borderColor: C.hairline } as any}>
            {t.features.list.map((f, i) => (
              <motion.div key={i} variants={staggerItem}
                className="border-r border-b group cursor-pointer"
                style={{ borderColor: C.hairline, padding: 24, backgroundColor: C.canvas }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surface1)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.canvas)}>
                {/* Icon — flat, IBM blue */}
                <div className="mb-8 w-10 h-10 flex items-center justify-center"
                  style={{ color: C.primary }}>
                  {React.cloneElement(f.icon as React.ReactElement, { size: 24 })}
                </div>
                {/* card-title: 24px weight 400 */}
                <h3 className="text-[24px] font-[400] leading-[1.33] mb-4" style={{ color: C.ink }}>
                  {f.t}
                </h3>
                {/* body: 16px weight 400 tracking 0.16px */}
                <p className="text-[16px] font-[400] leading-[1.50] tracking-[0.16px] mb-6" style={{ color: C.inkMuted }}>
                  {f.d}
                </p>
                <BtnGhost>
                  {t.common.more} <ArrowRight size={14} />
                </BtnGhost>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          Stats — canvas band, display-lg numbers, left hairline borders
      ============================================================ */}
      <section style={{ backgroundColor: C.canvas, borderTop: `1px solid ${C.hairline}`, borderBottom: `1px solid ${C.hairline}` }}>
        <div className="max-w-[1584px] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {t.stats.map((s, i) => (
              <StatBlock key={i} value={s.value} suffix={s.suffix} prefix={s.prefix} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Platform tabs — surface-1, product-tab / product-tab-selected
          0px radius, 2px primary underline when selected
      ============================================================ */}
      <section style={{ backgroundColor: C.surface1, padding: '96px 0' }}>
        <div className="max-w-[1584px] mx-auto px-8">
          <Reveal className="mb-10">
            <p className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] mb-4" style={{ color: C.inkMuted }}>
              {t.platform.eyebrow}
            </p>
            <h2 className="font-[300] leading-[1.20]" style={{ fontSize: 42, color: C.ink }}>
              {t.platform.title}
            </h2>
          </Reveal>

          {/* product-tab strip — bottom hairline, selected gets 2px primary */}
          <div className="flex items-stretch border-b" style={{ borderColor: C.hairline }}>
            {t.platform.tabs.map((tab, i) => (
              <button key={tab.id} onClick={() => setPlatformTab(i)}
                className="relative flex-1 text-left transition-colors"
                style={{
                  padding: '16px 20px',
                  backgroundColor: C.canvas,
                  color: platformTab === i ? C.ink : C.inkMuted,
                  fontSize: 14,
                  fontWeight: platformTab === i ? 600 : 400,
                  lineHeight: '1.29',
                  letterSpacing: '0.16px',
                  borderRadius: 0,
                  borderRight: `1px solid ${C.hairline}`,
                }}>
                {tab.label}
                {/* 2px primary underline for selected tab — Carbon signature */}
                {platformTab === i && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: C.primary }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab content — product-card style: canvas, 0px radius, 32px padding */}
          <AnimatePresence mode="wait">
            <motion.div key={`tab-${platformTab}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <p className="text-[16px] font-[400] leading-[1.50] tracking-[0.16px] my-8" style={{ color: C.inkMuted }}>
                {t.platform.tabs[platformTab].desc}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l" style={{ borderColor: C.hairline }}>
                {t.platform.tabs[platformTab].cards.map((card, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-r border-b group cursor-pointer transition-colors"
                    style={{ borderColor: C.hairline, padding: 32, backgroundColor: C.canvas }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surface1)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.canvas)}>
                    <div className="mb-6 w-10 h-10 flex items-center justify-center" style={{ color: C.primary }}>
                      {React.cloneElement(card.icon as React.ReactElement, { size: 22 })}
                    </div>
                    <p className="text-[20px] font-[400] leading-[1.40] mb-4" style={{ color: C.ink }}>{card.label}</p>
                    <BtnGhost>{t.common.more} <ArrowRight size={12} /></BtnGhost>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================================
          Customer stories — canvas band, resource-tile layout
          Flat image frames, no rounded corners
      ============================================================ */}
      <section style={{ backgroundColor: C.canvas, padding: '96px 0', borderTop: `1px solid ${C.hairline}` }}>
        <div className="max-w-[1584px] mx-auto px-8">
          <Reveal className="mb-12">
            <p className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] mb-4" style={{ color: C.inkMuted }}>
              {t.testimonial.eyebrow}
            </p>
            <h2 className="font-[300] leading-[1.20]" style={{ fontSize: 42, color: C.ink }}>
              {t.testimonial.title}
            </h2>
          </Reveal>

          <StaggerGrid className="grid md:grid-cols-3 border-t border-l" style={{ borderColor: C.hairline } as any}>
            {t.testimonial.items.map((item, i) => (
              <motion.div key={i} variants={staggerItem}
                className="border-r border-b" style={{ borderColor: C.hairline }}>
                {/* Flat image frame — no rounded corners */}
                <div className="w-full border-b" style={{ aspectRatio: '16/9', backgroundColor: C.surface1, borderColor: C.hairline }}>
                  <svg viewBox="0 0 400 225" className="w-full h-full opacity-30">
                    <rect x="0" y="0" width="400" height="225" fill={C.surface1} />
                    {[50,100,150,200,250,300,350].map(x => (
                      <line key={x} x1={x} y1="0" x2={x} y2="225" stroke={C.hairline} strokeWidth="1" />
                    ))}
                    <circle cx="200" cy="112" r="40" fill="none" stroke={C.primary} strokeWidth="1" />
                    <circle cx="200" cy="112" r="4" fill={C.primary} />
                    <rect x="0" y="0" width="4" height="225" fill={C.primary} />
                  </svg>
                </div>
                <div style={{ padding: 24 }}>
                  {/* Quote — body: 16px weight 400 */}
                  <blockquote className="text-[16px] font-[400] leading-[1.50] tracking-[0.16px] mb-6 border-l-2 pl-4"
                    style={{ color: C.ink, borderColor: C.primary }}>
                    "{item.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    {/* Flat square avatar — 0px radius */}
                    <div className="w-8 h-8 flex items-center justify-center text-[12px] font-[600]"
                      style={{ backgroundColor: C.ink, color: '#ffffff' }}>
                      {item.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-[14px] font-[600] leading-[1.29] tracking-[0.16px]" style={{ color: C.ink }}>{item.name}</p>
                      <p className="text-[12px] font-[400] leading-[1.33] tracking-[0.32px]" style={{ color: C.inkSubtle }}>{item.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          News / resources — surface-1 band, resource-tile layout
      ============================================================ */}
      <section style={{ backgroundColor: C.surface1, padding: '96px 0', borderTop: `1px solid ${C.hairline}` }}>
        <div className="max-w-[1584px] mx-auto px-8">
          <Reveal className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] mb-4" style={{ color: C.inkMuted }}>
                {t.news.eyebrow}
              </p>
              <h2 className="font-[300] leading-[1.20]" style={{ fontSize: 42, color: C.ink }}>
                {t.news.title}
              </h2>
            </div>
            <BtnGhost>
              {t.news.viewAll} <ArrowRight size={14} />
            </BtnGhost>
          </Reveal>

          <StaggerGrid className="grid md:grid-cols-4 border-t border-l" style={{ borderColor: C.hairline } as any}>
            {t.news.items.map((item, i) => (
              <motion.div key={i} variants={staggerItem}
                className="border-r border-b group cursor-pointer transition-colors"
                style={{ borderColor: C.hairline, backgroundColor: C.canvas }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surface1)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.canvas)}>
                {/* Flat image frame */}
                <div className="w-full border-b" style={{ aspectRatio: '16/9', backgroundColor: C.surface1, borderColor: C.hairline }}>
                  <svg viewBox="0 0 320 180" className="w-full h-full opacity-25">
                    <rect x="0" y="0" width="320" height="180" fill={C.surface1} />
                    {item.type === 'data' && <polyline points="20,140 70,90 120,110 170,60 220,90 270,50 310,70" fill="none" stroke={C.primary} strokeWidth="2"/>}
                    {item.type === 'expo' && [80,140,200].map((x,j) => <rect key={j} x={x} y={60+j*10} width={40} height={120-j*10} fill={C.inkSubtle} opacity="0.4"/>)}
                    {item.type === 'ai' && <><circle cx="160" cy="90" r="50" fill="none" stroke={C.primary} strokeWidth="1.5"/><circle cx="160" cy="90" r="20" fill="none" stroke={C.primary} strokeWidth="1"/></>}
                    <rect x="0" y="0" width="4" height="180" fill={C.primary} />
                  </svg>
                </div>
                <div style={{ padding: 16 }}>
                  {/* caption: 12px */}
                  <p className="text-[12px] font-[400] leading-[1.33] tracking-[0.32px] mb-2" style={{ color: C.inkSubtle }}>
                    {item.date} · {item.tag}
                  </p>
                  {/* body-emphasis: 14px weight 600 */}
                  <h4 className="text-[14px] font-[600] leading-[1.29] tracking-[0.16px] mb-2 line-clamp-2 transition-colors"
                    style={{ color: C.ink }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.primary)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.ink)}>
                    {item.title}
                  </h4>
                  {/* body-sm: 14px weight 400 */}
                  <p className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] line-clamp-2 mb-4" style={{ color: C.inkMuted }}>
                    {item.desc}
                  </p>
                  <BtnGhost>{t.common.more} <ArrowRight size={12} /></BtnGhost>
                </div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================
          CTA Banner — cta-banner: primary blue bg, 0px radius, padding 48px
          headline: 32px weight 400
      ============================================================ */}
      <section style={{ backgroundColor: C.primary, padding: '48px 0' }}>
        <div className="max-w-[1584px] mx-auto px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-[32px] font-[400] leading-[1.25] mb-3" style={{ color: C.onPrimary }}>
              {t.cta.title}
            </h2>
            <p className="text-[18px] font-[400] leading-[1.50]" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {t.cta.sub}
            </p>
          </div>
          <div className="flex items-center gap-0 flex-shrink-0">
            {/* On dark blue: white button = button-secondary (ink bg in light, but here we adapt) */}
            <motion.button onClick={() => setIsChatting(true)}
              whileTap={{ scale: 0.98 }}
              className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] flex items-center gap-2 transition-colors"
              style={{ backgroundColor: C.onPrimary, color: C.ink, padding: '12px 16px', borderRadius: 0 }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.surface1)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.onPrimary)}>
              {t.cta.primary} <ArrowRight size={14} />
            </motion.button>
            <button className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] flex items-center gap-2 border-l border-white/20 transition-colors"
              style={{ backgroundColor: 'transparent', color: C.onPrimary, padding: '12px 16px', borderRadius: 0 }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.blue60)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              {t.cta.secondary}
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          Newsletter — newsletter-input: surface-1 input, 0px radius, adjacent button-primary
      ============================================================ */}
      <section style={{ backgroundColor: C.canvas, padding: '96px 0', borderTop: `1px solid ${C.hairline}` }}>
        <div className="max-w-[1584px] mx-auto px-8">
          <div className="max-w-[640px]">
            <Reveal>
              <p className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] mb-4" style={{ color: C.inkMuted }}>
                {t.newsletter.label}
              </p>
              <h2 className="font-[300] leading-[1.20] mb-8" style={{ fontSize: 42, color: C.ink }}>
                Stay informed on Smart Guard.
              </h2>
              {/* newsletter-input + button-primary, no gap — Carbon pattern */}
              <div className="flex items-stretch">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="flex-1 text-[16px] font-[400] leading-[1.50] tracking-[0.16px] outline-none border-b-2 focus:border-b-2 transition-colors"
                  style={{
                    backgroundColor: C.surface1,
                    color: C.ink,
                    padding: '11px 16px',
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: `2px solid ${C.hairline}`,
                  }}
                  onFocus={e => (e.target.style.borderBottomColor = C.primary)}
                  onBlur={e => (e.target.style.borderBottomColor = C.hairline)}
                />
                <BtnPrimary onClick={() => {}}>
                  {t.newsletter.submit} <ArrowRight size={14} />
                </BtnPrimary>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          Footer — inverse-canvas (#161616), body-sm, 5-column links
          The only inverted surface. No rounding anywhere.
      ============================================================ */}
      <footer style={{ backgroundColor: C.inverseCanvas, padding: '64px 0 0' }}>
        <div className="max-w-[1584px] mx-auto px-8">
          {/* Logo row */}
          <div className="flex items-center gap-3 pb-12 border-b" style={{ borderColor: C.inverseSurface1 }}>
            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: C.primary }}>
              <ShieldCheck size={16} color="#ffffff" />
            </div>
            <span className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px]" style={{ color: C.inverseInk }}>
              Smart Guard AI
            </span>
          </div>

          {/* 5-column link grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0 py-12 border-b" style={{ borderColor: C.inverseSurface1 }}>
            {t.footer.columns.map((col, i) => (
              <div key={i} className="pr-8">
                <h4 className="text-[14px] font-[600] leading-[1.29] tracking-[0.16px] mb-5" style={{ color: C.inverseInk }}>
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <button className="text-[14px] font-[400] leading-[1.29] tracking-[0.16px] text-left transition-colors"
                        style={{ color: C.inverseInkMuted }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.inverseInk)}
                        onMouseLeave={e => (e.currentTarget.style.color = C.inverseInkMuted)}>
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
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-[12px] font-[400] leading-[1.33] tracking-[0.32px]" style={{ color: C.inverseInkMuted }}>
                {t.footer.copy}
              </span>
              {t.footer.legal.map((link, i) => (
                <button key={i} className="text-[12px] font-[400] leading-[1.33] tracking-[0.32px] transition-colors"
                  style={{ color: C.inverseInkMuted }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.inverseInk)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.inverseInkMuted)}>
                  {link}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 border text-[12px] font-[400] tracking-[0.32px]"
              style={{ borderColor: C.inverseSurface1, color: C.inverseInkMuted }}>
              <span className="w-1.5 h-1.5" style={{ backgroundColor: C.primary }} />
              {t.footer.demo}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pb-8 border-t pt-6" style={{ borderColor: C.inverseSurface1 }}>
            <p className="text-[12px] font-[400] leading-[1.33] tracking-[0.32px] max-w-[720px]" style={{ color: C.inkSubtle }}>
              {t.footer.disclaimer}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default React.memo(App)
