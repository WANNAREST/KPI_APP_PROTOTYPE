import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const T1 = 'http://localhost:3001'

export default function KPISetup() {
  const [tab, setTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [kpis, setKpis] = useState([])
  const [tasks, setTasks] = useState([])
  const [assets, setAssets] = useState([])
  // ── Form states ──
  const [projForm, setProjForm] = useState({ name: '', startDate: '', endDate: '', status: 'Đang thực hiện', sprints: 0 })
  const [empForm, setEmpForm] = useState({ name: '', position: '', department: '', costPerHour: 10, skills: '' })
  const [kpiForm, setKpiForm] = useState({ name: '', target: '', unit: '', projectId: '', employeeId: '' })
  const [taskForm, setTaskForm] = useState({ name: '', projectId: '', assigneeId: '', type: 'Task', estimate: 1, taskWeight: 1, tags: '' })
  const [assetForm, setAssetForm] = useState({ name: '', code: '', type: 'Laptop', projectId: '', status: 'available' })
  const [showForm, setShowForm] = useState(false)
  const fetchAll = () => {
    fetch(`${T1}/api/projects`).then(r => r.json()).then(setProjects).catch(() => {})
    fetch(`${T1}/api/employees`).then(r => r.json()).then(setEmployees).catch(() => {})
    fetch(`${T1}/api/kpis`).then(r => r.json()).then(setKpis).catch(() => {})
    fetch(`${T1}/api/tasks`).then(r => r.json()).then(setTasks).catch(() => {})
    fetch(`${T1}/api/assets`).then(r => r.json()).then(setAssets).catch(() => {})
  }
  useEffect(fetchAll, [])
  // ── CRUD Handlers ──
  const addProject = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${T1}/api/projects`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projForm)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Lỗi hệ thống');
      setProjForm({ name: '', startDate: '', endDate: '', status: 'Đang thực hiện', sprints: 0 })
      setShowForm(false); fetchAll(); toast.success('Đã tạo dự án')
    } catch (err) { toast.error(err.message) }
  }
  const addEmployee = async (e) => {
    e.preventDefault()
    // Convert skills string "React:3, NodeJS:4" to object { React: 3, NodeJS: 4 }
    let skillsObj = {};
    if (empForm.skills) {
      empForm.skills.split(',').forEach(s => {
        const [k, v] = s.split(':');
        if (k && v) skillsObj[k.trim()] = Number(v.trim());
      });
    }

    try {
      const res = await fetch(`${T1}/api/employees`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...empForm, skills: skillsObj })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Lỗi hệ thống');
      setEmpForm({ name: '', position: '', department: '', costPerHour: 10, skills: '' })
      setShowForm(false); fetchAll(); toast.success('Đã tạo nhân viên')
    } catch (err) { toast.error(err.message) }
  }

  const addKpi = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${T1}/api/kpis`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kpiForm)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Lỗi hệ thống');
      setKpiForm({ name: '', target: '', unit: '', projectId: '', employeeId: '' })
      setShowForm(false); fetchAll(); toast.success('Đã tạo KPI')
    } catch (err) { toast.error(err.message) }
  }

  const addTask = async (e) => {
    e.preventDefault()
    let tagsArray = taskForm.tags ? taskForm.tags.split(',').map(t => t.trim()) : [];
    try {
      const res = await fetch(`${T1}/api/tasks`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskForm, tags: tagsArray })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Vui lòng điền đủ thông tin, hoặc restart Backend nếu bị 404 Cannot POST');
      setTaskForm({ name: '', projectId: '', assigneeId: '', type: 'Task', estimate: 1, taskWeight: 1, tags: '' })
      setShowForm(false); fetchAll(); toast.success('Đã tạo Task')
    } catch (err) { toast.error(err.message) }
  }

  const addAsset = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${T1}/api/assets`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetForm)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Vui lòng điền đủ thông tin, hoặc restart Backend nếu bị 404 Cannot POST');
      setAssetForm({ name: '', code: '', type: 'Laptop', projectId: '', status: 'available' })
      setShowForm(false); fetchAll(); toast.success('Đã tạo Asset')
    } catch (err) { toast.error(err.message) }
  }

  const deleteItem = async (type, id) => {
    try {
      const res = await fetch(`${T1}/api/${type}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Lỗi hệ thống');
      fetchAll(); toast.success('Đã xóa')
    } catch (err) { toast.error(err.message) }
  }

  // ── Tab config ──
  const tabs = [
    { key: 'projects', label: 'Projects', count: projects.length },
    { key: 'employees', label: 'Employees', count: employees.length },
    { key: 'tasks', label: 'Tasks (Works)', count: tasks.length },
    { key: 'assets', label: 'Assets', count: assets.length },
    { key: 'kpis', label: 'KPI Targets', count: kpis.length },
  ]

  return (
    <div>
      <p className="page-desc">Quản lý Projects, Employees, và KPI Definitions</p>



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
            {tab === 'tasks' && 'Danh sách công việc'}
            {tab === 'assets' && 'Danh sách tài sản thiết bị'}
            {tab === 'kpis' && 'Danh sách chỉ số KPI (Chỉ tiêu)'}
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
                <div className="col-span-2">
                  <label className="form-label">Họ và tên <span className="text-red-400">*</span></label>
                  <input placeholder="Ví dụ: Nguyễn Văn A" value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} required
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Chức vụ</label>
                  <input placeholder="Ví dụ: Lập trình viên" value={empForm.position} onChange={e => setEmpForm({...empForm, position: e.target.value})}
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Phòng ban</label>
                  <input placeholder="Ví dụ: Phát triển" value={empForm.department} onChange={e => setEmpForm({...empForm, department: e.target.value})}
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Chi phí / Giờ ($)</label>
                  <input type="number" placeholder="10" value={empForm.costPerHour} onChange={e => setEmpForm({...empForm, costPerHour: e.target.value})}
                    className="form-input" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Kỹ năng (Cú pháp: Skill:Level)</label>
                  <input placeholder="Ví dụ: React:3, NodeJS:4" value={empForm.skills} onChange={e => setEmpForm({...empForm, skills: e.target.value})}
                    className="form-input" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full btn-primary">Tạo nhân viên</button>
                </div>
              </form>
            )}
            {tab === 'tasks' && (
              <form onSubmit={addTask} className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
                <div className="col-span-2">
                  <label className="form-label">Tên công việc (Task) <span className="text-red-400">*</span></label>
                  <input placeholder="Ví dụ: Viết API đăng nhập" value={taskForm.name} onChange={e => setTaskForm({...taskForm, name: e.target.value})} required
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Thuộc dự án <span className="text-red-400">*</span></label>
                  <select value={taskForm.projectId} onChange={e => setTaskForm({...taskForm, projectId: e.target.value})} required className="form-select">
                    <option value="" className="bg-slate-800">— Phân bổ —</option>
                    {projects.map(p => <option key={p.id} value={p.id} className="bg-slate-800">{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Phân công (Assignee)</label>
                  <select value={taskForm.assigneeId} onChange={e => setTaskForm({...taskForm, assigneeId: e.target.value})} className="form-select">
                    <option value="" className="bg-slate-800">— Chưa giao —</option>
                    {employees.map(e => <option key={e.id} value={e.id} className="bg-slate-800">{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Loại Task <span className="text-red-400">*</span></label>
                  <select value={taskForm.type}  onChange={e => setTaskForm({...taskForm, type: e.target.value})} className="form-select">
                    <option value="Epic" className="bg-slate-800">Epic</option>
                    <option value="Story" className="bg-slate-800">Story</option>
                    <option value="Task" className="bg-slate-800">Task</option>
                    <option value="Bug" className="bg-slate-800">Bug</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Estimate (Ngày) <span className="text-red-400">*</span></label>
                  <input type="number" step="0.5" value={taskForm.estimate} onChange={e => setTaskForm({...taskForm, estimate: e.target.value})} required className="form-input" />
                </div>
                <div>
                  <label className="form-label">Trọng số (Weight)</label>
                  <input type="number" value={taskForm.taskWeight} onChange={e => setTaskForm({...taskForm, taskWeight: e.target.value})} className="form-input" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full btn-primary">Tạo Task</button>
                </div>
              </form>
            )}

            {tab === 'assets' && (
              <form onSubmit={addAsset} className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
                <div>
                  <label className="form-label">Mã tài sản <span className="text-red-400">*</span></label>
                  <input placeholder="Ví dụ: LAP_001" value={assetForm.code} onChange={e => setAssetForm({...assetForm, code: e.target.value})} required className="form-input" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Tên tài sản</label>
                  <input placeholder="Ví dụ: MacBook Pro M2" value={assetForm.name} onChange={e => setAssetForm({...assetForm, name: e.target.value})} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Loại (Type)</label>
                  <select value={assetForm.type} onChange={e => setAssetForm({...assetForm, type: e.target.value})} className="form-select">
                    <option value="Laptop" className="bg-slate-800">Laptop</option>
                    <option value="Server" className="bg-slate-800">Server</option>
                    <option value="Software" className="bg-slate-800">Phần mềm</option>
                    <option value="Room" className="bg-slate-800">Phòng họp</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Thuộc dự án (Cấp phát)</label>
                  <select value={assetForm.projectId} onChange={e => setAssetForm({...assetForm, projectId: e.target.value})} className="form-select">
                    <option value="" className="bg-slate-800">— Nằm kho —</option>
                    {projects.map(p => <option key={p.id} value={p.id} className="bg-slate-800">{p.name}</option>)}
                  </select>
                </div>
                <div className="flex items-end col-start-4">
                  <button type="submit" className="w-full btn-primary">Thêm tài sản</button>
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
                <th className="table-th">Phòng ban</th>
                <th className="table-th">Cost/Hr</th>
                <th className="table-th w-1/3">Kỹ năng</th>
                <th className="table-th-right"></th>
              </tr></thead>
              <tbody>
                {employees.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-slate-600">Chưa có nhân viên nào</td></tr>}
                {employees.map(e => (
                  <tr key={e.id} className="table-tr">
                    <td className="table-td text-slate-500">{e.id}</td>
                    <td className="table-td font-medium text-white">
                      {e.name}
                      <p className="text-xs text-slate-500 font-normal">{e.position || '—'}</p>
                    </td>
                    <td className="table-td">{e.department || '—'}</td>
                    <td className="table-td text-amber-400 font-medium">${e.costPerHour}</td>
                    <td className="table-td">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(e.skills || {}).map(([skill, lvl]) => (
                          <span key={skill} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                            {skill}: <span className="text-indigo-400">{lvl}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="table-td-right">
                      <button onClick={() => deleteItem('employees', e.id)} className="btn-danger-text">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'tasks' && (
            <table className="table-main">
              <thead><tr>
                <th className="table-th">Task</th>
                <th className="table-th">Dự án</th>
                <th className="table-th">Loại</th>
                <th className="table-th">Assignee</th>
                <th className="table-th text-center">Estimate</th>
                <th className="table-th text-center">Trọng số</th>
                <th className="table-th-right"></th>
              </tr></thead>
              <tbody>
                {tasks.length === 0 && <tr><td colSpan="7" className="text-center py-12 text-slate-600">Chưa có công việc nào</td></tr>}
                {tasks.map(t => (
                  <tr key={t.id} className="table-tr">
                    <td className="table-td font-medium text-white">{t.name}</td>
                    <td className="table-td">{t.projectName}</td>
                    <td className="table-td">
                      <span className={`px-2 py-1 rounded text-xs border ${
                        t.type === 'Bug' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        t.type === 'Epic' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>{t.type}</span>
                    </td>
                    <td className="table-td">{t.assigneeName}</td>
                    <td className="table-td text-center">{t.estimate}d</td>
                    <td className="table-td text-center text-slate-400">{t.taskWeight}</td>
                    <td className="table-td-right">
                      <button onClick={() => deleteItem('tasks', t.id)} className="btn-danger-text">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'assets' && (
            <table className="table-main">
              <thead><tr>
                <th className="table-th">Mã Code</th>
                <th className="table-th">Tên tài sản</th>
                <th className="table-th">Loại</th>
                <th className="table-th">Dự án sử dụng</th>
                <th className="table-th">Trạng thái</th>
                <th className="table-th-right"></th>
              </tr></thead>
              <tbody>
                {assets.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-slate-600">Chưa có tài sản nào</td></tr>}
                {assets.map(a => (
                  <tr key={a.id} className="table-tr">
                    <td className="table-td font-medium text-slate-300">{a.code}</td>
                    <td className="table-td text-white">{a.name}</td>
                    <td className="table-td text-slate-400">{a.type}</td>
                    <td className="table-td">{a.projectName}</td>
                    <td className="table-td">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        a.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>{a.status === 'available' ? 'Sẵn sàng' : 'Đang dùng'}</span>
                    </td>
                    <td className="table-td-right">
                      <button onClick={() => deleteItem('assets', a.id)} className="btn-danger-text">Xóa</button>
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
