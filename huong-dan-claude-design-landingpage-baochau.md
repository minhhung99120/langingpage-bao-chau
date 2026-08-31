# Hướng dẫn dùng Claude Design để dựng Landing Page Bảo Châu

*Dựa trên bản vẽ `banvev2updated.md` (29/8/2026, v2 cập nhật vòng 3) — mọi nội dung chữ, số liệu, thứ tự khối trong tài liệu này lấy đúng từ bản vẽ đó, không thêm bớt. Tài liệu này chỉ bổ sung phần kỹ thuật/tương tác/hiệu ứng và cách trình bày prompt cho Claude Design.*

**Cách dùng:** copy toàn bộ nội dung dưới đây, dán làm mô tả yêu cầu khi mở phiên Claude Design mới (kèm 4 ảnh tham khảo nếu bạn còn giữ). Yêu cầu Claude Design dựng thành **1 trang cuộn liên tục** (không tách nhiều artboard rời) — vì đây là landing page 1 trang, đúng tinh thần bản vẽ gốc.

---

## 1. Mục tiêu và ràng buộc tổng thể

**Khuyến nghị:** dựng landing page như 1 sản phẩm kỹ thuật gọn — ít file, biến số tập trung, mọi nội dung dễ tìm — để bước sau (đưa sang Claude Code lên online) không phải viết lại từ đầu.

Ba yêu cầu bắt buộc, áp dụng cho toàn trang:

| Yêu cầu | Áp dụng |
|---|---|
| Mọi nút bấm/link có hiệu ứng hover | Xem checklist đầy đủ ở mục 4 — không sót phần tử nào |
| Ảnh có zoom nhẹ khi hover, mượt khi rời chuột | Áp dụng cho ảnh dạng thẻ/card. **Ngoại lệ có chủ đích:** không áp cho ảnh nền full-bleed (Khối 8) — xem lý do ở mục 4 |
| Cảm giác "trang đắt tiền" khi cuộn | Hiệu ứng cuộn tinh tế nhưng rõ tay nghề — chi tiết ở mục 3 |

**Một điểm cần bạn lưu ý trước khi dựng:** bản vẽ gốc quy định rất rõ *"Bỏ hoàn toàn: kính mờ (glassmorphism), blob gradient trôi nổi, chữ ánh kim chạy động"* — vì đối tượng khách là người đi học lái xe đủ lứa tuổi, cần cảm giác **nghiêm túc, đáng tin**, không phải trang trình diễn hiệu ứng. Yêu cầu "hiệu ứng xịn khi cuộn" của bạn không mâu thuẫn với quy tắc đó nếu hiểu đúng: "xịn" ở đây nên đến từ **sự nhất quán và tinh chỉnh** (cùng 1 easing curve xuyên suốt, timing vừa đủ, không giật) chứ không phải thêm nhiều loại hiệu ứng khác nhau. Mục 3 dưới đây đã mở rộng hiệu ứng theo hướng bạn chọn (cho phép nổi bật hơn: parallax nhẹ, sticky reveal) nhưng vẫn giữ nguyên 3 điều cấm — nhắc lại rõ trong prompt để Claude Design không tự ý thêm kính mờ/blob khi "sáng tạo thêm cho đẹp".

---

## 2. Hệ thống thiết kế (khai báo 1 lần, dùng lại toàn trang)

Yêu cầu Claude Design khai báo các giá trị này thành **biến dùng chung** (CSS custom properties `:root`) ngay từ đầu, không hard-code mã màu/kích thước rải rác trong từng khối — đây là điều kiện tiên quyết để sau này chỉnh 1 chỗ là đổi cả trang, và để Claude Code đọc code không bị rối.

**Màu sắc (đã chốt — phương án A-ii):**

| Biến | Mã màu | Dùng ở đâu |
|---|---|---|
| `--bg-gradient-start` | `#F0F8FD` | Nền Hero, khối nền màu, dải trang trí Khối 1.5 |
| `--bg-gradient-end` | `#D6EBFA` | (chéo 135° với màu trên) |
| `--heading-gradient-start` | `#1E6FB5` | Chữ tiêu đề chính mỗi khối (background-clip: text, tĩnh, không animate) |
| `--heading-gradient-end` | `#072644` | |
| `--color-navy` | `#072644` | Nút CTA, icon, viền nhấn, chữ thân trên nền sáng, nền Khối 6.5/8 |
| `--color-white` | `#FFFFFF` | Thẻ ảnh, bảng giá, FAQ, thẻ "Không" |
| `--color-accent-badge` | `#B8860B` | Badge ưu đãi trên nền navy (Khối 6.5, Khối 8 nếu có) — không dùng cho badge trên nền sáng |

