# Landing page Bảo Châu

Trang tĩnh thuần HTML + CSS + JS. **Không có bước build**, không dùng framework, không thư viện ngoài —
Hostinger cứ upload lên là chạy.

---

## Xem thử trên máy

Mở terminal ngay trong thư mục này rồi chạy một trong hai cách:

```bash
npx serve
```

```bash
python3 -m http.server 4173
```

Rồi mở địa chỉ mà nó in ra (thường `http://localhost:3000` hoặc `http://localhost:4173`).

> Đừng mở thẳng `index.html` bằng cách bấm đúp vào file. Trình duyệt sẽ chặn việc nạp
> `js/noi-dung.js` và trang sẽ trống phần bảng giá, lộ trình, câu hỏi.

---

## Cấu trúc file

```
index.html                — trang chủ, chia bằng comment <!-- KHỐI n: ... -->
chinh-sach-bao-mat.html   — trang chính sách bảo mật (bắt buộc để duyệt quảng cáo)
css/styles.css            — toàn bộ giao diện, biến màu ở :root
js/noi-dung.js            — ⭐ TOÀN BỘ NỘI DUNG: giá, câu hỏi, lộ trình, hotline…
js/app.js                 — hiệu ứng và xử lý, không chứa nội dung
img/                      — ảnh và logo
```

**Quy tắc chung: muốn sửa chữ hay số thì mở `js/noi-dung.js`.** Gần như không bao giờ phải đụng tới
`index.html` hay `js/app.js`.

---

## Việc hay làm nhất

### 1. Sửa giá / số giờ / số km

Mở `js/noi-dung.js`, tìm mục **`6. BẢNG GIÁ`**. Mỗi hạng bằng là một khối, mỗi gói là một object:

```js
{
  ma: "A1", ten: "Tiết kiệm",
  gia: "16.000.000đ",          // ← sửa giá ở đây
  gioHoc: "20 giờ",            // ← sửa số giờ thực hành
  dongTruoc: "5.000.000đ",     // ← sửa tiền đóng trước
  chiTiet: { ... }             // ← nội dung phần "Chi tiết gói"
}
```

Số km DAT nằm trong dòng `r7` của từng gói:

```js
r7: chayDat("Đủ 710km hạng B số tự động – 14h học", "Chạy cao tốc + đường tỉnh lộ + ...")
```

Tham số thứ hai là dòng loại đường (tô đỏ). Truyền `null` nếu gói đó không có.

> ⚠️ Giá, số giờ và số km là **số thật đã chốt**. Đừng sửa khi chưa hỏi chủ trung tâm.
> Lệ phí thi sát hạch **645.000đ** luôn phải ghi rõ là nộp cho đơn vị tổ chức thi,
> Bảo Châu không thu.

**Bỏ bớt một mục trong gói:** xoá dòng đó khỏi `chiTiet`. Trang tự hiện dấu `–` căn giữa
để các thẻ vẫn thẳng hàng khi so sánh.

**Thêm một mục mới cho mọi gói:** thêm khoá mới (ví dụ `r15`) vào `chiTiet` của các gói,
rồi thêm `"r15"` vào mảng `hangMuc` của hạng bằng đó — `hangMuc` quyết định thứ tự các dòng.

### 2. Đổi số suất còn lại

`js/noi-dung.js`, mục **`3. ƯU ĐÃI`**:

```js
const UU_DAI = {
  conLai: 7,     // ← đổi số này
  tong: 20,
  ...
};
```

Một chỗ duy nhất, cả 4 vị trí trên trang (Hero, Học phí, Banner giữa trang, CTA cuối) tự cập nhật.

### 3. Thêm / sửa câu hỏi thường gặp

`js/noi-dung.js`, mục **`8. CÂU HỎI THƯỜNG GẶP`**. Thêm một object:

```js
{ hoi: "Câu hỏi của khách?", dap: "Câu trả lời." },
```

> ⚠️ Thứ tự 10 câu hiện tại được xếp theo mạch quan tâm của người mới tìm hiểu:
> câu 1–3 *"tôi có học được không"* → câu 4–6 *nhóm tiền* → câu 7–9 *chi tiết vận hành*
> → câu 10 *đẩy sang đăng ký*. **Chèn câu mới vào đúng nhóm, đừng thêm vào cuối danh sách.**

### 4. Sửa hotline, email, địa chỉ, link Facebook/YouTube

`js/noi-dung.js`, mục **`2. THÔNG TIN LIÊN HỆ`**. Sửa xong là mọi chỗ trên trang đổi theo.

```js
hotline: "0378.999.120",     // dạng hiển thị
hotlineSo: "0378999120",     // dùng cho nút gọi và link Zalo — nhớ sửa cả hai
```

> Riêng số điện thoại trong khối JSON-LD ở đầu `index.html` (phần SEO cho Google)
> nằm trong HTML, sửa hotline thì sửa luôn dòng `"telephone"` ở đó.

### 5. Thay ảnh

Chép ảnh mới vào thư mục `img/`, rồi trỏ lại đường dẫn:

| Ảnh | Sửa ở đâu |
|---|---|
| 3 ảnh trượt ở Hero | `js/noi-dung.js` → `ANH_HERO` |
| Ảnh xe cuối mỗi tab học phí | `js/noi-dung.js` → `BANG_GIA` → `anh` |
| 4 ảnh lộ trình | `js/noi-dung.js` → `LO_TRINH` → `anh` |
| 3 ảnh khối "3 Không", ảnh hợp đồng, ảnh nền CTA cuối | `index.html` |

