export const ProjectTable = ({ projects, deleteItem, onAssign }) => (
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
      {projects.length === 0 && <tr><td colSpan="7" className="text-center py-12 text-stone-600">Chưa có dự án nào</td></tr>}
      {projects.map(p => (
        <tr key={p.id} className="table-tr">
          <td className="table-td text-stone-500">{p.id}</td>
          <td className="table-td font-medium text-stone-900">{p.name}</td>
          <td className="table-td">{p.startDate || '—'}</td>
          <td className="table-td">{p.endDate || '—'}</td>
          <td className="table-td">
            <span className={`px-2 py-0.5 mt-1 inline-block rounded-lg text-[10px] font-bold ${p.status === 'Planning' ? 'bg-amber-500/15 text-amber-600' :
                'bg-teal-500/15 text-teal-600'
              }`}>{p.status}</span>
          </td>
          <td className="table-td">{p.sprints}</td>
          <td className="table-td-right flex gap-2 justify-end">
            {p.status === 'Planning' && (
              <button onClick={() => onAssign(p.id)} className="px-3 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-lg hover:bg-rose-600 shadow-md">
                Phân công
              </button>
            )}
            <button onClick={() => deleteItem('projects', p.id)} className="btn-danger-text">Xóa</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const EmployeeTable = ({ employees, deleteItem }) => (
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
      {employees.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-stone-600">Chưa có nhân viên nào</td></tr>}
      {employees.map(e => (
        <tr key={e.id} className="table-tr">
          <td className="table-td text-stone-500">{e.id}</td>
          <td className="table-td font-medium text-stone-900">
            {e.name}
            <p className="text-xs text-stone-500 font-normal">{e.position || '—'}</p>
          </td>
          <td className="table-td">{e.department || '—'}</td>
          <td className="table-td text-amber-600 font-medium">${e.costPerHour}</td>
          <td className="table-td">
            <div className="flex flex-wrap gap-1">
              {Object.entries(e.skills || {}).map(([skill, lvl]) => (
                <span key={skill} className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-[10px] text-stone-700 font-semibold">
                  {skill}: <span className="text-rose-600">{lvl}</span>
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
);

export const TaskTable = ({ tasks, deleteItem }) => (
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
      {tasks.length === 0 && <tr><td colSpan="7" className="text-center py-12 text-stone-600">Chưa có công việc nào</td></tr>}
      {tasks.map(t => (
        <tr key={t.id} className="table-tr">
          <td className="table-td font-medium text-stone-900">{t.name}</td>
          <td className="table-td">{t.projectName}</td>
          <td className="table-td">
            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${t.type === 'Bug' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                t.type === 'Epic' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-teal-500/10 text-teal-600 border-teal-500/20'
              }`}>{t.type}</span>
          </td>
          <td className="table-td">{t.assigneeName}</td>
          <td className="table-td text-center">{t.estimate}d</td>
          <td className="table-td text-center text-stone-600">{t.taskWeight}</td>
          <td className="table-td-right">
            <button onClick={() => deleteItem('tasks', t.id)} className="btn-danger-text">Xóa</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const AssetTable = ({ assets, deleteItem }) => (
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
      {assets.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-stone-600">Chưa có tài sản nào</td></tr>}
      {assets.map(a => (
        <tr key={a.id} className="table-tr">
          <td className="table-td font-medium text-stone-700">{a.code}</td>
          <td className="table-td text-stone-900">{a.name}</td>
          <td className="table-td text-stone-600">{a.type}</td>
          <td className="table-td">{a.projectName}</td>
          <td className="table-td">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-600'
              }`}>{a.status === 'available' ? 'Sẵn sàng' : 'Đang dùng'}</span>
          </td>
          <td className="table-td-right">
            <button onClick={() => deleteItem('assets', a.id)} className="btn-danger-text">Xóa</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const KpiTable = ({ kpis, deleteItem }) => (
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
      {kpis.length === 0 && <tr><td colSpan="7" className="text-center py-12 text-stone-600">Chưa có KPI nào</td></tr>}
      {kpis.map(k => (
        <tr key={k.id} className="table-tr">
          <td className="table-td text-stone-500">{k.id}</td>
          <td className="table-td font-medium text-stone-900">{k.name}</td>
          <td className="table-td-right text-stone-700">{k.target}</td>
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
);


