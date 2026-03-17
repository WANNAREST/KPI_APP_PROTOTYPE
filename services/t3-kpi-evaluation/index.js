const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3003;

const T1_URL = 'http://localhost:3001';
const T2_URL = 'http://localhost:3002';

app.use(cors());
app.use(express.json());

// ============================================
// KPIEvaluationService (T3) — Tính toán hiệu suất
// Lấy dữ liệu từ T1 (KPI targets) & T2 (actual data)
// ============================================

// GET — Tính toán hiệu suất cho Project/Employee dựa trên Tasks
app.get('/api/evaluate', async (req, res) => {
  try {
    // 1. Fetch data from T1
    const [tasksRes, projsRes, empsRes] = await Promise.all([
      axios.get(`${T1_URL}/api/tasks`),
      axios.get(`${T1_URL}/api/projects`),
      axios.get(`${T1_URL}/api/employees`)
    ]);

    const tasks = tasksRes.data;
    const projects = projsRes.data;
    const employees = empsRes.data;

    if (tasks.length === 0) {
      return res.json({ message: 'Chưa có công việc nào để đánh giá', results: [] });
    }

    // --- Tính toán ở mức Project ---
    const projectResults = projects.map(proj => {
      const projTasks = tasks.filter(t => t.projectId === proj.id);
      const totalTasks = projTasks.length;
      const doneTasks = projTasks.filter(t => t.status === 'Done');
      
      // 1. Velocity: Tổng taskWeight của các task Done
      const velocity = doneTasks.reduce((sum, t) => sum + (Number(t.taskWeight) || 0), 0);
      
      // 2. Completion Rate: (Done / Total)
      const completionRate = totalTasks > 0 ? (doneTasks.length / totalTasks) : 0;
      
      // 3. Quality: 1 - (Bugs Done / Total Done) (Simplified)
      const doneBugs = doneTasks.filter(t => t.type === 'Bug').length;
      const quality = doneTasks.length > 0 ? (1 - (doneBugs / doneTasks.length)) : 1; // Default 1 (100%) if no tasks done yet

      // 4. CycleTime Index (Mock: giả sử đúng tiến độ là 1.0)
      const cycleTime = 1.0; 

      return {
        type: 'Project',
        id: proj.id,
        name: proj.name,
        velocity: Math.round(velocity),
        completionRate: Math.round(completionRate * 100),
        quality: Math.round(quality * 100),
        cycleTime,
        overallScore: Math.round((completionRate * 0.4 + quality * 0.4 + (cycleTime === 1.0 ? 0.2 : 0)) * 100)
      };
    });

    // --- Tính toán ở mức Employee ---
    const employeeResults = employees.map(emp => {
      const empTasks = tasks.filter(t => t.assigneeId === emp.id);
      const totalTasks = empTasks.length;
      const doneTasks = empTasks.filter(t => t.status === 'Done');
      
      const velocity = doneTasks.reduce((sum, t) => sum + (Number(t.taskWeight) || 0), 0);
      const completionRate = totalTasks > 0 ? (doneTasks.length / totalTasks) : 0;
      const doneBugs = doneTasks.filter(t => t.type === 'Bug').length;
      const quality = doneTasks.length > 0 ? (1 - (doneBugs / doneTasks.length)) : 1;
      const cycleTime = 1.0;

      return {
        type: 'Employee',
        id: emp.id,
        name: emp.name,
        velocity: Math.round(velocity),
        completionRate: Math.round(completionRate * 100),
        quality: Math.round(quality * 100),
        cycleTime,
        overallScore: Math.round((completionRate * 0.5 + quality * 0.5) * 100)
      };
    });

    // Merge and return
    const results = [...projectResults, ...employeeResults].filter(r => r.velocity > 0 || r.completionRate > 0);

    console.log(`[T3] Đã tính toán KPI cho ${projects.length} dự án và ${employees.length} nhân sự`);
    res.json({ results });
  } catch (error) {
    console.error('[T3] Lỗi tính toán:', error.message);
    res.status(500).json({ error: 'Không thể tính toán. Kiểm tra T1 đang chạy.' });
  }
});

// GET — Thống kê tổng quan (Dashboard)
app.get('/api/evaluate/stats', async (req, res) => {
  try {
    const [tasksRes, empsRes] = await Promise.all([
      axios.get(`${T1_URL}/api/tasks`),
      axios.get(`${T1_URL}/api/employees`)
    ]);
    const tasks = tasksRes.data;
    const employees = empsRes.data;

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'Done').length;
    const avgCompletion = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    res.json({
      totalEmployees: employees.length,
      totalTasks,
      doneTasks,
      avgCompletion,
      systemHealth: avgCompletion > 70 ? 'Good' : 'Needs Attention'
    });
  } catch {
    res.status(500).json({ error: 'Không thể lấy thống kê' });
  }
});

app.listen(PORT, () => {
  console.log(`📈 [T3] KPIEvaluationService đang chạy tại http://localhost:${PORT}`);
});
