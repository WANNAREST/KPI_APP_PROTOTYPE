import { useState } from 'react'

// Service URLs
const T1_URL = 'http://localhost:3001'
const T2_URL = 'http://localhost:3002'
const T3_URL = 'http://localhost:3003'
const T4_URL = 'http://localhost:3004'

function App() {
  // ── State ──
  const [kpiName, setKpiName] = useState('')
  const [kpiTarget, setKpiTarget] = useState('')
  const [kpiUnit, setKpiUnit] = useState('')
  const [kpis, setKpis] = useState([])

  const [selectedKpiId, setSelectedKpiId] = useState('')
  const [actualValue, setActualValue] = useState('')

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // ── Helpers ──
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  // ── Fetch KPIs list ──
  const fetchKpis = async () => {
    try {
      const res = await fetch(`${T1_URL}/api/kpis`)
      const data = await res.json()
      setKpis(data)
    } catch {
      showMessage('Không thể kết nối đến T1 (KPISetup)', 'error')
    }
  }

  // ── T1: Tạo KPI mục tiêu ──
  const handleCreateKpi = async (e) => {
    e.preventDefault()
    if (!kpiName || !kpiTarget || !kpiUnit) {
      showMessage('Vui lòng điền đầy đủ thông tin KPI', 'error')
      return
    }
    try {
      const res = await fetch(`${T1_URL}/api/kpis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: kpiName,
          target: Number(kpiTarget),
          unit: kpiUnit
        })
      })
      const data = await res.json()
      if (res.ok) {
        showMessage(`Đã tạo KPI: ${data.name}`)
        setKpiName('')
        setKpiTarget('')
        setKpiUnit('')
        fetchKpis()
      } else {
        showMessage(data.error, 'error')
      }
    } catch {
      showMessage('Lỗi kết nối đến T1 (KPISetup)', 'error')
    }
  }

  // ── T2: Ghi nhận dữ liệu thực tế ──
  const handleRecordActual = async (e) => {
    e.preventDefault()
    if (!selectedKpiId || !actualValue) {
      showMessage('Vui lòng chọn KPI và nhập giá trị thực tế', 'error')
      return
    }
    try {
      const res = await fetch(`${T2_URL}/api/workdata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpiId: Number(selectedKpiId),
          actual: Number(actualValue)
        })
      })
      const data = await res.json()
      if (res.ok) {
        showMessage(`Đã ghi nhận dữ liệu thực tế cho KPI #${selectedKpiId}`)
        setActualValue('')
      } else {
        showMessage(data.error, 'error')
      }
    } catch {
      showMessage('Lỗi kết nối đến T2 (WorkData)', 'error')
    }
  }

  // ── T3 + T4: Tính toán & Đánh giá ──
  const handleEvaluate = async () => {
    setLoading(true)
    try {
      // Gọi T3: Tính toán hiệu suất
      const evalRes = await fetch(`${T3_URL}/api/evaluate`)
      const evalData = await evalRes.json()

      if (!evalData.results || evalData.results.length === 0) {
        showMessage('Chưa có dữ liệu KPI để đánh giá', 'error')
        setLoading(false)
        return
      }

      // Gọi T4: Cập nhật trạng thái
      const adjustRes = await fetch(`${T4_URL}/api/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: evalData.results })
      })
      const adjustData = await adjustRes.json()

      setResults(adjustData.adjustments)
      showMessage('Đánh giá KPI thành công!')
    } catch {
      showMessage('Lỗi khi tính toán. Kiểm tra các dịch vụ đang chạy.', 'error')
    }
    setLoading(false)
  }

  // ── Render ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/30">
            K
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              KPI Dashboard
            </h1>
            <p className="text-sm text-slate-400">Hệ thống quản lý KPI — Microservices Prototype</p>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {message.text && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all duration-300 ${
          message.type === 'error'
            ? 'bg-red-500/90 text-white border border-red-400/30'
            : 'bg-emerald-500/90 text-white border border-emerald-400/30'
        }`}>
          {message.type === 'error' ? '❌' : '✅'} {message.text}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Service Status Badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { label: 'T1 — KPISetup', port: 3001, color: 'blue' },
            { label: 'T2 — WorkData', port: 3002, color: 'violet' },
            { label: 'T3 — Evaluation', port: 3003, color: 'amber' },
            { label: 'T4 — Adjustment', port: 3004, color: 'emerald' }
          ].map(s => (
            <span key={s.port} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full bg-${s.color}-400 animate-pulse`}></span>
              {s.label} <span className="text-slate-500">:{s.port}</span>
            </span>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ────────── T1: Thiết lập KPI ────────── */}
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-blue-500/10">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-blue-400">🎯</span> T1 — Thiết lập mục tiêu KPI
              </h2>
              <p className="text-xs text-slate-400 mt-1">KPISetupService — Port 3001</p>
            </div>
            <form onSubmit={handleCreateKpi} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Tên chỉ số KPI</label>
                <input
                  type="text"
                  value={kpiName}
                  onChange={e => setKpiName(e.target.value)}
                  placeholder="Ví dụ: Doanh thu bán hàng"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Mục tiêu</label>
                  <input
                    type="number"
                    value={kpiTarget}
                    onChange={e => setKpiTarget(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Đơn vị</label>
                  <input
                    type="text"
                    value={kpiUnit}
                    onChange={e => setKpiUnit(e.target.value)}
                    placeholder="triệu VND"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 font-medium shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer"
              >
                + Tạo KPI mới
              </button>
            </form>
          </div>

          {/* ────────── T2: Nhập dữ liệu thực tế ────────── */}
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-violet-500/10">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-violet-400">📊</span> T2 — Nhập dữ liệu thực tế
              </h2>
              <p className="text-xs text-slate-400 mt-1">WorkDataService — Port 3002</p>
            </div>
            <form onSubmit={handleRecordActual} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Chọn KPI</label>
                <select
                  value={selectedKpiId}
                  onChange={e => setSelectedKpiId(e.target.value)}
                  onClick={fetchKpis}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition appearance-none"
                >
                  <option value="" className="bg-slate-800">-- Chọn KPI --</option>
                  {kpis.map(kpi => (
                    <option key={kpi.id} value={kpi.id} className="bg-slate-800">
                      {kpi.name} (Mục tiêu: {kpi.target} {kpi.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Giá trị thực tế</label>
                <input
                  type="number"
                  value={actualValue}
                  onChange={e => setActualValue(e.target.value)}
                  placeholder="Nhập giá trị thực tế đạt được"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 font-medium shadow-lg shadow-violet-500/25 transition-all duration-200 cursor-pointer"
              >
                📥 Ghi nhận dữ liệu
              </button>
            </form>
          </div>
        </div>

        {/* ────────── T3 + T4: Đánh giá KPI ────────── */}
        <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-amber-500/10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-amber-400">📈</span> T3 + T4 — Kết quả đánh giá KPI
              </h2>
              <p className="text-xs text-slate-400 mt-1">KPIEvaluationService (3003) → KPIAdjustmentService (3004)</p>
            </div>
            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 font-medium shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Đang tính...
                </span>
              ) : '⚡ Tính toán kết quả'}
            </button>
          </div>

          <div className="p-6">
            {results.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-4xl mb-3">📋</p>
                <p>Nhấn <strong>"Tính toán kết quả"</strong> để xem đánh giá KPI</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">ID</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Tên KPI</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Mục tiêu</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Thực tế</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Hiệu suất</th>
                      <th className="text-center py-3 px-4 text-slate-400 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(r => (
                      <tr key={r.kpiId} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-3 px-4 text-slate-300">#{r.kpiId}</td>
                        <td className="py-3 px-4 font-medium">{r.name}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{r.target} {r.unit}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{r.actual} {r.unit}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-semibold ${r.performance >= 100 ? 'text-emerald-400' : r.performance >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                            {r.performance}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            r.status === 'Đạt'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {r.status === 'Đạt' ? '✅' : '❌'} {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-600 pb-8">
          KPI Microservices Prototype — React + Vite + Tailwind CSS + Node.js (Express)
        </footer>
      </main>
    </div>
  )
}

export default App
