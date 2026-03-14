const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

// ============================================
// KPIAdjustmentService (T4) - Cập nhật trạng thái KPI
// In-memory database
// ============================================
let adjustments = [];
let nextId = 1;

// Cập nhật trạng thái KPI (Đạt / Không đạt)
app.post('/api/adjust', (req, res) => {
  const { results } = req.body;

  if (!results || !Array.isArray(results)) {
    return res.status(400).json({
      error: 'Vui lòng cung cấp mảng results'
    });
  }

  // Lưu kết quả đánh giá
  const newAdjustments = results.map(result => {
    // Kiểm tra nếu đã có adjustment cho KPI này thì cập nhật
    const existingIndex = adjustments.findIndex(a => a.kpiId === result.kpiId);

    const adjustment = {
      id: existingIndex !== -1 ? adjustments[existingIndex].id : nextId++,
      kpiId: result.kpiId,
      name: result.name,
      target: result.target,
      actual: result.actual,
      unit: result.unit,
      performance: result.performance,
      status: result.status,
      adjustedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      adjustments[existingIndex] = adjustment;
    } else {
      adjustments.push(adjustment);
    }

    return adjustment;
  });

  console.log(`[T4] Đã cập nhật trạng thái cho ${newAdjustments.length} KPI`);
  res.json({ adjustments: newAdjustments });
});

// Lấy tất cả bản ghi adjustment
app.get('/api/adjustments', (req, res) => {
  res.json(adjustments);
});

app.listen(PORT, () => {
  console.log(`✅ [T4] KPIAdjustmentService đang chạy tại http://localhost:${PORT}`);
});
