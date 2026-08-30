# Handoff: Landing page Bảo Châu

## Tóm tắt
Landing page một trang, cuộn liên tục, cho trung tâm tư vấn tuyển sinh và đào tạo lái xe Bảo Châu (Hà Nội).
Mục tiêu duy nhất: khách để lại họ tên + số điện thoại + hạng muốn học.

## Về các file trong `reference/`
`reference/` là **bản thiết kế tham chiếu viết bằng HTML** — nó thể hiện đúng hình ảnh và hành vi mong muốn,
**không phải code production để copy nguyên**. Nhiệm vụ khi triển khai là **dựng lại đúng thiết kế này**
thành một trang tĩnh HTML/CSS/JS bình thường (xem `PROMPT-CLAUDE-CODE.md` cho cấu trúc đề xuất).

Mở `reference/Landing Page Bao Chau.dc.html` bằng trình duyệt là xem được bản chạy thật (kể cả hiệu ứng),
dùng nó làm chuẩn so sánh pixel khi dựng lại.

## Độ hoàn thiện
**Hi-fi.** Màu, cỡ chữ, khoảng cách, hiệu ứng đều là bản chốt. Dựng lại càng sát càng tốt.

---

## Design tokens

| Token | Giá trị | Dùng ở đâu |
|---|---|---|
| `--color-navy` | `#072644` | chữ tiêu đề, nút chính, nền khối 6.5 / khối 8 |
| `--color-body` | `#3E5A75` | chữ nội dung |
| `--color-white` | `#FFFFFF` | nền trang, nền thẻ |
| `--color-hairline` | `#D6E4F0` | đường kẻ, viền thẻ |
| `--color-accent-badge` | `#B8860B` | nhãn "Ưu đãi tháng này", nhãn chặng, chấm nhấp nháy |
| `--bg-gradient-start` → `--bg-gradient-end` | `#F0F8FD` → `#D6EBFA` | nền các khối xanh nhạt, `linear-gradient(135deg, …)` |
| `--heading-gradient-start` → `--heading-gradient-end` | `#1E6FB5` → `#072644` | gradient chữ tiêu đề H1/H2, `linear-gradient(135deg, …)` + `background-clip:text` |
| `--radius-button` | `10px` | nút, ô input |
| `--radius-card` | `14px` | thẻ, ảnh lớn |
| `--transition-base` | `200ms cubic-bezier(0.22,1,0.36,1)` | mọi hover |
| `--transition-image-zoom` | `400ms cubic-bezier(0.22,1,0.36,1)` | zoom ảnh khi hover |
| `--shell` | `1180px` | chiều rộng nội dung tối đa |

Màu phụ dùng trực tiếp: `#2F506F` (chữ đậm trên nền xanh), `#4A6480` (chữ phụ), `#7A8EA3` (chữ mờ),
`#9CC3E4` / `#C9E1F4` (chữ trên nền navy), `#C9E1F4` (viền thẻ trên nền xanh), `#E8F0F7` (nền viên nhắc ưu đãi),
`#041B31` (nền footer), `#F5FAFD` (hover hàng FAQ), `#A3341F` trên `#FDF0EC` (báo lỗi form).

**Chữ:** Be Vietnam Pro (Google Fonts), weight 400/500/600/700.
**Quan trọng:** `line-height` của H1/H2 tối thiểu `1.3` + `padding-top:0.08em` — chặt hơn sẽ **cắt mất dấu tiếng Việt** (Ở, Ầ, Ố) khi dùng gradient chữ.

**Ngưỡng mobile:** `max-width: 760px` (JS dùng `matchMedia`). Không có breakpoint nào khác — phần còn lại chạy bằng `clamp()` và `repeat(auto-fit, minmax(...))`.

---

## Các khối theo thứ tự trang

1. **Header** — sticky top. Logo (`img/logo-bao-chau.png`) + "Bảo Châu / ĐÀO TẠO LÁI XE" + 3 anchor (Học phí, Lộ trình, Câu hỏi) + hotline + nút "Nhận tư vấn".
   Mobile: ẩn 3 anchor và hotline chữ, còn logo + nút. Các section có anchor cần `scroll-margin-top:88px`.
   ⚠ Thẻ bọc ngoài toàn trang phải dùng `overflow-x: clip`, **không** dùng `overflow-x: hidden` (sẽ làm sticky mất tác dụng).
