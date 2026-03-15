# 🎯 Hệ Thống Quản Lý KPI (Microservices Architecture)

## 📖 Giới thiệu (Overview)

Dự án này là một **Hệ Thống Quản Lý KPI** được xây dựng theo kiến trúc Microservices. Mục tiêu của hệ thống là tự động hóa và quản lý toàn bộ **Vòng lặp KPI (KPI Cycle)** từ khâu thiếp lập mục tiêu, ghi nhận thực tế, đánh giá hiệu suất cho đến khi đưa ra điều chỉnh. 

Hệ thống giúp các nhà quản lý và nhân viên dễ dàng theo dõi tiến độ công việc, đánh giá mức độ hoàn thành chỉ tiêu một cách khách quan dựa trên dữ liệu thực tế.

---

## 🏗️ Kiến trúc (Architecture)

Hệ thống bao gồm một Dashboard (Frontend) kết nối trực tiếp đến **4 Microservices** (Backend) độc lập. Mỗi service chịu trách nhiệm cho một giai đoạn riêng biệt trong vòng lặp KPI và chạy trên một port khác nhau:

1. **T1 - KPI Setup (Port 3001):** Quản lý định nghĩa KPI, thông tin Nhân viên và Dự án.
2. **T2 - Work Data (Port 3002):** Ghi nhận dữ liệu thực tế (Actual data) theo từng KPI.
3. **T3 - KPI Evaluation (Port 3003):** Lấy dữ liệu từ T1 và T2 để tính toán tỷ lệ hoàn thành (Performance) và đánh giá trạng thái (Đạt / Không đạt).
4. **T4 - KPI Adjustment (Port 3004):** Nhận kết quả đánh giá từ T3 để phê duyệt trạng thái, ghi chú và đề xuất mục tiêu (Target) cho chu kỳ tiếp theo.

---

## 🛠️ Danh sách API chi tiết

### 📌 1. Service T1: KPI Setup (`http://localhost:3001`)

Quản lý danh mục cốt lõi: Dự án, Nhân viên, và KPI Definition.

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/projects` | Lấy danh sách dự án |
| **POST** | `/api/projects` | Tạo dự án mới |
| **DELETE**| `/api/projects/:id` | Xóa dự án |
| **GET** | `/api/employees` | Lấy danh sách nhân viên |
| **POST** | `/api/employees` | Tạo nhân viên mới |
| **DELETE**| `/api/employees/:id` | Xóa nhân viên |
| **GET** | `/api/kpis` | Lấy danh sách định nghĩa KPI |
| **POST** | `/api/kpis` | Tạo KPI mới |
| **PUT** | `/api/kpis/:id` | Cập nhật mục tiêu KPI (Target) |
| **DELETE**| `/api/kpis/:id` | Xóa KPI |
| **GET** | `/api/stats` | Thống kê số lượng tổng quan |

<details>
<summary><b>Mẫu Request / Response T1</b></summary>

**POST `/api/kpis` - Request Body Mẫu:**
```json
{
  "name": "Doanh thu bán hàng",
  "target": 500,
  "unit": "Triệu VND",
  "projectId": 1,
  "employeeId": 2
}
```

**Response Mẫu:**
```json
{
  "id": 1,
  "name": "Doanh thu bán hàng",
  "target": 500,
  "unit": "Triệu VND",
  "projectId": 1,
  "employeeId": 2,
  "createdAt": "2023-10-25T10:00:00.000Z"
}
```
</details>

---

### 📌 2. Service T2: Work Data (`http://localhost:3002`)

Ghi nhận số liệu thực tế cho các KPI đang thực hiện.

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/workdata` | Lấy tất cả dữ liệu thực tế |
| **POST** | `/api/workdata` | Ghi nhận hoặc cập nhật số liệu thực tế cho 1 KPI |
| **GET** | `/api/workdata/:kpiId`| Lấy dữ liệu thực tế theo ID của KPI |
| **DELETE**| `/api/workdata/:id` | Xóa dữ liệu |

<details>
<summary><b>Mẫu Request / Response T2</b></summary>

**POST `/api/workdata` - Request Body Mẫu:**
```json
{
  "kpiId": 1,
  "actual": 450,
  "note": "Bán được lô hàng lớn cho công ty XYZ"
}
```

**Response Mẫu:**
```json
{
  "id": 1,
  "kpiId": 1,
  "actual": 450,
  "note": "Bán được lô hàng lớn cho công ty XYZ",
  "createdAt": "2023-10-25T14:30:00.000Z"
}
```
</details>

---

### 📌 3. Service T3: KPI Evaluation (`http://localhost:3003`)

