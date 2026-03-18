export const ProjectForm = ({ addProject, projForm, setProjForm, onCancel }) => (
  <form onSubmit={addProject} className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
    <div className="col-span-2 lg:col-span-3">
      <label className="form-label">Tên dự án <span className="text-red-400">*</span></label>
      <input placeholder="Ví dụ: Dự án phát triển App KPI" value={projForm.name} onChange={e => setProjForm({ ...projForm, name: e.target.value })} required
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Ngày bắt đầu</label>
      <input type="date" value={projForm.startDate} onChange={e => setProjForm({ ...projForm, startDate: e.target.value })}
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Ngày kết thúc</label>
      <input type="date" value={projForm.endDate} onChange={e => setProjForm({ ...projForm, endDate: e.target.value })}
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Trạng thái</label>
      <select value={projForm.status} onChange={e => setProjForm({ ...projForm, status: e.target.value })}
        className="form-select">
        <option className="bg-white" value="Đang thực hiện">Đang thực hiện</option>
        <option className="bg-white" value="Hoàn thành">Hoàn thành</option>
        <option className="bg-white" value="Tạm dừng">Tạm dừng</option>
      </select>
    </div>
    <div>
      <label className="form-label">Số Sprint</label>
      <input type="number" placeholder="0" value={projForm.sprints || ''} onChange={e => setProjForm({ ...projForm, sprints: Number(e.target.value) })}
        className="form-input" />
    </div>
    <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 col-span-2 lg:col-span-3 mt-2">
      <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer">Hủy</button>
      <button type="submit" className="btn-primary">Tạo dự án</button>
    </div>
  </form>
);
export const EmployeeForm = ({ addEmployee, empForm, setEmpForm, onCancel }) => (
  <form onSubmit={addEmployee} className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
    <div className="col-span-2">
      <label className="form-label">Họ và tên <span className="text-red-400">*</span></label>
      <input placeholder="Ví dụ: Nguyễn Văn A" value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} required
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Chức vụ</label>
      <input placeholder="Ví dụ: Lập trình viên" value={empForm.position} onChange={e => setEmpForm({ ...empForm, position: e.target.value })}
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Phòng ban</label>
      <input placeholder="Ví dụ: Phát triển" value={empForm.department} onChange={e => setEmpForm({ ...empForm, department: e.target.value })}
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Chi phí / Giờ ($)</label>
      <input type="number" placeholder="10" value={empForm.costPerHour} onChange={e => setEmpForm({ ...empForm, costPerHour: e.target.value })}
        className="form-input" />
    </div>
    <div className="col-span-2">
      <label className="form-label">Kỹ năng (Cú pháp: Skill:Level)</label>
      <input placeholder="Ví dụ: React:3, NodeJS:4" value={empForm.skills} onChange={e => setEmpForm({ ...empForm, skills: e.target.value })}
        className="form-input" />
    </div>
    <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 col-span-2 lg:col-span-4 mt-2">
      <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer">Hủy</button>
      <button type="submit" className="btn-primary">Tạo nhân viên</button>
    </div>
  </form>
);

export const TaskForm = ({ addTask, taskForm, setTaskForm, projects, employees, onCancel }) => (
  <form onSubmit={addTask} className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
    <div className="col-span-2">
      <label className="form-label">Tên công việc (Task) <span className="text-red-400">*</span></label>
      <input placeholder="Ví dụ: Viết API đăng nhập" value={taskForm.name} onChange={e => setTaskForm({ ...taskForm, name: e.target.value })} required
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Thuộc dự án <span className="text-red-400">*</span></label>
      <select value={taskForm.projectId} onChange={e => setTaskForm({ ...taskForm, projectId: e.target.value })} required className="form-select">
        <option value="" className="bg-white">— Phân bổ —</option>
        {projects.map(p => <option key={p.id} value={p.id} className="bg-white">{p.name}</option>)}
      </select>
    </div>
    <div>
      <label className="form-label">Phân công (Assignee)</label>
      <select value={taskForm.assigneeId} onChange={e => setTaskForm({ ...taskForm, assigneeId: e.target.value })} className="form-select">
        <option value="" className="bg-white">— Chưa giao —</option>
        {employees.map(e => <option key={e.id} value={e.id} className="bg-white">{e.name}</option>)}
      </select>
    </div>
    <div>
      <label className="form-label">Loại Task <span className="text-red-400">*</span></label>
      <select value={taskForm.type} onChange={e => setTaskForm({ ...taskForm, type: e.target.value })} className="form-select">
        <option value="Epic" className="bg-white">Epic</option>
        <option value="Story" className="bg-white">Story</option>
        <option value="Task" className="bg-white">Task</option>
        <option value="Bug" className="bg-white">Bug</option>
      </select>
    </div>
    <div>
      <label className="form-label">Estimate (Ngày) <span className="text-red-400">*</span></label>
      <input type="number" step="0.5" value={taskForm.estimate} onChange={e => setTaskForm({ ...taskForm, estimate: e.target.value })} required className="form-input" />
    </div>
    <div>
      <label className="form-label">Trọng số (Weight)</label>
      <input type="number" value={taskForm.taskWeight} onChange={e => setTaskForm({ ...taskForm, taskWeight: e.target.value })} className="form-input" />
    </div>
    <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 col-span-2 lg:col-span-4 mt-2">
      <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer">Hủy</button>
      <button type="submit" className="btn-primary">Tạo Task</button>
    </div>
  </form>
);

