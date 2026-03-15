import { useState } from 'react'

const T3 = 'http://localhost:3003'
const T4 = 'http://localhost:3004'

export default function Evaluation() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [evaluated, setEvaluated] = useState(false)
  const [msg, setMsg] = useState('')

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }

  const handleEvaluate = async () => {
    setLoading(true)
    try {
      const evalRes = await fetch(`${T3}/api/evaluate`)
      const evalData = await evalRes.json()
      if (!evalData.results?.length) {
        flash('Chưa có dữ liệu KPI để đánh giá'); setLoading(false); return
      }
      const adjRes = await fetch(`${T4}/api/adjust`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: evalData.results })
      })
      const adjData = await adjRes.json()
      setResults(adjData.adjustments)
      setEvaluated(true)
      flash('Đánh giá hoàn tất')
    } catch {
      flash('Lỗi kết nối. Kiểm tra T1, T2, T3, T4 đang chạy.')
    }
    setLoading(false)
  }

  const passed = results.filter(r => r.status === 'Đạt').length
  const failed = results.filter(r => r.status !== 'Đạt').length
  const avg = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.performance, 0) / results.length) : 0

  return (
    <div>
      <p className="page-desc">Tính toán hiệu suất bằng cách lấy dữ liệu từ T1 & T2</p>

      {msg && <div className="toast-success">{msg}</div>}

      {/* Action */}
      <div className="card p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="card-title mb-1">Tính toán kết quả đánh giá</h2>
          <p className="text-xs text-slate-500">T3 gọi API đến T1 (mục tiêu) và T2 (thực tế), tính hiệu suất (%) → gửi qua T4 lưu trạng thái.</p>
        </div>
        <button onClick={handleEvaluate} disabled={loading}
          className="btn-primary disabled:opacity-50 whitespace-nowrap">
          {loading ? 'Đang tính...' : 'Tính toán kết quả'}
        </button>
      </div>

      {/* Stats */}
      {evaluated && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{passed}</p>
            <p className="text-xs text-slate-500 mt-1">Đạt</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{failed}</p>
            <p className="text-xs text-slate-500 mt-1">Không đạt</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{avg}%</p>
            <p className="text-xs text-slate-500 mt-1">Hiệu suất TB</p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="card">
        <div className="card-header pb-2 border-none">
          <h2 className="card-title">Kết quả đánh giá ({results.length})</h2>
        </div>
        <div className="table-container pt-2">
          <table className="table-main">
            <thead>
              <tr>
                <th className="table-th">KPI</th>
                <th className="table-th">Dự án</th>
                <th className="table-th">Nhân viên</th>
                <th className="table-th-right">Mục tiêu</th>
                <th className="table-th-right">Thực tế</th>
                <th className="table-th-right">Hiệu suất</th>
                <th className="table-th-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && (
                <tr><td colSpan="7" className="text-center py-16 text-slate-600">
                  Nhấn "Tính toán kết quả" để bắt đầu đánh giá
                </td></tr>
              )}
              {results.map(r => (
                <tr key={r.kpiId} className="table-tr">
                  <td className="table-td font-medium text-white">{r.name}</td>
                  <td className="table-td">{r.projectName}</td>
                  <td className="table-td">{r.employeeName}</td>
                  <td className="table-td-right text-slate-300">{r.target} {r.unit}</td>
                  <td className="table-td-right text-slate-300">{r.actual} {r.unit}</td>
                  <td className="table-td-right">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className={`h-full rounded-full ${r.performance >= 100 ? 'bg-emerald-400' : r.performance >= 70 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${Math.min(r.performance, 100)}%` }}></div>
                      </div>
                      <span className={`text-xs font-medium ${r.performance >= 100 ? 'text-emerald-400' : r.performance >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                        {r.performance}%
                      </span>
                    </div>
                  </td>
                  <td className="table-td-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                      r.status === 'Đạt'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {r.status}
                    </span>
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