Nhớ sửa cả chữ `alt` — đó là phần mô tả ảnh cho Google và cho người dùng trình đọc màn hình.

Ảnh nên nén xuống dưới ~200KB trước khi dùng. Trên máy Mac:

```bash
sips -Z 1500 -s format jpeg -s formatOptions 60 anh-goc.jpg --out img/ten-moi.jpg
```

> ⚠️ `khoi5-xe-vios-so-san.jpg` là ảnh **cần số sàn** (tab B số sàn),
> `khoi5-xe-kia-k250.jpg` là ảnh **xe tải sát hạch** (tab C1) — đừng đổi chỗ.

### 6. Đổi màu / cỡ chữ

`css/styles.css`, phần `:root` ở đầu file chứa toàn bộ biến màu và bo góc.

> ⚠️ `line-height` của H1/H2 phải ≥ `1.3` và có `padding-top: 0.08em`.
> Chặt hơn sẽ **cắt mất dấu tiếng Việt** (Ở, Ầ, Ố) vì tiêu đề dùng gradient chữ.

---

## Nối form đăng ký với Google Sheet

Form hiện **chưa nối** — bấm Đăng ký vẫn hiện màn hình cảm ơn nhưng không có dữ liệu chảy về đâu.

Để nối:

1. Làm theo `HUONG-DAN-KET-NOI-FORM.md` (dựng Google Apps Script từ `apps-script-lead.gs`,
   ghi Google Sheet + báo Telegram). **Không cần viết lại code backend**, đã có sẵn.
2. Copy URL Web App nhận được, dán vào dòng đầu `js/noi-dung.js`:

```js
const URL_NHAN_DANG_KY = "https://script.google.com/macros/s/..../exec";
```

Xong. Trang gửi `{hoTen, soDienThoai, hangBang, viTri, trang, nguon, thoiGian}`, trong đó
`viTri` là `"Hero"` hoặc `"Cuối trang"` để biết form nào ra khách tốt hơn.

Nếu mạng lỗi, trang tự thử lại 1 lần; vẫn lỗi thì lưu tạm vào `localStorage`
(khoá `bc_lead_loi_<thời điểm>`) và vẫn báo thành công cho khách.

**Tuỳ chọn — lấy số suất còn lại tự động:** nếu có API trả về JSON dạng `{"suatConLai": 7}`,
dán URL vào `URL_API_SUAT` ở ngay dưới. Trang gọi lại mỗi 60 giây; API lỗi thì hiện
"Liên hệ để kiểm tra".

---

## Trước khi đưa lên hosting

- [ ] Đã dán `URL_NHAN_DANG_KY` và thử gửi một đơn thật, kiểm tra Google Sheet có dòng mới.
- [ ] **Khai `canonical`**: mở `index.html`, tìm khối chú thích ngay dưới thẻ `<title>`,
      thay `ten-mien-cua-ban.vn` bằng tên miền thật rồi bỏ dấu chú thích cho thẻ hoạt động.
      Hiện đang cố tình để trống — khai trỏ sang tên miền chưa tồn tại có thể làm
      Google không index trang thật.
- [ ] Mở `ten-mien/robots.txt` xem có hiển thị không, rồi bỏ dấu `#` ở dòng `Sitemap:` nếu có sitemap.
- [ ] Xem lại trang trên điện thoại thật, không chỉ thu nhỏ cửa sổ trình duyệt.
- [ ] `chinh-sach-bao-mat.html` phải truy cập được — Facebook và Google bắt buộc có
      trang này mới duyệt quảng cáo.

Các bước đưa lên Hostinger nằm ở `DEPLOY.md`.

---

## Ghi chú kỹ thuật (cho người sửa code)

Ba chỗ dễ làm hỏng nếu sửa ẩu:

1. **`.trang` phải dùng `overflow-x: clip`**, không được đổi sang `overflow-x: hidden` —
   header sticky sẽ mất tác dụng.
2. **Ảnh trong lộ trình**: desktop `position: sticky; top: 96px`, mobile `position: relative; top: auto`.
   Giữ `top: 96px` khi đang `relative` sẽ làm ảnh đè lên chữ.
3. **Cân hàng ngang bảng giá**: các dòng cần so sánh mang `data-pkg-row="..."`, thùng chứa mang
   `data-pkg-grid`. Hàm `canHangGoi()` trong `js/app.js` gom các dòng cùng khoá rồi set chiều cao
   bằng nhau. Nó chạy lại khi: dựng trang, đổi tab, đổi cỡ cửa sổ, và khi font tải xong.
   Thêm dòng mới vào thẻ gói thì nhớ gắn `data-pkg-row`.

Chỉ có **một ngưỡng mobile duy nhất: `max-width: 760px`**. Phần còn lại co giãn bằng
`clamp()` và `repeat(auto-fit, minmax(...))` — đừng thêm breakpoint mới.

---

## Các file gốc của bộ handoff

- `README-THIET-KE-GOC.md` — bản đặc tả thiết kế đầy đủ (tokens, từng khối, mọi hiệu ứng, ranh giới nội dung).
- `reference/` — bản thiết kế chạy được, dùng để đối chiếu. **Không phải code của trang này.**
- `PROMPT-CLAUDE-CODE.md`, `DEPLOY.md`, `HUONG-DAN-KET-NOI-FORM.md`, `apps-script-lead.gs`.

Khi đưa lên hosting chỉ cần upload: `index.html`, `chinh-sach-bao-mat.html`, `css/`, `js/`, `img/`.