**Bo góc, khoảng cách, chữ:**

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `--radius-button` | 8–10px | Nút chữ nhật bo góc nhẹ, màu đặc — không gradient, không blur |
| `--radius-card` | 12–16px | Thẻ ảnh, thẻ "Không", thẻ chặng |
| `--transition-base` | 200ms `cubic-bezier(0.22, 1, 0.36, 1)` | Dùng cho MỌI hover (nút, thẻ, tab) — 1 easing curve duy nhất xuyên suốt trang, đây là thứ tạo cảm giác "đắt tiền" nhất, quan trọng hơn việc thêm hiệu ứng lạ |
| `--transition-image-zoom` | 400ms cùng easing trên | Riêng cho zoom ảnh — chậm hơn nút một chút vì ảnh diện tích lớn, nhanh quá sẽ giật |

Font: giữ đúng quy tắc bản vẽ — tiêu đề mỗi khối ≤ 12 từ, thân 2–3 câu (Khối 2 và dòng phụ Hero là ngoại lệ đã chốt nguyên văn). Không cần chọn font mới trong tài liệu này — để Claude Design đề xuất 1 font sans-serif rõ ràng, dễ đọc trên mobile (kênh chính là Facebook Ads), không dùng font trang trí/serif màu mè.

---

## 3. Hiệu ứng cuộn — theo khối (đã mở rộng theo lựa chọn của bạn: cho phép nổi bật hơn, vẫn giữ 3 điều cấm)

| Khối | Hiệu ứng khi cuộn tới | Vì sao chọn hiệu ứng này |
|---|---|---|
| Mọi khối văn bản (tiêu đề + thân) | Fade-in + trượt lên nhẹ (translateY 24px → 0), 600ms, chạy 1 lần khi khối vào ~15–20% khung hình (Intersection Observer) | Chuẩn, không giật, không lặp lại gây rối mắt khi cuộn qua lại |
| Khối 1.5 (dải số liệu) | **Đếm số (count-up)** cho 2 mục có số thật (10.000+ và 10+), ~1.5s, chạy đúng 1 lần — đúng như bản vẽ đã chốt. 3 mục còn lại chỉ fade/slide, không đếm | Giữ nguyên yêu cầu gốc — đây là hiệu ứng số liệu, không phải trang trí |
| Nền Hero, nền Khối 8 (ảnh full-bleed) | Parallax nhẹ — ảnh dịch chuyển chậm hơn nội dung (~0.15–0.2 lần tốc độ cuộn), biên độ giới hạn để không lộ mép ảnh | Đây là hiệu ứng "cao cấp" rõ nét nhất mà không cần thêm màu/hình gì mới — dùng cho đúng 2 khối có ảnh nền lớn, không lạm dụng |
| Khối 3 — Phần A (3 ô KHÔNG) | Stagger reveal — 3 ô fade+trượt lên lần lượt, cách nhau 100–150ms | Tạo nhịp thị giác khi 3 luận điểm bán hàng chính xuất hiện, đúng lúc khách đọc kỹ nhất |
| Khối 6 (4 thẻ chặng) | Trên desktop: ảnh minh hoạ mỗi thẻ dùng `position: sticky` nhẹ khi danh sách bước cuộn qua (hiệu ứng "scrollytelling" tinh tế). **Trên mobile: bỏ sticky, chỉ fade/slide thường** | Sticky trên mobile dễ giật lag trên máy yếu — kênh chính là Facebook Ads mobile, ưu tiên mượt hơn hiệu ứng |
| Khối 6.5 (banner ưu đãi) | Scale-in nhẹ (0.97 → 1) kết hợp fade | Banner quan trọng (nhắc ưu đãi lần 3/4), cần nổi bật vừa đủ mà không giật |
| Số suất còn lại (X/20, cả 3 chỗ) | Nếu số thay đổi khi trang đang mở (poll API): crossfade số cũ → số mới, không nhảy số đột ngột | Không bắt buộc, chỉ nên có nếu Claude Design làm nổi luôn cơ chế polling |

