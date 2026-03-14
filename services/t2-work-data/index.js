const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// ============================================
// WorkDataService (T2) - Ghi nhận dữ liệu thực tế
// In-memory database
// ============================================
let workData = [];
let nextId = 1;

// Ghi nhận dữ liệu thực tế làm được
app.post('/api/workdata', (req, res) => {
  const { kpiId, actual } = req.body;

  if (!kpiId || actual === undefined) {
    return res.status(400).json({
      error: 'Vui lòng cung cấp đầy đủ: kpiId, actual'
    });
  }

  // Kiểm tra nếu đã có dữ liệu cho KPI này thì cập nhật
  const existingIndex = workData.findIndex(w => w.kpiId === Number(kpiId));
  if (existingIndex !== -1) {
    workData[existingIndex].actual = Number(actual);
    workData[existingIndex].updatedAt = new Date().toISOString();
    console.log(`[T2] Đã cập nhật dữ liệu KPI #${kpiId}: actual = ${actual}`);
    return res.json(workData[existingIndex]);
  }

  const entry = {
    id: nextId++,
    kpiId: Number(kpiId),
    actual: Number(actual),
    createdAt: new Date().toISOString()
  };

  workData.push(entry);
  console.log(`[T2] Đã ghi nhận dữ liệu KPI #${kpiId}: actual = ${actual}`);
  res.status(201).json(entry);
});

// Lấy tất cả dữ liệu thực tế
app.get('/api/workdata', (req, res) => {
  res.json(workData);
});

// Lấy dữ liệu thực tế theo KPI ID
app.get('/api/workdata/:kpiId', (req, res) => {
  const data = workData.filter(w => w.kpiId === Number(req.params.kpiId));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`📊 [T2] WorkDataService đang chạy tại http://localhost:${PORT}`);
});
