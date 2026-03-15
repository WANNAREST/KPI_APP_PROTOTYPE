const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

// ============================================
// KPIAdjustmentService (T4) — Cập nhật trạng thái KPI
// ============================================

let adjustments = [];
let nextId = 1;

// POST — Cập nhật trạng thái KPI (nhận kết quả từ T3)
app.post('/api/adjust', (req, res) => {
  const { results } = req.body;

  if (!results || !Array.isArray(results)) {
    return res.status(400).json({ error: 'Vui lòng cung cấp mảng results' });
  }

  const newAdjustments = results.map(r => {
    const existingIdx = adjustments.findIndex(a => a.kpiId === r.kpiId);
    const adjustment = {
      id: existingIdx !== -1 ? adjustments[existingIdx].id : nextId++,
      kpiId: r.kpiId,
      name: r.name,
      target: r.target,
      actual: r.actual,
      unit: r.unit,
      performance: r.performance,
      status: r.status,
      projectName: r.projectName || '—',
      employeeName: r.employeeName || '—',
      employeeName: r.employeeName || '—',
      adjustedAt: new Date().toISOString(),
      note: existingIdx !== -1 ? adjustments[existingIdx].note : '',
      nextTarget: existingIdx !== -1 ? adjustments[existingIdx].nextTarget : Math.round(r.target * 1.1), // Suggest 10% increase by default
      history: existingIdx !== -1 ? adjustments[existingIdx].history : [
        Math.max(0, r.performance - 30),
        Math.max(0, r.performance - 15),
        Math.max(0, r.performance + 10),
        r.performance
      ],
      isClosed: existingIdx !== -1 ? adjustments[existingIdx].isClosed : false
    };

    if (existingIdx !== -1) {
      adjustments[existingIdx] = adjustment;
    } else {
      adjustments.push(adjustment);
    }
    return adjustment;
  });

  console.log(`[T4] Đã cập nhật ${newAdjustments.length} KPI`);
  res.json({ adjustments: newAdjustments });
});

// POST — Cập nhật trạng thái thủ công cho 1 KPI
app.post('/api/adjust/:kpiId', (req, res) => {
  const kpiId = Number(req.params.kpiId);
  const { status } = req.body;

  const idx = adjustments.findIndex(a => a.kpiId === kpiId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Chưa có kết quả đánh giá cho KPI này' });
  }

  adjustments[idx].status = status;
  adjustments[idx].adjustedAt = new Date().toISOString();
  console.log(`[T4] Cập nhật KPI #${kpiId} → ${status}`);
  res.json(adjustments[idx]);
});

// POST — Cập nhật chi tiết (Notes, NextTarget, IsClosed)
app.post('/api/adjust/:kpiId/details', (req, res) => {
  const kpiId = Number(req.params.kpiId);
  const { note, nextTarget, isClosed } = req.body;

  const idx = adjustments.findIndex(a => a.kpiId === kpiId);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy' });

  if (note !== undefined) adjustments[idx].note = note;
  if (nextTarget !== undefined) adjustments[idx].nextTarget = Number(nextTarget);
  if (isClosed !== undefined) adjustments[idx].isClosed = isClosed;

  res.json(adjustments[idx]);
});

// GET — Danh sách trạng thái
app.get('/api/adjustments', (req, res) => {
  res.json(adjustments);
});

app.listen(PORT, () => {
  console.log(`✅ [T4] KPIAdjustmentService đang chạy tại http://localhost:${PORT}`);
});
