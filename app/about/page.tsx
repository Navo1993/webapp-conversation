import React from 'react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Banner - 呼应主页风格 */}
      <section className="bg-gradient-to-r from-[#0052D4] to-[#1a73e8] text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          连接未来 · 预见智能
        </h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          电梯工程技术专业 —— 培养数字化时代的“大国工匠”
        </p>
      </section>

      <div className="max-w-6xl mx-auto py-16 px-6">
        
        {/* 学校与专业介绍 */}
        <section className="mb-20">
          <div className="flex items-center mb-10">
            <div className="w-2 h-8 bg-[#0052D4] mr-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">专业概况</h2>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              本专业是学校的<span className="text-[#0052D4] font-bold">王牌专业</span>。我们不仅关注传统的机械维保，更致力于将物联网 (IoT) 与人工智能 (AI) 深度融合，打造数字化融通赋能的教学新模式。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-[#0052D4] mb-2">产教融合</h3>
                <p className="text-sm text-gray-500">对接广交会演示标准，实现校企深度合作。</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-[#0052D4] mb-2">实操基地</h3>
                <p className="text-sm text-gray-500">拥有主题文化车厢及默纳克控制系统实训室。</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-[#0052D4] mb-2">名师引领</h3>
                <p className="text-sm text-gray-500">由行业“老师傅”与 AI 技术教师共同指导。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 杰出人物/毕业生介绍 */}
        <section className="mb-20">
          <div className="flex items-center mb-10">
            <div className="w-2 h-8 bg-[#0052D4] mr-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">榜样力量</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 曹新平 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-blue-100 text-[#0052D4] text-xs font-bold rounded-full mb-4">优秀毕业生</span>
              <h3 className="text-2xl font-bold mb-3">曹新平</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                凭借精湛的维保技艺与不断钻研的精神，从学徒成长为行业技术骨干。他的事迹证明了“一技在手，一生无忧”的职教真谛。
              </p>
            </div>
            {/* 王佳豪 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-blue-100 text-[#0052D4] text-xs font-bold rounded-full mb-4">优秀毕业生</span>
              <h3 className="text-2xl font-bold mb-3">王佳豪</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                在校期间深耕电梯控制电路分析，现已成为企业技术先锋，代表了新一代电梯人勇于探索数字化升级的精神。
              </p>
            </div>
          </div>
        </section>

      </div>

      <footer className="bg-gray-900 text-gray-400 py-12 text-center text-sm">
        © 2026 校园展示平台 | SMART GUARD 智能守卫技术支持
      </footer>
    </div>
  )
}
