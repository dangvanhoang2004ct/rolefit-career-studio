# Kiểm tra trước khi phát hành

- [ ] Tải trang trên điện thoại và desktop, không tràn bố cục.
- [ ] Bản minh họa hiển thị [MINH HỌA], không được mô tả là AI đánh giá thật.
- [ ] Tải TXT/DOCX/PDF văn bản, kiểm tra trích xuất, và báo lỗi khi scan không có chữ.
- [ ] Không cung cấp CV hoặc không đồng ý gửi AI thì bị chặn đúng.
- [ ] Không có API key hoặc mã truy cập → API báo chưa kết nối; không giả tạo kết quả.
- [ ] Có key/mã → phân tích JD, ma trận 4 trạng thái, CV editor, lộ trình tối đa 3 mục.
- [ ] Export `.docx` mở được bằng Word, tên theo công ty/vị trí, có thể chỉnh sửa.
- [ ] Mở hai báo cáo, chuyển tab và so sánh kỹ năng.
- [ ] Chatbot có mã hợp lệ trả câu hỏi; sai mã nhận 401.
- [ ] Không nhúng API key trong HTML, JS hoặc Git repository.

Đã kiểm tra cú pháp JavaScript, ma trận DOM, thử hàm Word bằng node và đọc `.docx` bằng python-docx. Chức năng gọi AI thật chỉ kiểm tra được trên Netlify sau khi chủ site cấu hình key riêng. Môi trường thử hiện tại chặn trình duyệt Chromium truy cập URL theo chính sách hệ thống; chưa xác nhận được tương tác UI bằng tự động hóa trình duyệt.
