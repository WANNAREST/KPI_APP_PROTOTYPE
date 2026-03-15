import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: '⊞', label: 'Tổng Quan' },
  { to: '/setup', icon: '◈', label: 'KPI Setup Service' },
  { to: '/workdata', icon: '◇', label: 'Work Data Service' },
  { to: '/evaluation', icon: '◫', label: 'Evaluation Service' },
  { to: '/adjustment', icon: '◪', label: 'Adjustment Service' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0d1420] border-r border-white/[0.06] flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
          KPI
        </div>
        <div>
          <h2 className="text-base font-semibold text-white leading-tight">KPI Cycle Prototype</h2>
          <p className="text-[11px] text-slate-500">Microservices Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 ${isActive
                ? 'bg-indigo-500/15 text-indigo-400 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`
            }
          >
            <span className="text-base w-5 text-center opacity-70">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-medium">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">Administrator</p>
            <p className="text-[10px] text-slate-600 truncate">admin@system.local</p>
          </div>
          <button className="text-slate-600 hover:text-slate-400 text-base cursor-pointer" title="Đăng xuất">⎋</button>
        </div>
      </div>
    </aside>
  )
}
