const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());
let projects = [
  {
    id: 1,
    name: "Performance System 2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "In Progress",
    sprints: 12,
    requirements: {
      taskList: [
        { name: "Thiết kế API Core", skill: "NodeJS", weight: 8 },
        { name: "Giao diện Dashboard", skill: "React", weight: 7 },
        { name: "Viết Unit Test", skill: "Jest", weight: 4 },
        { name: "Tích hợp CI/CD", skill: "DevOps", weight: 5 }
      ]
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "E-Commerce Platform",
    startDate: "2026-02-15",
    endDate: "2026-08-30",
    status: "In Progress",
    sprints: 8,
    requirements: { taskList: [] },
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Mobile App Redeploy",
    startDate: "2026-03-01",
    endDate: "2026-05-30",
    status: "Planning",
    sprints: 4,
    requirements: { taskList: [] },
    createdAt: new Date().toISOString()
  }
];

let employees = [
  { id: 1, name: "Trần Thế Anh", position: "Backend Lead", department: "Kỹ thuật", costPerHour: 50, skills: { "NodeJS": 5, "SQL": 4, "Docker": 3 } },
  { id: 2, name: "Lê Thị Bích", position: "Frontend Dev", department: "Kỹ thuật", costPerHour: 40, skills: { "React": 5, "CSS": 5, "Figma": 4 } },
  { id: 3, name: "Nguyễn Văn Cường", position: "Fullstack Dev", department: "Kỹ thuật", costPerHour: 45, skills: { "NodeJS": 4, "React": 4, "SQL": 5 } },
  { id: 4, name: "Phạm Minh Dũng", position: "Tester", department: "QC", costPerHour: 30, skills: { "Jest": 5, "Manual Test": 5, "Automation": 4 } }
];

let kpis = [
  { id: 1, name: "Velocity", target: 20, unit: "pts/sprint", projectId: 1, createdAt: new Date().toISOString() },
  { id: 2, name: "Quality", target: 95, unit: "%", projectId: 1, createdAt: new Date().toISOString() },
  { id: 3, name: "Cycle Time", target: 3, unit: "days", projectId: 1, createdAt: new Date().toISOString() },
  { id: 4, name: "Completion Rate", target: 100, unit: "%", projectId: 1, createdAt: new Date().toISOString() }
];

let tasks = [
  { id: 1, projectId: 1, assigneeId: 1, name: "Thiết kế API Core", status: "Done", type: "Task", estimate: 8, taskWeight: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, projectId: 1, assigneeId: 2, name: "Giao diện Dashboard", status: "Inprogress", type: "Task", estimate: 7, taskWeight: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, projectId: 1, assigneeId: 4, name: "Viết Unit Test", status: "Todo", type: "Task", estimate: 4, taskWeight: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 4, projectId: 1, assigneeId: 3, name: "Tích hợp CI/CD", status: "Todo", type: "Task", estimate: 5, taskWeight: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 5, projectId: 2, assigneeId: 1, name: "Database Optimization", status: "Done", type: "Task", estimate: 6, taskWeight: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 6, projectId: 2, assigneeId: 3, name: "Payment Gateway", status: "Inprogress", type: "Task", estimate: 10, taskWeight: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];
let assets = [
  { id: 1, code: "LAP_001", name: "MacBook Pro M2", type: "Laptop", projectId: 1, status: "using", createdAt: new Date().toISOString() },
  { id: 2, code: "LAP_002", name: "Dell XPS 15", type: "Laptop", projectId: null, status: "available", createdAt: new Date().toISOString() }
];

let nextProjectId = 4;
let nextEmployeeId = 5;
let nextKpiId = 5;
let nextTaskId = 7;
let nextAssetId = 3;
// GET — Danh sách dự án
app.get('/api/projects', (req, res) => {
  res.json(projects);
});
// POST — Tạo dự án mới
app.post('/api/projects', (req, res) => {
  const { name, startDate, endDate, status, sprints, requirements } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Tên dự án là bắt buộc' });
  }
  const project = {
    id: nextProjectId++,
    name,
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || '',
    status: status || 'Đang thực hiện',
    sprints: Number(sprints) || 1,
    requirements: requirements || { taskList: [] }, // { taskList: [{ name, skill, weight }] }
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
// GET — Preview Assignment
app.get('/api/projects/:id/assign/preview', (req, res) => {
  const projectId = Number(req.params.id);
  const { algo } = req.query; // 'skill' or 'roundrobin'
  const project = projects.find(p => p.id === projectId);
  
  if (!project) return res.status(404).json({ error: 'Không tìm thấy dự án' });
  if (!project.requirements || !project.requirements.taskList) {
    return res.status(400).json({ error: 'Dự án chưa có yêu cầu công việc' });
  }

  const tasksToAssign = project.requirements.taskList;
  const availableEmployees = employees; // In real case, filter by availability
  
  if (availableEmployees.length === 0) {
    return res.status(400).json({ error: 'Không có nhân viên trong hệ thống' });
  }
  let assignments = [];
  if (algo === 'roundrobin') {
    tasksToAssign.forEach((t, index) => {
      const emp = availableEmployees[index % availableEmployees.length];
      assignments.push({
        taskName: t.name,
        skillRequired: t.skill,
        weight: t.weight,
        assigneeId: emp.id,
        assigneeName: emp.name,
        matchScore: 100 
      });
    });
  } else {
    // Skill Match
    tasksToAssign.forEach(t => {
      let bestMatch = null;
      let highestScore = -1;
      // Normalize required skills: [{ name, weight }]
      let requiredSkills = [];
      if (Array.isArray(t.skills)) {
        requiredSkills = t.skills.map(s => typeof s === 'string' ? { name: s, weight: 1 } : s);
      } else if (t.skill) {
        requiredSkills = [{ name: t.skill, weight: 1 }];
      }
      availableEmployees.forEach(emp => {
        let weightedScoreSum = 0;
        let totalWeight = 0;

        requiredSkills.forEach(reqSkill => {
          const rName = (reqSkill.name || '').toLowerCase();
          const rWeight = Number(reqSkill.weight) || 1;
          totalWeight += rWeight;

          let maxSkillLevel = 0;
          Object.keys(emp.skills || {}).forEach(empSkillName => {
            const sName = empSkillName.toLowerCase();
            if (sName.includes(rName) || rName.includes(sName)) {
              maxSkillLevel = Math.max(maxSkillLevel, emp.skills[empSkillName] || 0);
            }
          });
          weightedScoreSum += (maxSkillLevel * 25) * rWeight; // 0-4 scale -> 100
        });
        const finalScore = totalWeight > 0 ? weightedScoreSum / totalWeight : 0;
        if (finalScore > highestScore) {
          highestScore = Math.round(finalScore);
          bestMatch = emp;
        }
      });
      const assignee = bestMatch || availableEmployees[0];
      assignments.push({
        taskName: t.name,
        skillsRequired: requiredSkills,
        weight: t.weight,
        assigneeId: assignee.id,
        assigneeName: assignee.name,
        matchScore: highestScore
      });
    });
  }
  res.json({ assignments });
});
// POST — Commit Assignment
app.post('/api/projects/:id/assign/commit', (req, res) => {
  const projectId = Number(req.params.id);
  const { assignments } = req.body;
  const project = projects.find(p => p.id === projectId);

  if (!project) return res.status(404).json({ error: 'Không tìm thấy dự án' });
  
  // 1. Create Tasks based on assignments
  const createdTasks = assignments.map(a => {
    const task = {
      id: nextTaskId++,
      projectId,
      assigneeId: a.assigneeId,
      name: a.taskName,
      status: 'Todo',
      type: 'Task',
      estimate: a.weight,
      skillsRequired: a.skillsRequired || [],
      taskWeight: Number(a.weight),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(task);
    return task;
  });

  // 2. Initialize KPI Targets for this project
  const metrics = [
    { name: 'Velocity', target: assignments.reduce((s, a) => s + Number(a.weight), 0) / (project.sprints || 1), unit: 'pts/sprint' },
    { name: 'Quality', target: 95, unit: '%' },
    { name: 'Cycle Time', target: 3, unit: 'days' },
    { name: 'Completion Rate', target: 100, unit: '%' }
  ];

  metrics.forEach(m => {
    kpis.push({
      id: nextKpiId++,
      name: m.name,
      target: m.target,
      unit: m.unit,
      projectId,
      createdAt: new Date().toISOString()
    });
  });

  project.status = 'In Progress';

  console.log(`[T1] Đã phê duyệt phân công và khởi tạo KPI cho dự án #${projectId}`);
  res.json({ message: 'Assignment committed successfully', createdTasks });
});

// POST — Update Configuration (Feedback Loop from T4)
app.post('/api/config/update', (req, res) => {
  const { projectId, suggestions } = req.body;
  console.log(`[T1] Nhận yêu cầu điều chỉnh từ T4 cho dự án #${projectId}:`, suggestions);
  // In a real system, this would update weights or project parameters
  res.json({ message: 'Configuration updated based on feedback', suggestions });
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

// ─────────────── DASHBOARD HELPERS ───────────────
app.get('/api/dashboard/trend', (req, res) => {
  res.json([
    { day: 'Thứ 2', avgScore: 72 },
    { day: 'Thứ 3', avgScore: 75 },
    { day: 'Thứ 4', avgScore: 78 },
    { day: 'Thứ 5', avgScore: 84 },
    { day: 'Thứ 6', avgScore: 88 },
    { day: 'Thứ 7', avgScore: 91 },
    { day: 'Chủ Nhật', avgScore: 94 },
  ]);
});

app.get('/api/dashboard/projects', (req, res) => {
  res.json([
    { name: 'Performance System', target: 95, actual: 88 },
    { name: 'E-Commerce Platform', target: 80, actual: 72 },
    { name: 'Mobile App Redeploy', target: 60, actual: 45 },
    { name: 'CRM Integration', target: 120, actual: 115 },
    { name: 'Cloud Migration', target: 100, actual: 98 },
  ]);
});

app.listen(PORT, () => {
  console.log(`🎯 [T1] KPISetupService đang chạy tại http://localhost:${PORT}`);
});