2. **Khối 1 — Hero** — nền gradient xanh + lớp parallax. Trái: H1 2 dòng gradient, đoạn giới thiệu, 2 ô nhỏ (ưu đãi 1.000.000đ / số suất còn lại). Phải: ngăn xếp 3 ảnh + form đăng ký.
   Desktop grid `1.02fr 0.98fr`, areas `"hero-text hero-media" "hero-text hero-form"`.
   Mobile 1 cột, thứ tự `hero-media → hero-text → hero-form`.
3. **Khối 1.5 — Dải số liệu** — 5 ô: 10.000+ học viên · 10+ năm · 10+ sân tập · "1 – 1 – 1" · "Hợp đồng" (mô tả: đào tạo bằng văn bản, ký trước khi vào lớp). Desktop 5 cột (`minmax(188px,1fr)`), mobile 2 cột.
   ⚠ **Cả 5 dòng số dùng cùng một cỡ chữ** `clamp(30px,3.6vw,40px)` đặt trong khung cao `clamp(34px,4.1vw,46px)` với `align-items:flex-end` — để chân chữ và dòng mô tả bên dưới thẳng một đường ngang. Không cho ô nào cỡ chữ riêng.
4. **Khối 2 — Vấn đề ngành** — nền gradient xanh, cột chữ hẹp 860px, H2 gradient.
5. **Khối 3 — Chính sách 3 Không** — 3A: 3 thẻ (ảnh 16:10 + tiêu đề + mô tả), reveal so le. 3B: ảnh hợp đồng + H3 + nút. 3C: 2 thẻ "Đã bao gồm" (nền gradient xanh, mỗi dòng có dấu tích ✓) / "Chưa bao gồm" (nền trắng).
6. **Khối 5 — Học phí** — 3 tab (B số tự động / B số sàn / C1) với thanh trượt chỉ báo `translateX(activeTab*100%)`. Tab A và B: 3 thẻ gói (Tiết kiệm trắng / Tiêu chuẩn nền navy + nhãn "Phổ biến nhất" / Cao cấp trắng). Tab C1: **1 thẻ duy nhất** nền navy, nhãn "Gói duy nhất". Mỗi tab kết thúc bằng 1 ảnh xe 21:9.
   Mobile: các thẻ chuyển sang **cuộn ngang** `grid-auto-flow:column; grid-auto-columns:86%; scroll-snap-type:x mandatory`, mỗi thẻ `scroll-snap-align:center`.

   **Cấu trúc một thẻ gói** — 2 tầng:
   - *Luôn hiện*: tên gói + badge · giá 33px · 2 dòng nhãn–giá trị có gạch mảnh phía trên ("Giờ học thực hành" → *20 giờ*; "Đóng trước vào lớp" → *5.000.000đ*; nhãn 13px `#7A8EA3`, giá trị 15px bold, `tabular-nums`) · nút mở chi tiết.
   - *Nút mở chi tiết*: **kiểu tối giản** — chỉ chữ "Chi tiết gói" 13.5px + mũi tên ▼ 9px, không viền không nền, `background:none;border:0`, hover `opacity:0.65`, vùng bấm `min-height:44px`. Mũi tên `rotate(180deg)` khi mở.
   - *Panel chi tiết*: `max-height` 0 ↔ 1400px + `opacity`, 340ms. Mỗi mục một dòng `border-top` 11px padding: hồ sơ khai giảng · phí khám sức khoẻ · lý thuyết + thi hết môn + quản lý · cabin · học vỡ/sa hình/tổng ôn · phí thuê sân · chạy DAT (km + giờ, dòng loại đường tô đỏ) · 5 quyền lợi riêng của Cao cấp · lệ phí thi. Mục gói đó không có thì hiện **dấu "–" căn giữa màu mờ** để giữ hàng so sánh. Thẻ C1 **không có** dòng "–" nào (không có gói khác để so).
   - **Mỗi gói mở/đóng độc lập** — mở gói này không đóng gói kia (state `openPkg` dạng object theo key `pkgA1…pkgC1`).

   ⚠ **Cân hàng ngang giữa các thẻ**: mọi dòng cần so sánh có `data-pkg-row="<key>"`, container có `data-pkg-grid`. Một hàm JS gom các dòng cùng key trong cùng grid, lấy chiều cao lớn nhất rồi set `minHeight` cho tất cả — nên các dòng của 3 thẻ luôn thẳng một đường. Chạy lại khi: mount, đổi tab, `resize`, và `document.fonts.ready`. Dòng tiêu đề thẻ cũng tham gia (key `h0`, `min-height:24px`) vì badge làm lệch ~5px.

   **Dải ưu đãi cuối khối** — thẻ trắng `border:1px solid #C9E1F4` + `box-shadow:0 10px 30px rgba(7,38,68,0.07)`, **rộng bằng ảnh phía trên** (không `justify-self:start`), `display:flex; justify-content:space-between; flex-wrap:wrap`. Trái: chấm đỏ `#B42318` nhấp nháy + "Giảm 1.000.000đ học phí" (navy, `clamp(18px,2vw,22px)`, bold) + dòng phụ "Còn N/20 suất · áp dụng cho suất đăng ký sớm trong tháng" (số suất màu `#B42318`). Phải: nút navy bo 12px "Giữ suất cho tôi →" (`flex:1 1 auto` nên mobile tự giãn full chiều ngang, desktop nằm sát lề phải).
