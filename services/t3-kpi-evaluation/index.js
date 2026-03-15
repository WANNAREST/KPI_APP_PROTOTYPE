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

// GET — Tính toán hiệu suất cho tất cả KPI
app.get('/api/evaluate', async (req, res) => {
  try {
    // Lấy dữ liệu từ T1
    const kpisRes = await axios.get(`${T1_URL}/api/kpis`);
    const kpis = kpisRes.data;

    // Lấy dữ liệu từ T2
    const workRes = await axios.get(`${T2_URL}/api/workdata`);
    const workData = workRes.data;

    if (kpis.length === 0) {
      return res.json({ message: 'Chưa có KPI nào', results: [] });
    }

    const results = kpis.map(kpi => {
      const data = workData.find(w => w.kpiId === kpi.id);
      const actual = data ? data.actual : 0;
      const performance = kpi.target > 0
        ? Math.round((actual / kpi.target) * 100 * 100) / 100
        : 0;
      const status = performance >= 100 ? 'Đạt' : 'Không đạt';

      return {
        kpiId: kpi.id,
        name: kpi.name,
        target: kpi.target,
        unit: kpi.unit,
        actual,
        performance,
        status,
        projectName: kpi.projectName || '—',
        employeeName: kpi.employeeName || '—'
      };
    });

    console.log(`[T3] Đã đánh giá ${results.length} chỉ số KPI`);
    res.json({ results });
  } catch (error) {
    console.error('[T3] Lỗi:', error.message);
    res.status(500).json({
      error: 'Không thể tính toán. Kiểm tra T1 và T2 đang chạy.'
    });
  }
});

// GET — Thống kê tổng quan
app.get('/api/evaluate/stats', async (req, res) => {
  try {
    const kpisRes = await axios.get(`${T1_URL}/api/kpis`);
    const workRes = await axios.get(`${T2_URL}/api/workdata`);

    const total = kpisRes.data.length;
    const evaluated = workRes.data.length;
    let passed = 0;

    kpisRes.data.forEach(kpi => {
      const data = workRes.data.find(w => w.kpiId === kpi.id);
      if (data && kpi.target > 0 && (data.actual / kpi.target) >= 1) {
        passed++;
      }
    });

    res.json({
      totalKpis: total,
      evaluated,
      passed,
      failed: evaluated - passed,
      avgPerformance: total > 0
        ? Math.round(kpisRes.data.reduce((sum, kpi) => {
            const data = workRes.data.find(w => w.kpiId === kpi.id);
            const actual = data ? data.actual : 0;
            return sum + (kpi.target > 0 ? (actual / kpi.target) * 100 : 0);
          }, 0) / total)
        : 0
    });
  } catch {
    res.status(500).json({ error: 'Không thể lấy thống kê' });
  }
});

app.listen(PORT, () => {
  console.log(`📈 [T3] KPIEvaluationService đang chạy tại http://localhost:${PORT}`);
});
