# 🚀 Kịch Bản Demo: Hệ thống Quản lý KPI (Microservices)

Tài liệu này hướng dẫn chi tiết từng bước để demo toàn bộ vòng đời (lifecycle) của việc quản lý hiệu suất dựa trên Task (Công việc) qua 4 Microservices (T1, T2, T3, T4). Đồng thời, giải thích rõ cách dữ liệu luân chuyển và các API giao tiếp với nhau.

---

## 🎬 TÓM TẮT LUỒNG DỮ LIỆU (DATA FLOW)
1. **T1 (KPI Setup)**: Đóng vai trò là CSDL chính (Master Data). Cho phép tạo Dự án (Project), Nhân sự (Employee), và Công việc (Task).
2. **T2 (Work Data)**: Đóng vai trò Worker. Khi người dùng thay đổi trạng thái công việc (VD: Todo -> Inprogress -> Done), T2 sẽ gọi API sang T1 để cập nhật trạng thái Task, đồng thời tự động lưu lại lịch sử (Work Logs) ở T2.
3. **T3 (Evaluation)**: Đóng vai trò là cỗ máy tính toán. Khi được kích hoạt, T3 sẽ gọi sang T1 lấy toàn bộ danh sách Task. Sau đó tóm tắt và đánh giá KPI cho Dự án và Nhân sự dựa trên công thức tính: **Velocity** (Vận tốc hoàn thành), **Quality** (Chất lượng - dựa trên tỷ lệ Bug), và **Completion Rate** (Tỷ lệ hoàn thành). Sau đó, nó sẽ tự động gửi kết quả điểm số sang T4.
4. **T4 (Adjustment)**: Đóng vai trò Quản lý phân tích. T4 nhận kết quả chấm điểm từ T3, đưa ra đề xuất Tự động (Thưởng/Phạt/Đào tạo), cho phép quản lý Ghi chú, và có chốt sổ (Close Cycle) để đóng băng phiên đánh giá.

---

## 🎭 KỊCH BẢN DEMO CHI TIẾT (STEP-BY-STEP)

Phân vai: Người trình bày đóng vai Quản lý dự án (Project Manager).

### Bước 1: Khởi tạo Dữ liệu Nền tảng (Service T1)
* **Thao tác trên UI:** Vào Tab **"Danh mục & KPI (T1)"**.
* **Hành động 1:** Khởi tạo tài nguyên. 
  - Tạo 1 Dự án mới: "Website Bán Hàng 2026".
  - Tạo 2 Nhân sự: 
    + "Trần Văn Dev" (Phòng IT, Cost: $15/h, Skills: `React:4, Node:3`)
    + "Lê Thị Tester" (Phòng QA, Cost: $10/h, Skills: `Testing:4`)
* **Hành động 2:** Giao việc (Tạo Tasks).
  - Tạo Task 1: "Thiết kế giao diện trang chủ" -> Gán cho "Trần Văn Dev", Loại: **Task**, Trọng số (Weight): 5.
  - Tạo Task 2: "Viết API Đăng nhập" -> Gán cho "Trần Văn Dev", Loại: **Task**, Trọng số: 3.
  - Tạo Task 3: "Lỗi UI hiển thị sai trên Mobile" -> Gán cho "Trần Văn Dev", Loại: **Bug**, Trọng số: 2.
* **API hoạt động ngầm:** 
  - Giao diện (Frontend) đang gọi `POST http://localhost:3001/api/projects`, `POST /api/employees`, và `POST /api/tasks` để lưu vào bộ nhớ (In-memory) của T1.

### Bước 2: Chạy thực tế và Ghi log sự kiện (Service T2)
* **Thao tác trên UI:** Chuyển sang Tab **"Cập nhật Tiến độ (T2)"**.
* **Hành động:** Giả lập quá trình làm việc trong tuần.
  - Ở Task "Thiết kế giao diện", bấm **Bắt đầu làm (Inprogress)**, rồi sau đó bấm tiếp **Hoàn thành (Done)**.
  - Ở Task "Viết API Đăng nhập", bấm **Bắt đầu làm (Inprogress)** và để đó.
  - Nhìn xuống bảng "Nhật ký hoạt động". Bạn sẽ thấy danh sách log thay đổi trạng thái vừa thực hiện.
