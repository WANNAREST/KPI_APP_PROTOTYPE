import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import KPISetup from './pages/KPISetup'
import WorkData from './pages/WorkData'
import Evaluation from './pages/Evaluation'
import Adjustment from './pages/Adjustment'

const pageTitles = {
  '/': 'Tổng Quan Hệ Thống',
  '/setup': 'KPI Setup Service (T1)',
  '/workdata': 'Work Data Service (T2)',
  '/evaluation': 'Evaluation Service (T3)',
  '/adjustment': 'Adjustment Service (T4)',
}

function App() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'KPI Dashboard'

  return (
    <div className="flex min-h-screen bg-[#0b1121]">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col">
        {/* Top Header */}
        <header className="h-14 border-b border-white/[0.06] bg-[#0d1420]/80 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-[15px] font-semibold text-white">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                className="w-52 pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs">⌕</span>
            </div>
            <button className="text-slate-500 hover:text-slate-300 text-sm cursor-pointer" title="Thông báo">🔔</button>
            <button className="text-slate-500 hover:text-slate-300 text-sm cursor-pointer" title="Trợ giúp">❓</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/setup" element={<KPISetup />} />
            <Route path="/workdata" element={<WorkData />} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/adjustment" element={<Adjustment />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
