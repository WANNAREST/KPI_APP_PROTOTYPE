import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-72 flex flex-col w-full transition-all duration-300 min-w-0">
        {/* Top Header - Floating Pill */}
        <header className="m-4 lg:mx-6 lg:mt-6 h-14 rounded-2xl bg-white/80 border border-stone-200 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-4 lg:top-6 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden text-stone-600 hover:text-stone-900 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-lg lg:text-[20px] font-semibold text-stone-900 truncate">{title}</h1>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                className="w-52 pl-8 pr-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-600 text-xs">⌕</span>
            </div>
            <button className="text-stone-600 hover:text-stone-800 text-sm cursor-pointer transition-colors" title="Thông báo">🔔</button>
            <button className="text-stone-600 hover:text-stone-800 text-sm cursor-pointer transition-colors" title="Trợ giúp">❓</button>
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
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="dark" />
    </div>
  )
}

export default App



