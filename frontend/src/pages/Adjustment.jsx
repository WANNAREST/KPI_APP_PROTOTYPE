import { useState, useEffect } from 'react'

const T1 = 'http://localhost:3001'
const T4 = 'http://localhost:3004'

// ── Mini Sparkline Component ──
const Sparkline = ({ data }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data) * 0.8; 
  const max = Math.max(...data) * 1.1;
  const range = max - min || 1;
  
  const width = 60;
  const height = 24;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - ((d - min) / range) * height}`).join(' ');

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={width} height={height} className="overflow-visible">
        <polyline points={points} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - ((d - min) / range) * height} r="2" fill="#818cf8" />
        ))}
      </svg>
      <span className="text-[10px] text-slate-500">Kỳ trước → nay</span>
    </div>
  )
}

// ── Recommendation Logic ──
const getRecommendation = (perf) => {
  if (perf >= 150) return { text: 'Tăng mục tiêu', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' }
  if (perf < 50) return { text: 'Cần hỗ trợ', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
  return { text: 'Giữ nguyên', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
}

export default function Adjustment() {
  const [adjustments, setAdjustments] = useState([])
  const [msg, setMsg] = useState('')
  const [editingId, setEditingId] = useState(null)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const fetchData = () => {
    fetch(`${T4}/api/adjustments`).then(r => r.json()).then(setAdjustments).catch(() => {})
  }
  useEffect(fetchData, [])

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }

  // Cập nhật trạng thái thủ công (Đạt/Không đạt)
  const toggleStatus = async (kpiId, currentStatus, isClosed) => {
    if (isClosed) return flash('Kỳ đánh giá đã chốt, không thể sửa!');
    const newStatus = currentStatus === 'Đạt' ? 'Không đạt' : 'Đạt'
    await fetch(`${T4}/api/adjust/${kpiId}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    fetchData()
  }

  // Cập nhật chi tiết (Notes, NextTarget)
  const updateDetails = async (kpiId, field, value) => {
    await fetch(`${T4}/api/adjust/${kpiId}/details`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value })
    })
    fetchData()
  }

  // Handle Note input blur
  const handleNoteBlur = (kpiId, value) => {
    updateDetails(kpiId, 'note', value)
  }

  // Handle Next Target input blur
  const handleTargetBlur = (kpiId, value) => {
    updateDetails(kpiId, 'nextTarget', Number(value))
    setEditingId(null)
  }

  // ── Chốt & Chuyển kỳ ──
  const handleCloseCycle = async () => {
    setIsClosing(true)
    for (const a of adjustments) {
      if (!a.isClosed) {
        // 1. Gửi T1 để cập nhật mục tiêu mới
        await fetch(`${T1}/api/kpis/${a.kpiId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: a.nextTarget })
        }).catch(console.error)
        
        // 2. Cập nhật T4 trạng thái isClosed = true
        await updateDetails(a.kpiId, 'isClosed', true)
      }
    }
    setIsClosing(false)
    setShowModal(false)
    fetchData()
    flash('Đã chốt kỳ thành công & chuyển mục tiêu sang T1!')
  }

  const passed = adjustments.filter(a => a.status === 'Đạt').length
  const failed = adjustments.filter(a => a.status !== 'Đạt').length
  const isAllClosed = adjustments.length > 0 && adjustments.every(a => a.isClosed)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-base text-slate-500">Xem, nhận xét hiệu suất và đề xuất mục tiêu cho chu kỳ tiếp theo</p>
        
        {adjustments.length > 0 && (
          <button 
            onClick={() => setShowModal(true)}
            disabled={isAllClosed}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              isAllClosed 
                ? 'bg-emerald-500/10 text-emerald-500 cursor-not-allowed border border-emerald-500/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 cursor-pointer'
            }`}
          >
            {isAllClosed ? '✓ Đã chốt kỳ này' : 'Chốt & Chuyển kỳ'}
          </button>
        )}
      </div>

      {msg && <div className="toast-success">{msg}</div>}

      {/* Stats */}
      {adjustments.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">KPI Đạt mục tiêu</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">{passed}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-lg text-emerald-400">✓</div>
          </div>
          <div className="card p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Không đạt mục tiêu</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{failed}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-lg text-red-400">✗</div>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="card">
        <div className="card-header border-none pb-2">
          <div>
            <h2 className="card-title">Phân tích & Điều chỉnh KPI ({adjustments.length})</h2>
            <p className="text-xs text-slate-600 mt-0.5">Hệ thống tự động đưa ra đề xuất dựa trên xu hướng hiệu suất</p>
          </div>
        </div>
        <div className="table-container pt-2 pb-4">
          <table className="table-main">
            <thead>
              <tr>
                <th className="table-th w-48">KPI</th>
                <th className="table-th text-center">Xu hướng</th>
                <th className="table-th-right">Hiệu suất</th>
                <th className="table-th">Gợi ý hệ thống</th>
                <th className="table-th-center">Trạng thái</th>
                <th className="table-th w-40">Mục tiêu kỳ sau</th>
                <th className="table-th w-64">Ghi chú (Lý do)</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.length === 0 && (
                <tr><td colSpan="7" className="text-center py-16 text-slate-600">
                  Hãy vào trang Evaluation (T3) để tính toán trước
                </td></tr>
              )}
              {adjustments.map(a => {
                const rec = getRecommendation(a.performance)
                return (
                  <tr key={a.kpiId} className={`table-tr ${a.isClosed ? 'opacity-60 bg-black/20' : ''}`}>
                    <td className="table-td">
                      <p className="font-medium text-white">{a.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{a.employeeName} • {a.projectName}</p>
                    </td>
                    <td className="table-td-center">
                      <Sparkline data={a.history} />
                    </td>
                    <td className="table-td-right">
                      <span className={`text-base font-medium ${a.performance >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {a.performance}%
                      </span>
                      <p className="text-[10px] text-slate-500">{a.actual}/{a.target}</p>
                    </td>
                    <td className="table-td">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-medium border ${rec.color}`}>
                        {rec.text}
                      </span>
                    </td>
                    <td className="table-td-center">
                      <button 
                        onClick={() => toggleStatus(a.kpiId, a.status, a.isClosed)}
                        disabled={a.isClosed}
                        className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-medium transition ${
                          a.isClosed ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                        } ${
                          a.status === 'Đạt'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                        {a.status}
                      </button>
                    </td>
                    <td className="table-td">
                      {editingId === a.kpiId && !a.isClosed ? (
                        <input 
                          type="number" 
                          autoFocus
                          defaultValue={a.nextTarget}
                          onBlur={(e) => handleTargetBlur(a.kpiId, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                          className="w-full px-2 py-1.5 rounded bg-black/40 border border-indigo-500/50 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-indigo-300"
                        />
                      ) : (
                        <div 
                          onClick={() => !a.isClosed && setEditingId(a.kpiId)}
                          className={`px-2 py-1.5 rounded border border-transparent text-sm flex items-center justify-between group ${
                            a.isClosed ? '' : 'cursor-pointer hover:bg-white/5 hover:border-white/10'
                          }`}
                          title={a.isClosed ? '' : 'Nhấn để sửa'}
                        >
                          <span className="text-indigo-300 font-medium">{a.nextTarget} {a.unit}</span>
                          {!a.isClosed && <span className="text-slate-600 opacity-0 group-hover:opacity-100 text-xs">✎</span>}
                        </div>
                      )}
                    </td>
                    <td className="table-td">
                      <input 
                        type="text" 
                        defaultValue={a.note}
                        placeholder={a.isClosed ? "Không có ghi chú" : "Nhập lý do sai lệch..."}
                        disabled={a.isClosed}
                        onBlur={(e) => handleNoteBlur(a.kpiId, e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-transparent border border-transparent hover:border-white/10 focus:border-indigo-500/50 focus:bg-white/5 text-sm transition focus:outline-none disabled:opacity-50"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Chốt Kỳ ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-2xl bg-[#0f1523] shadow-2xl border-white/10">
            <div className="card-header border-white/10">
              <h2 className="text-lg font-semibold text-white">Chốt kỳ & Duyệt mục tiêu mới</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="card-body">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-6 text-sm text-indigo-200">
                <p className="font-semibold mb-1 text-indigo-300">Lưu ý quan trọng:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hành động này sẽ khóa dữ liệu của kỳ hiện tại (không thể chỉnh sửa nữa).</li>
                  <li>Các mục tiêu kỳ sau (Next Target) sẽ được tự động đồng bộ sang Service T1 để bắt đầu chu kỳ mới.</li>
                </ul>
              </div>

              <div className="max-h-[40vh] overflow-y-auto mb-6 pr-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 text-xs uppercase border-b border-white/10">
                      <th className="pb-2">KPI</th>
                      <th className="pb-2 text-right">Mục tiêu cũ</th>
                      <th className="pb-2 text-right text-indigo-400">Mục tiêu mới</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adjustments.filter(a => !a.isClosed).map(a => (
                      <tr key={a.kpiId} className="border-b border-white/[0.03]">
                        <td className="py-2 text-slate-300">{a.name}</td>
                        <td className="py-2 text-right text-slate-500">{a.target}</td>
                        <td className="py-2 text-right font-medium text-indigo-300">{a.nextTarget} {a.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleCloseCycle}
                  disabled={isClosing}
                  className="btn-primary flex items-center gap-2"
                >
                  {isClosing ? 'Đang xử lý...' : 'Xác nhận Chốt Kỳ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