**Vẫn cấm tuyệt đối** (nhắc lại rõ trong prompt gửi Claude Design, vì đã nới hiệu ứng nên càng dễ bị lạm dụng): kính mờ/backdrop-blur trên card hoặc nút, blob gradient trôi nổi/animate nền, chữ gradient chạy ánh kim, hiệu ứng "confetti"/particle/vui nhộn. Gradient chữ tiêu đề luôn tĩnh.

---

## 4. Checklist bắt buộc — mọi nút bấm phải có hover, không sót phần tử nào

| # | Phần tử | Vị trí | Hiệu ứng hover đề xuất |
|---|---|---|---|
| 1 | Nút "Nhận tư vấn" | Header | Nền navy sáng lên nhẹ (brightness 1.12) + scale 1.02 + shadow tăng nhẹ |
| 2 | 3 anchor link (Học phí/Lộ trình/Câu hỏi) | Header | Gạch chân trượt vào từ trái, hoặc đổi màu đậm hơn |
| 3 | Nút "Đăng ký" | Form Hero | Như #1 |
| 4 | Dropdown "Hạng muốn học" | Form Hero | Viền đổi màu navy khi focus, không cần zoom |
| 5 | Nút "Xem trước hợp đồng khi tư vấn" | Khối 3B | Như #1 |
| 6 | 3 tab (B số tự động/B số sàn/C1) | Khối 5 | Tab active có underline/nền chỉ báo trượt mượt giữa các tab khi đổi (transform 250ms) |
| 7 | Link "Giữ suất cho tôi" (trong câu) | Khối 5 | Gạch chân xuất hiện mượt, 150ms |
| 8 | Nút "Giữ suất cho tôi" (trắng trên navy) | Khối 6.5 | Nền trắng ngả nhẹ màu/thêm shadow, scale 1.02 |
| 9 | 8 accordion FAQ | Khối 7 | Nền hàng nhạt hơn nhẹ khi hover; icon +/− xoay 180° mượt khi mở/đóng |
| 10 | Nút submit form | Khối 8 | Như #1 |
| 11 | Nút hotline/Zalo | Khối 8 | Như #1, kích thước đủ lớn để bấm tay trên mobile |
| 12 | 2 nút "Gọi ngay"/"Để lại số" | Thanh CTA sticky mobile | Trên mobile không có hover thật — dùng hiệu ứng `:active` (scale 0.97) làm phản hồi khi chạm thay cho hover |

Với phần tử #12: vì đây là thanh cuộn theo mobile, nên yêu cầu thêm hiệu ứng **xuất hiện/ẩn mượt** — hiện ra sau khi cuộn qua khỏi Hero, ẩn đi khi gần tới Footer để không đè lên form CTA cuối.

---

## 5. Ảnh — quy tắc zoom hover

Áp dụng zoom nhẹ (scale 1.05, container `overflow: hidden`, transition theo `--transition-image-zoom`) cho đúng các ảnh dạng thẻ sau:

- Hero: ảnh chính (cảnh giáo viên + học viên)
- Khối 3A: 3 ảnh minh hoạ nhỏ trong 3 ô "KHÔNG"
- Khối 3B: ảnh hợp đồng thật
- Khối 5: ảnh xe theo từng tab (Vios, Kia K250)
- Khối 6: 4 ảnh/video minh hoạ 4 thẻ chặng

**Không áp zoom cho ảnh nền Khối 8** (ảnh nền phủ navy mờ, full-bleed toàn khối) — ảnh nền dạng này người dùng không "hover vào ảnh" như một thẻ riêng, zoom ở đây sẽ gây cảm giác rung nền khi rê chuột ngẫu nhiên qua khối, phản tác dụng với yêu cầu "trang đắt tiền". Khối 8 đã có parallax nhẹ khi cuộn (mục 3) — vậy là đủ chuyển động cho khối này.

---

## 6. Cấu trúc từng khối — nội dung dựng đúng nguyên văn bản vẽ

*Claude Design cần đọc đúng thứ tự và nội dung dưới đây — đây là bản tóm tắt để dựng, chi tiết đầy đủ (shot-list, ghi chú màu, lý do từng quyết định) nằm trong `banvev2updated.md`.*

**Header (sticky):** logo trái · hotline chữ + nút "Nhận tư vấn" phải · 2–3 anchor link.

