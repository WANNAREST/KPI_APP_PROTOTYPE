# 🎯 KPI Management System (Microservices Prototype)

## 📖 Giới thiệu (Overview)

Dự án này là một **Hệ Thống Quản Lý KPI nâng cao** được xây dựng theo kiến trúc Microservices và cơ sở dữ liệu In-Memory. 
Hệ thống giúp các nhà quản lý theo dõi tiến độ công việc (Tasks), tài sản (Assets) và đánh giá năng suất (Performance/KPIs) của Nhân sự cũng như Dự án một cách tự động thông qua các mô hình công thức tính toán: Velocity, Quality, và Cycle Time.

---

## 🏗️ Kiến trúc (Architecture)

Hệ thống bao gồm một Dashboard (Frontend React) kết nối trực tiếp đến **4 Microservices** (Backend Node.js/Express) độc lập:

1. **T1 - KPI Setup (Port 3001):** Quản lý Master Data: Projects, Employees (skills & costs), Tasks (Estimate, Weight, Status, Type), và Assets.
2. **T2 - Work Data (Port 3002):** Worker node dùng để cập nhật trạng thái làm việc thực tế (Thay đổi trạng thái Task: Todo -> Inprogress -> Done) và lưu trữ Work Logs.
3. **T3 - KPI Evaluation (Port 3003):** Thực hiện tính toán hiệu suất tự động. Lấy dữ liệu công việc (Tasks) từ T1 để tổng hợp ra các chỉ số: Velocity (Số điểm công việc đạt được), Quality (Tỷ lệ ít bug), Completion Rate, và Overall Score.
4. **T4 - KPI Adjustment (Port 3004):** Hệ thống phân tích và quản lý kết quả đánh giá cuối chu kỳ. Lưu trữ kết quả, đưa ra gợi ý hành động (Thưởng/Đào tạo), và cho phép quản lý chốt kỳ.

---

## 🚀 Kịch bản Demo (Demo Workflow)

Để hiểu rõ cách hoạt động của vòng lặp KPI dựa trên Task, hãy thực hiện theo 4 bước sau:

**Bước 1: Khởi tạo Dữ liệu (T1 - KPI Setup)**
- Truy cập tab **Danh mục & KPI (T1)**.
- Thêm một Dự án mới và một Nhân sự mới (nhập chi phí giờ và kỹ năng).
- Chuyển sang thẻ **Danh sách Công việc (Tasks)**: Tạo mới 3-4 công việc, bao gồm 'Task' bình thường và 'Bug', gán cho nhân sự vừa tạo.

**Bước 2: Log thời gian & Trạng thái làm việc (T2 - Work Data)**
- Truy cập tab **Cập nhật Tiến độ (T2)**.
- Giao diện dạng Kanban list sẽ hiển thị các Tasks. Bấm nút **"Bắt đầu làm (Inprogress)"**, sau đó bấm **"Hoàn thành (Done)"** cho một số Task. 
- Bạn sẽ thấy hệ thống ghi nhận lịch sử (Work Logs) ở bảng bên dưới.

**Bước 3: Chạy Đánh giá Tự động (T3 - Evaluation)**
- Truy cập tab **Đánh giá Hiệu suất (T3)**.
- Bấm **"Tính toán kết quả đánh giá"**.
- Hệ thống (T3) sẽ thu thập danh sách Tasks hiện tại, tính toán ra **Velocity**, **Tỷ lệ hoàn thành**, **Chất lượng** và quy đổi thành điểm số (Overall Score) cho từng Dự án và Nhân sự. 

**Bước 4: Điều chỉnh & Chốt kỳ (T4 - Adjustment)**
- Truy cập tab **Quản lý & Điều chỉnh (T4)**.
- Hệ thống tự động gợi ý hành động cụ thể cho những cá nhân đạt điểm xuất sắc hoặc điểm thấp.
- Quản lý có thể nhập **"Ghi chú (Lý do thưởng/phạt)"**.
- Bấm nút **"Chốt sổ Dữ liệu"** để khóa (Close) kết quả của phiên làm việc này, chuẩn bị cho vòng lặp KPI tiếp theo.

---

## 💻 Hướng dẫn Cài đặt (Installation)

Yêu cầu môi trường đã cài đặt sẵn [Node.js](https://nodejs.org/).

### 1. Khởi chạy 4 Microservices (Backend)
Mở 4 cửa sổ terminal riêng biệt. Ở mỗi cửa sổ, lần lượt di chuyển vào từng thư mục và chạy lệnh:

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

### 2. Khởi chạy Frontend (React/Vite)
Mở Terminal thứ 5:

```bash
cd frontend
npm install
npm run dev
```

Truy cập đường link hiển thị trên terminal (thường là `http://localhost:5173`) để sử dụng hệ thống!