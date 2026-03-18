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
    const [tasksRes, projsRes, empsRes, kpisRes] = await Promise.all([
      axios.get(`${T1_URL}/api/tasks`),
      axios.get(`${T1_URL}/api/projects`),
      axios.get(`${T1_URL}/api/employees`),
      axios.get(`${T1_URL}/api/kpis`)
    ]);

    const tasks = tasksRes.data;
    const projects = projsRes.data;
    const employees = empsRes.data;
    const kpis = kpisRes.data;

    if (tasks.length === 0) {
      return res.json({ message: 'Chưa có công việc nào để đánh giá', results: [] });
    }

    // Helper functions
    const calculateMetrics = (targetTasks, targetKpis) => {
      const totalTasks = targetTasks.length;
      const doneTasks = targetTasks.filter(t => t.status === 'Done');
      
      // 1. Velocity: Sum taskWeight of Done tasks
      const velocityActual = doneTasks.reduce((sum, t) => sum + (Number(t.taskWeight) || 0), 0);
      
      // 2. Quality: (Done - Bugs) / Done
      const totalBugs = targetTasks.reduce((sum, t) => sum + (Number(t.bugCount) || 0), 0);
      const qualityActual = doneTasks.length > 0 ? Math.max(0, (doneTasks.length - totalBugs) / doneTasks.length) * 100 : 100;

      // 3. Cycle Time: Average of (End - Start)
      let totalCycleTime = 0;
      let tasksWithTime = 0;
      doneTasks.forEach(t => {
        if (t.actualStartTime && t.actualEndTime) {
          const start = new Date(t.actualStartTime);
          const end = new Date(t.actualEndTime);
          const diffDays = (end - start) / (1000 * 60 * 60 * 24);
          if (diffDays > 0) {
            totalCycleTime += diffDays;
            tasksWithTime++;
          }
        }
      });
      const cycleTimeActual = tasksWithTime > 0 ? (totalCycleTime / tasksWithTime) : 3; // Default 3 if no data

      // 4. Completion Rate: Done / Total
      const completionRateActual = totalTasks > 0 ? (doneTasks.length / totalTasks) * 100 : 0;

      // Map to targets
      const findTarget = (name) => targetKpis.find(k => k.name === name)?.target || 1;

      return {
        velocity: { actual: velocityActual, target: findTarget('Velocity') },
        quality: { actual: Math.round(qualityActual), target: findTarget('Quality') },
        cycleTime: { actual: Number(cycleTimeActual.toFixed(1)), target: findTarget('Cycle Time') },
        completionRate: { actual: Math.round(completionRateActual), target: findTarget('Completion Rate') }
      };
    };

    // --- Tính toán ở mức Project ---
    const projectResults = projects.map(proj => {
      const projTasks = tasks.filter(t => t.projectId === proj.id);
      const projKpis = kpis.filter(k => k.projectId === proj.id);
      const metrics = calculateMetrics(projTasks, projKpis);

      return {
        type: 'Project',
        id: proj.id,
        name: proj.name,
        ...metrics,
        overallScore: Math.round((metrics.completionRate.actual * 0.4 + metrics.quality.actual * 0.4 + 20) ) // Simplified score
      };
    });

    // --- Tính toán ở mức Employee ---
    const employeeResults = employees.map(emp => {
      const empTasks = tasks.filter(t => t.assigneeId === emp.id);
      const empKpis = kpis.filter(k => k.employeeId === emp.id);
      const metrics = calculateMetrics(empTasks, empKpis);

      return {
        type: 'Employee',
        id: emp.id,
        name: emp.name,
        ...metrics,
        overallScore: Math.round((metrics.completionRate.actual * 0.5 + metrics.quality.actual * 0.5))
      };
    });

    // Merge and return
    const results = [...projectResults, ...employeeResults].filter(r => r.velocity.actual > 0 || r.completionRate.actual > 0);

    console.log(`[T3] Đã tính toán KPI chi tiết cho ${projects.length} dự án và ${employees.length} nhân sự`);
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
