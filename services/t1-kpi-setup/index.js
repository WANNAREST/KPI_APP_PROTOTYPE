const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());
let projects = [];
let employees = [];
let kpis = [];
let tasks = [];
let assets = [];

let nextProjectId = 1;
let nextEmployeeId = 1;
let nextKpiId = 1;
let nextTaskId = 1;
let nextAssetId = 1;

// ─────────────── PROJECTS ───────────────
// GET — Danh sách dự án
app.get('/api/projects', (req, res) => {
  res.json(projects);
});
// POST — Tạo dự án mới
app.post('/api/projects', (req, res) => {
  const { name, startDate, endDate, status, sprints } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Tên dự án là bắt buộc' });
  }
  const project = {
    id: nextProjectId++,
    name,
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || '',
    status: status || 'Đang thực hiện',
    sprints: sprints || 0,
    createdAt: new Date().toISOString()
  };
  projects.push(project);
  console.log(`[T1] Đã tạo dự án: ${project.name}`);
  res.status(201).json(project);
});
// GET — Lấy dự án theo ID
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === Number(req.params.id));
  if (!project) return res.status(404).json({ error: 'Không tìm thấy dự án' });
  res.json(project);
});
// DELETE — Xóa dự án
app.delete('/api/projects/:id', (req, res) => {
  const idx = projects.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy dự án' });
  projects.splice(idx, 1);
  res.json({ message: 'Đã xóa dự án' });
});
// ─────────────── EMPLOYEES ───────────────
// GET — Danh sách nhân viên
app.get('/api/employees', (req, res) => {
  res.json(employees);
});
// POST — Tạo nhân viên mới
app.post('/api/employees', (req, res) => {
  const { name, position, department, costPerHour, skills } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Tên nhân viên là bắt buộc' });
  }
  const employee = {
    id: nextEmployeeId++,
    name,
    position: position || '',
    department: department || '',
    costPerHour: Number(costPerHour) || 10,
    skills: skills || {}, // e.g., { "React": 3, "NodeJS": 4 }
    createdAt: new Date().toISOString()
  };
  employees.push(employee);
  console.log(`[T1] Đã tạo nhân viên: ${employee.name}`);
  res.status(201).json(employee);
});
// DELETE — Xóa nhân viên
app.delete('/api/employees/:id', (req, res) => {
  const idx = employees.findIndex(e => e.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
  employees.splice(idx, 1);
  res.json({ message: 'Đã xóa nhân viên' });
});
// ─────────────── KPI DEFINITIONS ───────────────
// GET — Danh sách KPI
app.get('/api/kpis', (req, res) => {
  // Enrich with project/employee names
  const enriched = kpis.map(k => ({
    ...k,
    projectName: projects.find(p => p.id === k.projectId)?.name || '—',
    employeeName: employees.find(e => e.id === k.employeeId)?.name || '—'
  }));
  res.json(enriched);
});

// POST — Tạo KPI mới
app.post('/api/kpis', (req, res) => {
  const { name, target, unit, projectId, employeeId } = req.body;
  if (!name || target === undefined || !unit) {
    return res.status(400).json({ error: 'Vui lòng cung cấp: name, target, unit' });
  }
  const kpi = {
    id: nextKpiId++,
    name,
    target: Number(target),
    unit,
    projectId: projectId ? Number(projectId) : null,
    employeeId: employeeId ? Number(employeeId) : null,
    createdAt: new Date().toISOString()
  };
  kpis.push(kpi);
  console.log(`[T1] Đã tạo KPI: ${kpi.name} — Mục tiêu: ${kpi.target} ${kpi.unit}`);
  res.status(201).json(kpi);
});

// GET — Lấy KPI theo ID
app.get('/api/kpis/:id', (req, res) => {
  const kpi = kpis.find(k => k.id === Number(req.params.id));
  if (!kpi) return res.status(404).json({ error: 'Không tìm thấy KPI' });
  res.json(kpi);
});

// DELETE — Xóa KPI
app.delete('/api/kpis/:id', (req, res) => {
  const idx = kpis.findIndex(k => k.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy KPI' });
  kpis.splice(idx, 1);
  res.json({ message: 'Đã xóa KPI' });
});

// PUT — Cập nhật KPI (Target cho kỳ sau)
app.put('/api/kpis/:id', (req, res) => {
  const kpi = kpis.find(k => k.id === Number(req.params.id));
  if (!kpi) return res.status(404).json({ error: 'Không tìm thấy KPI' });
  const { target } = req.body;
  if (target !== undefined) {
    kpi.target = Number(target);
    console.log(`[T1] Đã cập nhật mục tiêu KPI #${kpi.id} -> ${kpi.target}`);
  }
  res.json(kpi);
});

// ─────────────── TASKS ───────────────
// GET — Danh sách Task
app.get('/api/tasks', (req, res) => {
  const enriched = tasks.map(t => ({
    ...t,
    projectName: projects.find(p => p.id === t.projectId)?.name || '—',
    assigneeName: employees.find(e => e.id === t.assigneeId)?.name || '—'
  }));
  res.json(enriched);
});

// POST — Tạo Task
app.post('/api/tasks', (req, res) => {
  const { projectId, name, parentId, status, type, estimate, tags, skillsRequired, taskWeight, assigneeId } = req.body;
  if (!name || !projectId || !type || !estimate) {
    return res.status(400).json({ error: 'Dữ liệu bắt buộc: projectId, name, type, estimate' });
  }
  const task = {
    id: nextTaskId++,
    projectId: Number(projectId),
    assigneeId: assigneeId ? Number(assigneeId) : null,
    name,
    parentId: parentId || [], // Array of prerequisite task IDs
    status: status || 'Todo', // Todo, Inprogress, Done, WontDo
    type, // Task, Bug, Epic, Story
    estimate: Number(estimate),
    tags: tags || [],
    skillsRequired: skillsRequired || {}, // e.g., { "React": 3 }
    taskWeight: Number(taskWeight) || Number(estimate), // Fallback to estimate if not provided
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(task);
  console.log(`[T1] Đã tạo Task: ${task.name}`);
  res.status(201).json(task);
});

// DELETE — Xóa Task
app.delete('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy Task' });
  tasks.splice(idx, 1);
  res.json({ message: 'Đã xóa Task' });
});

