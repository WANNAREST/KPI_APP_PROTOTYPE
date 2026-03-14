const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());
let kpis = [];
let nextId = 1;
// Tạo mới một chỉ số KPI mục tiêu
app.post('/api/kpis', (req, res) => {
  const { name, target, unit } = req.body;

  if (!name || target === undefined || !unit) {
    return res.status(400).json({
      error: 'Vui lòng cung cấp đầy đủ: name, target, unit'
    });
  }

  const kpi = {
    id: nextId++,
    name,
    target: Number(target),
    unit,
    createdAt: new Date().toISOString()
  };

  kpis.push(kpi);
  console.log(`[T1] Đã tạo KPI: ${kpi.name} - Mục tiêu: ${kpi.target} ${kpi.unit}`);
  res.status(201).json(kpi);
});
// Lấy danh sách tất cả KPI
app.get('/api/kpis', (req, res) => {
  res.json(kpis);
});
// Lấy một KPI theo ID
app.get('/api/kpis/:id', (req, res) => {
  const kpi = kpis.find(k => k.id === Number(req.params.id));
  if (!kpi) {
    return res.status(404).json({ error: 'Không tìm thấy KPI' });
  }
  res.json(kpi);
});
app.listen(PORT, () => {
  console.log(`🎯 [T1] KPISetupService đang chạy tại http://localhost:${PORT}`);
});
