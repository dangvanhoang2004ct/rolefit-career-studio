# RoleFit 2.1 — vận hành

Website: https://rolefit-career-studio.netlify.app/

## AI Gateway
Backend dùng OpenAI SDK với OPENAI_API_KEY và OPENAI_BASE_URL do Netlify AI Gateway cấp ở runtime. Người dùng không phải nhập key riêng hoặc APP_ACCESS_CODE. Gói Netlify phải hỗ trợ AI Gateway và AI Features phải được bật. Model mặc định gpt-4.1-mini được xác nhận có trong providers endpoint khi cập nhật; OPENAI_MODEL vẫn là tùy chọn quản trị.

GET /api/health chỉ cho biết có cấu hình runtime, KHÔNG chứng minh một lần gọi AI đã thành công. Nếu ready=false, kiểm tra AI Features, gói và credits. Không tạo key giả.

## Giới hạn
- Phân tích và so sánh: 2 yêu cầu/phút/IP/domain cho mỗi endpoint.
- Chat: 6 yêu cầu/phút/IP/domain.
- Bảo vệ cả /api/* và /.netlify/functions/* bằng config.path.
- JD 16.000, CV 20.000, ghi chú 3.000 ký tự; payload tối đa 4 MB được đếm từ luồng request, không chỉ tin Content-Length.
- Đầu ra tối đa 6.500 token; chat 1.500, so sánh 1.700. SDK không tự retry, timeout 45 giây.
- Netlify rate limiting có thể trễ tới 10 giây. Không phải quota tuyệt đối/người dùng hay trần chi phí toàn site; nhiều IP vẫn có thể dùng hết credits. Không bật auto-recharge như một phần bản cập nhật này.

## Dữ liệu
Hồ sơ mặc định ở bộ nhớ tab. Lưu localStorage chỉ khi người dùng chọn. OpenAI request có store:false. Không ghi CV/JD vào log. Origin check giảm yêu cầu từ website khác nhưng không thay thế xác thực người dùng.

## Cập nhật
Push main → Netlify tự build npm run build → public và Functions. Không thay repository. .netlify/ và .env được gitignore.

## Kiểm thử
npm test: SDK mock + validation + HTML/JS. npm run build: metadata chia sẻ. Luôn kiểm thử production bằng CV/JD giả lập trước khi xác nhận AI thật; không dùng dữ liệu cá nhân để kiểm tra hệ thống.


## Kết quả theo trang và AI biên tập
- Dùng Trang trước/Trang tiếp: tổng quan, bằng chứng, CV Harvard, lộ trình, việc làm, báo cáo đầy đủ.
- Trong CV Harvard: yêu cầu AI nhận xét và đề xuất; đọc bản đề xuất, bấm Áp dụng. Hoàn tác khôi phục bản trước; Word luôn xuất nội dung trong ô CV đang sửa.
- Việc làm: chọn địa điểm, bấm Tìm việc từ CV hoặc bật tìm sau phân tích. Hai bước: AI chọn nghề từ CV, rồi truy vấn web LinkedIn công khai bằng từ khóa nghề/địa điểm. Chỉ hiện URL có trong nguồn trả về; không bịa để đủ 10. Thứ tự là độ liên quan với nhóm nghề, chưa phải đối chiếu toàn bộ CV với mọi JD.
- Không kết nối OAuth LinkedIn, không dùng cookie/tài khoản của chủ website cho khách. Đăng nhập LinkedIn trong Cloud Browser không cấp API việc làm cho website.
- Nếu Gateway không hỗ trợ web_search, hiển thị lỗi rõ ràng; cần nguồn tìm kiếm được cấp quyền để mở chức năng này.
- /api/revise: 2 lượt/phút/IP; /api/jobs: 4 lượt/phút/IP (2 lượt cho một quy trình). Không lưu CV/JD server-side, không lưu đầu ra provider qua store:false. Giới hạn IP không phải hạn mức chi phí toàn tài khoản; theo dõi credits trong Netlify.
