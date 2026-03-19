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
    // 1. Fetch data from T1 & T2
    const [tasksRes, projsRes, empsRes, kpisRes, logsRes] = await Promise.all([
      axios.get(`${T1_URL}/api/tasks`),
      axios.get(`${T1_URL}/api/projects`),
      axios.get(`${T1_URL}/api/employees`),
      axios.get(`${T1_URL}/api/kpis`),
      axios.get(`${T2_URL}/api/worklogs`)
    ]);
    
    const tasks = tasksRes.data;
    const projects = projsRes.data;
    const employees = empsRes.data;
    const kpis = kpisRes.data;
    const workLogs = logsRes.data;

    if (tasks.length === 0) {
      return res.json({ message: 'Chưa có công việc nào để đánh giá', results: [] });
    }

    // Helper functions
    const calculateMetrics = (targetTasks, targetKpis) => {
      const totalTasks = targetTasks.length;
      const doneTasks = targetTasks.filter(t => t.status === 'Done');
      
      // Get detailed logs for these tasks from T2
      const taskIds = targetTasks.map(t => t.id);
      const relevantLogs = workLogs.filter(log => taskIds.includes(log.taskId));

      // 1. Velocity: Sum taskWeight of Done tasks
      const velocityActual = doneTasks.reduce((sum, t) => sum + (Number(t.taskWeight) || 0), 0);
      
      // 2. Quality: 1 - (Total Bug / Total Task Done)
      // Quality % = (1 - Sum(Bugs) / DoneCount) * 100
      const totalBugs = relevantLogs.reduce((sum, l) => sum + (Number(l.bugCount) || 0), 0);
      const qualityRatio = doneTasks.length > 0 ? (1 - (totalBugs / doneTasks.length)) : 1;
      const qualityActual = Math.max(0, qualityRatio * 100);

      // 3. Cycle Time: Avg(Actual Duration / Estimate)
      // We want to show a ratio or an index. Let's use it as a percentage index where 100% means Actual = Estimate.
      // But the requirement says "Average of (Actual / Estimate)".
      let totalCycleRatio = 0;
      let tasksWithDuration = 0;
      doneTasks.forEach(t => {
        const log = relevantLogs.find(l => l.taskId === t.id && l.newStatus === 'Done');
        if (log && log.actualDuration && t.estimate) {
          totalCycleRatio += (Number(log.actualDuration) / Number(t.estimate));
          tasksWithDuration++;
        }
      });
      const cycleTimeRatio = tasksWithDuration > 0 ? (totalCycleRatio / tasksWithDuration) : 1;

      // 4. Completion Rate: Done / Total
      const completionRateActual = totalTasks > 0 ? (doneTasks.length / totalTasks) * 100 : 0;

      // Map to targets with sensible defaults
      const velocityTarget = targetKpis.find(k => k.name === 'Velocity')?.target || targetTasks.reduce((s, t) => s + (Number(t.taskWeight) || 0), 0) || 10;
      const qualityTarget = targetKpis.find(k => k.name === 'Quality')?.target || 100; // Target is 0 bugs usually
      const cycleTimeTarget = targetKpis.find(k => k.name === 'Cycle Time')?.target || 1.0; // Target ratio is 1.0
      const completionRateTarget = targetKpis.find(k => k.name === 'Completion Rate')?.target || 100;

      return {
        velocity: { actual: velocityActual, target: velocityTarget },
        quality: { actual: Math.round(qualityActual), target: qualityTarget },
        cycleTime: { actual: Number(cycleTimeRatio.toFixed(2)), target: cycleTimeTarget },
        completionRate: { actual: Math.round(completionRateActual), target: completionRateTarget }
      };
    };

    // --- Tính toán ở mức Project ---
    const projectResults = projects.map(proj => {
      const projTasks = tasks.filter(t => t.projectId === proj.id);
      const projKpis = kpis.filter(k => k.projectId === proj.id);
      const metrics = calculateMetrics(projTasks, projKpis);

      const velocityScore = (metrics.velocity.actual / metrics.velocity.target) * 100;
      const qualityScore = metrics.quality.actual;
      const cycleScore = (metrics.cycleTime.target / metrics.cycleTime.actual) * 100; // Lower ratio is better
      const completionScore = metrics.completionRate.actual;

      const overall = (velocityScore * 0.25 + qualityScore * 0.25 + completionScore * 0.25 + Math.min(cycleScore, 150) * 0.25);

      return {
        type: 'Project',
        id: proj.id,
        name: proj.name,
        metrics,
        overallScore: Math.round(overall)
      };
    });

    // --- Tính toán ở mức Employee ---
    const employeeResults = employees.map(emp => {
      const empTasks = tasks.filter(t => t.assigneeId === emp.id);
      const empKpis = kpis.filter(k => k.employeeId === emp.id);
      const metrics = calculateMetrics(empTasks, empKpis);

      const velocityScore = (metrics.velocity.actual / metrics.velocity.target) * 100;
      const qualityScore = metrics.quality.actual;
      const cycleScore = (metrics.cycleTime.target / metrics.cycleTime.actual) * 100;
      const completionScore = metrics.completionRate.actual;

      const overall = (velocityScore * 0.25 + qualityScore * 0.25 + completionScore * 0.25 + Math.min(cycleScore, 150) * 0.25);

      return {
        type: 'Employee',
        id: emp.id,
        name: emp.name,
        metrics,
        overallScore: Math.round(overall)
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
