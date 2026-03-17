const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// ============================================
// WorkDataService (T2) — Ghi nhận dữ liệu thực tế
// ============================================

let workLogs = [];
let nextLogId = 1;

const T1_URL = 'http://localhost:3001';

// Lấy danh sách work logs
app.get('/api/worklogs', (req, res) => {
  res.json(workLogs);
});

// Cập nhật trạng thái Task (tương đương với việc "làm việc")
app.post('/api/workdata/tasks/:taskId/status', async (req, res) => {
  const taskId = Number(req.params.taskId);
  const { status, note, employeeId } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Cần cung cấp status mới' });
  }

  try {
    // 1. Fetch task current info from T1
    const t1Res = await fetch(`${T1_URL}/api/tasks`);
    const tasks = await t1Res.json();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return res.status(404).json({ error: 'Không tìm thấy Task trên T1' });

    // 2. Cập nhật status sang T1
    const updRes = await fetch(`${T1_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!updRes.ok) throw new Error('Cập nhật T1 thất bại');

    // 3. Ghi log công việc tại T2
    const logEntry = {
      id: nextLogId++,
      taskId,
      taskName: task.name,
      employeeId: employeeId || task.assigneeId,
      oldStatus: task.status,
      newStatus: status,
      note: note || `Đổi trạng thái thành ${status}`,
      timestamp: new Date().toISOString()
    };
    workLogs.push(logEntry);
    
    console.log(`[T2] Đã ghi nhận chuyển Task #${taskId} sang ${status}`);
    res.status(201).json(logEntry);

  } catch (err) {
    console.error('[T2] Lỗi gọi T1:', err.message);
    res.status(500).json({ error: 'Không thể cập nhật Task (Lỗi kết nối T1)' });
  }
});

// GET — Dữ liệu log theo Task ID
app.get('/api/worklogs/task/:taskId', (req, res) => {
  const data = workLogs.filter(w => w.taskId === Number(req.params.taskId));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`📊 [T2] WorkDataService đang chạy tại http://localhost:${PORT}`);
});