export const AssetForm = ({ addAsset, assetForm, setAssetForm, projects, onCancel }) => (
  <form onSubmit={addAsset} className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
    <div>
      <label className="form-label">Mã tài sản <span className="text-red-400">*</span></label>
      <input placeholder="Ví dụ: LAP_001" value={assetForm.code} onChange={e => setAssetForm({ ...assetForm, code: e.target.value })} required className="form-input" />
    </div>
    <div className="col-span-2">
      <label className="form-label">Tên tài sản</label>
      <input placeholder="Ví dụ: MacBook Pro M2" value={assetForm.name} onChange={e => setAssetForm({ ...assetForm, name: e.target.value })} className="form-input" />
    </div>
    <div>
      <label className="form-label">Loại (Type)</label>
      <select value={assetForm.type} onChange={e => setAssetForm({ ...assetForm, type: e.target.value })} className="form-select">
        <option value="Laptop" className="bg-white">Laptop</option>
        <option value="Server" className="bg-white">Server</option>
        <option value="Software" className="bg-white">Phần mềm</option>
        <option value="Room" className="bg-white">Phòng họp</option>
      </select>
    </div>
    <div>
      <label className="form-label">Thuộc dự án (Cấp phát)</label>
      <select value={assetForm.projectId} onChange={e => setAssetForm({ ...assetForm, projectId: e.target.value })} className="form-select">
        <option value="" className="bg-white">— Nằm kho —</option>
        {projects.map(p => <option key={p.id} value={p.id} className="bg-white">{p.name}</option>)}
      </select>
    </div>
    <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 col-span-2 lg:col-span-4 mt-2">
      <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer">Hủy</button>
      <button type="submit" className="btn-primary">Thêm tài sản</button>
    </div>
  </form>
);

export const KpiForm = ({ addKpi, kpiForm, setKpiForm, projects, employees, onCancel }) => (
  <form onSubmit={addKpi} className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
    <div>
      <label className="form-label">Tên chỉ số KPI <span className="text-red-400">*</span></label>
      <input placeholder="Ví dụ: Doanh thu bán hàng" value={kpiForm.name} onChange={e => setKpiForm({ ...kpiForm, name: e.target.value })} required
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Mục tiêu <span className="text-red-400">*</span></label>
      <input type="number" placeholder="Ví dụ: 100" value={kpiForm.target} onChange={e => setKpiForm({ ...kpiForm, target: e.target.value })} required
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Đơn vị <span className="text-red-400">*</span></label>
      <input placeholder="Ví dụ: triệu VND" value={kpiForm.unit} onChange={e => setKpiForm({ ...kpiForm, unit: e.target.value })} required
        className="form-input" />
    </div>
    <div>
      <label className="form-label">Thuộc dự án</label>
      <select value={kpiForm.projectId} onChange={e => setKpiForm({ ...kpiForm, projectId: e.target.value })}
        className="form-select">
        <option value="" className="bg-white">— Chọn dự án —</option>
        {projects.map(p => <option key={p.id} value={p.id} className="bg-white">{p.name}</option>)}
      </select>
    </div>
    <div>
      <label className="form-label">Phụ trách</label>
      <select value={kpiForm.employeeId} onChange={e => setKpiForm({ ...kpiForm, employeeId: e.target.value })}
        className="form-select">
        <option value="" className="bg-white">— Chọn nhân viên —</option>
        {employees.map(e => <option key={e.id} value={e.id} className="bg-white">{e.name}</option>)}
      </select>
    </div>
    <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 col-span-2 lg:col-span-3 mt-2">
      <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer">Hủy</button>
      <button type="submit" className="btn-primary">Tạo KPI</button>
    </div>
  </form>
);


