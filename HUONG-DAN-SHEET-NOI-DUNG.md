# Sửa số suất còn lại bằng Google Sheet

Mục đích: đổi số suất **trên điện thoại, trong 10 giây**, không phải mở code, không push GitHub,
không deploy lại Hostinger.

Làm một lần mất khoảng 10 phút. Sau đó mãi mãi chỉ là sửa một ô trong Sheet.

---

## Vì sao dùng Sheet xuất bản CSV, không dùng Apps Script

Trang này có hai việc phải nói chuyện với Google, và chúng dùng hai cơ chế khác nhau:

| Việc | Dùng gì | Vì sao |
|---|---|---|
| **Nhận đăng ký** (ghi vào Sheet) | Apps Script | Mỗi khách chỉ gọi 1 lần khi bấm nút → không bao giờ quá tải |
| **Đọc số suất** (lấy từ Sheet) | Sheet xuất bản CSV | Mọi khách vào trang đều gọi → cần thứ chịu tải tốt |

Google giới hạn Apps Script **30 lượt chạy đồng thời**, và không công bố hạn mức lượt gọi mỗi ngày
cho tài khoản Gmail thường. Đặt nó vào đường đi chính của trang đang chạy quảng cáo là rủi ro.
Bản CSV xuất bản do `docs.google.com` phục vụ, sinh ra để nhiều người đọc cùng lúc.

**Đánh đổi:** Google giữ đệm bản CSV khoảng **5 phút**. Sửa số xong, chờ tối đa 5 phút mới thấy
trên trang. Với con số đổi mỗi ngày một lần thì không thành vấn đề.

---

## BƯỚC 1 — Tạo Sheet

Vào [sheets.new](https://sheets.new), đặt tên `Bảo Châu — Nội dung trang`.

Gõ đúng **3 dòng, 2 cột** này vào trang tính đầu tiên:

|   | A | B |
|---|---|---|
| **1** | `khoa` | `gia_tri` |
| **2** | `suat_con_lai` | `7` |
| **3** | `tong_suat` | `20` |

Lưu ý:
- Dòng 1 là tiêu đề, **giữ nguyên chữ `khoa` và `gia_tri`**, đừng dịch, đừng đổi.
- Cột A là tên khoá, **không được sửa**. Trang tìm đúng chữ `suat_con_lai` để lấy số.
- Cột B là chỗ anh sửa hằng ngày.

---

## BƯỚC 2 — Xuất bản lên web

Trong Sheet: **Tệp → Chia sẻ → Xuất bản lên web**

1. Ô bên trái: chọn **trang tính chứa bảng trên** (đừng để "Toàn bộ tài liệu")
2. Ô bên phải: đổi từ "Trang web" sang **Giá trị được phân tách bằng dấu phẩy (.csv)**
3. Bấm **Xuất bản** → **OK**
4. Copy đường link hiện ra, dạng:

```
https://docs.google.com/spreadsheets/d/e/2PACX-1vT.../pub?gid=0&single=true&output=csv
```

> Đây **không phải** link chia sẻ Sheet thông thường. Link đúng luôn có `/pub?` và `output=csv`.
> Nếu link của anh chứa `/edit#gid=` thì là link sai — quay lại làm đúng mục "Xuất bản lên web".

**Về quyền riêng tư:** xuất bản nghĩa là ai có link đều đọc được nội dung trang tính đó.
Vì vậy **chỉ để số suất trong Sheet này**, đừng để danh sách học viên hay số điện thoại.
Sheet nhận đăng ký phải là một file khác, không xuất bản.

---

## BƯỚC 3 — Dán vào code

Mở `js/noi-dung.js`, dòng gần đầu file:

```js
const URL_NOI_DUNG_SHEET = "";
```

Dán link vừa copy vào giữa hai dấu nháy:

```js
const URL_NOI_DUNG_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv";
```

Rồi tăng số `?v=` ở 4 chỗ trong `index.html` và `chinh-sach-bao-mat.html` (xem README),
push GitHub, deploy Hostinger. **Đây là lần cuối anh phải làm chuỗi thao tác này cho việc đổi số suất.**

---

## Từ nay: đổi số suất

Mở Sheet trên điện thoại, sửa ô B2, xong. Trang tự cập nhật trong vòng 5 phút,
cả 4 chỗ hiển thị cùng đổi số kèm hiệu ứng mờ dần.

Không push, không deploy, không lo cache.

---

## Khi Sheet trục trặc thì sao

Trang **không bao giờ vỡ**. Nếu không đọc được Sheet — mất mạng, Google lỗi, gõ sai ô,
sửa nhầm quyền — trang lặng lẽ hiển thị con số dự phòng ghi trong `js/noi-dung.js`:

```js
const UU_DAI = {
  conLai: 7,     // ← số dự phòng
```

Khách không thấy bất kỳ dấu hiệu trục trặc nào. Thỉnh thoảng anh cập nhật số này cho khỏi
lệch quá xa so với thực tế là đủ.

Những trường hợp trang bỏ qua dữ liệu Sheet và giữ số dự phòng:

Bảng dưới là hành vi thật, đã đo trên trang chứ không phải suy đoán:

| Trong Sheet ghi | Kết quả |
|---|---|
| `7` | ✅ hiện "Còn 7/20 suất" |
| `07` · `7 suất` · `7suất` · ` 7 ` | ✅ vẫn hiểu là **7** — trang tự bỏ phần thừa |
| `7.5` | ✅ hiểu là **7** (cắt phần thập phân) |
| `0` | ✅ hiện "Còn 0/20 suất" — dùng được khi hết suất |
| `còn 7` · `bảy` · `abc` | ⚠️ giữ số dự phòng |
| ô trống · xoá dòng `suat_con_lai` | ⚠️ giữ số dự phòng |
| `-3` · số lớn hơn tổng suất (vd `50`) | ⚠️ giữ số dự phòng |

**Mẹo nhớ:** bắt đầu bằng **chữ số** thì trang đọc được, bắt đầu bằng **chữ cái** thì không.

Chèn thêm dòng ở giữa bảng vô hại — trang tìm theo tên khoá ở cột A, không theo vị trí dòng.

⚠️ Một trường hợp cần tránh: gõ ngày tháng vào ô đó. `20/7` sẽ bị hiểu thành **20 suất**.

---

## Kiểm tra sau khi dựng

1. Mở thẳng link CSV trên trình duyệt — phải tải về hoặc hiện ra mấy dòng chữ dạng
   `suat_con_lai,7`. Nếu hiện trang đăng nhập Google là chưa xuất bản đúng.
2. Vào trang, sửa ô B2 thành số khác, chờ 5 phút rồi tải lại trang xem đã đổi chưa.
3. Thử gõ bậy vào ô B2 (ví dụ `abc`), tải lại trang — phải thấy số dự phòng, trang không vỡ.
