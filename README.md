# RoleFit 2.0 — CV × JD Career Studio

## Triển khai RoleFit trên Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/dangvanhoang2004ct/rolefit-career-studio)

**Lưu ý:** Nút trên **bắt đầu quy trình tạo site**, chưa phải URL website đã công khai. Luồng template có thể sao chép repository; để giữ liên kết đúng với repository hiện có, vào [Netlify Import an existing project](https://app.netlify.com/start) và chọn repo `dangvanhoang2004ct/rolefit-career-studio`.

Cần khai báo `OPENAI_API_KEY`, `APP_ACCESS_CODE` (≥12 ký tự) bằng **Netlify Environment variables**; `OPENAI_MODEL` tùy chọn. Không đưa bí mật vào repository. Sau khi deploy, kiểm tra `/api/health` và phân tích thử CV/JD. Xem [USAGE.md](USAGE.md) và [PROJECT_BRIEF.md](PROJECT_BRIEF.md) trước khi mở cho công chúng.


Hệ thống phân tích CV so với JD, phân loại bằng chứng, tạo CV Word có thể chỉnh sửa, chọn tối đa ba năng lực ưu tiên và hỏi đáp AI theo ngữ cảnh. Giao diện sử dụng tiếng Việt, thiết kế desktop và mobile.

**Bắt đầu:** đọc [START-HERE.md](START-HERE.md) trước khi triển khai Netlify.

## Kiến trúc

```text
public/
  index.html             Trang web chính
  assets/app.js          Xử lý giao diện, tải JD/CV, quản lý báo cáo, xuất Word
  assets/style.css       Responsive UI
  assets/share-card.png  Ảnh chia sẻ Facebook / Zalo
netlify/
  functions/analyze.mjs  Phân tích JD + CV bằng OpenAI Responses API Structured Outputs
  functions/chat.mjs     Hỏi đáp theo báo cáo
  functions/compare.mjs  Phân tích kỹ năng chung nhiều JD
  functions/health.mjs   Kiểm tra tình trạng cấu hình
  lib/shared.mjs         Kiểm tra quyền truy cập, gọi API an toàn
  lib/report-schema.mjs  JSON Schema có ràng buộc
scripts/build.mjs        Thiết lập metadata chia sẻ mạng xã hội
scripts/static-check.mjs Kiểm tra tính nhất quán của HTML/JS
netlify.toml            Build, Functions, redirect, security headers
package.json            npm run build; npm test
```

## Tính năng và giới hạn

- **Hoạt động không cần API:** nhập và đọc văn bản CV/JD, xem bản phân tích **minh họa có nhãn**, xem giao diện, sửa báo cáo/CV minh họa, xuất Word, sao lưu hoặc khôi phục báo cáo JSON.
- **Cần Netlify Functions và OpenAI API:** phân tích nội dung JD/CV thật, đọc ảnh JD, chatbot, đánh giá các JD có nội dung tương đồng.
- **PDF/DOCX:** trình duyệt tải PDF.js/Mammoth từ CDN để trích văn bản; file scan không có chữ sẽ không được OCR tự động; file PDF >35 trang phải chia nhỏ.
- **Không tự tạo thông tin:** chỉ dựa trên CV/JD đã cung cấp. Bất kỳ nội dung nào thiếu cần xác minh trước khi nộp. CV Word có thể chỉnh sửa và cần tự kiểm tra.
- **Quyền truy cập:** mã dùng chung chỉ thích hợp sử dụng cá nhân/nhóm tin cậy. Trước khi chia sẻ tính năng AI cho đại chúng, cần hệ thống đăng nhập, rate limit và kiểm soát hạn mức API.
- **Dữ liệu:** Mặc định chỉ ở bộ nhớ tab; chỉ lưu JD/CV vào localStorage nếu người dùng chọn; xuất JSON backup có thể chứa dữ liệu cá nhân; OpenAI Responses API gọi với `store:false`. Không lưu hồ sơ trên server ứng dụng.

## Các biến môi trường

`OPENAI_API_KEY` (bắt buộc), `APP_ACCESS_CODE` (bắt buộc, ≥12 ký tự), `OPENAI_MODEL` (tùy chọn, mặc định `gpt-4.1-mini`). **Tuyệt đối không ghi giá trị thật vào mã nguồn.**

## Kiểm tra trước khi dùng thực tế

`npm test` đã kiểm tra các API dưới dạng mock và tính nhất quán HTML/JS. File Word mẫu đã được đọc và render để kiểm tra. Không có lời khẳng định các thao tác người dùng đã được kiểm thử trên trình duyệt Netlify thật hoặc OpenAI API thật trước khi bạn triển khai.

## Nguồn kỹ thuật

- Netlify: https://docs.netlify.com/start/quickstarts/deploy-from-repository/
- Netlify Functions: https://docs.netlify.com/build/functions/configuration/
- Environment variables: https://docs.netlify.com/build/environment-variables/get-started/
- OpenAI Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
