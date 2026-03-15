const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// ============================================
// WorkDataService (T2) — Ghi nhận dữ liệu thực tế
// ============================================

let workData = [];
let nextId = 1;

// POST — Ghi nhận dữ liệu thực tế
app.post('/api/workdata', (req, res) => {
  const { kpiId, actual, note } = req.body;

  if (!kpiId || actual === undefined) {
    return res.status(400).json({ error: 'Vui lòng cung cấp: kpiId, actual' });
  }

  // Nếu đã có dữ liệu cho KPI này → cập nhật
  const existing = workData.findIndex(w => w.kpiId === Number(kpiId));
  if (existing !== -1) {
    workData[existing].actual = Number(actual);
    workData[existing].note = note || workData[existing].note;
    workData[existing].updatedAt = new Date().toISOString();
    console.log(`[T2] Cập nhật KPI #${kpiId}: actual = ${actual}`);
    return res.json(workData[existing]);
  }

  const entry = {
    id: nextId++,
    kpiId: Number(kpiId),
    actual: Number(actual),
    note: note || '',
    createdAt: new Date().toISOString()
  };
  workData.push(entry);
  console.log(`[T2] Ghi nhận KPI #${kpiId}: actual = ${actual}`);
  res.status(201).json(entry);
});

// GET — Tất cả dữ liệu thực tế
app.get('/api/workdata', (req, res) => {
  res.json(workData);
});

// GET — Dữ liệu theo KPI ID
app.get('/api/workdata/:kpiId', (req, res) => {
  const data = workData.filter(w => w.kpiId === Number(req.params.kpiId));
  res.json(data);
});

// DELETE — Xóa dữ liệu
app.delete('/api/workdata/:id', (req, res) => {
  const idx = workData.findIndex(w => w.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy' });
  workData.splice(idx, 1);
  res.json({ message: 'Đã xóa' });
});

app.listen(PORT, () => {
  console.log(`📊 [T2] WorkDataService đang chạy tại http://localhost:${PORT}`);
});
