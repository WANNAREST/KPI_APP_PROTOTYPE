import { NavLink } from 'react-router-dom'
const navItems = [
  { to: '/', icon: '⊞', label: 'Tổng Quan' },
  { to: '/setup', icon: '◈', label: 'KPI Setup Service' },
  { to: '/workdata', icon: '◇', label: 'Work Data Service' },
  { to: '/evaluation', icon: '◫', label: 'Evaluation Service' },
  { to: '/adjustment', icon: '◪', label: 'Adjustment Service' },
]
export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`fixed left-4 lg:left-6 top-4 lg:top-6 bottom-4 lg:bottom-6 w-64 bg-white border border-stone-200 rounded-2xl flex flex-col z-50 transition-transform duration-300 shadow-lg overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-4 border-b border-stone-200 bg-stone-50">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm md:text-base shadow-md shrink-0">
            KPI
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-stone-900 leading-tight">KPI Cycle</h2>
            <p className="text-sm md:text-base text-stone-600 font-medium pt-0.5">System Admin</p>
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
                `flex items-center gap-4 px-4 py-3 rounded-2xl text-sm md:text-base transition-all duration-150 ${isActive
                  ? 'bg-rose-500/15 text-rose-600 font-semibold shadow-sm border border-rose-500/20'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100 font-medium'
                }`
              }
            >
              <span className="text-lg md:text-xl w-6 text-center opacity-70">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="px-4 py-5 border-t border-stone-200 bg-stone-50">
          <div className="flex items-center gap-4 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm md:text-base text-stone-800 font-bold shrink-0 shadow-sm">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-bold text-stone-900 truncate">Administrator</p>
              <p className="text-xs md:text-sm text-stone-600 truncate mt-0.5">admin@system.local</p>
            </div>
            <button className="text-stone-500 hover:text-rose-600 transition-colors text-lg md:text-xl cursor-pointer" title="Đăng xuất">⎋</button>
          </div>
        </div>
      </aside>
    </>
  )
}



