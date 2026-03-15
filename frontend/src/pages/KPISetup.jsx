import { useState, useEffect } from 'react'

const T1 = 'http://localhost:3001'

export default function KPISetup() {
  const [tab, setTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [kpis, setKpis] = useState([])

  // ── Form states ──
  const [projForm, setProjForm] = useState({ name: '', startDate: '', endDate: '', status: 'Đang thực hiện', sprints: 0 })
  const [empForm, setEmpForm] = useState({ name: '', position: '', department: '' })
  const [kpiForm, setKpiForm] = useState({ name: '', target: '', unit: '', projectId: '', employeeId: '' })
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState('')

  const fetchAll = () => {
    fetch(`${T1}/api/projects`).then(r => r.json()).then(setProjects).catch(() => {})
    fetch(`${T1}/api/employees`).then(r => r.json()).then(setEmployees).catch(() => {})
    fetch(`${T1}/api/kpis`).then(r => r.json()).then(setKpis).catch(() => {})
  }
  useEffect(fetchAll, [])

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }

  // ── CRUD Handlers ──
  const addProject = async (e) => {
    e.preventDefault()
    await fetch(`${T1}/api/projects`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projForm)
    })
    setProjForm({ name: '', startDate: '', endDate: '', status: 'Đang thực hiện', sprints: 0 })
    setShowForm(false); fetchAll(); flash('Đã tạo dự án')
  }

  const addEmployee = async (e) => {
    e.preventDefault()
    await fetch(`${T1}/api/employees`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empForm)
    })
    setEmpForm({ name: '', position: '', department: '' })
    setShowForm(false); fetchAll(); flash('Đã tạo nhân viên')
  }

  const addKpi = async (e) => {
    e.preventDefault()
    await fetch(`${T1}/api/kpis`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kpiForm)
    })
    setKpiForm({ name: '', target: '', unit: '', projectId: '', employeeId: '' })
    setShowForm(false); fetchAll(); flash('Đã tạo KPI')
  }

  const deleteItem = async (type, id) => {
    await fetch(`${T1}/api/${type}/${id}`, { method: 'DELETE' })
    fetchAll(); flash('Đã xóa')
  }

  // ── Tab config ──
  const tabs = [
    { key: 'projects', label: 'Projects', count: projects.length },
    { key: 'employees', label: 'Employees', count: employees.length },
    { key: 'kpis', label: 'KPI Definitions', count: kpis.length },
  ]

  return (
    <div>
      <p className="page-desc">Quản lý Projects, Employees, và KPI Definitions</p>

      {/* Toast */}
      {msg && <div className="toast-success">{msg}</div>}

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-white/[0.06] mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setShowForm(false) }}
            className={`flex-1 py-3 text-sm font-medium transition-all cursor-pointer ${
              tab === t.key
                ? 'bg-indigo-500/15 text-indigo-400 border-b-2 border-indigo-400'
                : 'bg-[#111827] text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className="card">
        {/* Card Header */}
        <div className="card-header">
          <h2 className="card-title">
            {tab === 'projects' && 'Danh sách dự án'}
            {tab === 'employees' && 'Danh sách nhân viên'}
            {tab === 'kpis' && 'Danh sách chỉ số KPI'}
          </h2>
          <button onClick={() => setShowForm(!showForm)}
            className="btn-primary">
            + Thêm mới
          </button>
        </div>

        {/* ── Add Form ── */}
        {showForm && (
          <div className="px-6 py-5 border-b border-white/[0.06] bg-indigo-500/[0.03]">
            {tab === 'projects' && (
              <form onSubmit={addProject} className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
                <div className="col-span-2 lg:col-span-3">
                  <label className="form-label">Tên dự án <span className="text-red-400">*</span></label>
                  <input placeholder="Ví dụ: Dự án phát triển App KPI" value={projForm.name} onChange={e => setProjForm({...projForm, name: e.target.value})} required
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Ngày bắt đầu</label>
                  <input type="date" value={projForm.startDate} onChange={e => setProjForm({...projForm, startDate: e.target.value})}
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Ngày kết thúc</label>
                  <input type="date" value={projForm.endDate} onChange={e => setProjForm({...projForm, endDate: e.target.value})}
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Trạng thái</label>
                  <select value={projForm.status} onChange={e => setProjForm({...projForm, status: e.target.value})}
                    className="form-select">
                    <option className="bg-slate-800" value="Đang thực hiện">Đang thực hiện</option>
                    <option className="bg-slate-800" value="Hoàn thành">Hoàn thành</option>
                    <option className="bg-slate-800" value="Tạm dừng">Tạm dừng</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Số Sprint</label>
                  <input type="number" placeholder="0" value={projForm.sprints || ''} onChange={e => setProjForm({...projForm, sprints: Number(e.target.value)})}
                    className="form-input" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full btn-primary">Tạo dự án</button>
                </div>
              </form>
            )}
            {tab === 'employees' && (
              <form onSubmit={addEmployee} className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
                <div>
                  <label className="form-label">Họ và tên <span className="text-red-400">*</span></label>
                  <input placeholder="Ví dụ: Nguyễn Văn A" value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} required
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Chức vụ</label>
                  <input placeholder="Ví dụ: Nhân viên" value={empForm.position} onChange={e => setEmpForm({...empForm, position: e.target.value})}
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Phòng ban</label>
                  <input placeholder="Ví dụ: Phòng IT" value={empForm.department} onChange={e => setEmpForm({...empForm, department: e.target.value})}
                    className="form-input" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full btn-primary">Tạo nhân viên</button>
                </div>
              </form>
            )}
            {tab === 'kpis' && (
              <form onSubmit={addKpi} className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
                <div>
                  <label className="form-label">Tên chỉ số KPI <span className="text-red-400">*</span></label>
                  <input placeholder="Ví dụ: Doanh thu bán hàng" value={kpiForm.name} onChange={e => setKpiForm({...kpiForm, name: e.target.value})} required
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Mục tiêu <span className="text-red-400">*</span></label>
                  <input type="number" placeholder="Ví dụ: 100" value={kpiForm.target} onChange={e => setKpiForm({...kpiForm, target: e.target.value})} required
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Đơn vị <span className="text-red-400">*</span></label>
                  <input placeholder="Ví dụ: triệu VND" value={kpiForm.unit} onChange={e => setKpiForm({...kpiForm, unit: e.target.value})} required
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Thuộc dự án</label>
                  <select value={kpiForm.projectId} onChange={e => setKpiForm({...kpiForm, projectId: e.target.value})}
                    className="form-select">
                    <option value="" className="bg-slate-800">— Chọn dự án —</option>
                    {projects.map(p => <option key={p.id} value={p.id} className="bg-slate-800">{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Phụ trách</label>
                  <select value={kpiForm.employeeId} onChange={e => setKpiForm({...kpiForm, employeeId: e.target.value})}
                    className="form-select">
                    <option value="" className="bg-slate-800">— Chọn nhân viên —</option>
                    {employees.map(e => <option key={e.id} value={e.id} className="bg-slate-800">{e.name}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full btn-primary">Tạo KPI</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ── Tables ── */}
        <div className="table-container pt-2 pb-2">
          {tab === 'projects' && (
            <table className="table-main">
              <thead><tr>
                <th className="table-th">ID</th>
                <th className="table-th">Tên dự án</th>
                <th className="table-th">Ngày bắt đầu</th>
                <th className="table-th">Ngày kết thúc</th>
                <th className="table-th">Trạng thái</th>
                <th className="table-th">Sprints</th>
                <th className="table-th-right"></th>
              </tr></thead>
              <tbody>
                {projects.length === 0 && <tr><td colSpan="7" className="text-center py-12 text-slate-600">Chưa có dự án nào</td></tr>}
                {projects.map(p => (
                  <tr key={p.id} className="table-tr">
                    <td className="table-td text-slate-500">{p.id}</td>
                    <td className="table-td font-medium text-white">{p.name}</td>
                    <td className="table-td">{p.startDate || '—'}</td>
                    <td className="table-td">{p.endDate || '—'}</td>
                    <td className="table-td">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.status === 'Hoàn thành' ? 'bg-emerald-500/15 text-emerald-400' :
                        p.status === 'Tạm dừng' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-blue-500/15 text-blue-400'
                      }`}>{p.status}</span>
                    </td>
                    <td className="table-td">{p.sprints}</td>
                    <td className="table-td-right">
                      <button onClick={() => deleteItem('projects', p.id)} className="btn-danger-text">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'employees' && (
            <table className="table-main">
              <thead><tr>
                <th className="table-th">ID</th>
                <th className="table-th">Tên nhân viên</th>
                <th className="table-th">Chức vụ</th>
                <th className="table-th">Phòng ban</th>
                <th className="table-th-right"></th>
              </tr></thead>
              <tbody>
                {employees.length === 0 && <tr><td colSpan="5" className="text-center py-12 text-slate-600">Chưa có nhân viên nào</td></tr>}
                {employees.map(e => (
                  <tr key={e.id} className="table-tr">
                    <td className="table-td text-slate-500">{e.id}</td>
                    <td className="table-td font-medium text-white">{e.name}</td>
                    <td className="table-td">{e.position || '—'}</td>
                    <td className="table-td">{e.department || '—'}</td>
                    <td className="table-td-right">
                      <button onClick={() => deleteItem('employees', e.id)} className="btn-danger-text">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'kpis' && (
            <table className="table-main">
              <thead><tr>
                <th className="table-th">ID</th>
                <th className="table-th">Tên KPI</th>
                <th className="table-th-right">Mục tiêu</th>
                <th className="table-th">Đơn vị</th>
                <th className="table-th">Dự án</th>
                <th className="table-th">Nhân viên</th>
                <th className="table-th-right"></th>
              </tr></thead>
              <tbody>
                {kpis.length === 0 && <tr><td colSpan="7" className="text-center py-12 text-slate-600">Chưa có KPI nào</td></tr>}
                {kpis.map(k => (
                  <tr key={k.id} className="table-tr">
                    <td className="table-td text-slate-500">{k.id}</td>
                    <td className="table-td font-medium text-white">{k.name}</td>
                    <td className="table-td-right text-slate-300">{k.target}</td>
                    <td className="table-td">{k.unit}</td>
                    <td className="table-td">{k.projectName}</td>
                    <td className="table-td">{k.employeeName}</td>
                    <td className="table-td-right">
                      <button onClick={() => deleteItem('kpis', k.id)} className="btn-danger-text">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
