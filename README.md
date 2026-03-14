# KPI_APP_PROTOTYPE — Hệ thống quản lý KPI (Microservices)

> Bản mẫu (prototype) hệ thống quản lý KPI theo kiến trúc Microservices.  
> Sử dụng **React (Vite) + Tailwind CSS** cho Frontend và **Node.js (Express)** cho Backend.

## 📁 Cấu trúc dự án (Monorepo)

```
KPI_APP_PROTOTYPE/
├── services/
│   ├── t1-kpi-setup/          # 🎯 Port 3001 — Thiết lập mục tiêu KPI
│   │   ├── package.json
│   │   └── index.js
│   ├── t2-work-data/           # 📊 Port 3002 — Ghi nhận dữ liệu thực tế
│   │   ├── package.json
│   │   └── index.js
│   ├── t3-kpi-evaluation/      # 📈 Port 3003 — Tính toán hiệu suất (%)
│   │   ├── package.json
│   │   └── index.js
│   └── t4-kpi-adjustment/      # ✅ Port 3004 — Cập nhật trạng thái KPI
│       ├── package.json
│       └── index.js
├── frontend/                   # ⚛️  React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json                # Root — chạy đồng thời tất cả services
└── README.md
```

## 🏗️ Kiến trúc hệ thống

```
┌──────────────────────────────────────────────────────┐
│                    KPI Dashboard                     │
│              (React + Vite + Tailwind)               │
│                   localhost:5173                      │
└────────┬──────────┬──────────┬──────────┬────────────┘
         │          │          │          │
    ┌────▼───┐ ┌────▼───┐ ┌────▼───┐ ┌────▼───┐
    │ T1     │ │ T2     │ │ T3     │ │ T4     │
    │ Setup  │ │ Work   │ │ Eval   │ │ Adjust │
    │ :3001  │ │ :3002  │ │ :3003  │ │ :3004  │
    └────────┘ └────────┘ └───┬────┘ └────────┘
                              │
                    Gọi T1 & T2 để
                    tính hiệu suất
```

- **T1 (KPISetup)** — Tạo/lưu chỉ số KPI mục tiêu.
- **T2 (WorkData)** — Ghi nhận dữ liệu thực tế làm được.
- **T3 (KPIEvaluation)** — Lấy dữ liệu từ T1 & T2 để tính toán hiệu suất (%).
- **T4 (KPIAdjustment)** — Cập nhật trạng thái KPI (Đạt / Không đạt).

> ⚠️ Dữ liệu được lưu **tạm trong bộ nhớ** (mảng Array). Khi restart service, dữ liệu sẽ mất.

---

## 🚀 Hướng dẫn cài đặt & chạy

### Yêu cầu

- **Node.js** ≥ 18
- **npm** ≥ 9

### Bước 1 — Cài đặt dependencies

```bash
# Tại thư mục gốc KPI_APP_PROTOTYPE/
npm install

# Cài đặt cho từng service và frontend
cd services/t1-kpi-setup && npm install && cd ../..
cd services/t2-work-data && npm install && cd ../..
cd services/t3-kpi-evaluation && npm install && cd ../..
cd services/t4-kpi-adjustment && npm install && cd ../..
cd frontend && npm install && cd ..
```

### Bước 2 — Chạy đồng thời tất cả dịch vụ

```bash
npm run dev
```

Lệnh này sẽ khởi động **5 process** cùng lúc:

| Service           | URL                         |
|-------------------|-----------------------------|
| T1 — KPISetup     | http://localhost:3001        |
| T2 — WorkData     | http://localhost:3002        |
| T3 — KPIEvaluation| http://localhost:3003        |
| T4 — KPIAdjustment| http://localhost:3004        |
| Frontend (React)  | http://localhost:5173        |

### Bước 3 — Mở trình duyệt

Truy cập **http://localhost:5173** để sử dụng KPI Dashboard.

---

## 🧪 Hướng dẫn sử dụng

1. **Tạo KPI mục tiêu (T1):** Điền tên, mục tiêu, đơn vị → nhấn "Tạo KPI mới"
2. **Nhập dữ liệu thực tế (T2):** Chọn KPI, nhập giá trị thực tế → nhấn "Ghi nhận dữ liệu"
3. **Đánh giá KPI (T3 + T4):** Nhấn **"⚡ Tính toán kết quả"** → xem bảng kết quả

### Ví dụ

| KPI             | Mục tiêu       | Thực tế        | Hiệu suất | Trạng thái |
|-----------------|-----------------|----------------|------------|------------|
| Doanh thu       | 100 triệu VND  | 120 triệu VND | 120%       | ✅ Đạt     |
| Số đơn hàng     | 50 đơn          | 35 đơn         | 70%        | ❌ Không đạt|

---

## 📡 API Endpoints

### T1 — KPISetupService (Port 3001)

| Method | Endpoint       | Mô tả                   |
|--------|----------------|--------------------------|
| POST   | /api/kpis      | Tạo chỉ số KPI mới       |
| GET    | /api/kpis      | Lấy danh sách tất cả KPI |
| GET    | /api/kpis/:id  | Lấy KPI theo ID          |

### T2 — WorkDataService (Port 3002)

| Method | Endpoint            | Mô tả                      |
|--------|---------------------|-----------------------------|
| POST   | /api/workdata       | Ghi nhận dữ liệu thực tế   |
| GET    | /api/workdata       | Lấy tất cả dữ liệu         |
| GET    | /api/workdata/:kpiId| Lấy dữ liệu theo KPI ID    |

### T3 — KPIEvaluationService (Port 3003)

| Method | Endpoint       | Mô tả                                    |
|--------|----------------|-------------------------------------------|
| GET    | /api/evaluate  | Tính toán hiệu suất (lấy từ T1 & T2)    |

### T4 — KPIAdjustmentService (Port 3004)

| Method | Endpoint          | Mô tả                       |
|--------|-------------------|------------------------------|
| POST   | /api/adjust       | Cập nhật trạng thái KPI      |
| GET    | /api/adjustments  | Lấy danh sách trạng thái     |

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** React (Vite) + Tailwind CSS v4
- **Backend:** Node.js + Express.js
- **Giao tiếp:** REST API (fetch / axios)
- **Dữ liệu:** In-memory Array (temporary)