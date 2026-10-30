# PROJECT BRIEF — RoleFit Career Studio

Cập nhật: 2026-10-30

## Mục tiêu
RoleFit là website tiếng Việt, có link public mở được trên điện thoại và máy tính, dễ chia sẻ qua Facebook, Zalo, TikTok, Messenger. Cốt lõi là đánh giá JD–CV dựa trên bằng chứng, cải thiện CV và kế hoạch thu hẹp khoảng trống năng lực. Ưu tiên website hoạt động thật, không phải mock được ngụy trang thành AI.

## Nguyên tắc phân tích
- Đọc toàn bộ JD, phân biệt yêu cầu bắt buộc và ưu tiên, dữ kiện rõ ràng và suy luận.
- Đối chiếu CV qua bảng `Yêu cầu JD — Bằng chứng — Đáp ứng — Khoảng trống — Cách cải thiện`.
- Mức đáp ứng: tốt / một phần / CV chưa có bằng chứng / đã xác định chưa đáp ứng. Không coi chưa đề cập là không biết.
- Không bịa tên, số liệu, thời gian, kinh nghiệm, công cụ hay thành tích; không quy đổi số năm hoặc portfolio thành thâm niên làm việc.
- Đánh giá phù hợp ứng tuyển ngay / thử sức / bổ sung trước, không chấm tỷ lệ trúng tuyển vô căn cứ.
- CV riêng theo JD, Harvard 1 cột, Word chỉnh sửa được, giữ dữ kiện CV gốc.
- Chọn tối đa 3 thiếu hụt lớn nhất; ưu tiên bài thực hành, sản phẩm minh chứng, tiêu chí hoàn thành, phân kỳ trước ứng tuyển / trước phỏng vấn / sau.
- Hỗ trợ nhiều JD, kỹ năng dùng chung, hỏi đáp chatbot theo CV/JD đã phân tích.

## Yêu cầu website
- UX/UI rõ ràng, responsive, nhập văn bản và tài liệu CV/JD, chỉnh sửa và sao chép báo cáo, xuất DOCX, sao lưu kết quả.
- Dashboard trực quan, bảng đối chiếu và trợ lý hội thoại có ngữ cảnh.
- AI chạy qua Netlify Functions, API key phía máy chủ, không dùng kết quả giả.
- Người dùng phải đồng ý khi gửi dữ liệu hồ sơ tới dịch vụ AI.
- Ưu tiên triển khai GitHub repository `dangvanhoang2004ct/rolefit-career-studio` → Netlify liên tục từ nhánh `main`.
- Website mở công khai; quyền sử dụng AI và dữ liệu cá nhân phải được quản lý an toàn. Hạn chế lạm dụng và ngân sách cần thực hiện trước khi cho đại chúng gọi AI.

## Trạng thái tính đến 2026-10-30
- Mã nguồn đã được commit lên GitHub.
- Kiểm tra local `npm test` và `npm run build` đã chạy thành công; kiểm tra API là mock (chưa gọi OpenAI thật).
- Chưa có bằng chứng website Netlify production đã deploy thành công; cần chủ tài khoản xác thực trên Netlify.
- Cần các biến môi trường `OPENAI_API_KEY`, `APP_ACCESS_CODE`; `OPENAI_MODEL` tùy chọn.
- Chưa có persistent user login, rate limiting server-side, database và scheduler; không gọi là AI agent tự chủ hoàn toàn.

## Quy trình cập nhật
Chỉnh mã nguồn → chạy test/build → commit GitHub main → Netlify auto deploy → kiểm tra health + giao diện + workflow và social preview.

Thông tin này lưu trong repository làm yêu cầu dự án dài hạn; không phải bộ nhớ vĩnh viễn của ChatGPT.