// PUT — Cập nhật Task
app.put('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Không tìm thấy Task' });
  
  const updates = req.body;
  Object.assign(task, updates);
  task.updatedAt = new Date().toISOString();
  
  console.log(`[T1] Đã cập nhật Task #${task.id}`);
  res.json(task);
});

// ─────────────── ASSETS ───────────────
// GET — Danh sách Asset
app.get('/api/assets', (req, res) => {
  const enriched = assets.map(a => ({
    ...a,
    projectName: projects.find(p => p.id === a.projectId)?.name || '—'
  }));
  res.json(enriched);
});

// POST — Tạo Asset
app.post('/api/assets', (req, res) => {
  const { type, status, projectId, code, name } = req.body;
  if (!type) {
    return res.status(400).json({ error: 'Loại tài sản (type) là bắt buộc' });
  }
  const asset = {
    id: nextAssetId++,
    type, // Laptop, Server, Room...
    status: status || 'available', // available | in_use
    projectId: projectId ? Number(projectId) : null,
    code: code || '',
    name: name || '',
    usageLog: [],
    createdAt: new Date().toISOString()
  };
  assets.push(asset);
  console.log(`[T1] Đã tạo Asset: ${asset.name || asset.code}`);
  res.status(201).json(asset);
});

// DELETE — Xóa Asset
app.delete('/api/assets/:id', (req, res) => {
  const idx = assets.findIndex(a => a.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy Asset' });
  assets.splice(idx, 1);
  res.json({ message: 'Đã xóa Asset' });
});

// PUT — Cập nhật Asset
app.put('/api/assets/:id', (req, res) => {
  const asset = assets.find(a => a.id === Number(req.params.id));
  if (!asset) return res.status(404).json({ error: 'Không tìm thấy Asset' });
  
  const updates = req.body;
  Object.assign(asset, updates);
  
  console.log(`[T1] Đã cập nhật Asset #${asset.id}`);
  res.json(asset);
});

// ─────────────── STATS ───────────────
// GET — Thống kê tổng quan cho Dashboard
app.get('/api/stats', (req, res) => {
  res.json({
    totalProjects: projects.length,
    totalEmployees: employees.length,
    totalKpis: kpis.length,
    totalTasks: tasks.length,
    totalAssets: assets.length
  });
});

app.listen(PORT, () => {
  console.log(`🎯 [T1] KPISetupService đang chạy tại http://localhost:${PORT}`);
});
