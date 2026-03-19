import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import { MOCK_TASKS, MOCK_EMPLOYEES, MOCK_WORKLOGS } from '../mock/mockData'

const T1 = 'http://localhost:3001'
const T2 = 'http://localhost:3002'

export default function WorkData() {
  const [tasks, setTasks] = useState(MOCK_TASKS || [])
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES)
  const [workLogs, setWorkLogs] = useState(MOCK_WORKLOGS)
  const [doneModal, setDoneModal] = useState({ isOpen: false, taskId: null, actualDuration: '', bugCount: 0, note: '' })

  const fetchData = () => {
    fetch(`${T1}/api/tasks`).then(r => r.json()).then(data => data.length && setTasks(data)).catch(() => {})
    fetch(`${T1}/api/employees`).then(r => r.json()).then(data => data.length && setEmployees(data)).catch(() => {})
    fetch(`${T2}/api/worklogs`).then(r => r.json()).then(data => data.length && setWorkLogs(data)).catch(() => {})
  }
  useEffect(() => {
    fetchData()
  }, [])



  const handleStatusChange = async (taskId, newStatus, extraData = {}) => {
    try {
      const res = await fetch(`${T2}/api/workdata/tasks/${taskId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, ...extraData })
      });
      if (res.ok) {
        toast.success(`Đã chuyển trạng thái sang ${newStatus}`);
        fetchData();
        setDoneModal({ ...doneModal, isOpen: false });
      } else {
        const err = await res.json();
        toast.error(err.error || 'Lỗi cập nhật trạng thái');
      }
    } catch {
      toast.error('Lỗi kết nối đến server');
    }
  }


  const enrichedLogs = workLogs.map(w => {
    const emp = employees.find(e => e.id === w.employeeId);
    return { ...w, employeeName: emp ? emp.name : 'Unknown' };
  });

  const getStatusColor = (status) => {
    if (status === 'Done') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (status === 'Inprogress') return 'bg-amber-500/15 text-amber-600 border-amber-500/30';
    if (status === 'WontDo') return 'bg-stone-500/15 text-stone-600 border-stone-500/30';
    return 'bg-teal-500/15 text-teal-600 border-teal-500/30';
  };

  return (
    <div>
      <p className="page-desc">Cập nhật tiến độ công việc để hệ thống ghi nhận dữ liệu thực tế</p>

      {/* Task List (Kanban-like List) */}
      <div className="card mb-6">
        <div className="card-header pb-2">
          <h2 className="card-title">Cập nhật trạng thái Task (Bảng công việc)</h2>
        </div>
        <div className="table-container pt-2">
          <table className="table-main">
            <thead>
              <tr>
                <th className="table-th w-1/3">Công việc</th>
                <th className="table-th">Loại</th>
                <th className="table-th">Phân công</th>
                <th className="table-th text-center">Trạng thái hiện tại</th>
                <th className="table-th-center">Cập nhật thành</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && <tr><td colSpan="5" className="text-center py-12 text-stone-500">Chưa có công việc nào cần xử lý</td></tr>}
              {tasks.map(t => (
                <tr key={t.id} className="table-tr">
                  <td className="table-td">
                    <p className="font-bold text-stone-900 text-base">{t.name}</p>
                    <p className="text-xs text-stone-500 mt-1 font-medium">Dự án: {t.projectName} • Estimate: {t.estimate}d</p>
                  </td>
                  <td className="table-td">
                    <span className="px-3 py-1 rounded text-xs bg-stone-100 text-stone-600 font-semibold border border-stone-200">{t.type}</span>
                  </td>
                  <td className="table-td text-rose-600 font-bold text-sm tracking-wide">{t.assigneeName}</td>
                  <td className="table-td text-center">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 shadow-sm ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="table-td-center">
                    <div className="flex items-center justify-center gap-2">
                      {t.status === 'Todo' && (
                        <button onClick={() => handleStatusChange(t.id, 'Inprogress')} className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/30 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm">
                          <span className="text-xs">▶</span> Bắt đầu làm (Inprogress)
                        </button>
                      )}
                      {t.status === 'Inprogress' && (
                        <button 
                          onClick={() => setDoneModal({ isOpen: true, taskId: t.id, actualDuration: t.estimate || '', bugCount: 0, note: '' })} 
                          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="text-xs">✔</span> Hoàn thành (Done)
                        </button>
                      )}
                      {t.status !== 'Done' && t.status !== 'WontDo' && (
                        <button onClick={() => handleStatusChange(t.id, 'WontDo')} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full" title="Hủy bỏ/Không làm nữa">
                          <span className="text-sm font-bold">✕</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Card (WorkLogs) */}
      <div className="card">
        <div className="card-header pb-2">
          <h2 className="card-title">Nhật ký hoạt động ({workLogs.length})</h2>
        </div>
        <div className="table-container pt-2">
          <table className="table-main">
            <thead>
              <tr>
                <th className="table-th w-16">ID</th>
                <th className="table-th">Thời gian</th>
                <th className="table-th">Nhân sự</th>
                <th className="table-th">Task</th>
                <th className="table-th">Thay đổi trạng thái</th>
                <th className="table-th w-1/4">Ghi chú hệ thống</th>
              </tr>
            </thead>
            <tbody>
              {enrichedLogs.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-stone-600">Chưa có hoạt động nào</td></tr>}
              {/* Reverse to show latest first */}
              {enrichedLogs.slice().reverse().map(w => (
                <tr key={w.id} className="table-tr text-sm">
                  <td className="table-td text-stone-400 font-mono">#{w.id}</td>
                  <td className="table-td text-stone-600 font-medium">
                    {new Date(w.timestamp).toLocaleTimeString('vi-VN')} {new Date(w.timestamp).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="table-td text-rose-600 font-bold">{w.employeeName}</td>
                  <td className="table-td text-stone-900 font-semibold">{w.taskName}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border shadow-sm ${getStatusColor(w.oldStatus)}`}>{w.oldStatus}</span>
                      <span className="text-stone-400 font-bold">→</span>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border shadow-sm ${getStatusColor(w.newStatus)}`}>{w.newStatus}</span>
                    </div>
                  </td>
                  <td className="table-td italic text-stone-500 text-xs font-medium">{w.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={doneModal.isOpen} 
        onClose={() => setDoneModal({ ...doneModal, isOpen: false })}
        title="Xác nhận hoàn thành công việc"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Thời gian thực hiện thực tế (Ngày/Giờ)
            </label>
            <input 
              type="number"
              className="form-input"
              value={doneModal.actualDuration}
              onChange={e => setDoneModal({ ...doneModal, actualDuration: e.target.value })}
              placeholder="Nhập số lượng thực tế..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Số lượng bug phát sinh
            </label>
            <input 
              type="number"
              className="form-input"
              value={doneModal.bugCount}
              onChange={e => setDoneModal({ ...doneModal, bugCount: e.target.value })}
              placeholder="Số lỗi phát hiện..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Ghi chú công việc
            </label>
            <textarea 
              className="form-input min-h-[100px]"
              value={doneModal.note}
              onChange={e => setDoneModal({ ...doneModal, note: e.target.value })}
              placeholder="Nhân viên có thể nhập báo cáo nhanh tại đây..."
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button 
              onClick={() => setDoneModal({ ...doneModal, isOpen: false })}
              className="px-6 py-2 rounded-xl text-sm font-bold text-stone-500 hover:bg-stone-100 transition-all"
            >
              Hủy
            </button>
            <button 
              onClick={() => handleStatusChange(doneModal.taskId, 'Done', { 
                actualDuration: doneModal.actualDuration, 
                bugCount: doneModal.bugCount, 
                note: doneModal.note 
              })}
              className="px-6 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
            >
              Xác nhận & Hoàn thành
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