**Khối 1 — Hero:** 2 cột desktop (trái chữ+form, phải ảnh lớn), 1 cột mobile. Tiêu đề 2 dòng ("Học lái ô tô Bảo Châu" / "Hơn cả một khoá học", dòng 2 dùng gradient tĩnh). Dòng phụ nguyên văn đã chốt. Badge ưu đãi 2 cột ("ƯU ĐÃI THÁNG NÀY / Giảm 1.000.000đ" | "Còn X/20 suất" — số X lấy real-time qua API, có fallback text nếu lỗi, xem mục 7). Form: nhãn "Nhận tư vấn miễn phí" → Họ tên/SĐT/Hạng học → nút "Đăng ký".

**Khối 1.5 — Dải số liệu:** nhãn nhỏ "Bảo Châu trong con số". Dải trang trí phía trên **dùng gradient xanh đã chốt** `--bg-gradient-start` → `--bg-gradient-end` (đã quyết, không dùng 3 tông hồng-xanh dương-xanh lá của ảnh gốc). 5 cột: 10.000+ học viên · 10+ năm · 10+ sân tập · "1 thầy–1 trò–1 xe" · "Hợp đồng đào tạo bằng văn bản". Count-up cho 2 mục số thật.

**Khối 2 — Vấn đề ngành:** nền gradient nhạt, tiêu đề + thân + câu kết in đậm — nguyên văn đã chốt, không có ảnh.

**Khối 3 — "Con số lúc ký là con số cuối cùng":** Phần A: 3 ô "KHÔNG" (nền trắng, viền mảnh navy nhạt, mỗi ô 1 ảnh nhỏ, stagger reveal). Phần B: 2 cột ảnh hợp đồng thật + chữ + nút "Xem trước hợp đồng khi tư vấn". Phần C: 2 cột "Đã bao gồm"/"Chưa bao gồm" — số liệu 645.000đ, 700.000đ+, 350.000đ/giờ dùng đúng như bản vẽ, không đổi.

**Khối 5 — Học phí 3 hạng:** tiêu đề "Học phí niêm yết công khai", dòng phụ, 3 tab, bảng giá đúng số trong bản vẽ, ảnh xe theo tab, dòng nhắc ưu đãi dạng pill có chấm nhấp nháy nhỏ + link "Giữ suất cho tôi".

**Khối 6 — Lộ trình 4 chặng/11 bước:** 4 thẻ dọc, mỗi thẻ có nhãn "Chặng X", tiêu đề chặng, danh sách bước đánh số tròn, 1 ảnh/video bên cạnh. Nội dung 11 bước lấy nguyên văn từ bản vẽ (mục Khối 6).

**Khối 6.5 — Banner ưu đãi giữa trang:** nền navy đặc, cột trái badge vàng đồng `--color-accent-badge` "ƯU ĐÃI THÁNG NÀY" + tiêu đề "Giảm 1.000.000đ học phí" + dòng phụ + dòng ưu đãi sinh viên khó khăn, cột phải thẻ trắng "Số suất còn lại X/20" + nút "Giữ suất cho tôi".

**Khối 7 — FAQ:** accordion 8 câu đúng danh sách bản vẽ, câu về khu vực tập sửa theo hướng "tư vấn viên sắp xếp sân gần bạn nhất trong hệ thống" (không hứa tự do chọn sân).

**Khối 8 — CTA cuối:** nền ảnh thật phủ navy 55–65% opacity, tiêu đề, ưu đãi cụ thể, form giống Hero + dòng "chưa cần nộp khoản nào", nút hotline/Zalo to rõ trên mobile.

**Footer:** tên đầy đủ, địa chỉ, hotline, giờ làm việc. **Thanh CTA sticky mobile:** 2 nút Gọi ngay/Để lại số.

---

## 7. Yêu cầu kỹ thuật — để dễ chỉnh sửa và bàn giao Claude Code

**Khuyến nghị:** giữ toàn bộ trang bằng HTML/CSS/JS thuần (không dùng framework như React/Vue trừ khi bạn có kế hoạch khác) — để Claude Code sau này deploy tĩnh (Netlify/Vercel/GitHub Pages) không cần bước build, giảm rủi ro lỗi khi bàn giao.

