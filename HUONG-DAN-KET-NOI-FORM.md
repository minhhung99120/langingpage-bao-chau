# Nối trang với Google Sheet + Telegram

Một Google Sheet, một cầu nối Apps Script, làm cả ba việc:

1. **Nhận đăng ký** — khách điền form → một dòng mới trong Sheet
2. **Báo Telegram** — điện thoại anh kêu ngay khi có khách
3. **Đổi số suất còn lại** — sửa một ô trong Sheet, trang tự cập nhật

Làm một lần khoảng 20 phút. Làm đúng thứ tự.

---

## Sheet có để "Chỉ mình tôi" được không?

**Được. Và nên để như vậy.**

Đây là chỗ nhiều người hiểu nhầm nên cần nói rõ. Khi triển khai Apps Script, có hai thiết lập
riêng biệt và chúng không liên quan gì tới nhau:

| Thiết lập | Chọn gì | Nghĩa là |
|---|---|---|
| **Thực thi với tư cách** (Execute as) | **Tôi (Me)** | Script chạy bằng quyền của anh → nó đọc/ghi được Sheet riêng tư |
| **Ai có quyền truy cập** (Who has access) | **Bất kỳ ai (Anyone)** | Ai cũng **gọi được script**, nhưng **không ai nhìn thấy Sheet** |

Khách vào trang không hề chạm tới Google Sheet. Họ chỉ gọi tới script, script mới là thứ mở
Sheet — bằng quyền của anh. Sheet giữ nguyên **"Chỉ mình tôi"** từ đầu tới cuối.

Cách duy nhất làm lộ Sheet là tự tay bấm **Tệp → Chia sẻ → Xuất bản lên web**. **Đừng làm việc đó.**

> Vì Sheet riêng tư nên `SHEET_ID` nằm trong code công khai trên GitHub cũng vô hại —
> biết mã số mà không có quyền thì không mở được. Nhưng nếu sau này anh lỡ đổi Sheet sang
> "bất kỳ ai có đường liên kết", mã số đó lập tức thành đường vào. Cứ để riêng tư.

---

## Phần 1 — Tạo bot Telegram (5 phút)

Telegram **không gửi thông báo qua số điện thoại** được. Cần một con bot, nó sẽ nhắn tin cho anh.

1. Mở Telegram, tìm **@BotFather** (có dấu tích xanh), bấm **Start**.
2. Gửi: `/newbot`
3. Nó hỏi tên bot → gõ: `Bao Chau Lead`
4. Nó hỏi username → gõ tên kết thúc bằng `bot`, ví dụ: `baochau_lead_bot` (trùng thì thêm số).
5. BotFather trả về một dòng dài kiểu
   `8123456789:AAF3xk9_abcdEFGH-ijklMNOP12345678`
   → đây là **BOT TOKEN**. Copy giữ lại.
6. Bấm vào link bot vừa tạo, bấm **Start**, nhắn cho nó một chữ bất kỳ: `hi`
   → **bắt buộc**, không nhắn trước thì bot không được phép nhắn cho anh.
7. Lấy **CHAT ID**: mở trình duyệt, dán link này (thay `<TOKEN>`):
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
   Tìm đoạn `"chat":{"id":123456789` → số đó là **CHAT ID**.

> Muốn cả đội cùng nhận: tạo nhóm Telegram, thêm bot vào nhóm, nhắn một tin trong nhóm rồi
> làm lại bước 7. Chat id của nhóm là số âm (ví dụ `-1001234567890`), dùng số đó.

⚠️ **Bot token là mật khẩu.** Ai có nó thì điều khiển được bot. Chỉ dán vào Apps Script,
**tuyệt đối không** dán vào file trong thư mục dự án rồi push lên GitHub — repo đang để công khai.

---

## Phần 2 — Dựng cầu nối Apps Script (10 phút)