* **API hoạt động ngầm:**
  - Khi bấm đổi trạng thái, UI gọi `POST http://localhost:3002/api/workdata/tasks/:taskId/status`.
  - Service T2 nhận yêu cầu -> Lên T1 gọi `GET /api/tasks/:id` để lấy thông tin cũ -> Gọi `PUT http://localhost:3001/api/tasks/:id` ở T1 để đổi trạng thái thành "Done" -> Sau đó lưu thông tin log vào bộ nhớ nội bộ của T2. 

### Bước 3: Đánh giá Năng lực tự động (Service T3)
* **Thao tác trên UI:** Chuyển sang Tab **"Đánh giá Hiệu suất (T3)"**.
* **Hành động:** 
  - Bấm nút **"Tính toán kết quả"**.
  - Kết quả xuất hiện. Bạn giải thích cho khán giả ý nghĩa của các con số:
    + "Trần Văn Dev" có Velocity = 5 (vì đã xong Task 1 có Weight 5). 
    + Hoàn thành 1/3 (33%) Task được giao. 
    + Quality = 100% (vì chưa có task Bug nào dạng Done, tỷ lệ lỗi là 0/1).
    + Tổng điểm: Khoảng < 80 điểm (do tỷ lệ hoàn thành thấp).
* **API hoạt động ngầm:**
  - UI gọi `GET http://localhost:3003/api/evaluate`.
  - T3 sẽ thọc vào T1 qua ngõ `GET http://localhost:3001/api/tasks`. T3 tính toán các công thức (Velocity, Quality, Completion).
  - T3 gom biến số thành dạng JSON (đã chấm điểm xong) và "bắn" ngay sang T4 bằng lệnh `POST http://localhost:3004/api/adjust` để lưu sổ sách. T3 trả kết quả lại cho UI hiển thị.

### Bước 4: Phân tích và Ra quyết định (Service T4)
* **Thao tác trên UI:** Chuyển sang Tab **"Quản lý & Điều chỉnh (T4)"**.
* **Hành động 1:** Nhận xét và Gợi ý.
  - Bảng T4 hiển thị lại điểm số từ T3. Cột "Khuyến nghị hành động" sẽ đổi màu (Xanh: Duy trì, Đỏ: Cần đào tạo) dựa trên Overall Score.
  - Quản lý nhấp vào cột "Kế hoạch hỗ trợ/Lý do thưởng" của anh Trần Văn Dev -> Gõ: "Cần code API nhanh hơn, chuyển QA test gấp".
* **Hành động 2:** Khóa sổ kết thúc tháng.
  - Bấm **"Chốt sổ Dữ liệu"**. 
  - Một Modal hiện lên cảnh báo. Bấm đồng ý. Ngay lập tức hàng của anh "Trần Văn Dev" sẽ chuyển sang trạng thái đã chốt, ô nhập văn bản bị mờ (disabled).
* **API hoạt động ngầm:**
  - Khi quản lý gõ Ghi chú và rời trỏ chuột, UI gọi `POST http://localhost:3004/api/adjust/summary/:id/details` để lưu ghi chú.
  - Khi bấm Chốt sổ, UI duyệt qua tất cả báo cáo chưa khóa và gọi API T4 để set `isClosed: true`. 
  - Lúc này màn hình Dashboard (nếu bạn chuyển qua) cũng sẽ hiển thị các con số tổng kết của kỳ.
  - (Viết API ngầm T4 có tùy chọn gọi ngược lại T1 để cấp lại Target nếu cần, nhưng do đã chuyển sang đánh giá bằng Task, vòng lặp mới sẽ bắt đầu bằng việc T1 giao Task mới).

---

## 🌐 TÓM TẮT ĐỊA CHỈ API POSTMAN (Dành cho Dev Tester)

| Microservice | Port | Mục đích chính | Lệnh gọi ví dụ |
| :--- | :--- | :--- | :--- |
| **T1 - Setup** | 3001 | Thêm/Xóa/Sửa Task, Project, Employee | `POST http://localhost:3001/api/tasks` |
| **T2 - WorkData** | 3002 | Worker Proxy cập nhật trạng thái Task | `POST http://localhost:3002/api/workdata/tasks/:taskId/status` |
| **T3 - Evaluate** | 3003 | Tổng hợp tính toán Score (không lưu trữ) | `GET http://localhost:3003/api/evaluate` |
| **T4 - Adjust** | 3004 | Lưu trữ Snapshot kết quả, Ghi chú, Lock dữ liệu | `GET http://localhost:3004/api/adjustments` |
