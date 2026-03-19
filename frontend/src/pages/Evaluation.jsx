import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import Modal from '../components/Modal'

const T3 = 'http://localhost:3003'
const T4 = 'http://localhost:3004'

export default function Evaluation() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [evaluated, setEvaluated] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const fetchPreviousResults = async () => {
    try {
      const res = await fetch(`${T4}/api/adjustments`)
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) {
          setResults(data)
          setEvaluated(true)
          setSelectedItem(data[0])
        }
      }
    } catch { }
  }

  useEffect(() => { fetchPreviousResults() }, [])

  const handleEvaluate = async () => {
    setLoading(true)
    try {
      const evalRes = await fetch(`${T3}/api/evaluate`)
      const evalData = await evalRes.json()
      if (!evalData.results?.length) {
        toast.warn('Chưa đủ dữ liệu công việc để tính toán'); setLoading(false); return
      }
      const adjRes = await fetch(`${T4}/api/adjust`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: evalData.results })
      })
      const adjData = await adjRes.json()
      setResults(adjData.adjustments)
      setEvaluated(true)
      setSelectedItem(adjData.adjustments[0])
      toast.success('Tính toán điểm hiệu suất hoàn tất')
    } catch {
      toast.error('Lỗi kết nối. Kiểm tra các Service đang chạy.')
    }
    setLoading(false)
  }

  const prepareChartData = (item) => {
    if (!item) return []
    const m = item.metrics;
    return [
      { subject: 'Velocity', A: (m.velocity.actual / m.velocity.target) * 100, fullMark: 150 },
      { subject: 'Quality', A: m.quality.actual, fullMark: 100 },
      { subject: 'Cycle Time', A: (m.cycleTime.target / m.cycleTime.actual) * 100, fullMark: 150 },
      { subject: 'Completion', A: m.completionRate.actual, fullMark: 100 }
    ]
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10'
    if (score >= 70) return 'text-amber-500 bg-amber-500/10'
    return 'text-rose-500 bg-rose-500/10'
  }

  const [viewMode, setViewMode] = useState('Employee') // 'Employee' or 'Project'
  const filteredResults = results.filter(r => r.type === viewMode)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Action & Summary */}
        <div className="flex-1 space-y-6">
          <div className="card p-6">
            <h2 className="card-title mb-2">KPI Evaluation (Service T3)</h2>
            <p className="text-sm text-stone-500 mb-6">
              Hệ thống tự động tổng hợp dữ liệu Target (T1) và Thực tế (T2) để tính toán hiệu suất dựa trên 4 chỉ số cốt lõi.
            </p>
            <button onClick={handleEvaluate} disabled={loading}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-200 disabled:opacity-50">
              {loading ? 'Đang phân tích...' : 'Tính toán kết quả Đánh giá'}
            </button>
          </div>

          {evaluated && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Dự án/Nhân sự</p>
                <p className="text-2xl font-black text-stone-800">{results.length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Hiệu suất TB</p>
                <p className="text-2xl font-black text-emerald-500">
                  {Math.round(results.reduce((s, r) => s + r.overallScore, 0) / (results.length || 1))}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Visualization */}
        {selectedItem && (
          <div className="flex-[1.5] card p-6 bg-white overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-stone-900">{selectedItem.name}</h3>
                <p className="text-sm text-stone-500 mb-2">Phân tích đa chiều (Radar Chart)</p>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${selectedItem.type === 'Project' ? 'bg-amber-100 text-amber-600' : 'bg-teal-100 text-teal-600'}`}>
                  {selectedItem.type === 'Project' ? 'Dự án' : 'Nhân sự'}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${getScoreColor(selectedItem.overallScore)}`}>
                OVERALL: {selectedItem.overallScore}
              </span>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prepareChartData(selectedItem)}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 10, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name={selectedItem.name}
                    dataKey="A"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.6}
                  />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Main Results Table */}
      <div className="card overflow-hidden">
        <div className="p-1 pb-0 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-stretch sm:items-center">
          {/* Tabs */}
          <div className="flex">
            <button 
              onClick={() => { setViewMode('Employee'); if (results.filter(r => r.type === 'Employee')[0]) setSelectedItem(results.filter(r => r.type === 'Employee')[0]); }}
              className={`px-6 py-4 text-xs font-bold transition-all border-b-2 ${viewMode === 'Employee' ? 'border-rose-500 text-rose-600 bg-white' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
            >
              💼 Xếp hạng Nhân sự
            </button>
            <button 
              onClick={() => { setViewMode('Project'); if (results.filter(r => r.type === 'Project')[0]) setSelectedItem(results.filter(r => r.type === 'Project')[0]); }}
              className={`px-6 py-4 text-xs font-bold transition-all border-b-2 ${viewMode === 'Project' ? 'border-rose-500 text-rose-600 bg-white' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
            >
              🏗️ Tổng quan Dự án
            </button>
          </div>

          <div className="px-6 py-2 flex gap-4 text-[10px] font-bold uppercase text-stone-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tốt (&gt;90)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Khá (70-90)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Cần lưu ý (&lt;70)</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/20">
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase">Đối tượng ({viewMode})</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase text-center">Velocity (Act/Tgt)</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase text-center">Quality</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase text-center">Cycle Ratio</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase text-center">Completion</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase text-center">Overall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredResults.map(r => (
                <tr 
                  key={`${r.type}-${r.id}`} 
                  onClick={() => setSelectedItem(r)}
                  className={`group cursor-pointer transition-all hover:bg-rose-50/30 ${selectedItem?.id === r.id && selectedItem?.type === r.type ? 'bg-rose-50/50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-stone-800 text-sm">{r.name}</p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase">{r.type === 'Project' ? 'Dự án' : 'Nhân sự'}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-bold text-stone-700">{r.metrics.velocity.actual} <span className="text-stone-300 font-normal">/</span> {r.metrics.velocity.target}</p>
                    <div className="w-16 h-1 bg-stone-100 rounded-full mx-auto mt-1">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min((r.metrics.velocity.actual/r.metrics.velocity.target)*100, 100)}%` }}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className={`text-sm font-bold ${r.metrics.quality.actual >= 90 ? 'text-emerald-500' : 'text-rose-500'}`}>{r.metrics.quality.actual}%</p>
                    <p className="text-[9px] text-stone-400 font-bold">Tgt: {r.metrics.quality.target}%</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className={`text-sm font-bold ${r.metrics.cycleTime.actual <= r.metrics.cycleTime.target ? 'text-emerald-500' : 'text-amber-500'}`}>{r.metrics.cycleTime.actual}x</p>
                    <p className="text-[9px] text-stone-400 font-bold">Ratio Actual/Tgt</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-bold text-stone-800">{r.metrics.completionRate.actual}%</p>
                    <div className="w-12 h-1 bg-stone-100 rounded-full mx-auto mt-1">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${r.metrics.completionRate.actual}%` }}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black shadow-sm ${getScoreColor(r.overallScore)}`}>
                        {r.overallScore}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-stone-400 text-sm italic">Nhấn nút phía trên để bắt đầu phân tích dữ liệu thực tế</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