Tổng hợp và tính toán hiệu suất tự động.

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/evaluate` | Tính toán hiệu suất (Performance %) cho tất cả KPI |
| **GET** | `/api/evaluate/stats` | Thống kê số lượng KPI Đạt / Không đạt |

<details>
<summary><b>Mẫu Request / Response T3</b></summary>

**GET `/api/evaluate` - Response Mẫu:**
```json
{
  "results": [
    {
      "kpiId": 1,
      "name": "Doanh thu bán hàng",
      "target": 500,
      "unit": "Triệu VND",
      "actual": 450,
      "performance": 90,
      "status": "Không đạt",
      "projectName": "Dự án A",
      "employeeName": "Nguyễn Văn B"
    }
  ]
}
```
</details>

---

### 📌 4. Service T4: KPI Adjustment (`http://localhost:3004`)

Điều chỉnh, phê duyệt và kết luận chu kỳ.

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/adjustments` | Lấy danh sách kết quả đã điều chỉnh |
| **POST** | `/api/adjust` | Cập nhật mảng kết quả từ T3 vào T4 |
| **POST** | `/api/adjust/:kpiId` | Phê duyệt trạng thái thủ công cho KPI |
| **POST** | `/api/adjust/:kpiId/details` | Cập nhật Ghi chú, Target mới, hoặc Đóng KPI |

<details>
<summary><b>Mẫu Request / Response T4</b></summary>

**POST `/api/adjust/1/details` - Request Body Mẫu:**
```json
{
  "note": "Cần cố gắng hơn vào tháng sau",
  "nextTarget": 550,
  "isClosed": false
}
```

**Response Mẫu:**
```json
{
  "id": 1,
  "kpiId": 1,
  "name": "Doanh thu",
  "performance": 90,
  "status": "Không đạt",
  "note": "Cần cố gắng hơn vào tháng sau",
  "nextTarget": 550,
  "history": [60, 75, 100, 90],
  "isClosed": false
}
```
</details>

---

## 🚀 Kịch bản Demo (Demo Workflow)

Để hiểu rõ vòng lặp KPI của hệ thống, hãy thực hiện theo 4 bước sau trên giao diện:

1. **Bước 1: Khởi tạo (T1)**
   - Truy cập **Thiết lập KPI**.
   - Tạo một Nhân Viên (ví dụ: "Sơn Tùng M-TP").
   - Tạo một Dự án (ví dụ: "Music Video mới").
   - Tạo một KPI (ví dụ: "Lượt xem YouTube", Mục tiêu: `100` Triệu view, chỉ định nhân viên và dự án vừa tạo).

2. **Bước 2: Ghi nhận công việc (T2)**
   - Chuyển sang trang **Dữ liệu thực tế (Work Data)**.
   - Chọn KPI "Lượt xem YouTube" và nhập số liệu thực tế (ví dụ: `120`). Hệ thống T2 sẽ lưu lại con số này.

3. **Bước 3: Đánh giá tự động (T3)**
   - Chuyển sang trang **Đánh giá KPI**.
   - Bấm nút **Chạy đánh giá hệ thống (Evaluate)**.
   - T3 sẽ tự động gọi sang T1 lấy Mục tiêu, gọi sang T2 lấy Thực tế, rồi tính ra `Performance: 120%` và định đoạt trạng thái là `"Đạt"`.

4. **Bước 4: Điều chỉnh & Đề xuất (T4)**
   - Chuyển sang trang **Điều chỉnh**.
   - T4 sẽ nhận kết quả từ T3. Tại đây Quản lý có thể:
     - Viết ghi chú (Nhận xét khen thưởng).
     - Điều chỉnh tự động Tăng/Giảm mục tiêu cho kỳ tới (Ví dụ: Tăng target lên `132` Triệu view cho kỳ tiếp theo).
     - Hoặc có thể chốt đóng chu kỳ KPI (Close KPI).

---

## 💻 Hướng dẫn cài đặt (Installation)

Yêu cầu môi trường: Cài đặt sẵn [Node.js](https://nodejs.org/).

### 1. Khởi chạy 4 Microservices (Backend)
Mở 4 terminal riêng biệt, lần lượt di chuyển vào từng thư mục và chạy lệnh:

**Terminal 1:**
```bash
cd services/t1-kpi-setup
npm install
node index.js
```

**Terminal 2:**
```bash
cd services/t2-work-data
npm install
node index.js
```

**Terminal 3:**
```bash
cd services/t3-kpi-evaluation
npm install
node index.js
```

**Terminal 4:**
```bash
cd services/t4-kpi-adjustment
npm install
node index.js
```

### 2. Khởi chạy Frontend (Vite + React)
Mở Terminal thứ 5:

```bash
cd frontend
npm install
npm run dev
```

Chương trình sẽ hiển thị một đường link Local (thường là `http://localhost:5173`). Bấm vào link đó trên trình duyệt để sử dụng hệ thống!