7. **Khối 6 — Lộ trình** — 4 thẻ chặng, mỗi thẻ 2 cột: danh sách bước (số tròn 32px + chữ 17px) và ảnh. Desktop ảnh 4:3 `position:sticky; top:96px`; mobile ảnh 16:9 `position:relative; top:auto` (⚠ giữ `top:96px` khi relative sẽ đè lên chữ). Tổng 11 bước: chặng 1 có 2 bước, chặng 2 có 3, chặng 3 có 3, chặng 4 có 3.
8. **Khối 6.5 — Banner ưu đãi** — nền navy, trái: nhãn + "Giảm 1.000.000đ học phí" + ghi chú sinh viên; phải: thẻ trắng "Số suất còn lại" + nút.
9. **Khối 7 — FAQ** — **10 câu**, accordion, chỉ mở 1 câu tại một thời điểm. Thứ tự xếp theo mạch quan tâm của người mới tìm hiểu, **không xếp ngẫu nhiên**:
   1. Chưa từng cầm vô-lăng, học được không? · 2. Mất bao lâu thì có bằng? · 3. Đi làm giờ hành chính, học vào lúc nào? *(3 câu đầu: tôi có học được không)*
   4. Học phí đã gồm những gì, có phát sinh không? · 5. Có trả góp không? · 6. Có chương trình hỗ trợ học phí không? *(nhóm tiền)*
   7. Phần lý thuyết học online hay offline? · 8. Tôi tự đi khám sức khoẻ ở ngoài được không? · 9. Thi không đỗ thì sao? *(chi tiết vận hành)*
   10. Vì sao cần tư vấn trước khi vào khoá? *(đẩy sang CTA)*
10. **Khối 8 — CTA cuối** — nền ảnh `img/khoi8-nen-hoc-vien-va-xe.jpg` + lớp phủ `rgba(7,38,68,0.62)` + parallax. Trái: H2, đoạn chữ, nút gọi + nút Zalo. Phải: form đăng ký (cùng component với Hero).
11. **Footer** — nền `#041B31`, 3 cột `repeat(auto-fit,minmax(250px,1fr))`, gap `clamp(28px,4vw,56px)`.
   Cột 1: **chỉ biểu tượng logo** `img/logo-bao-chau-mark-trang.png` cao 46px (không dùng logo kèm chữ — tên đã có ngay dưới) + "Văn phòng Tư vấn Tuyển sinh và Đào tạo lái xe Bảo Châu" (trắng 15.5px) + địa chỉ (`#8FB4D6`).
   Cột 2 & 3 dùng **cặp nhãn–nội dung**: nhãn 11.5px in hoa `letter-spacing:0.1em` màu `#5F87AA` (HOTLINE & ZALO / EMAIL / GIỜ LÀM VIỆC / THEO DÕI BẢO CHÂU), nội dung trắng bên dưới; số hotline 19px bold là điểm nhấn.
   Dải cuối tách riêng: `border-top:1px solid rgba(156,195,228,0.16)` + "© 2026 Bảo Châu" + link "Chính sách bảo mật".
