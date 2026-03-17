import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const T3 = 'http://localhost:3003'
const T4 = 'http://localhost:3004'

export default function Evaluation() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [evaluated, setEvaluated] = useState(false)

  const fetchPreviousResults = async () => {
    try {
      const res = await fetch(`${T4}/api/adjustments`)
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) {
          setResults(data)
          setEvaluated(true)
        }
      }
    } catch {
      // Ignore if fetch fails on initial load
    }
  }

  useEffect(() => {
    fetchPreviousResults()
  }, [])
  const handleEvaluate = async () => {
    setLoading(true)
    try {
      const evalRes = await fetch(`${T3}/api/evaluate`)
      const evalData = await evalRes.json()
      if (!evalData.results?.length) {
        toast.warn('Chưa đủ dữ liệu công việc (Task) để tính toán KPI'); setLoading(false); return
      }
      const adjRes = await fetch(`${T4}/api/adjust`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: evalData.results })
      })
      const adjData = await adjRes.json()
      setResults(adjData.adjustments)
      setEvaluated(true)
      toast.success('Tính toán điểm hiệu suất hoàn tất')
    } catch {
      toast.error('Lỗi kết nối. Kiểm tra T1, T2, T3, T4 đang chạy.')
    }
    setLoading(false)
  }

  const projectResults = results.filter(r => r.type === 'Project')
  const employeeResults = results.filter(r => r.type === 'Employee')
  const avg = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.overallScore, 0) / results.length) : 0

  return (
    <div>
      <p className="page-desc">Tính toán hiệu suất bằng cách lấy dữ liệu từ T1 & T2</p>



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
            <p className="text-2xl font-bold text-indigo-400">{projectResults.length}</p>
            <p className="text-xs text-slate-500 mt-1">Dự án được đánh giá</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">{employeeResults.length}</p>
            <p className="text-xs text-slate-500 mt-1">Nhân sự được đánh giá</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{avg}%</p>
            <p className="text-xs text-slate-500 mt-1">Điểm hiệu suất TB</p>
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
                <th className="table-th">Đối tượng</th>
                <th className="table-th text-center">Velocity (ĐV C.Việc)</th>
                <th className="table-th text-center">Hoàn thành (%)</th>
                <th className="table-th text-center">Chất lượng (Quality)</th>
                <th className="table-th text-center">Cycle/On-time</th>
                <th className="table-th-center">Điểm Hiệu Suất Tổng Hợp (Overall)</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && (
                <tr><td colSpan="6" className="text-center py-16 text-slate-600">
                  Nhấn "Tính toán kết quả" để phân tích dữ liệu hiệu suất
                </td></tr>
              )}
              {results.map(r => (
                <tr key={`${r.type}-${r.targetId}`} className="table-tr">
                  <td className="table-td">
                    <p className="font-medium text-white">{r.name}</p>
                    <span className={`px-2 py-0.5 mt-1 inline-block rounded text-[10px] ${r.type === 'Project' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {r.type === 'Project' ? 'Dự án' : 'Nhân sự'}
                    </span>
                  </td>
                  <td className="table-td text-center font-medium text-amber-300">{r.velocity}</td>
                  <td className="table-td text-center text-slate-300">{r.completionRate}%</td>
                  <td className="table-td text-center text-slate-300">
                    <span className={r.quality >= 90 ? 'text-emerald-400' : r.quality >= 70 ? 'text-amber-400' : 'text-red-400'}>
                      {r.quality}%
                    </span>
                  </td>
                  <td className="table-td text-center text-slate-300">{r.cycleTime.toFixed(1)}</td>
                  
                  <td className="table-td-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className={`text-base font-bold ${r.overallScore >= 80 ? 'text-emerald-400' : r.overallScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                        {r.overallScore} điểm
                      </span>
                      <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className={`h-full rounded-full ${r.overallScore >= 80 ? 'bg-emerald-400' : r.overallScore >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${Math.min(r.overallScore, 100)}%` }}></div>
                      </div>
                    </div>
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
