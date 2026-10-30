# Hoàn tất RoleFit trên Netlify

> RoleFit là ứng dụng CV × JD có xử lý AI ở Netlify Functions. Không phải website tĩnh thuần túy.

## Cách nhanh nhất từ repository có sẵn

1. Mở https://app.netlify.com/start và đăng nhập bằng Netlify của chủ website.
2. Chọn **Import an existing project** > **GitHub** > repository `dangvanhoang2004ct/rolefit-career-studio`.
3. Branch: `main`; Build command: `npm run build`; Publish: `public`; Functions: `netlify/functions`. Các giá trị đã nằm trong `netlify.toml`.
4. Trong Netlify > Project configuration > Environment variables, đặt bằng giao diện kín:
   - `OPENAI_API_KEY`: OpenAI API key của chủ website.
   - `APP_ACCESS_CODE`: mã bí mật do chủ website tự đặt, dài ít nhất 12 ký tự.
   - `OPENAI_MODEL`: tùy chọn, mặc định `gpt-4.1-mini`.
   Đảm bảo scope có **Functions**; lưu và trigger deploy/redeploy sau khi thay đổi.
5. Kiểm tra **Deploys** báo trạng thái **Published**; nếu có lỗi xem deploy log.
6. Kiểm tra `https://<ten-site>.netlify.app/api/health`. `ready: true` là đã có hai biến bắt buộc (chưa xác nhận API key được OpenAI chấp nhận).
7. Mở website và thử với CV/JD mẫu không chứa dữ liệu riêng tư. Kiểm tra: phân tích bằng AI, chat, xuất Word, và so sánh JD.
8. Kiểm tra URL `.netlify.app` từ máy khác/chế độ ẩn danh. Nếu project là **Private**, đổi thành **Public** theo cài đặt project visibility; không chia sẻ mã truy cập AI công khai.
9. Gửi đường link public qua Zalo, Facebook hoặc TikTok. Nếu preview ảnh không hiện, kiểm tra metadata `og:image` tại HTML, URL tuyệt đối và khả năng truy cập của trình thu thập của nền tảng.

## Liên kết Netlify triển khai từ mã nguồn (template)

https://app.netlify.com/start/deploy?repository=https://github.com/dangvanhoang2004ct/rolefit-career-studio

**Chú ý:** Đây là link khởi tạo triển khai, **không phải website RoleFit đã chạy**. Netlify Deploy button có thể sao chép repository thành repo mới. Nếu muốn giữ kết nối chính với repository đang dùng, ưu tiên **Import an existing project**.

## Bảo mật & giới hạn

- Không đưa API key hoặc `APP_ACCESS_CODE` vào GitHub, frontend, hay hội thoại.
- Trang web có thể mở công khai, nhưng AI có mã truy cập dùng chung dành cho cá nhân/nhóm tin cậy. Muốn tất cả người dùng đều dùng AI: cần đăng nhập riêng, rate limit, quota, abuse protection, kiểm soát chi phí và chính sách dữ liệu trước khi mở công khai.
- Chatbot hiện là trợ lý theo yêu cầu, không phải agent tự chạy trong nền; muốn tự động theo lịch cần thiết kế thêm tác vụ nền và lưu trữ có quyền truy cập.
- CV/JD có thông tin cá nhân; yêu cầu đồng ý gửi trước khi gọi API AI.
- Không nhận định triển khai đã thành công cho tới khi có URL thật và kiểm thử.

## Theo dõi

Chủ website có thể cập nhật trang qua commit lên branch `main`; Netlify tự build và deploy lại nếu đã kết nối Git.