12. **Thanh CTA cố định (chỉ mobile)** — 2 nút "Gọi ngay" / "Để lại số", hiện khi đã cuộn qua 75% Hero và ẩn khi Khối 8 vào khung hình; `transform: translateY(120%)` khi ẩn.

---

## Hành vi & hiệu ứng

- **Reveal khi cuộn**: phần tử `[data-reveal]` bắt đầu `opacity:0; translateY(24px)` (biến thể `data-reveal-scale` dùng `scale(0.97)`), chạy `600ms cubic-bezier(0.22,1,0.36,1)` khi vào khung hình (`IntersectionObserver`, `rootMargin: 0px 0px -15% 0px`). `data-reveal-delay` (ms) tạo hiệu ứng so le. **Hai điều bắt buộc**: (a) phần tử đã nằm trong khung hình lúc tải thì không ẩn (tránh nhấp nháy); (b) khi cuộn nhanh vượt qua, phải quét lại và hiện những phần tử đã ra khỏi khung hình phía trên.
- **Đếm số**: 2 số ở Khối 1.5 (10.000+, 10+), 1500ms, easing `1-(1-p)³`, chạy đúng một lần, format `toLocaleString('vi-VN')`.
- **Parallax**: lớp nền Hero (hệ số 0.14) và Khối 8 (0.18), dịch theo `requestAnimationFrame`, chỉ tính khi khối trong tầm nhìn ±200px.
- **Ngăn xếp 3 ảnh Hero**: 3 ảnh xếp lớp, ảnh trước 100% và rõ, 2 ảnh sau lùi + thu nhỏ + mờ dần. Đổi ảnh bằng: vuốt ngang (>40px, bỏ qua nếu là vuốt dọc >30px), bấm nhanh vào ảnh, 2 mũi tên `‹ ›` mờ (chỉ hiện khi hover, chỉ trên thiết bị có chuột), 3 chấm chỉ báo ở giữa mép dưới (chấm đang chọn dài 20px). **Chỉ ảnh đang ở trước** phóng `scale(1.05)` khi hover.
- **Tab học phí**: 3 tab, chỉ báo trượt 250ms.
- **FAQ**: `max-height` 0 ↔ 460px + `opacity`, 320ms; icon `+` ↔ `−` kèm `rotate(180deg)`.
- **Chi tiết gói học phí**: xem Khối 5 ở trên — mở/đóng độc lập từng gói + cân hàng ngang bằng JS.
- **Số suất còn lại**: một nguồn duy nhất, hiển thị ở 4 chỗ (Hero, Khối 5, Khối 6.5, Khối 8). Mặc định 7/20. Có thể lấy từ API (`apiUrl`), poll mỗi 60s; API lỗi thì hiện "Liên hệ để kiểm tra". Khi số đổi, 4 chỗ cùng mờ đi rồi hiện lại (crossfade 200ms).
- **Hover chung**: nút `filter:brightness(1.14) + scale(1.02)` và bóng đậm hơn, active `scale(0.97)`; link có gạch chân chạy từ 0% → 100%; thẻ ảnh `scale(1.05)`; 2 ô nhỏ ở Hero nhấc lên 3px + viền `#1E6FB5`.
- **`prefers-reduced-motion: reduce`**: tắt animation, transition về 1ms.

## Form đăng ký (dùng chung 2 chỗ)
3 trường: Họ và tên (text), Số điện thoại (tel, `inputMode="numeric"`), Hạng muốn học (select: B số tự động / B số sàn / C1 / Chưa biết, cần tư vấn). Không có nhãn ngoài, chỉ placeholder. Nút submit `Đăng ký`, cao 15px padding, full width.
Kiểm tra: họ tên ≥ 2 ký tự → "Bạn nhập giúp họ tên nhé."; số điện thoại đúng `^0\d{9}$` sau khi bỏ ký tự không phải số → "Số điện thoại cần 10 số, bắt đầu bằng 0."
Trong lúc gửi: nút đổi chữ thành "Đang gửi…" và `disabled`.
Gửi thành công: thay form bằng thẻ xanh nhạt "Đã nhận thông tin của bạn / Tư vấn viên Bảo Châu sẽ gọi lại trong ít phút."