1. Mở Google Sheet của anh (hoặc tạo mới tại [sheets.new](https://sheets.new)).
   Nếu tạo mới: copy đoạn mã trong URL giữa `/d/` và `/edit` — đó là **SHEET ID**.
2. Menu **Tiện ích mở rộng → Apps Script**.
3. Xoá hết code mẫu, dán **toàn bộ nội dung file `apps-script-lead.gs`** vào.
4. Sửa 3 dòng cấu hình ở đầu:
   - `SHEET_ID` → mã Sheet của anh (kiểm tra lại cho chắc)
   - `TELEGRAM_BOT_TOKEN` → token ở Phần 1
   - `TELEGRAM_CHAT_ID` → chat id ở Phần 1
5. Bấm **Lưu**.
6. Chọn hàm **`chuanBiSheet`** ở ô dropdown → **Run**.
   Lần đầu Google hỏi quyền: **Review permissions → chọn tài khoản → Advanced →
   Go to … (unsafe) → Allow**.
   → Mở Sheet, phải thấy **2 tab mới**:

   **Tab `DangKy`** — khách đăng ký sẽ rơi vào đây:

   | Thời gian | Họ tên | Số điện thoại | Hạng bằng | Vị trí form | Trang | Nguồn truy cập |
   |---|---|---|---|---|---|---|

   **Tab `NoiDung`** — chỗ anh sửa số suất hằng ngày:

   |   | A | B |
   |---|---|---|
   | **1** | `khoa` | `gia_tri` |
   | **2** | `suat_con_lai` | `7` |
   | **3** | `tong_suat` | `20` |

7. Chọn hàm **`kiemTraGhi`** → **Run**.
   → Tab `DangKy` có dòng "Nguyễn Văn Test" **và** Telegram có một tin nhắn.
   Chưa thấy tin Telegram thì kiểm tra lại token, chat id, và đã bấm Start cho bot chưa.
8. Chọn hàm **`kiemTraDoc`** → **Run** → mở **Nhật ký thực thi (Execution log)**.
   → Phải in ra đại loại `{"suat_con_lai":7,"tong_suat":20}`.
9. Bấm **Triển khai (Deploy) → Tuỳ chọn triển khai mới (New deployment)**:
   - Loại: **Ứng dụng web (Web app)**
   - Thực thi với tư cách: **Tôi (Me)**
   - Ai có quyền truy cập: **Bất kỳ ai (Anyone)** ← sai chỗ này là form không gửi được
   - **Triển khai** → copy **URL ứng dụng web**, dạng
     `https://script.google.com/macros/s/AKfy…/exec`

---

## Phần 3 — Dán URL vào trang

Mở `js/noi-dung.js`, dán **cùng một URL** vào **cả hai dòng** ở đầu file:

```js
const URL_NHAN_DANG_KY   = "https://script.google.com/macros/s/AKfy…/exec";
const URL_NOI_DUNG_SHEET = "https://script.google.com/macros/s/AKfy…/exec";
```

Cùng một cầu nối phục vụ hai chiều: trang **gửi** đăng ký tới đó, và **đọc** số suất từ đó.

Rồi tăng số `?v=` ở 4 chỗ (xem README), push GitHub, deploy Hostinger.

**Kiểm tra thật:** mở trang, điền form bằng số của anh, bấm Đăng ký.
Trong ~2 giây phải có một dòng mới trong Sheet **và** một tin Telegram:

```
🔔 LEAD MỚI — BẢO CHÂU

👤 Nguyễn Văn A
📞 0912345678          ← bấm vào là gọi luôn
🚗 Quan tâm: B số tự động
📍 Form: Hero
🕒 31/08/2026 14:22:05
🌐 Nguồn: facebook.com
🎟 Còn lại: 7/20 suất
```

---

## Từ nay: đổi số suất

Mở Sheet trên điện thoại → tab **`NoiDung`** → sửa ô **B2** → xong.

Không push, không deploy, không lo cache.

**Bao lâu thì trang đổi theo?** Tối đa khoảng **6 phút** — script giữ đệm 1 phút, trang đọc lại
mỗi 5 phút. Muốn thấy ngay thì tải lại trang bằng `Cmd+Shift+R`.

### Gõ thế nào cho đúng

Bảng dưới là hành vi thật, đã đo trên trang chứ không phải suy đoán:

| Trong ô B2 ghi | Kết quả |
|---|---|
| `7` | ✅ hiện "Còn 7/20 suất" |
| `07` · `7 suất` · `7suất` · ` 7 ` | ✅ vẫn hiểu là **7** — trang tự bỏ phần thừa |
| `7.5` | ✅ hiểu là **7** (cắt phần thập phân) |
| `0` | ✅ hiện "Còn 0/20 suất" — dùng được khi hết suất |
| `còn 7` · `bảy` · `abc` | ⚠️ giữ số dự phòng |
| ô trống · xoá dòng `suat_con_lai` | ⚠️ giữ số dự phòng |
| `-3` · số lớn hơn tổng suất (vd `50`) | ⚠️ giữ số dự phòng |

**Mẹo nhớ:** bắt đầu bằng **chữ số** thì đọc được, bắt đầu bằng **chữ cái** thì không.

Chèn thêm dòng ở giữa bảng vô hại — trang tìm theo tên khoá ở cột A, không theo vị trí dòng.
Nhưng **đừng sửa chữ ở cột A**, và đừng gõ ngày tháng vào ô B2 (`20/7` sẽ bị hiểu thành 20 suất).

---

## Khi có trục trặc thì trang thế nào

**Trang không bao giờ vỡ.** Nếu không đọc được Sheet — mất mạng, Google lỗi, gõ sai ô, script
hỏng — trang lặng lẽ hiển thị số dự phòng ghi trong `js/noi-dung.js`:

```js
const UU_DAI = {
  conLai: 7,     // ← số dự phòng
```

Khách không thấy bất kỳ dấu hiệu trục trặc nào. Thỉnh thoảng anh cập nhật số này cho khỏi lệch
quá xa thực tế là đủ.

Với **form đăng ký** thì khác: nếu mạng khách lỗi lúc gửi, trang tự thử lại 1 lần; vẫn lỗi thì
lưu tạm trong máy khách và **anh sẽ không nhận được**. Trường hợp này hiếm nhưng có thật —
nên đừng bỏ hẳn kênh gọi điện và Zalo.

---

## Lưu ý vận hành

- **Không tốn phí**, không cần máy chủ riêng.
- **Về tải:** Google giới hạn Apps Script **30 lượt chạy đồng thời**. Trang đã giảm tải sẵn:
  script giữ đệm 60 giây, trang chỉ đọc lại mỗi 5 phút và **chỉ khi khách đang thực sự xem tab**.
  Với lưu lượng của một trung tâm ở Hà Nội thì còn xa mới chạm trần.
- **Mỗi lần sửa code trong Apps Script**, phải vào **Deploy → Manage deployments → Edit →
  Version: New version → Deploy**. Nếu bấm "New deployment" sẽ ra **URL mới** còn URL cũ vẫn
  chạy code cũ — đây là cái bẫy hay gặp nhất, sửa mãi không thấy gì đổi.
- Cột **"Vị trí form"** cho biết khách điền ở đầu trang (Hero) hay cuối trang — biết chỗ nào
  ra lead tốt hơn để tối ưu.
- Cột **"Nguồn truy cập"** cho biết khách đến từ Facebook, Google hay vào thẳng.
- **Sao lưu:** thỉnh thoảng **Tệp → Tải xuống → Excel** một bản để dành.
