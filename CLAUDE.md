# Landing page Bảo Châu

Trang tĩnh thuần HTML + CSS + JS cho trung tâm tư vấn tuyển sinh và đào tạo lái xe Bảo Châu (Hà Nội).
**Không framework, không bước build.** Hostinger serve trực tiếp file.

- Chạy thật: https://daotaolaixebaochau.com
- Repo: https://github.com/minhhung99120/langingpage-bao-chau (public)
- Người dùng: **Hùng**, phụ trách marketing. Không phải lập trình viên. **Trả lời bằng tiếng Việt.**

## Cấu trúc

```
index.html               trang chủ, chia bằng comment <!-- KHỐI n: ... -->
chinh-sach-bao-mat.html  bắt buộc có để duyệt quảng cáo Facebook/Google
css/styles.css           tokens ở :root, class tiếng Việt có nghĩa
js/noi-dung.js           ⭐ TOÀN BỘ NỘI DUNG — giá, FAQ, lộ trình, hotline, ảnh
js/app.js                render + hiệu ứng, không chứa nội dung
apps-script-lead.gs      backend Google Apps Script (dán vào Google, không chạy ở đây)
.htaccess                ép Cache-Control max-age=0 must-revalidate cho html/css/js
robots.txt / sitemap.xml
img/                     ảnh đã nén
```

**Sửa nội dung thì mở `js/noi-dung.js` trước.** Chỉ khi nội dung không có ở đó mới đụng `index.html`.

## Quy trình sửa

Sửa file → `git add -A && git commit -m "..." && git push` → Hùng bấm Deploy trên Hostinger.

**Không bơm `?v=` nữa.** `.htaccess` đã lo cache, đã đo trên tên miền thật.
Nếu deploy xong mà trang vẫn cũ kể cả sau `Cmd+Shift+R` → nghi `.htaccess` không được áp dụng, đừng đoán.

## Ranh giới nội dung — TUYỆT ĐỐI KHÔNG VƯỢT

Đây là ràng buộc kinh doanh, không phải sở thích. Vi phạm là rủi ro thật cho trung tâm.

1. **Không nêu tỉ lệ thi đỗ** dưới bất kỳ dạng nào — không có dữ liệu thật.
2. **Không dùng "bao đỗ", "đỗ 100%", "cam kết đậu".**
3. **Không tuyên bố tư cách pháp lý** — chưa có giấy phép kinh doanh và mã số thuế.
   Không "được Sở cấp phép", không "cơ sở đạt chuẩn", không số giấy phép, không schema ngụ ý chứng nhận.
4. **Không liệt kê tên/địa chỉ sân tập**, không nói sân "đạt chuẩn". Sân là của bên thứ ba.
5. **Không hứa "tự do chọn sân tập".**
6. **Không đếm ngược giả, không giá gạch ngang.**
7. Học bổng chỉ viết chung, **không nêu số suất hay mức giảm cụ thể**.
8. **Không dùng tên "Minh Hùng"** ở bất cứ đâu — chỉ thương hiệu Bảo Châu.
9. Lệ phí thi sát hạch **luôn phải ghi rõ nộp cho đơn vị tổ chức thi, Bảo Châu không thu**.

Danh sách đầy đủ kèm lý do: `README-THIET-KE-GOC.md` mục "Ranh giới nội dung".

## Số liệu là số thật — không tự sửa

Giá, số giờ, km DAT trong `BANG_GIA` là số đã chốt với chủ trung tâm.
**Hỏi Hùng trước khi đổi.** 7 gói: `A1 A2 A3` (B số tự động), `B1 B2 B3` (B số sàn), `C1`.

## Bẫy đã gặp — đọc trước khi sửa

- **Một con số có thể nằm ở nhiều file.** Ví dụ `645.000` (lệ phí thi) nằm ở 4 chỗ:
  `noi-dung.js` dòng 108, 109, 311 và `index.html` dòng 218.
  **Luôn `grep -rn "<số>" js/ index.html` trước và sau khi sửa.**
- **Bỏ một phần tử làm phần còn lại giãn sai bố cục.** Đã xảy ra khi bỏ thẻ "C1 lái được xe gì":
  thẻ gói còn lại tự giãn hết chiều ngang. Bỏ gì thì kiểm lại bố cục ở 390 / 768 / 1440.
- **`.trang` phải là `overflow-x: clip`**, không được đổi sang `hidden` — header sticky sẽ chết.
- **Ảnh Khối 6**: desktop `sticky; top:96px`, mobile `relative; top:auto`. Giữ `top:96px` khi
  relative sẽ đè lên chữ.
- **Cân hàng bảng giá**: dòng so sánh mang `data-pkg-row`, thùng chứa mang `data-pkg-grid`.
  Hàm `canHangGoi()` trong `app.js` cân chiều cao. Thêm dòng mới nhớ gắn `data-pkg-row`.
- **`line-height` H1/H2 ≥ 1.3 và `padding-top: 0.08em`** — chặt hơn cắt mất dấu tiếng Việt.
- **Không đặt animation transform lên `.hero__nen` hay `.cta-cuoi__nen`** — `app.js` đang ghi
  `transform` lên chính hai phần tử đó để chạy parallax, hai transform sẽ đè nhau. Hiệu ứng
  "nền thở" vì thế nằm ở `.hero__nen::before`.
- **Hai dòng H1 Hero là `display:block`**, không có `<br>` — cần thế để chạy được hiệu ứng
  hiện lần lượt từng dòng (phần tử inline không nhận `translateY`).
- **Chỉ một ngưỡng mobile: `max-width: 760px`.** Đừng thêm breakpoint.
- **`khoi5-xe-vios-so-san.jpg`** là ảnh cần số sàn, **`khoi5-xe-kia-k250.jpg`** là xe tải C1 —
  đừng đổi chỗ.

## Google Sheet + Telegram (đã nối, đang chạy)

Một Apps Script phục vụ hai chiều, URL nằm ở `URL_NHAN_DANG_KY` và `URL_NOI_DUNG_SHEET`
trong `noi-dung.js` — **cùng một URL**.

- `doPost` → ghi đăng ký vào tab `DangKy` + báo Telegram
- `doGet` → trả số suất từ tab `NoiDung`
- **Sheet để "Chỉ mình tôi".** Script chạy với tư cách chủ Sheet nên đọc/ghi được;
  khách chỉ gọi script chứ không thấy Sheet. **Đừng bao giờ khuyên xuất bản Sheet lên web.**
- Sheet lỗi → trang giữ số dự phòng `UU_DAI.conLai`, **không** hiện "Liên hệ để kiểm tra"
  (Hùng đã chọn cách này).
- Bot token chỉ nằm trong Apps Script trên Google. **Không bao giờ đưa token vào repo** — repo public.

Hùng đổi số suất hằng ngày bằng cách sửa ô B2 tab `NoiDung`, không cần đụng code.

## Kiểm tra trước khi báo xong

Chạy `python3 -m http.server 4173` rồi kiểm ở **390 / 768 / 1440px**:
không tràn ngang, các dòng `data-pkg-row` thẳng hàng, accordion mở/đóng độc lập,
mọi vùng bấm ≥ 48px trên mobile, không lỗi console.

## Tài liệu khác

- `README.md` — hướng dẫn bảo trì cho Hùng
- `README-THIET-KE-GOC.md` — đặc tả thiết kế gốc, đầy đủ tokens và mọi hiệu ứng
- `HUONG-DAN-KET-NOI-FORM.md` — dựng Sheet + Telegram
- `DEPLOY.md` — đưa lên Hostinger
- `reference/` — bản thiết kế tham chiếu, **không phải code production**