**Backend đã có sẵn** (bản thiết kế đã nối, chỉ thiếu URL):
- Form POST tới một Google Apps Script Web App. Body là JSON nhưng `Content-Type: text/plain;charset=utf-8` — **bắt buộc**, để tránh CORS preflight mà Apps Script không xử lý được.
- Payload: `{hoTen, soDienThoai, hangBang, viTri, trang, nguon, thoiGian}`. `viTri` = "Hero" hoặc "Cuối trang" (biết form nào ra lead tốt hơn); `nguon` = `document.referrer`.
- Lỗi mạng: tự thử lại 1 lần, vẫn lỗi thì lưu payload vào `localStorage` key `bc_lead_loi_<timestamp>` rồi vẫn hiện màn hình thành công.
- URL để trong hằng số `LEAD_API_URL` ở đầu logic class (hiện là chuỗi rỗng → chỉ đổi trạng thái tại chỗ).
- Code Apps Script hoàn chỉnh: `apps-script-lead.gs` (ghi Google Sheet + gửi thông báo Telegram). Hướng dẫn dựng: `HUONG-DAN-KET-NOI-FORM.md`.

## Trang phụ: Chính sách bảo mật
`reference/Chinh Sach Bao Mat.dc.html` → dựng thành `chinh-sach-bao-mat.html`. **Bắt buộc phải có** để được duyệt quảng cáo Facebook/Google.
Cột nội dung 820px, header sticky gọn (logo + "← Về trang chủ"), hero gradient + H1 navy (không gradient chữ) + ngày cập nhật, 8 mục có số, thẻ CTA gọi hotline ở cuối, footer gọn 1 hàng. Link tới trang này nằm ở dải copyright của footer trang chủ.

## Assets
`img/` — 15 ảnh JPG (đã resize và nén, ~40–90KB mỗi ảnh) + 3 logo PNG (`logo-bao-chau.png` bản đủ, `logo-bao-chau-trang.png` bản trắng đủ, `logo-bao-chau-mark-trang.png` **chỉ biểu tượng, dùng ở footer**). Tên file nói rõ vị trí dùng (`hero-*`, `khoi3-*`, `khoi5-*`, `khoi6-*`, `khoi8-*`).
⚠ `khoi5-xe-vios-so-san.jpg` là ảnh **cần số sàn** (tab B số sàn), `khoi5-xe-kia-k250.jpg` là ảnh **xe tải sát hạch** (tab C1) — đừng đổi chỗ.

## Ranh giới nội dung — không được đổi
- Không cam kết "đỗ 100%", không hứa "bao đỗ", không nói giúp gian lận thi.
- Lệ phí thi sát hạch **645.000đ** luôn phải ghi rõ là nộp cho đơn vị tổ chức thi, Bảo Châu không thu.
- Giá, số giờ, số km DAT trong Khối 5 là số thật — không sửa khi chưa hỏi chủ trung tâm. Số đã chốt:
  · **B số tự động** (DAT 710km): Tiết kiệm 16.000.000đ / DAT 14h / 20 giờ · Tiêu chuẩn 17.500.000đ / DAT 14h / 22 giờ · Cao cấp 26.000.000đ / DAT 20h / 32 giờ
  · **B số sàn** (DAT 810km): Tiết kiệm 16.500.000đ / DAT 20h / 26 giờ · Tiêu chuẩn 18.100.000đ / DAT 20h / 28 giờ · Cao cấp 27.000.000đ / DAT 24h / 36 giờ
  · **C1** (DAT 825km): Tiêu chuẩn 21.400.000đ / DAT 24h / 32 giờ · đóng trước 7.000.000đ · xe học Kia K250
  · Đóng trước vào lớp: Tiết kiệm & Tiêu chuẩn 5.000.000đ, Cao cấp 15.000.000đ
- Chính sách học bổng chỉ viết chung ("một số suất cho sinh viên và hoàn cảnh khó khăn"), **không nêu số suất hay mức giảm cụ thể**.
- Không dùng đếm ngược giả, không giá gạch ngang.
