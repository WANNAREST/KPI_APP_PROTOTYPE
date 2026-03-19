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
    <div className="col-span-2 lg:col-span-3">
      <div className="flex justify-between items-center mb-3">
        <div>
          <label className="form-label mb-0">Yêu cầu công việc (Danh sách Task & Kỹ năng có trọng số)</label>
          <p className="text-[11px] text-stone-500 mt-0.5 italic">Gợi ý: Nhập tên kĩ năng và trọng số tương ứng (1-10) để tối ưu hóa phân công.</p>
        </div>
        <button 
          type="button" 
          onClick={() => setProjForm({ ...projForm, requirementsList: [...projForm.requirementsList, { name: '', skills: [], weight: 1 }] })}
          className="px-4 py-1.5 bg-rose-500 text-white rounded-xl text-[11px] font-bold hover:bg-rose-600 active:scale-95 transition-all shadow-md shadow-rose-200"
        >
          + Thêm Task Mới
        </button>
      </div>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 border border-stone-100 rounded-3xl p-4 bg-stone-50/30">
        {projForm.requirementsList.map((req, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm transition-all hover:border-rose-300 hover:shadow-md group relative">
            <div className="flex gap-5 items-start">
              <div className="flex-1 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 mb-1.5 block">Tên Công Việc</label>
                    <input 
                      placeholder="VD: Xây dựng Module Mobile Core" 
                      value={req.name} 
                      onChange={e => {
                        const newList = [...projForm.requirementsList];
                        newList[idx].name = e.target.value;
                        setProjForm({ ...projForm, requirementsList: newList });
                      }}
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-rose-400 outline-none transition-all placeholder:text-stone-300" 
                    />
                  </div>
                  <div className="w-24 text-right">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 mb-1.5 block">Ưu tiên (w)</label>
                    <input 
                      type="number" 
                      value={req.weight} 
                      onChange={e => {
                        const newList = [...projForm.requirementsList];
                        newList[idx].weight = Number(e.target.value);
                        setProjForm({ ...projForm, requirementsList: newList });
                      }}
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-xl px-3 py-2.5 text-sm text-center font-bold text-stone-700 focus:bg-white focus:border-rose-400 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 mb-2 block">Kỹ năng & Mức độ quan trọng (1-10)</label>
                  <div className="space-y-3">
                    {/* Add Skill Row */}
                    <div className="flex gap-2">
                       <input 
                        id={`skill-input-${idx}`}
                        placeholder="Nhập kĩ năng (VD: React)" 
                        className="flex-1 bg-stone-50/50 border border-stone-100 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-rose-300 outline-none"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const skillVal = e.target.value.trim();
                            const weightVal = document.getElementById(`weight-input-${idx}`).value;
                            if (skillVal) {
                              const newList = [...projForm.requirementsList];
                              if (!newList[idx].skills.find(s => s.name === skillVal)) {
                                newList[idx].skills = [...newList[idx].skills, { name: skillVal, weight: Number(weightVal) || 1 }];
                                setProjForm({ ...projForm, requirementsList: newList });
                                e.target.value = '';
                                document.getElementById(`weight-input-${idx}`).value = 1;
                              }
                            }
                          }
                        }}
                      />
                      <input 
                        id={`weight-input-${idx}`}
                        type="number"
                        placeholder="W"
                        defaultValue={1}
                        className="w-16 bg-stone-50/50 border border-stone-100 rounded-xl px-2 py-2 text-xs text-center focus:bg-white focus:border-rose-300 outline-none"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const skillInp = document.getElementById(`skill-input-${idx}`);
                          const weightInp = document.getElementById(`weight-input-${idx}`);
                          const skillVal = skillInp.value.trim();
                          const weightVal = weightInp.value;
                          if (skillVal) {
                            const newList = [...projForm.requirementsList];
                            if (!newList[idx].skills.find(s => s.name === skillVal)) {
                              newList[idx].skills = [...newList[idx].skills, { name: skillVal, weight: Number(weightVal) || 1 }];
                              setProjForm({ ...projForm, requirementsList: newList });
                              skillInp.value = '';
                              weightInp.value = 1;
                            }
                          }
                        }}
                        className="px-3 bg-stone-100 text-stone-600 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                      >
                        Thêm
                      </button>
                    </div>

                    {/* Skill Tags Display */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {req.skills.length === 0 && <span className="text-[10px] text-stone-300 italic py-1">Chưa có kĩ năng nào được thêm...</span>}
                      {req.skills.map((s, si) => (
                        <div key={si} className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-2 group/tag transition-all hover:bg-rose-100 shadow-sm">
                          <span>{s.name}</span>
                          <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-lg text-[9px] leading-tight">w:{s.weight}</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              const newList = [...projForm.requirementsList];
                              newList[idx].skills = newList[idx].skills.filter((_, i) => i !== si);
                              setProjForm({ ...projForm, requirementsList: newList });
                            }}
                            className="ml-1 text-rose-300 hover:text-rose-800 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {projForm.requirementsList.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => {
                    const newList = projForm.requirementsList.filter((_, i) => i !== idx);
                    setProjForm({ ...projForm, requirementsList: newList });
                  }}
                  className="p-2 text-stone-200 hover:text-rose-500 transition-all absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                  title="Xóa công việc"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
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


