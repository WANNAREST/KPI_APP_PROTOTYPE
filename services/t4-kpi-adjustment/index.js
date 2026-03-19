const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3004;
app.use(cors());
app.use(express.json());
// ============================================
// KPIAdjustmentService (T4) — Cập nhật trạng thái KPI
// ============================================
let adjustments = [
  {
    id: 1,
    type: "Project",
    targetId: 1,
    name: "Performance System 2026",
    metrics: {
      velocity: { actual: 18, target: 20 },
      quality: { actual: 92, target: 95 },
      cycleTime: { actual: 3.5, target: 3 },
      completionRate: { actual: 85, target: 100 }
    },
    overallScore: 88,
    needsAdjustment: true,
    suggestions: ["Velocity thấp hơn mục tiêu 10%", "Completion Rate cần cải thiện"],
    adjustedAt: new Date().toISOString(),
    isClosed: false,
    note: "Cần tập trung hoàn thành các backlog tồn đọng."
  },
  {
    id: 2,
    type: "Project",
    targetId: 2,
    name: "E-Commerce Platform",
    metrics: {
      velocity: { actual: 24, target: 25 },
      quality: { actual: 98, target: 95 },
      cycleTime: { actual: 2.8, target: 3 },
      completionRate: { actual: 92, target: 100 }
    },
    overallScore: 94,
    needsAdjustment: false,
    suggestions: [],
    adjustedAt: new Date().toISOString(),
    isClosed: false,
    note: "Tiến độ rất tốt, duy trì phong độ."
  }
];
let nextId = 3;

const axios = require('axios');
const T1_URL = 'http://localhost:3001';

// POST — Cập nhật trạng thái KPI (nhận kết quả từ T3)
app.post('/api/adjust', async (req, res) => {
  const { results } = req.body;

  if (!results || !Array.isArray(results)) {
    return res.status(400).json({ error: 'Vui lòng cung cấp mảng results' });
  }
  const newAdjustments = await Promise.all(results.map(async r => {
    // Check deviation > 20% for any metric
    let needsAdjustment = false;
    let suggestions = [];
    const check = (actual, target, name) => {
      if (!target || target === 0) return;
      const deviation = Math.abs(actual - target) / target;
      if (deviation > 0.20) {
        needsAdjustment = true;
        suggestions.push(`${name} lệch ${Math.round(deviation * 100)}% (Thực tế: ${actual}, Mục tiêu: ${target})`);
      }
    };
    check(r.velocity.actual, r.velocity.target, 'Velocity');
    check(r.quality.actual, r.quality.target, 'Quality');
    check(r.cycleTime.actual, r.cycleTime.target, 'Cycle Time');
    check(r.completionRate.actual, r.completionRate.target, 'Completion Rate');

    const existingIdx = adjustments.findIndex(a => a.type === r.type && a.targetId === r.id);
    const adjustment = {
      id: existingIdx !== -1 ? adjustments[existingIdx].id : nextId++,
      type: r.type,
      targetId: r.id,
      name: r.name,
      metrics: {
        velocity: r.velocity,
        quality: r.quality,
        cycleTime: r.cycleTime,
        completionRate: r.completionRate
      },
      overallScore: r.overallScore,
      needsAdjustment,
      suggestions,
      adjustedAt: new Date().toISOString(),
      isClosed: existingIdx !== -1 ? adjustments[existingIdx].isClosed : false
    };

    // Auto feedback loop if needsAdjustment is true and it's a Project
    if (needsAdjustment && r.type === 'Project') {
      try {
        await axios.post(`${T1_URL}/api/config/update`, {
          projectId: r.id,
          suggestions: suggestions
        });
        console.log(`[T4] Đã gửi yêu cầu điều chỉnh tự động cho Dự án #${r.id}`);
        adjustment.feedbackSent = true;
      } catch (err) {
        console.error(`[T4] Lỗi gửi feedback tới T1 cho Dự án #${r.id}:`, err.message);
      }
    }

    if (existingIdx !== -1) {
      adjustments[existingIdx] = adjustment;
    } else {
      adjustments.push(adjustment);
    }
    return adjustment;
  }));

  console.log(`[T4] Đã phân tích điều chỉnh cho ${newAdjustments.length} đối tượng`);
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
