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
// KPIEvaluationService (T3) - Tính toán hiệu suất
// Lấy dữ liệu từ T1 & T2 để đánh giá
// ============================================

// Tính toán hiệu suất cho tất cả KPI
app.get('/api/evaluate', async (req, res) => {
  try {
    // Lấy dữ liệu từ T1 (mục tiêu KPI)
    const kpisResponse = await axios.get(`${T1_URL}/api/kpis`);
    const kpis = kpisResponse.data;

    // Lấy dữ liệu từ T2 (kết quả thực tế)
    const workDataResponse = await axios.get(`${T2_URL}/api/workdata`);
    const workData = workDataResponse.data;

    if (kpis.length === 0) {
      return res.json({
        message: 'Chưa có KPI nào được thiết lập',
        results: []
      });
    }

    // Tính toán hiệu suất cho từng KPI
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
        status
      };
    });

    console.log(`[T3] Đã đánh giá ${results.length} chỉ số KPI`);
    res.json({ results });
  } catch (error) {
    console.error('[T3] Lỗi khi tính toán:', error.message);
    res.status(500).json({
      error: 'Không thể tính toán hiệu suất. Kiểm tra T1 và T2 đang chạy.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`📈 [T3] KPIEvaluationService đang chạy tại http://localhost:${PORT}`);
});
