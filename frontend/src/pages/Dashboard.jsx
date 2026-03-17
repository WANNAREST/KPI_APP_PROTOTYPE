import { useState, useEffect } from 'react'

const T1 = 'http://localhost:3001'
const T3 = 'http://localhost:3003'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalProjects: 0, totalEmployees: 0, totalKpis: 0, totalTasks: 0, totalAssets: 0 })
  const [evalStats, setEvalStats] = useState({ totalEmployees: 0, totalTasks: 0, doneTasks: 0, avgCompletion: 0, systemHealth: 'N/A' })
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = () => {
    fetch(`${T1}/api/stats`).then(r => r.json()).then(setStats).catch(() => {})
    fetch(`${T3}/api/evaluate/stats`).then(r => r.json()).then(setEvalStats).catch(() => {})
  }

  useEffect(fetchStats, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchStats()
    setTimeout(() => setRefreshing(false), 800)
  }

  const cards = [
    { label: 'Dự án đang chạy', value: stats.totalProjects, sub: 'Được quản lý trên hệ thống', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400', icon: '/favicon.svg' },
    { label: 'Nhân sự', value: stats.totalEmployees, sub: 'Tham gia dự án', iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400', icon: '/favicon.svg' },
    { label: 'Công việc (Tasks)', value: stats.totalTasks, sub: `${evalStats.doneTasks} task đã Done`, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400', icon: '/favicon.svg' },
    { label: 'Tiến độ chung', value: `${evalStats.avgCompletion}%`, sub: `Tình trạng: ${evalStats.systemHealth}`, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', icon: '/favicon.svg' },
  ]

  const services = [
    { name: 'T1 — KPISetup', port: 3001, tech: 'NODEJS', color: 'border-t-blue-500', techColor: 'bg-green-500/10 text-green-400' },
    { name: 'T2 — WorkData', port: 3002, tech: 'NODEJS', color: 'border-t-violet-500', techColor: 'bg-green-500/10 text-green-400' },
    { name: 'T3 — Evaluation', port: 3003, tech: 'NODEJS', color: 'border-t-amber-500', techColor: 'bg-green-500/10 text-green-400' },
    { name: 'T4 — Adjustment', port: 3004, tech: 'NODEJS', color: 'border-t-emerald-500', techColor: 'bg-green-500/10 text-green-400' },
  ]

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="card p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{c.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{c.value}</p>
                <p className="text-[11px] text-slate-600 mt-1">{c.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center text-lg`}>
                <img src={c.icon} alt="icon" className="w-5 h-5 opacity-80" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Section */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Kiến trúc Microservices</h2>
        <button onClick={handleRefresh}
          className={`text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer transition ${refreshing ? 'opacity-50' : ''}`}>
          Làm mới trạng thái ↻
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {services.map(s => (
          <div key={s.port} className={`card border-t-2 ${s.color}`}>
            <div className="card-body pb-4">
              <div className="flex justify-end mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  ONLINE
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-500 text-lg mb-4">
                ⊟
              </div>
              <p className="text-sm font-semibold text-white">{s.name}</p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-slate-500">Port {s.port}</p>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${s.techColor}`}>
                  {s.tech}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Overview */}
      {(evalStats.totalTasks > 0 || stats.totalAssets > 0) && (
        <div>
          <h2 className="text-base font-semibold text-white mb-2">Tình trạng Quản lý</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{evalStats.doneTasks}</p>
              <p className="text-xs text-slate-500 mt-1">Công việc Hoàn thành</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{evalStats.totalTasks > 0 ? evalStats.totalTasks - evalStats.doneTasks : 0}</p>
              <p className="text-xs text-slate-500 mt-1">Đang xử lý / Tồn đọng</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">{stats.totalAssets}</p>
              <p className="text-xs text-slate-500 mt-1">Tài sản (Assets) cấp phát</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
