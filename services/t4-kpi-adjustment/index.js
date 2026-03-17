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
    // Unique identifier for this assessment: type + id
    const existingIdx = adjustments.findIndex(a => a.type === r.type && a.targetId === r.id);
    const adjustment = {
      id: existingIdx !== -1 ? adjustments[existingIdx].id : nextId++,
      type: r.type, // 'Project' or 'Employee'
      targetId: r.id, // Project ID or Employee ID
      name: r.name,
      velocity: r.velocity,
      completionRate: r.completionRate,
      quality: r.quality,
      cycleTime: r.cycleTime,
      overallScore: r.overallScore,
      
      adjustedAt: new Date().toISOString(),
      note: existingIdx !== -1 ? adjustments[existingIdx].note : '',
      nextTarget: existingIdx !== -1 ? adjustments[existingIdx].nextTarget : Math.round(r.overallScore * 1.1),
      isClosed: existingIdx !== -1 ? adjustments[existingIdx].isClosed : false
    };

    if (existingIdx !== -1) {
      adjustments[existingIdx] = adjustment;
    } else {
      adjustments.push(adjustment);
    }
    return adjustment;
  });

  console.log(`[T4] Đã lưu kết quả cho ${newAdjustments.length} đối tượng`);
  res.json({ adjustments: newAdjustments });
});

// POST — Cập nhật chi tiết (Notes, NextTarget, IsClosed)
app.post('/api/adjust/summary/:id/details', (req, res) => {
  const id = Number(req.params.id);
  const { note, nextTarget, isClosed } = req.body;

  const idx = adjustments.findIndex(a => a.id === id);
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
