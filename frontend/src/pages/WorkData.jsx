import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { MOCK_TASKS, MOCK_EMPLOYEES, MOCK_WORKLOGS } from '../mock/mockData'

const T1 = 'http://localhost:3001'
const T2 = 'http://localhost:3002'

export default function WorkData() {
  const [tasks, setTasks] = useState(MOCK_TASKS || [])
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES)
  const [workLogs, setWorkLogs] = useState(MOCK_WORKLOGS)

  const fetchData = () => {
    fetch(`${T1}/api/tasks`).then(r => r.json()).then(data => data.length && setTasks(data)).catch(() => {})
    fetch(`${T1}/api/employees`).then(r => r.json()).then(data => data.length && setEmployees(data)).catch(() => {})
    fetch(`${T2}/api/worklogs`).then(r => r.json()).then(data => data.length && setWorkLogs(data)).catch(() => {})
  }
  useEffect(() => {
    fetchData()
  }, [])



  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${T2}/api/workdata/tasks/${taskId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Đã chuyển trạng thái sang ${newStatus}`);
        fetchData();
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
                    <p className="font-medium text-stone-900">{t.name}</p>
                    <p className="text-[10px] text-stone-500 mt-1">Dự án: {t.projectName} • Estimate: {t.estimate}d</p>
                  </td>
                  <td className="table-td">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white text-stone-600">{t.type}</span>
                  </td>
                  <td className="table-td text-rose-600">{t.assigneeName}</td>
                  <td className="table-td text-center">
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="table-td-center">
                    <div className="flex items-center justify-center gap-2">
                      {t.status === 'Todo' && (
                        <button onClick={() => handleStatusChange(t.id, 'Inprogress')} className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded text-xs transition">
                          ▶ Bắt đầu làm (Inprogress)
                        </button>
                      )}
                      {t.status === 'Inprogress' && (
                        <button onClick={() => handleStatusChange(t.id, 'Done')} className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded text-xs transition">
                          ✔ Hoàn thành (Done)
                        </button>
                      )}
                      {t.status !== 'Done' && t.status !== 'WontDo' && (
                        <button onClick={() => handleStatusChange(t.id, 'WontDo')} className="text-[10px] text-stone-500 hover:text-red-400 transition" title="Hủy bỏ/Không làm nữa">
                          ✕
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
                  <td className="table-td text-stone-500">#{w.id}</td>
                  <td className="table-td text-xs text-stone-600">
                    {new Date(w.timestamp).toLocaleTimeString('vi-VN')} {new Date(w.timestamp).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="table-td text-rose-600 font-medium">{w.employeeName}</td>
                  <td className="table-td text-stone-900">{w.taskName}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getStatusColor(w.oldStatus)}`}>{w.oldStatus}</span>
                      <span className="text-stone-500">→</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getStatusColor(w.newStatus)}`}>{w.newStatus}</span>
                    </div>
                  </td>
                  <td className="table-td italic text-stone-500">{w.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


