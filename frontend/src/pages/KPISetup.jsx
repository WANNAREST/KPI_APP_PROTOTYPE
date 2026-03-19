import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ProjectForm, EmployeeForm, TaskForm, AssetForm, KpiForm } from '../components/KPISetupForms'
import { ProjectTable, EmployeeTable, TaskTable, AssetTable, KpiTable } from '../components/KPISetupTables'
import Modal from '../components/Modal'

const T1 = 'http://localhost:3001'

export default function KPISetup() {
  const [tab, setTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [kpis, setKpis] = useState([])
  const [tasks, setTasks] = useState([])
  const [assets, setAssets] = useState([])
  // ── Form states ──
  const [projForm, setProjForm] = useState({ name: '', startDate: '', endDate: '', status: 'Planning', sprints: 1, requirementsList: [{ name: '', skills: [], weight: 1 }] })
  const [empForm, setEmpForm] = useState({ name: '', position: '', department: '', costPerHour: 10, skills: '' })
  const [kpiForm, setKpiForm] = useState({ name: '', target: '', unit: '', projectId: '', employeeId: '' })
  const [taskForm, setTaskForm] = useState({ name: '', projectId: '', assigneeId: '', type: 'Task', estimate: 1, taskWeight: 1, tags: '' })
  const [assetForm, setAssetForm] = useState({ name: '', code: '', type: 'Laptop', projectId: '', status: 'available' })
  const [showForm, setShowForm] = useState(false)
  
  // ── Assignment Preview States ──
  const [assignModal, setAssignModal] = useState({ isOpen: false, projectId: null, algo: 'skill' })
  const [previewData, setPreviewData] = useState([])
  const [loadingPreview, setLoadingPreview] = useState(false)
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
    const taskList = projForm.requirementsList.filter(r => r.name.trim() !== '');

    try {
      const res = await fetch(`${T1}/api/projects`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...projForm, requirements: { taskList } })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Lỗi hệ thống');
      setProjForm({ name: '', startDate: '', endDate: '', status: 'Planning', sprints: 1, requirementsList: [{ name: '', skills: [], weight: 1 }] })
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

  // ── Assignment Logic ──
  const fetchPreview = async (projectId, algo) => {
    setLoadingPreview(true);
    try {
      const res = await fetch(`${T1}/api/projects/${projectId}/assign/preview?algo=${algo}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi preview');
      setPreviewData(data.assignments);
    } catch (err) { toast.error(err.message) }
    setLoadingPreview(false);
  }

  const commitAssignment = async () => {
    try {
      const res = await fetch(`${T1}/api/projects/${assignModal.projectId}/assign/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignments: previewData })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Lỗi commit');
      toast.success('Đã phê duyệt phân công và tạo KPI');
      setAssignModal({ isOpen: false, projectId: null, algo: 'skill' });
      fetchAll();
    } catch (err) { toast.error(err.message) }
  }

  const openAssignModal = (projectId) => {
    setAssignModal({ isOpen: true, projectId, algo: 'skill' });
    fetchPreview(projectId, 'skill');
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
              className={`pb-3 px-1 text-sm font-semibold transition-colors duration-200 border-b-2 flex-1 text-center ${
                tab === t.key
                ? 'bg-rose-500/15 text-rose-600 border-rose-400'
                : 'border-transparent text-stone-600 hover:text-stone-800 hover:bg-stone-100'
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

        {/* ── Add Form Modal ── */}
        <Modal 
          isOpen={showForm} 
          onClose={() => setShowForm(false)}
          title={
            tab === 'projects' ? 'Thêm Dự án mới' :
            tab === 'employees' ? 'Thêm Nhân viên mới' :
            tab === 'tasks' ? 'Thêm Công việc mới' :
            tab === 'assets' ? 'Thêm Tài sản mới' :
            tab === 'kpis' ? 'Thêm Định nghĩa KPI mới' : 'Thêm mới'
          }
          maxWidth={tab === 'tasks' || tab === 'assets' || tab === 'employees' ? 'max-w-4xl' : 'max-w-3xl'}
        >
          {tab === 'projects' && <ProjectForm addProject={addProject} projForm={projForm} setProjForm={setProjForm} onCancel={() => setShowForm(false)} />}
          {tab === 'employees' && <EmployeeForm addEmployee={addEmployee} empForm={empForm} setEmpForm={setEmpForm} onCancel={() => setShowForm(false)} />}
          {tab === 'tasks' && <TaskForm addTask={addTask} taskForm={taskForm} setTaskForm={setTaskForm} projects={projects} employees={employees} onCancel={() => setShowForm(false)} />}
          {tab === 'assets' && <AssetForm addAsset={addAsset} assetForm={assetForm} setAssetForm={setAssetForm} projects={projects} onCancel={() => setShowForm(false)} />}
          {tab === 'kpis' && <KpiForm addKpi={addKpi} kpiForm={kpiForm} setKpiForm={setKpiForm} projects={projects} employees={employees} onCancel={() => setShowForm(false)} />}
        </Modal>

        {/* ── Tables ── */}
        <div className="table-container pt-2 pb-2">
          {tab === 'projects' && <ProjectTable projects={projects} deleteItem={deleteItem} onAssign={openAssignModal} />}
          {tab === 'employees' && <EmployeeTable employees={employees} deleteItem={deleteItem} />}
          {tab === 'tasks' && <TaskTable tasks={tasks} deleteItem={deleteItem} />}
          {tab === 'assets' && <AssetTable assets={assets} deleteItem={deleteItem} />}
          {tab === 'kpis' && <KpiTable kpis={kpis} deleteItem={deleteItem} />}
        </div>
      </div>

      {/* ── Assignment Preview Modal ── */}
      <Modal 
        isOpen={assignModal.isOpen} 
        onClose={() => setAssignModal({ ...assignModal, isOpen: false })}
        title="Phân công công việc tự động"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-6 p-4 bg-stone-100 rounded-xl">
            <span className="text-sm font-bold text-stone-700">Chọn giải thuật:</span>
            <div className="flex gap-3">
              <button 
                onClick={() => { setAssignModal({...assignModal, algo: 'skill'}); fetchPreview(assignModal.projectId, 'skill') }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${assignModal.algo === 'skill' ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-stone-600 border border-stone-200'}`}
              >
                Skill Match
              </button>
              <button 
                onClick={() => { setAssignModal({...assignModal, algo: 'roundrobin'}); fetchPreview(assignModal.projectId, 'roundrobin') }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${assignModal.algo === 'roundrobin' ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-stone-600 border border-stone-200'}`}
              >
                Round Robin
              </button>
            </div>
          </div>

          <div className="overflow-hidden border border-stone-200 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-stone-500">Tên Task</th>
                  <th className="px-4 py-3 text-xs font-bold text-stone-500">Yêu cầu</th>
                  <th className="px-4 py-3 text-xs font-bold text-stone-500">Phân công</th>
                  <th className="px-4 py-3 text-xs font-bold text-stone-500 text-right">Độ phù hợp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loadingPreview ? (
                  <tr><td colSpan="4" className="px-4 py-10 text-center text-stone-400">Đang tính toán...</td></tr>
                ) : previewData.map((a, i) => (
                  <tr key={i} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-stone-900">{a.taskName}</td>
                    <td className="px-4 py-3 text-xs text-stone-600">
                      { (a.skillsRequired || []).map(sk => `${sk.name}(w:${sk.weight})`).join(', ') } 
                      <span className="text-[10px] text-stone-400 block mt-0.5">Task W: {a.weight}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-rose-600 font-bold">{a.assigneeName}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono">{a.matchScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-stone-200">
            <button onClick={() => setAssignModal({ ...assignModal, isOpen: false })} className="px-6 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100">
              Hủy
            </button>
            <button onClick={commitAssignment} className="px-6 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 shadow-xl">
              Phê duyệt & Tạo KPI
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