| Việc cần làm | Vì sao |
|---|---|
| Đặt comment đánh dấu rõ mỗi khối, đúng tên gọi trong bản vẽ: `<!-- KHỐI 1: HERO -->`, `<!-- KHỐI 1.5: DẢI SỐ LIỆU -->`... | Sau này bạn hoặc Claude Code tìm đúng chỗ cần sửa trong vài giây, không phải đọc lại toàn bộ file |
| Toàn bộ màu/bo góc/transition khai báo bằng CSS variables ở đầu file (mục 2) | Đổi 1 dòng là đổi cả trang — quan trọng vì bảng màu đã trải qua 3 vòng thử, có thể còn chỉnh tiếp |
| 1 component form dùng chung cho Hero và Khối 8 (không viết trùng 2 lần) | Sửa nội dung/validation 1 nơi, áp dụng cả 2 chỗ |
| Số suất còn lại (X/20): gom vào **1 object cấu hình duy nhất** ở đầu file JS, ví dụ `slotConfig = { apiUrl: "", fallbackText: "Liên hệ để kiểm tra" }`, dùng chung cho cả 3 chỗ hiển thị (Hero/Khối 5/Khối 6.5) | Bản vẽ xác nhận đây là số lấy real-time qua Google Apps Script — khi Claude Code nối API thật, chỉ cần điền 1 chỗ `apiUrl`, không sửa 3 nơi |
| Đặt tên file ảnh đúng theo shot-list (vd `hero-giao-vien-hoc-vien.jpg`, `khoi3-hop-dong.jpg`) ngay từ placeholder | Khi có ảnh thật, chỉ thay file cùng tên, không cần sửa code |
| Gom JS theo từng tính năng, có comment rõ: đếm số, đóng/mở FAQ, chuyển tab, hiệu ứng cuộn, đếm suất còn lại | Dễ tắt/sửa riêng từng hiệu ứng nếu sau này thấy không hợp |
| Alt text đầy đủ cho mọi ảnh, trạng thái focus rõ cho nút/link/input | Chuẩn tối thiểu, cũng ảnh hưởng điểm chất lượng quảng cáo khi chạy Facebook Ads tới trang |
| Test hiển thị ở 2 mốc: 375px (mobile phổ biến) và 1440px (desktop) | Kênh chính là Facebook Ads mobile — ưu tiên kiểm mobile trước |

---

## 8. Ranh giới nội dung — nhắc khi dựng, không phải để hỏi lại

Toàn bộ chữ, số liệu trong bản vẽ đã đối chiếu với hồ sơ doanh nghiệp và ranh giới nội dung — dùng đúng nguyên văn, **không để Claude Design tự "viết mượt hơn" hay thêm cam kết/lợi ích mới** khi dựng giao diện. Cụ thể:

- Không thêm lại số "30 xe/30 giáo viên" (sai, số đúng là 13 xe/11 giáo viên, và khối này đã bị bỏ trong v2 — không cần nhắc lại ở đâu).
- Không diễn giải thành "chọn sân tập tự do/gần nhà" — giữ đúng "tư vấn viên sắp xếp sân gần bạn nhất trong hệ thống".
- Không thêm minh hoạ vector/clipart — chỉ ảnh/video thật.

---

## 9. Sau khi dựng xong trên Claude Design

1. Duyệt từng khối trên canvas, chỉnh trực tiếp (click-to-select, properties panel, sửa chữ tại chỗ).
2. Khi có ảnh thật theo shot-list (mục shot-list đầy đủ nằm trong `banvev2updated.md`), thay đúng theo tên file đã đặt ở mục 7.
3. Đưa file sang Claude Code kèm 1 dòng dặn rõ: *"Giữ nguyên cấu trúc biến CSS và comment đánh dấu khối, chỉ nối API số suất còn lại và deploy — không đổi màu/hiệu ứng đã có."* Việc này giúp Claude Code không "tối ưu lại" những gì bạn đã duyệt.

---

*Nguồn: `banvev2updated.md` (29/8/2026). Điểm đã chốt trong lượt này: dải trang trí Khối 1.5 dùng gradient xanh đã chốt (không giữ 3 tông hồng-xanh dương-xanh lá của ảnh gốc); hiệu ứng cuộn được phép nổi bật hơn mức tối giản ban đầu (parallax nhẹ, sticky reveal) nhưng vẫn giữ nguyên 3 điều cấm gốc.*
