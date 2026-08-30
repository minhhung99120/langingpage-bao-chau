# Prompt dán vào Claude Code

Mở terminal trong thư mục dự án rỗng, chạy `claude`, rồi dán **nguyên khối** phần dưới đây.

---

Tôi có một bản thiết kế landing page hoàn chỉnh cần dựng lại thành trang tĩnh để deploy lên Hostinger.

Đọc trước 3 thứ này:
1. `README.md` — spec đầy đủ: design tokens, từng khối, mọi hiệu ứng, ranh giới nội dung.
2. `reference/Landing Page Bao Chau.dc.html` — bản thiết kế chạy được. Mở bằng trình duyệt để xem đúng hình ảnh và hành vi. Đây là **tham chiếu**, không phải code để copy: nó chạy trên một runtime riêng, `{{ }}` là chỗ chèn giá trị, `sc-if`/`dc-import` là thẻ của runtime đó.
3. `reference/FormDangKy.dc.html` — form đăng ký (đã có sẵn code gửi lead sang Google Apps Script).
4. `reference/Chinh Sach Bao Mat.dc.html` — trang chính sách bảo mật (trang phụ, phải dựng luôn).

Hãy dựng lại thành trang tĩnh thuần HTML + CSS + JS, **không dùng framework, không bước build** (Hostinger sẽ serve trực tiếp file). Cấu trúc tôi muốn:

```
index.html                — toàn bộ markup, chia bằng comment <!-- KHỐI n: ... -->
chinh-sach-bao-mat.html   — trang chính sách bảo mật (dùng lại css/js chung)
css/styles.css      — biến màu ở :root, class có nghĩa (.hero, .goi-hoc-phi, ...)
js/noi-dung.js            — DỮ LIỆU: bảng giá 3 hạng (kèm toàn bộ nội dung chi tiết từng gói), 10 câu FAQ, 11 bước lộ trình, số suất còn lại, hotline, địa chỉ, URL nhận đăng ký
js/app.js                 — hiệu ứng: reveal, đếm số, parallax, tab học phí, accordion chi tiết gói + cân hàng ngang, FAQ, ngăn xếp ảnh Hero, thanh CTA mobile, form
img/                      — giữ nguyên, đã tối ưu
```

Yêu cầu bắt buộc:

- **Tách nội dung khỏi code.** Mọi con số và câu chữ hay thay đổi (giá gói, số suất, hotline, FAQ) đặt trong `js/noi-dung.js` dưới dạng object có comment tiếng Việt, để sau này sửa giá chỉ cần mở đúng 1 file. Các khối lặp (thẻ gói, câu FAQ, bước lộ trình) render từ dữ liệu đó, đừng viết tay 8 lần.
- **Form dùng chung.** Hero và Khối 8 dùng cùng một hàm khởi tạo, không copy markup 2 lần.
- **Bảng giá là phần khó nhất.** Mỗi thẻ gói có accordion "Chi tiết gói" mở/đóng **độc lập**, và các dòng cần so sánh giữa 3 thẻ phải **thẳng một hàng ngang** — đọc kỹ mục "Khối 5" trong README: dùng `data-pkg-grid` / `data-pkg-row` + hàm cân chiều cao chạy lại khi mount / đổi tab / resize / font tải xong. Render toàn bộ 7 thẻ gói từ dữ liệu trong `noi-dung.js`, đừng viết tay.
- **Giữ đúng mọi hiệu ứng trong README** — đặc biệt: reveal có quét lại khi cuộn nhanh; chỉ ảnh đang ở trước mới zoom khi hover; ảnh Khối 6 sticky trên desktop nhưng `top:auto` trên mobile; thẻ bọc trang dùng `overflow-x: clip`.
- **Mobile là ưu tiên số 1** (khách chủ yếu xem điện thoại). Ngưỡng `max-width:760px`. Kiểm tra: Hero thứ tự ảnh → chữ → form; bảng giá cuộn ngang có snap; header 1 hàng; thanh CTA cố định dưới; mọi nút và ô input ≥ 48px; không có thanh cuộn ngang toàn trang.
- **Chữ tiêu đề**: `line-height` ≥ 1.3 và `padding-top: 0.08em`, nếu không dấu tiếng Việt bị cắt.
- **Trang chính sách bảo mật**: dựng `chinh-sach-bao-mat.html` theo `reference/Chinh Sach Bao Mat.dc.html`, dùng lại `css/styles.css`, link từ dải copyright ở footer. Bắt buộc phải có để duyệt quảng cáo Facebook/Google.
- **SEO + chia sẻ**: thẻ `<title>`, `<meta name="description">`, Open Graph (`og:title`, `og:description`, `og:image` dùng `img/hero-giao-vien-hoc-vien.jpg`), `lang="vi"`, favicon từ `img/logo-bao-chau.png`, và JSON-LD `LocalBusiness` (tên: Trung tâm tư vấn tuyển sinh và đào tạo lái xe Bảo Châu, địa chỉ và hotline lấy trong README).
- **Tốc độ**: ảnh dưới màn hình đầu dùng `loading="lazy"`, ảnh Hero `fetchpriority="high"`; font Be Vietnam Pro nạp với `display=swap`; không thêm thư viện ngoài nào.

**Nối form:** giữ đúng cơ chế đã có trong `reference/FormDangKy.dc.html` — POST JSON với `Content-Type: text/plain;charset=utf-8` (bắt buộc, tránh CORS preflight), payload `{hoTen, soDienThoai, hangBang, viTri, trang, nguon, thoiGian}`, thử lại 1 lần khi lỗi, nút đổi thành "Đang gửi…". URL đặt ở hằng số `URL_NHAN_DANG_KY` đầu `js/noi-dung.js` (tạm chuỗi rỗng → chỉ đổi trạng thái tại chỗ). Backend đã viết sẵn ở `apps-script-lead.gs` (ghi Google Sheet + thông báo Telegram), hướng dẫn dựng ở `HUONG-DAN-KET-NOI-FORM.md` — **không cần viết lại**, chỉ cần trang gọi đúng.

Cuối cùng viết `README.md` mới ở gốc dự án, tiếng Việt, ghi rõ: sửa giá ở đâu, thêm câu FAQ ở đâu, thay ảnh ở đâu, đổi số suất còn lại ở đâu, và cách xem thử trên máy.

Xong thì chạy thử bằng `npx serve` và tự kiểm tra ở 3 cỡ màn hình 390px / 768px / 1440px, sửa hết lỗi tràn ngang trước khi báo tôi.
