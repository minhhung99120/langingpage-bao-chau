# Bản vẽ thiết kế Landing Page Bảo Châu — bản mới (v2, cập nhật vòng 3)

*Bản vẽ bằng chữ — chưa dựng HTML. Mục đích: Hùng duyệt cấu trúc, thông điệp, hình ảnh trước khi bắt tay code.*
*Ngày lập: 29/8/2026. Cập nhật vòng 2: theo yêu cầu chỉnh sau khi xem bản vẽ vòng 1 + 4 ảnh tham khảo. Cập nhật vòng 3: đối chiếu với 2 file `baochaulp.html` và `Landing Page Bảo Châu.dc.html` (bản Hùng từng tự dựng trước đây) để trả lời 3 điểm còn treo ở vòng 2. Xem mục "Nhật ký sửa đổi" ở cuối văn bản để biết chính xác chỗ nào đổi, chỗ nào còn treo, và nguồn dẫn từng chỗ.*

---

## Nguyên tắc thiết kế xuyên suốt (áp dụng cho mọi khối bên dưới)

| Hạng mục | Quy tắc |
|---|---|
| Ảnh | Ảnh/video thật của Bảo Châu là chủ đạo, không dùng minh hoạ vector/clipart. Mỗi khối tối đa 1 ý hình ảnh chính — không chồng nhiều ảnh nhỏ vụn vặt (khối 3 sau khi gộp nội dung là ngoại lệ có chủ đích — xem ghi chú riêng ở khối đó). |
| Màu | **Đã chốt — phương án A-ii** (rút từ ảnh quảng cáo Bảo Châu từng chạy, bỏ hẳn xanh Apple #0071e3 và tông navy #01498B cũ). Chi tiết ở mục "Bảng màu đã chốt" ngay dưới bảng này. |
| Hiệu ứng | Bỏ hoàn toàn: kính mờ (glassmorphism), blob gradient trôi nổi, chữ ánh kim chạy động. Chữ tiêu đề lớn được phép dùng gradient 2 tông xanh nhưng phải **tĩnh, không animation** — xem quy tắc gradient chữ bên dưới. Chỉ giữ transition mượt cơ bản (fade/slide nhẹ khi cuộn), **cộng thêm hiệu ứng số chạy (count-up) khi cuộn tới cho khối 1.5** — đây là hiệu ứng số liệu, không phải hiệu ứng trang trí, nên không tính vào danh sách bị cấm. |
| Nút bấm | Chữ nhật bo góc nhẹ (8–10px), màu đặc, không gradient, không blur. |
| Chữ | Mỗi khối: 1 tiêu đề ngắn (≤ 12 từ) + tối đa 1 dòng phụ + phần thân 2–3 câu. Khối 2 và dòng phụ Hero là ngoại lệ có chủ đích vì Hùng chốt nguyên văn — xem ghi chú tại từng khối. |
| Số lượng khối | **7 khối chính** (1, 2, 3, 5, 6, 7, 8 — khối 4 đã bỏ) **+ 2 khối bổ sung xen giữa** (1.5 ngay sau Hero, 6.5 ngay sau Khối 6). Mỗi khối vẫn giải quyết đúng 1 vấn đề, đều hướng về form. |

**Đã sửa các điểm vi phạm ranh giới nội dung có trong bản cũ:** bỏ danh sách tên khu vực sân tập (Liên Mạc, Nhật Tân, Mỹ Đình...) vì có thể bị hiểu là liệt kê tên/địa chỉ sân (ranh giới #4); bỏ câu kiểu "chọn sân tập gần nhà nhất" vì ngụ ý tự do chọn sân (ranh giới #8) — thay bằng "tư vấn viên sắp xếp sân gần bạn nhất trong hệ thống".

---

## Bảng màu đã chốt — phương án A-ii

*Chọn từ 3 vòng thử màu (navy-đỏ → 8 màu thay thế → rút từ ảnh quảng cáo cũ → 3 biến thể hướng A). A-ii thắng vì tương phản cao, dễ đọc trên mobile — kênh chính là Facebook Ads.*

| Vai trò | Mã màu | Dùng ở đâu |
|---|---|---|
| Nền chính (gradient) | #F0F8FD → #D6EBFA (chéo 135°) | Nền khối Hero và các khối dùng nền màu (Vấn đề ngành, CTA cuối) |
| Chữ tiêu đề lớn (gradient tĩnh) | #1E6FB5 → #072644 (chéo 135°, background-clip: text) | Chỉ dùng cho H1/H2 chính của mỗi khối — **không animation, không hiệu ứng chạy sáng** |
| Navy đặc (chữ phụ, nút, icon, viền) | #072644 | Nút CTA, icon check, đường kẻ nhấn, chữ thân trên nền sáng, nền khối 6.5 và khối 8 |
| Nền trắng/thẻ | #FFFFFF | Thẻ ảnh, bảng giá, FAQ accordion, thẻ "Không" ở khối 3 |

**Quy tắc dùng gradient chữ:** chỉ áp cho tiêu đề chính mỗi khối (không dùng cho chữ thân, nút, hay nhãn nhỏ, và không dùng cho số liệu ở khối 1.5). Đây là điểm khác biệt sống còn với bản .dc.html cũ: gradient ở đây là 2 màu tĩnh cố định, không chạy hiệu ứng ánh kim.

**Màu nhấn phụ (ưu đãi/badge):** **đã có tiền lệ cho 1 trường hợp cụ thể** — badge "ƯU ĐÃI THÁNG NÀY" trên nền navy đặc (Khối 6.5) dùng **#B8860B (vàng đồng)**, lấy đúng từ bản `.dc.html` cũ (khối gốc của ảnh 4). Đề xuất dùng thống nhất #B8860B cho mọi badge ưu đãi đặt trên nền navy (Khối 6.5, và Khối 8 nếu có badge tương tự). Badge ưu đãi ở Hero và dòng nhắc Khối 5 đặt trên nền sáng (trắng/xanh nhạt) nên vẫn dùng navy đặc #072644 làm chữ/nền — không cần thêm màu thứ ba vì đã đủ tương phản trên nền sáng. Dải trang trí như ảnh 1 ở Khối 1.5 vẫn là điểm chưa chốt riêng — xem ghi chú tại khối đó.

---

## Header (sticky, không tính vào 7 khối chính)

Logo Bảo Châu bên trái. Bên phải: hotline dạng chữ + 1 nút "Nhận tư vấn" (chữ nhật đặc navy). 2–3 anchor link: Học phí / Lộ trình / Câu hỏi. Không cần menu nhiều mục vì đây là landing page 1 trang, không phải website.

---

## Khối 1 — Hero: mở đúng kỳ vọng trong 3 giây

**Mục tiêu:** khách nhận ra ngay đây là trung tâm dạy lái xe thật ở Hà Nội, cảm nhận được thương hiệu, và thấy form ngay.

**Bố cục:** 2 cột trên desktop (trái: chữ + form, phải: ảnh lớn) — 1 cột trên mobile, ảnh lên trước, chữ overlay nhẹ nếu ảnh đủ tối.

**Tiêu đề — đã chốt, 2 dòng, dòng 2 dùng gradient tĩnh (#1E6FB5 → #072644):**
"Học lái ô tô Bảo Châu"
"Hơn cả một khoá học"

**Dòng phụ — đã chốt nguyên văn (không còn 2 phương án như bản trước):**
"10+ năm tư vấn và đào tạo hơn 10.000 học viên - Bảo Châu hướng đến trải nghiệm học tập chất lượng, tiên tiến. Chung tay xây dựng cộng đồng lái xe an toàn, văn minh."

*Ghi chú (không chặn việc dùng câu này, chỉ để bạn biết): cụm "trải nghiệm học tập chất lượng, tiên tiến" là đúng kiểu ngôn ngữ sáo rỗng mà bản vẽ vòng 1 từng rút gọn bớt để tránh, theo nguyên tắc "không dùng từ sáo rỗng" trong hồ sơ dự án. Vì đây là câu cảm xúc mở đầu chứ không phải luận điểm bán hàng, và bạn đã chốt nguyên văn, tôi giữ đúng như bạn viết — cỡ chữ nên để mức phụ, nhỏ hơn tiêu đề, đúng như bản vẽ vòng 1 đã lưu ý.*

**Badge ưu đãi — giữ nguyên cấu trúc tách 3 tầng chữ:**

```
┌──────────────────────────┬──────────────────┐
│  ƯU ĐÃI THÁNG NÀY         │   Còn X/20 suất   │
│  Giảm 1.000.000đ          │                   │
└──────────────────────────┴──────────────────┘
```

- Cột trái: "ƯU ĐÃI THÁNG NÀY" (chữ hoa, cỡ nhỏ ~11px, navy đặc) trên "Giảm 1.000.000đ" (cỡ lớn ~20px, đậm, navy đặc).
- Cột phải: "Còn X/20 suất" — font số tabular. **Cơ chế lấy số X — đã xác nhận từ bản `.dc.html` cũ:** không phải đếm ngược giả hay số gõ tay cố định, mà lấy real-time qua 1 API riêng (Google Apps Script) trả về số suất còn lại thật; nếu chưa cấu hình hoặc API lỗi thì hiển thị chữ "Liên hệ để kiểm tra" thay vì để trống hoặc bịa số. Bản vẽ này giữ nguyên cơ chế đó khi dựng trang thật — không cần Hùng gõ tay mỗi ngày. *(Ảnh bạn gửi tham khảo ghi 7/20 — đó là số tại đúng thời điểm chụp, không cần chốt cứng vì cơ chế đã tự động.)*
- Đặt dưới dòng phụ, trên form.

**Form — đã cập nhật theo yêu cầu:**
- Dòng nhãn trên đầu form: **"Nhận tư vấn miễn phí"**
- Trường: Họ tên – Số điện thoại – Hạng muốn học (dropdown)
- Nút bấm: **"Đăng ký"** (rút gọn, bỏ câu "Nhận tư vấn miễn phí trong ít phút" cũ vì nội dung đó đã chuyển lên làm nhãn đầu form, không cần lặp lại trên nút).

**Shot-list:**
- Cảnh chính: giáo viên ngồi ghế phụ, tay chỉ ra ngoài hướng dẫn; học viên (20–30 tuổi) cầm vô-lăng xe Toyota Vios thật; chụp từ ghế sau hoặc qua cửa kính, ánh sáng tự nhiên ban ngày.
- Cảnh dự phòng: cận tay học viên trên vô-lăng + bảng đồng hồ, ánh sáng ấm.
- Lưu ý: xin phép học viên xuất hiện trong ảnh quảng cáo; che/làm mờ biển số xe cá nhân nếu lộ trong khung hình.

---

## Khối 1.5 — MỚI: Dải số liệu nhanh (theo ảnh 1)

**Mục tiêu:** củng cố lòng tin ngay lập tức sau Hero, bằng số liệu quét nhanh được, trước khi vào khối 2 (đặt vấn đề). Đây là khối "bằng chứng nhanh", không phải khối thuyết phục sâu (việc đó để khối 3 làm).

**Nhãn nhỏ phía trên dải số liệu (chữ hoa, navy):** "Bảo Châu trong con số" — lấy nguyên từ bản `.dc.html` cũ, thêm vào cho khối có điểm neo, ảnh 1 bạn gửi không có dòng này nhưng đây đúng là nội dung Hùng đã viết trước đó cho đúng khối này.

**Bố cục:** 1 dải ngang, 5 cột trên desktop (2–3 cột × 2 dòng trên mobile). Mỗi cột: số/chữ lớn phía trên (navy đặc #072644, không dùng gradient — gradient chỉ dành cho tiêu đề chính mỗi khối) + 1 dòng mô tả nhỏ bên dưới.

**5 mục — đã xác nhận đủ cả 5, khớp cả ảnh 1 lẫn 2 file cũ:**
1. **10.000+** — học viên đã học lái tại Bảo Châu
2. **10+** — năm tư vấn tuyển sinh và đào tạo lái xe
3. **10+** — sân tập trải khắp Hà Nội *(đã khôi phục lại số "10+" — không có trong hồ sơ/skill, nhưng xuất hiện nhất quán ở cả 2 file cũ: `baochaulp.html` nhắc 3 lần "hơn 10 sân tập", `.dc.html` dùng đúng "10+" với hiệu ứng đếm số giống 2 mục trên — coi đây là số Hùng đã tự xác nhận trước đây, dùng lại được.)*
4. **1 thầy – 1 trò – 1 xe** — không học ghép, không chờ tới lượt
5. **Hợp đồng đào tạo** — bằng văn bản, ký trước khi vào lớp

**⚠️ Không đưa vào — phát hiện số liệu lệch:** bản `.dc.html` cũ có thêm 1 câu chốt ngay dưới dải số liệu: *"Đứng sau những con số đó là hơn 30 xe tập lái và hơn 30 giáo viên cơ hữu..."*. Con số **30 xe / 30 giáo viên** này **sai lệch nghiêm trọng** so với hồ sơ doanh nghiệp và skill kiến thức nền hiện tại (cập nhật 8/2026, mới hơn): thực tế chỉ có **13 xe, 11 giáo viên cơ hữu**. Đây chắc chắn là số liệu cũ/nháp từ thời trung tâm quy mô khác hoặc số ước lượng chưa chốt — bản vẽ này **không đưa câu đó vào**, và bạn nên biết để không vô tình dùng lại con số 30 ở nơi khác.

**Hiệu ứng số chạy khi cuộn tới:** áp dụng cho 2 mục có số thật (10.000+ và 10+) — dùng Intersection Observer, chạy đúng 1 lần khi khối vào khung hình, không lặp lại khi cuộn qua lại nhiều lần. 3 mục còn lại không phải số nên chỉ dùng fade/slide nhẹ đồng bộ thời điểm, không đếm số.

**Về dải màu trang trí:** ảnh 1 dùng dải gradient hồng → xanh dương → xanh lá phía trên khối số liệu — màu này **không nằm trong bảng màu đã chốt** (chỉ có 2 tông xanh + trắng). Đề xuất đổi dải này sang gradient trong hệ đã chốt (#F0F8FD → #D6EBFA) để không phá vỡ nhất quán màu toàn trang. Nếu Hùng muốn giữ đúng dải 3 tông như ảnh gốc làm điểm nhấn cố ý, cần chốt đây là màu bổ sung vào bảng màu (liên quan đến mục "màu nhấn phụ chưa chốt" ở trên).

Không cần shot-list riêng (khối chữ + số, đặt trên nền màu, không cần ảnh thật).

---

## Khối 2 — Vấn đề ngành: đọc xong phải gật đầu

**Mục tiêu:** đồng cảm nhanh, tạo lý do đọc tiếp.

**Tiêu đề — đã chốt nguyên văn:**
"\"Trọn gói\" - nhưng trọn gói tới đâu?"

**Thân bài — đã chốt nguyên văn:**
"Gần như trung tâm nào cũng quảng cáo trọn gói. Vấn đề là chữ "trọn gói" không có định nghĩa chung, nên mỗi nơi một kiểu. Nộp hồ sơ xong mới nghe tới: tiền xăng xe phụ thu do giá xăng tăng, tiền bến bãi, tiền bồi dưỡng thầy, tiền thi chứng chỉ,... Mỗi khoản vài trăm nghìn, nghe không lớn nhưng cộng lại thì con số cuối cùng đã khác hẳn con số ban đầu."

**Kết — in đậm, đã chốt nguyên văn:**
**"Và thời điểm phát hiện ra thường là lúc khó lùi nhất: hồ sơ đã nộp, đã đi học vài buổi."**

*Ghi chú: đoạn này là mô tả hiện tượng chung của ngành (không nói Bảo Châu thu các khoản này), nên không vi phạm ranh giới nội dung — khớp đúng tinh thần khối "đồng cảm" ban đầu. Đoạn hơi dài hơn nguyên tắc "2–3 câu" ở đầu văn bản vì đây là nguyên văn Hùng chốt, không rút gọn thêm.*

**Bố cục:** không cần ảnh lớn — nền gradient xanh da trời nhạt #F0F8FD → #D6EBFA (đồng bộ với hero), có thể đặt 1 câu trích lớn làm điểm nhấn thị giác. Không cần shot-list.

---

## Khối 3 — "Ở Bảo Châu, con số lúc ký là con số cuối cùng" (khối thuyết phục chính, đã đổi toàn bộ nội dung)

**Mục tiêu:** chuyển từ đồng cảm (khối 2) sang bằng chứng cụ thể: 3 cam kết "Không" + bằng chứng hợp đồng thật + minh bạch tới từng khoản chi phí. *Khối này thay thế hoàn toàn bố cục lưới 4-ô "Bảo Châu khác gì" của bản vẽ vòng 1 (không phong bì / hợp đồng / đổi giáo viên / chấm điểm) — xem lưu ý mất nội dung ở cuối mục này.*

**Tiêu đề chính (giữ nguyên từ bản vòng 1, khớp đúng ảnh 2):** "Ở Bảo Châu, con số lúc ký là con số cuối cùng." Nhãn nhỏ phía trên, chữ hoa: "CHÍNH SÁCH 3 KHÔNG".

### Phần A — 3 KHÔNG (nguyên văn từ ảnh 2, không bớt không thêm)

Bố cục lưới 3 ô ngang (desktop) / dọc (mobile). Thiết kế nhẹ lại so với ảnh 2: bỏ nền xám đậm/viền cứng, dùng nền trắng + viền mảnh 1px navy nhạt hoặc bo góc nhẹ, đồng bộ khung "thẻ nền trắng" trong bảng màu đã chốt. **Mỗi ô thêm 1 ảnh minh hoạ riêng** (đặt phía trên hoặc bên trái tiêu đề ô, kích thước nhỏ — khối này vẫn chủ yếu là chữ, ảnh chỉ minh hoạ):

1. **KHÔNG phát sinh chi phí ngầm** — "Học phí trọn gói đã gồm hồ sơ đăng ký, khám sức khoẻ, đào tạo lý thuyết, học cabin, thực hành và tổ chức kiểm tra hết môn."
   *Ảnh đề xuất: tư vấn viên/nhân viên văn phòng ngồi giải thích bảng giá cho học viên.*
2. **KHÔNG phụ phí xăng xe, bến bãi** — "Anh/chị không phải trả thêm cho mỗi buổi ra sân, cũng không phải trả tiền đỗ xăng xe tập. Công thầy và xăng xe đã nằm trong học phí."
   *Ảnh đề xuất: xe tập lái tại sân tập, không cận cảnh biển số/logo sân.*
3. **KHÔNG tiền bồi dưỡng, lót tay giáo viên** — "Giáo viên Bảo Châu được thưởng theo đánh giá của chính học viên — nên dạy tận tâm là quyền lợi của thầy, không phải thứ anh/chị phải mua thêm."
   *Ảnh đề xuất: giáo viên trò chuyện thoải mái với học viên cạnh xe.*

### Phần B — khối hợp đồng (nguyên văn từ ảnh 2)

Bố cục 2 cột: trái là ảnh, phải là chữ + nút.
- Ảnh: chụp 1 bản hợp đồng đào tạo thật của Bảo Châu, che phần thông tin cá nhân của học viên.
- Chữ: "Ba điều này không nằm trong quảng cáo. Chúng nằm trong hợp đồng." + "Hợp đồng đào tạo bằng văn bản được ký trước khi anh/chị vào lớp, ghi rõ học phí, lộ trình và quyền lợi từng gói. Học phí nộp thẳng vào tài khoản kế toán trung tâm, không nộp cho giáo viên."
- Nút: "Xem trước hợp đồng khi tư vấn" (giữ nguyên, không đổi).

### Phần C — MỚI, thêm từ ảnh 3: Đã bao gồm / Chưa bao gồm

Đặt ngay dưới phần B, trong cùng khối 3. Bố cục 2 cột song song, nền trắng, cùng hệ font/spacing với bảng giá ở Khối 5 để nhất quán thị giác — không cần tách thành khối riêng dù nằm sau phần hợp đồng.

**Cột 1 — "Đã bao gồm trong học phí"** (dấu check):
Hồ sơ mở lớp khai giảng · Phí khám sức khỏe · Học lý thuyết + thi hết môn lý thuyết và thực hành · Làm hồ sơ, chụp ảnh, in ảnh, quản lý học viên · Học vỡ, học sa hình, tổng ôn · Chạy DAT đường trường đủ số km theo quy định · Công thầy, xăng xe.

**Cột 2 — "Chưa bao gồm":**
- Lệ phí thi sát hạch: **645.000đ** — nộp trực tiếp cho đơn vị tổ chức thi theo quy định Nhà nước. Bảo Châu không thu khoản này. Gói Cao cấp đã bao gồm.
- Nếu thi trượt: **từ 700.000đ** — phí đăng ký thi lại 700.000đ + phí phần trượt: lý thuyết 100.000đ · sa hình 350.000đ · đường trường 80.000đ.
- Bổ túc thực hành thêm: **350.000đ/giờ** — chỉ khi muốn học thêm ngoài số giờ của gói, tự chọn, không bắt buộc.

*Đã đối chiếu: toàn bộ số liệu ở Phần C khớp 100% với hồ sơ doanh nghiệp (mục 3) và skill kiến thức nền (mục 3) — không có số nào lệch, dùng thẳng được, không cần sửa.*

### Lưu ý nội dung bị thay thế (cần Hùng biết, không phải quên)

Bố cục 4-ô cũ của khối này (bản vòng 1) có 2 luận điểm không còn xuất hiện ở đâu trên trang sau khi đổi sang nội dung ảnh 2+3: **"Đổi giáo viên ngay nếu thấy không hợp"** và **"Học viên chấm điểm sau mỗi buổi"** — đây là 2 điểm khác biệt xếp hạng #5 và #6 trong hồ sơ doanh nghiệp (mục 5). Bản vẽ này không tự thêm lại vì Hùng không yêu cầu, nhưng nếu muốn giữ, có thể đưa ngắn gọn vào FAQ (Khối 7) hoặc một dòng phụ nhỏ cuối khối 3.

**Shot-list khối 3:** (1) tư vấn viên giải thích bảng giá cho học viên, (2) xe tại sân tập, (3) giáo viên trò chuyện cùng học viên cạnh xe, (4) cận cảnh 1 bản hợp đồng thật (che thông tin cá nhân) — 4 cảnh, có thể chụp trong 1 buổi tại văn phòng.

---

## Khối 4 — ĐÃ BỎ

Theo yêu cầu, bỏ hoàn toàn khối "Bằng chứng vận hành thật" (13 xe, 11 thầy cơ hữu, dải ảnh + video hậu trường).

*Cần Hùng biết: sau khi bỏ khối này, 2 số liệu vận hành "13 xe" và "11 giáo viên cơ hữu" — vốn là differentiator #4 trong hồ sơ ("đủ xe đủ thầy, không phải gửi học viên sang đơn vị khác") — không còn xuất hiện ở bất kỳ khối nào khác trên trang. Không tự thêm lại vì không được yêu cầu, chỉ nêu để không phải phát hiện muộn.*

---

## Khối 5 — Học phí 3 hạng (dùng tab, không lặp lại 3 khối)

**Mục tiêu:** gọn trong 1 khối dù có 3 hạng, tránh lặp lại như bản cũ.

**Tiêu đề — đã đổi:** "Học phí niêm yết công khai"
**Dòng phụ — mới:** "Trọn gói từ khi đăng ký đến lúc cầm bằng trên tay"

**Bố cục:** 3 nút tab ngang (B số tự động / B số sàn / C1). Dưới mỗi tab là bảng giá đúng số liệu thật (khớp hồ sơ và skill):

| Hạng | Tiết kiệm | Tiêu chuẩn | Cao cấp |
|---|---|---|---|
| B số tự động | 16.000.000đ | 17.500.000đ | 26.000.000đ |
| B số sàn | 16.500.000đ | 18.100.000đ | 27.000.000đ |
| C1 (1 gói duy nhất) | — | 21.400.000đ | — |

Không dùng giá gạch ngang, không đếm ngược giả.

**Nhắc ưu đãi (vị trí giữa trang) — đã đổi nguyên văn:** 1 dòng nhỏ dưới bảng giá — "Đang áp dụng giảm 1.000.000đ học phí cho các suất đăng ký sớm trong tháng — Giữ suất cho tôi." *(sửa lỗi gõ "Giữa suất" → "Giữ suất" trong câu bạn đưa.)* Trình bày "Giữ suất cho tôi" như 1 link/nút nhỏ trong dòng chữ (không phải nút to riêng) — bấm vào cuộn tới form hoặc mở khối 6.5.

*Tham khảo từ `.dc.html` cũ (đúng vị trí này trong file):* dạng viên thuốc (pill) nền xanh nhạt #E8F0F7, có chấm nhỏ nhấp nháy "Đang áp dụng" + chữ "Giảm 1.000.000đ học phí · còn X/20 suất" (X lấy real-time, cùng cơ chế API như ở Hero) + nút navy "Giữ suất cho tôi" nằm cùng dòng bên phải. Có thể dùng lại đúng bố cục này, chỉ thay câu chữ theo bản Hùng vừa chốt.

**Ảnh minh hoạ:** mỗi tab có 1 ảnh nhỏ xe học tương ứng (Vios cho hạng B, Kia K250 cho C1) — ảnh thật xe của Bảo Châu.

**Shot-list:** ảnh riêng từng loại xe, góc 3/4 phía trước, sạch, có thể có giáo viên đứng cạnh để lấy tỷ lệ người – xe.

---

## Khối 6 — Từ lúc đăng ký tới lúc cầm bằng (đổi bố cục sang 4 chặng, 11 bước)

**Mục tiêu:** cụ thể hoá lộ trình hơn bố cục 5-mốc cũ, theo hướng bạn thấy ổn hơn.

**Tiêu đề:** "Từ lúc đăng ký tới lúc cầm bằng"
**Dòng phụ:** "Bốn chặng, mười một bước. Dưới 1 tháng chuẩn bị hồ sơ, 3–4 tháng đào tạo theo quy định."

**Về nội dung 11 bước — đã tìm thấy, lấy nguyên từ bản `.dc.html` cũ của bạn** (section "Từ lúc đăng ký tới lúc thi", đúng là nơi bạn đã tự thiết kế bố cục này trước đây). Không còn là đề xuất của tôi nữa — đây là nội dung gốc, dùng lại nguyên văn:

*Chặng 1 — Chuẩn bị hồ sơ*
1. **Đăng ký hồ sơ mở lớp** — Gửi online ảnh CCCD 2 mặt, 1 ảnh chân dung, 1 ảnh CCCD điện tử.
2. **Khám sức khỏe hoàn thiện hồ sơ** — Tại phòng khám liên kết, xong trong 20–30 phút.

*Chặng 2 — Lý thuyết và mô phỏng*
3. **Học luật + mô phỏng online** — Bắt buộc và phải đủ giờ theo quy định. Ai thấy khó có thể lên văn phòng học trực tiếp với thầy, miễn phí.
4. **Kiểm tra hết môn lý thuyết + mô phỏng**
5. **Học cabin** — 2 giờ trên cabin điện tử (gói Tiêu chuẩn và Cao cấp).

*Chặng 3 — Thực hành trên xe*
6. **Học thực hành cơ bản** — Làm quen xe, thao tác nền.
7. **Chạy đường trường (DAT)** — 710km hạng B tự động · 810km hạng B số sàn · 825km hạng C1.
8. **Học 11 bài thi sa hình** — Ghép ngang, ghép dọc, lên dốc — bài nào chưa chắc thì tập lại bài đó, thầy đi cùng từng lượt.

*Chặng 4 — Về đích*
9. **Kiểm tra hết môn thực hành**
10. **Tổng ôn sa hình + ôn xe chip** — Chạy thử trên xe gắn thiết bị chấm điểm như thi thật, để quen áp lực phòng thi.
11. **Thi sát hạch** — Khoảng 3–4 tháng kể từ ngày khai giảng.

*Đã đối chiếu: bước 5 (học cabin chỉ ở gói Tiêu chuẩn/Cao cấp) khớp đúng bảng giá ở Khối 5 và skill mục 2; mốc thời gian bước 11 khớp đúng hồ sơ và skill mục 6 ("khai giảng → thi 3–4 tháng"). "11 bài thi sa hình" ở bước 8 là kiến thức chung của kỳ thi sát hạch Việt Nam, không phải số liệu riêng của Bảo Châu nên không cần nguồn hồ sơ.*

**Bố cục:** 4 cụm dạng thẻ, mỗi thẻ = 1 chặng, xếp dọc theo lưới (giống bản `.dc.html`: mỗi thẻ có nhãn "Chặng X" nhỏ ở trên, tiêu đề chặng lớn, danh sách bước bên trong đánh số tròn, và 1 ảnh/video minh hoạ bên cạnh mỗi thẻ). Trên mobile các thẻ xếp dọc toàn bộ; không cần ẩn bớt bước vì mỗi thẻ chỉ có 2–3 bước, không quá dài.

**Shot-list khối 6 (mới, theo đúng 4 thẻ):** (1) làm hồ sơ tại văn phòng — Chặng 1; (2) lớp lý thuyết hoặc học cabin — Chặng 2; (3) học sa hình/thực hành tại sân — Chặng 3; (4) tổng ôn xe chip hoặc khoảnh khắc thi/nhận bằng — Chặng 4. Có thể dùng video ngắn thay ảnh tĩnh cho Chặng 2–4 nếu có điều kiện quay, giống hướng bản `.dc.html` cũ.

---

## Khối 6.5 — MỚI: Banner nhắc ưu đãi giữa trang (theo ảnh 4)

**Mục tiêu:** nhắc lại ưu đãi ngay sau khi khách vừa hình dung xong lộ trình học — đúng lúc dễ chuyển sang hành động.

**Bố cục (theo ảnh 4, chỉnh theo bảng màu đã chốt thay vì tông xanh navy nhạt/kính mờ của ảnh gốc):**
- Nền navy đặc #072644 (đồng bộ khối 8 — CTA cuối, tránh thêm 1 tông xanh dương khác gây lệch bảng màu).
- Cột trái: badge nhỏ "ƯU ĐÃI THÁNG NÀY" — **màu đã có tiền lệ: #B8860B (vàng đồng)**, lấy đúng từ bản `.dc.html` cũ — khối này trong file cũ khớp gần như 100% với ảnh 4 bạn gửi (cùng nền navy #01498B/#072644, cùng bố cục 2 cột, cùng nội dung). Coi như đã chốt được màu nhấn phụ cho badge trên nền navy, đỡ phải để trống ô "chưa chốt" như bản trước + tiêu đề lớn trắng đậm "Giảm 1.000.000đ học phí" + dòng phụ "Áp dụng cho tất cả các hạng và tất cả các gói." + dòng nhỏ "Ưu đãi riêng cho sinh viên có hoàn cảnh khó khăn — liên hệ tư vấn viên để được hướng dẫn." *(khớp đúng chính sách giảm 2.000.000đ trong hồ sơ, không cộng dồn với ưu đãi 1 triệu — tư vấn viên cần biết rõ điều này khi khách hỏi lại).*
- Cột phải: thẻ trắng nổi trên nền navy — "Số suất còn lại" + số lớn "X/20" (font tabular, lấy real-time qua cùng API Google Apps Script như ở Hero và Khối 5 — không phải gõ tay, không đếm ngược giả; nếu API chưa sẵn sàng thì hiện "Liên hệ để kiểm tra" thay vì để trống) + nút trắng chữ navy "Giữ suất cho tôi" (dẫn tới form).

Không cần shot-list (khối chữ/số, không cần ảnh thật).

**Lưu ý tần suất nhắc ưu đãi:** sau khi thêm khối này, ưu đãi "giảm 1 triệu" xuất hiện **4 lần** trên trang — badge Hero, dòng nhỏ Khối 5, banner đầy đủ ở đây, và CTA cụ thể ở Khối 8. Đây là chủ đích hợp lý cho phễu bán hàng (nhắc lại ở nhiều điểm chạm), nhưng nếu thấy dày quá, có thể bỏ dòng nhắc ở Khối 5 vì banner này đã làm việc đó kỹ hơn. Bản vẽ tạm giữ đủ cả 4 theo đúng yêu cầu, quyết định cắt bớt hay không tuỳ Hùng.

---

## Khối 7 — Câu hỏi thường gặp (giữ nguyên)

- Học phí đã gồm những gì, còn phải trả thêm khoản nào?
- Chưa từng cầm vô-lăng, học được không?
- Đi làm giờ hành chính, học vào lúc nào?
- Nên học số tự động hay số sàn?
- Thi lần đầu chưa đạt thì sao?
- Bằng B và C1 lái được xe gì?
- Có trả góp không?
- Mất bao lâu thì có bằng?

**Bỏ câu "Nhà tôi ở ngoại thành, tập ở đâu?"** nếu câu trả lời có ý "chọn sân thuận đường nhất" — sửa thành: tư vấn viên sắp xếp sân gần bạn nhất trong hệ thống, không hứa tự do chọn sân.

**Bố cục:** accordion đơn giản, không cần ảnh.

---

## Khối 8 — CTA cuối + ưu đãi (nhấn mạnh, giữ nguyên)

**Tiêu đề:** "Để lại số, Bảo Châu gọi lại đúng giờ hành chính."

**Ưu đãi cụ thể:** "Giảm 1.000.000đ học phí — áp dụng mọi hạng, mọi gói. Giới hạn 20 suất, xoay vòng lại mỗi tháng."

**Nền:** ảnh thật làm nền (đội xe hoặc lớp học), phủ lớp navy đặc #072644 mờ (khoảng 55–65% opacity).

**Form:** giống hero, thêm dòng nhỏ "Ở bước này bạn chưa cần nộp bất cứ khoản nào."

**Nút gọi nhanh:** hotline/Zalo hiển thị to, dễ bấm trên mobile.

---

## Footer (giữ nguyên)

Tên đầy đủ, địa chỉ, hotline, giờ làm việc.

## Thanh CTA sticky mobile (giữ nguyên)

Giữ 2 nút: Gọi ngay / Để lại số — chữ nhật bo nhẹ, đồng bộ style mới.

---

## Tổng hợp shot-list cần chụp trước khi dựng trang thật

| Khối | Cảnh cần chụp | Ưu tiên |
|---|---|---|
| Hero | Giáo viên hướng dẫn học viên trong xe Vios | Cao |
| Khối 3 | Tư vấn viên giải thích bảng giá cho học viên; xe tại sân tập; giáo viên trò chuyện cùng học viên cạnh xe; cận cảnh 1 bản hợp đồng thật (che thông tin cá nhân) | Cao |
| Khối 5 | Ảnh riêng xe Vios và Kia K250 | Trung bình |
| Khối 6 | 1 ảnh nền mờ (có thể tái dùng ảnh đã chụp ở khối khác) | Thấp |

*Khối 4 đã bỏ nên các cảnh trước đó dự kiến cho khối này (đội xe xếp hàng trước văn phòng, lớp lý thuyết, video hậu trường 10–15s) không còn khối đích trên landing page. Có thể tái dùng làm ảnh nền cho Khối 1.5/Khối 6, hoặc bỏ khỏi ưu tiên chụp — riêng video hậu trường vẫn có thể hữu ích cho content Fanpage dù không lên landing page, tuỳ Hùng quyết định có vẫn chụp không.*

Tổng cộng cần khoảng 8–10 ảnh thật, chụp được trong 1 buổi tại văn phòng và sân tập.

---

## Nhật ký sửa đổi và các điểm cần Hùng chốt lại

**Vòng 2 — đã sửa theo đúng yêu cầu:**
- Dòng phụ Hero, nút form Hero ("Đăng ký"), nhãn đầu form ("Nhận tư vấn miễn phí").
- Thêm khối 1.5 (dải số liệu, hiệu ứng đếm số khi cuộn).
- Tiêu đề + thân bài + kết luận in đậm khối 2, nguyên văn.
- Khối 3 đổi toàn bộ sang nội dung ảnh 2 (3 KHÔNG + hợp đồng) và ảnh 3 (đã/chưa bao gồm), thiết kế nhẹ lại, mỗi ô "Không" có ảnh riêng.
- Bỏ khối 4.
- Tiêu đề + dòng phụ khối 5, câu nhắc ưu đãi giữa trang (đã sửa lỗi gõ "Giữa suất" → "Giữ suất").
- Khối 6 đổi bố cục 4 chặng/11 bước.
- Thêm khối 6.5 (banner ưu đãi theo ảnh 4).

**Vòng 3 — đã đọc `baochaulp.html` và `Landing Page Bảo Châu.dc.html` (2 bản Hùng tự dựng trước đây), trả lời được cả 3 điểm treo ở vòng 2:**
1. ✅ **Nội dung 11 bước ở Khối 6** — tìm thấy nguyên bản trong `.dc.html` (section "Từ lúc đăng ký tới lúc thi", dòng ~556–628), đã thay thế bản đề xuất tạm bằng đúng nội dung gốc này. Không còn là đề xuất chờ duyệt nữa.
2. ✅ **"10+ sân tập"** — đã khôi phục lại số 10+, xuất hiện nhất quán ở cả 2 file cũ (không có trong hồ sơ/skill, nhưng là số Hùng tự xác nhận từ trước, không phải tôi bịa thêm).
3. ✅ **Cơ chế số suất X/20** — không phải gõ tay: `.dc.html` cho thấy đây là số lấy real-time qua 1 API (Google Apps Script trả về `suatConLai`), có fallback "Liên hệ để kiểm tra" nếu API lỗi/chưa cấu hình. Áp dụng cơ chế này cho cả 3 chỗ dùng X/20 (Hero, Khối 5, Khối 6.5) khi dựng trang thật — không cần Hùng cập nhật thủ công mỗi ngày.
4. ✅ **Màu nhấn phụ cho badge ưu đãi trên nền navy** — tìm thấy tiền lệ #B8860B (vàng đồng) dùng đúng ở khối gốc của ảnh 4 trong `.dc.html`. Áp dụng cho Khối 6.5; Hero/Khối 5 trên nền sáng vẫn dùng navy vì đã đủ tương phản.

**⚠️ Phát hiện mới, quan trọng — số liệu sai lệch cần tránh:** `.dc.html` cũ có câu "hơn 30 xe tập lái và hơn 30 giáo viên cơ hữu" ngay dưới khối số liệu — **con số này sai** so với hồ sơ hiện tại (13 xe, 11 giáo viên cơ hữu, cập nhật 8/2026). Bản vẽ này không đưa câu đó vào Khối 1.5. Nếu số 30 từng được dùng ở nơi nào khác (ảnh quảng cáo cũ, bài đăng cũ...), nên rà lại vì lệch khá xa so với số thật hiện tại.

**2 điểm phát sinh do các thay đổi ở vòng 2, vẫn còn nguyên — nêu để không bị phát hiện muộn:**
5. Khối 3 mới không còn nhắc "đổi giáo viên ngay" và "học viên chấm điểm mỗi buổi" (differentiator #5, #6 trong hồ sơ). Khối 4 bị bỏ cũng làm mất "13 xe, 11 giáo viên" (differentiator #4, số đúng — không nhầm với con số 30 sai ở trên). Cân nhắc đưa các ý này vào FAQ nếu không muốn mất hẳn khỏi trang.
6. Ưu đãi "giảm 1 triệu" giờ lặp lại 4 lần trên trang (Hero, Khối 5, Khối 6.5, Khối 8) — hợp lý cho phễu bán hàng nhưng có thể rút bớt nếu thấy dày.

**Vẫn treo, chưa ai chốt:**
7. Dải gradient trang trí ở Khối 1.5 (theo ảnh 1) dùng tông hồng-xanh dương-xanh lá không có trong bảng màu đã chốt và cũng không thấy trong 2 file cũ — bản vẽ đề xuất đổi sang gradient xanh trong hệ đã chốt, chờ bạn xác nhận có muốn giữ 3 tông gốc không.
