import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'
import StatCard from '../components/StatCard'
import ServiceCard from '../components/ServiceCard'
const T1 = 'http://localhost:3001'
const T3 = 'http://localhost:3003'
const projectData = [
  { name: 'App KPI', target: 100, actual: 85 },
  { name: 'CRM System', target: 80, actual: 90 },
  { name: 'E-commerce', target: 120, actual: 110 },
  { name: 'HR Portal', target: 60, actual: 65 },
  { name: 'Marketing', target: 90, actual: 80 },
]
const trendData = [
  { day: 'T2', avgScore: 65 },
  { day: 'T3', avgScore: 70 },
  { day: 'T4', avgScore: 82 },
  { day: 'T5', avgScore: 78 },
  { day: 'T6', avgScore: 85 },
  { day: 'T7', avgScore: 89 },
  { day: 'CN', avgScore: 92 },
]
const kpiStatusData = [
  { name: 'Đạt (Pass)', value: 12, color: '#fba918' }, // amber warm
  { name: 'Không đạt (Fail)', value: 4, color: '#fb7185' }, // rose/coral
  { name: 'Đang xem xét', value: 3, color: '#a8a29e' }, // stone-400
]
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-200 p-4 rounded-2xl shadow-xl">
        <p className="text-stone-700 font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};
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
    { label: 'Dự án đang chạy', value: stats.totalProjects, sub: 'Được quản lý trên hệ thống', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500', icon: '/favicon.svg' },
    { label: 'Nhân sự', value: stats.totalEmployees, sub: 'Tham gia dự án', iconBg: 'bg-rose-500/10', iconColor: 'text-rose-600', icon: '/favicon.svg' },
    { label: 'Công việc (Tasks)', value: stats.totalTasks, sub: `${evalStats.doneTasks} task đã Done`, iconBg: 'bg-stone-500/10', iconColor: 'text-stone-600', icon: '/favicon.svg' },
    { label: 'Tiến độ chung', value: `${evalStats.avgCompletion}%`, sub: `Tình trạng: ${evalStats.systemHealth}`, iconBg: 'bg-teal-500/10', iconColor: 'text-teal-600', icon: '/favicon.svg' },
  ]
  
  const services = [
    { name: 'T1 — KPISetup', port: 3001, tech: 'NODEJS', color: 'border-t-amber-500/50', techColor: 'bg-stone-500/20 text-stone-700' },
    { name: 'T2 — WorkData', port: 3002, tech: 'NODEJS', color: 'border-t-rose-500/50', techColor: 'bg-stone-500/20 text-stone-700' },
    { name: 'T3 — Evaluation', port: 3003, tech: 'NODEJS', color: 'border-t-stone-500/50', techColor: 'bg-stone-500/20 text-stone-700' },
    { name: 'T4 — Adjustment', port: 3004, tech: 'NODEJS', color: 'border-t-teal-500/50', techColor: 'bg-stone-500/20 text-stone-700' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="page-desc">Tổng quan về hiện trạng hệ thống và hiệu suất KPI</p>
        <button onClick={handleRefresh}
          className={`px-4 py-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-2xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 shadow-sm ${refreshing ? 'opacity-50' : ''}`}>
          ↻ Làm mới dữ liệu
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Charts Section 1: Bar & Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="card-header pb-2 border-none">
            <h2 className="card-title text-base">Tiến độ 5 dự án gần nhất</h2>
            <p className="text-xs text-stone-600 mt-1">So sánh Khối lượng Mục tiêu (Target) và Đã đạt được (Actual)</p>
          </div>
          <div className="p-4 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="name" stroke="#78716c" fontSize={12} tickLine={false} axisLine={{ stroke: '#e7e5e4' }} />
                <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#a8a29e' }} />
                <Bar dataKey="target" name="Mục tiêu" fill="#fba918" radius={[8, 8, 0, 0]} barSize={28} />
                <Bar dataKey="actual" name="Đã đạt" fill="#fb7185" radius={[8, 8, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card flex flex-col">
          <div className="card-header pb-2 border-none">
            <h2 className="card-title text-base">Tỷ lệ Trạng thái (KPIs)</h2>
            <p className="text-xs text-stone-500 mt-1">Phân bổ kết quả đánh giá cuối chu kỳ</p>
          </div>
          <div className="p-4 flex-1 min-h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kpiStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {kpiStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-stone-900">
                {kpiStatusData.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
              <span className="text-xs text-stone-600">Tổng KPI</span>
            </div>
          </div>
          {/* Custom Legend for Pie */}
          <div className="px-6 pb-6 flex justify-center gap-4 text-xs">
             {kpiStatusData.map(item => (
                <div key={item.name} className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Charts Section 2: Area Chart & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="card-header pb-2 border-none">
            <h2 className="card-title text-base">Xu hướng Hiệu suất Toàn hệ thống</h2>
            <p className="text-xs text-stone-500 mt-1">Điểm trung bình Overall (7 ngày qua)</p>
          </div>
          <div className="p-4 flex-1 min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="day" stroke="#78716c" fontSize={12} tickLine={false} axisLine={{ stroke: '#e7e5e4' }} />
                <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="avgScore" name="Điểm TB" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Existing Status Blocks */}
        <div className="flex flex-col gap-4">
           {/* Architecture Minimal representation */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-stone-900 mb-4">Các Microservices đang chạy</h2>
            <div className="space-y-3">
              {services.map(s => (
                <div key={s.port} className="flex items-center justify-between p-2 rounded bg-stone-50 border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-xs font-medium text-stone-800">{s.name}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">:{s.port}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-semibold text-stone-900 mb-4">Tỷ lệ Xử lý Tồn đọng</h2>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-rose-500">{evalStats.doneTasks}</span>
              <span className="text-sm text-stone-600 mb-1">/ {evalStats.totalTasks || 0} Task</span>
            </div>
            
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden mt-3">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400"
                  style={{ width: `${evalStats.totalTasks > 0 ? (evalStats.doneTasks / evalStats.totalTasks) * 100 : 0}%` }}></div>
            </div>
            <p className="text-xs text-stone-600 mt-2 text-right">
              {evalStats.totalTasks > 0 ? Math.round((evalStats.doneTasks / evalStats.totalTasks) * 100) : 0}% Trực thuộc hệ thống
            </p>
          </div>
        </div>
        
      </div>

    </div>
  )
}


