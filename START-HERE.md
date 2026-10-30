# ROLEFIT 2.0 — HƯỚNG DẪN ĐƯA LÊN NETLIFY

**Gói này đã có mã nguồn website + backend phân tích AI + chatbot + Word. Chưa có URL công khai cho đến khi chủ website tạo repository và deploy.**

## Cách nhanh nhất (GitHub Desktop — Netlify)

1. Giải nén `RoleFit-Complete-Netlify.zip`. Không xóa thư mục con `public`, `netlify/functions` hoặc file `netlify.toml`.
2. Mở [GitHub Desktop](https://desktop.github.com/) → **File → Add local repository** → chọn thư mục RoleFit đã giải nén. Gói có `.git` và một commit khởi tạo. Nếu GitHub Desktop thông báo không nhận repository, chọn **Create repository here** rồi tạo commit đầu tiên.
3. Chọn **Publish repository** và để **Private**. Bạn sẽ nhận URL dạng `https://github.com/<tai-khoan>/rolefit-career-studio`.
4. Mở [Netlify](https://app.netlify.com/start) → **Import an existing project** → **GitHub** → chọn repository vừa xuất bản. Nếu Netlify hỏi, đặt: **Build command** `npm run build`, **Publish directory** `public`, **Functions directory** `netlify/functions`. `netlify.toml` đã thiết lập các mục này.
5. Trong Netlify → **Project configuration → Environment variables** thêm:
   - `OPENAI_API_KEY`: API key riêng của OpenAI Platform (chi phí API tách biệt ChatGPT Plus).
   - `APP_ACCESS_CODE`: mã bí mật **ít nhất 12 ký tự**, không đăng công khai.
   - `OPENAI_MODEL`: tùy chọn, mặc định `gpt-4.1-mini`.
6. **Trigger deploy → Deploy site** lại sau khi thêm biến. Netlify sẽ cấp `https://<ten-site>.netlify.app`. Đây là link chia sẻ Facebook / Zalo / Messenger.
7. Mở `https://<ten-site>.netlify.app/api/health`. Khi cả hai biến cần thiết được cấu hình, máy chủ báo `"ready":true` (chỉ báo cấu hình, **không** xác nhận API key đã thanh toán/hoạt động). Vào RoleFit → **Thiết lập** → nhập mã truy cập → sử dụng CV/JD mẫu **không chứa thông tin nhạy cảm** để thử phân tích, chat, Word và so sánh nhiều JD.

> Để chỉ cần **dán một link repository vào Netlify**, repository đó phải tồn tại trên GitHub trước. File ZIP trong ChatGPT **không phải** GitHub URL và không thể được dán vào ô Import repository.

## Lưu ý bảo mật

- Không nhập API key trên giao diện website hay commit key vào GitHub. Chỉ nhập key trong trang **Environment variables** riêng của Netlify.
- Người xem công khai có thể mở giao diện. AI chỉ hoạt động với mã truy cập bí mật. Mã chia sẻ không thay thế tài khoản người dùng, quota và rate limiting khi vận hành công khai.
- Cài ngân sách/hạn mức ở OpenAI Platform; sử dụng dữ liệu CV/JD giả để kiểm thử lúc đầu.
- CV và JD được gửi lên API AI **chỉ khi bạn chủ động thực hiện phân tích/chat có ngữ cảnh**. Báo cáo JSON xuất ra có thể chứa dữ liệu nhạy cảm. Không gửi cho người không có quyền.

## Tính năng

- Đọc JD (văn bản, PDF có chữ, DOCX; ảnh JD JPG/PNG/WEBP khi có backend) và CV (văn bản, PDF có chữ, DOCX).
- Phân tích theo 4 mức bằng chứng (đáp ứng tốt / một phần / chưa có bằng chứng / đã xác định chưa đáp ứng).
- CV Harvard một cột xuất `.docx` thực, chỉnh sửa được.
- Lộ trình học tối đa 3 năng lực; phương án bù khoảng trống kinh nghiệm.
- So sánh nhiều JD, chatbot liên quan đến JD và CV đang chọn.
- Sao lưu / khôi phục báo cáo JSON (chủ động, không tự tải lên cloud); chỉnh sửa, sao chép báo cáo.
- Social sharing card tự thiết lập URL ảnh tuyệt đối trong lúc Netlify build.

## Chạy kiểm thử mã nguồn

Máy tính có Node 20+: `npm test` (backend dùng API mô phỏng, không phát sinh chi phí) và `npm run build` (kiểm tra tạo meta chia sẻ). Kiểm thử thật với OpenAI API/Netlify cần được thực hiện sau deploy.
