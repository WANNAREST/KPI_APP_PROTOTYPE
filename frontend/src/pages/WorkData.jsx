import { useState, useEffect } from 'react'

const T1 = 'http://localhost:3001'
const T2 = 'http://localhost:3002'

export default function WorkData() {
  const [kpis, setKpis] = useState([])
  const [workData, setWorkData] = useState([])
  const [form, setForm] = useState({ kpiId: '', actual: '', note: '' })
  const [msg, setMsg] = useState('')
  const fetchData = () => {
    fetch(`${T1}/api/kpis`).then(r => r.json()).then(setKpis).catch(() => {})
    fetch(`${T2}/api/workdata`).then(r => r.json()).then(setWorkData).catch(() => {})
  }
  useEffect(fetchData, [])

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.kpiId || !form.actual) { flash('Vui lòng chọn KPI và nhập giá trị'); return }
    await fetch(`${T2}/api/workdata`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ kpiId: '', actual: '', note: '' })
    fetchData(); flash('Đã ghi nhận dữ liệu')
  }

  const deleteEntry = async (id) => {
    await fetch(`${T2}/api/workdata/${id}`, { method: 'DELETE' })
    fetchData(); flash('Đã xóa')
  }

  const enriched = workData.map(w => {
    const kpi = kpis.find(k => k.id === w.kpiId)
    return { ...w, kpiName: kpi?.name || `KPI #${w.kpiId}`, unit: kpi?.unit || '', target: kpi?.target || 0 }
  })

  return (
    <div>
      <p className="page-desc">Ghi nhận dữ liệu thực tế làm được cho từng chỉ số KPI</p>

      {msg && <div className="toast-success">{msg}</div>}

      {/* Form Card */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Ghi nhận dữ liệu mới</h2>
        </div>
        <form onSubmit={handleSubmit} className="card-body grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Chọn KPI <span className="text-red-400">*</span></label>
            <select value={form.kpiId} onChange={e => setForm({...form, kpiId: e.target.value})} required
              className="form-input appearance-none">
              <option value="" className="bg-slate-800">— Chọn KPI —</option>
              {kpis.map(k => <option key={k.id} value={k.id} className="bg-slate-800">{k.name} (Mục tiêu: {k.target} {k.unit})</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Giá trị thực tế <span className="text-red-400">*</span></label>
            <input type="number" placeholder="Nhập giá trị" value={form.actual} onChange={e => setForm({...form, actual: e.target.value})} required
              className="form-input" />
          </div>
          <div>
            <label className="form-label">Ghi chú</label>
            <input placeholder="Tùy chọn" value={form.note} onChange={e => setForm({...form, note: e.target.value})}
              className="form-input" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full btn-primary">Ghi nhận</button>
          </div>
        </form>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Dữ liệu đã ghi nhận ({enriched.length})</h2>
        </div>
        <div className="table-container">
          <table className="table-main">
            <thead>
              <tr>
                <th className="table-th">ID</th>
                <th className="table-th">Chỉ số KPI</th>
                <th className="table-th-right">Mục tiêu</th>
                <th className="table-th-right">Thực tế</th>
                <th className="table-th">Ghi chú</th>
                <th className="table-th">Ngày ghi</th>
                <th className="table-th-right"></th>
              </tr>
            </thead>
            <tbody>
              {enriched.length === 0 && <tr><td colSpan="7" className="text-center py-12 text-slate-600">Chưa có dữ liệu</td></tr>}
              {enriched.map(w => (
                <tr key={w.id} className="table-tr">
                  <td className="table-td text-slate-500">{w.id}</td>
                  <td className="table-td font-medium text-white">{w.kpiName}</td>
                  <td className="table-td-right">{w.target} {w.unit}</td>
                  <td className="table-td-right font-medium text-indigo-300">{w.actual} {w.unit}</td>
                  <td className="table-td">{w.note || '—'}</td>
                  <td className="table-td text-xs">{new Date(w.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="table-td-right">
                    <button onClick={() => deleteEntry(w.id)} className="btn-danger-text">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
