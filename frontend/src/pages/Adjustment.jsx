import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sparkline from '../components/Sparkline'
import Modal from '../components/Modal'
const T1 = 'http://localhost:3001'
const T4 = 'http://localhost:3004'
// ── Recommendation Logic ──
const scoreLabel = (score) => {
  if (score >= 90) return { text: 'Thưởng / Tăng Level', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' }
  if (score >= 70) return { text: 'Đạt / Cần theo dõi thêm', color: 'bg-teal-500/10 text-teal-600 border-teal-500/20' }
  return { text: 'Phạt / PIP (Cần cải thiện)', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' }
}
export default function Adjustment() {
  const [adjustments, setAdjustments] = useState([])
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const fetchData = () => {
    fetch(`${T4}/api/adjustments`).then(r => r.json()).then(setAdjustments).catch(() => {})
  }
  useEffect(fetchData, [])
  // Cập nhật chi tiết (Notes, NextTarget)
  const updateDetails = async (id, field, value) => {
    await fetch(`${T4}/api/adjust/summary/${id}/details`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value })
    })
    fetchData()
  }
  // Handle Note input blur
  const handleNoteBlur = (id, value) => {
    updateDetails(id, 'note', value)
  }

  // ── Chốt & Chuyển kỳ ──
  const handleCloseCycle = async () => {
    setIsClosing(true)
    for (const a of adjustments) {
      if (!a.isClosed) {
        // Cập nhật T4 trạng thái isClosed = true
        await updateDetails(a.id, 'isClosed', true)
      }
    }
    setIsClosing(false)
    setShowModal(false)
    fetchData()
    toast.success('Đã chốt kỳ thành công cho tất cả đối tượng!')
  }
  const passed = adjustments.filter(a => a.overallScore >= 80).length
  const failed = adjustments.filter(a => a.overallScore < 80).length
  const isAllClosed = adjustments.length > 0 && adjustments.every(a => a.isClosed)
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="page-desc">Xem, nhận xét hiệu suất tổng hợp và đề xuất hành động cho Dự án/Nhân sự</p>
        {adjustments.length > 0 && (
          <button 
            onClick={() => setShowModal(true)}
            disabled={isAllClosed}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              isAllClosed 
                ? 'bg-emerald-500/10 text-emerald-500 cursor-not-allowed border border-emerald-500/20' 
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-sm cursor-pointer'
            }`}
          >
            {isAllClosed ? '✓ Đã chốt kỳ này' : 'Chốt sổ Dữ liệu'}
          </button>
        )}
      </div>
      {adjustments.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide">Đối tượng Xuất sắc (≥80đ)</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">{passed}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-lg text-emerald-400">🏆</div>
          </div>
          <div className="card p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide">Cần cải thiện (&lt;80đ)</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{failed}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-lg text-red-400">⚠️</div>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-header border-none pb-2">
          <div>
            <h2 className="card-title">Phân tích & Quản lý Biện pháp ({adjustments.length})</h2>
            <p className="text-xs text-stone-600 mt-0.5">Quyết định các hành động tối ưu cho chu kỳ công việc tiếp theo</p>
          </div>
        </div>
        <div className="table-container pt-2 pb-4">
          <table className="table-main">
            <thead>
              <tr>
                <th className="table-th w-48">Đối tượng</th>
                <th className="table-th text-center">Xu hướng</th>
                <th className="table-th-right">Điểm hệ thống</th>
                <th className="table-th">Khuyến nghị Hành động</th>
                <th className="table-th-center">Xếp loại</th>
                <th className="table-th w-32 hidden">Mục tiêu kỳ sau</th>
                <th className="table-th w-64">Kế hoạch hỗ trợ / Lý do thưởng</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.length === 0 && (
                <tr><td colSpan="7" className="text-center py-16 text-stone-600">
                  Hãy vào trang Evaluation (T3) để tính toán điểm hiệu suất
                </td></tr>
              )}
              {adjustments.map(a => {
                const rec = scoreLabel(a.overallScore)
                const isPass = a.overallScore >= 80;
                return (
                  <tr key={a.id} className={`table-tr ${a.isClosed ? 'opacity-60 bg-stone-100' : ''}`}>
                    <td className="table-td">
                      <p className="font-medium text-stone-900">{a.name}</p>
                      <p className="text-[10px] text-stone-600 mt-0.5 uppercase tracking-wide">{a.type === 'Project' ? 'Dự án' : 'Nhân sự'}</p>
                    </td>
                    <td className="table-td-center">
                      <Sparkline score={a.overallScore} />
                    </td>
                    <td className="table-td-right">
                      <span className={`text-xl font-bold tracking-tight ${isPass ? 'text-emerald-400' : 'text-amber-600'}`}>
                        {a.overallScore}đ
                      </span>
                      <p className="text-[10px] text-stone-500 whitespace-nowrap">Vel: {a.metrics.velocity.actual} | Cmp: {a.metrics.completionRate.actual}%</p>
                    </td>
                    <td className="table-td">
                      {a.needsAdjustment ? (
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20">CẦN ĐIỀU CHỈNH</span>
                          {a.suggestions.map((s, idx) => (
                            <p key={idx} className="text-[10px] text-stone-500 italic">• {s}</p>
                          ))}
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-medium border ${rec.color}`}>
                          {rec.text}
                        </span>
                      )}
                    </td>
                    <td className="table-td-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold ${
                        isPass ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {isPass ? 'Tốt' : 'Cần cải thiện'}
                      </span>
                    </td>
                    <td className="table-td hidden">
                      {/* Hidden in new UI for now to reduce clutter, could be brought back */}
                    </td>
                    <td className="table-td">
                      <div className="relative w-full group">
                        <textarea 
                          rows="2"
                          defaultValue={a.note}
                          placeholder={a.isClosed ? "Không có ghi chú" : "Mô tả giải pháp, tiền thưởng..."}
                          disabled={a.isClosed}
                          onBlur={(e) => handleNoteBlur(a.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-transparent border border-transparent group-hover:bg-stone-50 focus:bg-stone-50 focus:border-rose-500/50 text-sm transition focus:outline-none disabled:opacity-50 resize-none leading-relaxed"
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Chốt sổ kết quả đánh giá">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 text-sm text-amber-200">
          <p className="font-semibold mb-1 text-amber-300">Lưu ý quan trọng:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Khóa dữ liệu toàn bộ đánh giá trong phiên này (không thể chỉnh sửa kế hoạch/ghi chú).</li>
            <li>In kết quả và lưu vào lịch sử hoạt động để phòng nhân sự chi thưởng.</li>
          </ul>
        </div>

        <div className="max-h-[40vh] overflow-y-auto mb-6 pr-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 text-xs uppercase border-b border-stone-200">
                <th className="pb-2 text-left text-stone-600 font-semibold">Tên nhân sự / ID</th>
                <th className="pb-2 text-center text-stone-600 font-semibold">Vai trò</th>
                <th className="pb-2 text-center text-stone-600 font-semibold">Điểm KPI</th>
                <th className="pb-2 text-right text-rose-600 font-semibold">Đánh giá chung</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.filter(a => !a.isClosed).map(a => (
                <tr key={a.id} className="border-b border-white/[0.03]">
                  <td className="py-2 text-stone-700">{a.name}</td>
                  <td className="py-2 text-right text-stone-500">{a.overallScore}đ</td>
                  <td className="py-2 text-right font-medium text-emerald-400">{a.overallScore >= 80 ? 'Hoàn thành tốt' : 'Không đạt KPI'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
          <button 
            onClick={() => setShowModal(false)}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
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
      </Modal>
    </div>
  )
}


