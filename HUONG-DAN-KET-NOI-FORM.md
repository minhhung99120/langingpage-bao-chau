# Kết nối form đăng ký → Google Sheet + Telegram

Làm một lần, khoảng 15 phút. Làm đúng thứ tự.

---

## Phần 1 — Tạo bot Telegram (5 phút)

Telegram **không gửi thông báo qua số điện thoại** được. Cần một con bot, nó sẽ nhắn tin cho anh.

1. Mở Telegram, tìm **@BotFather** (có dấu tích xanh), bấm **Start**.
2. Gửi: `/newbot`
3. Nó hỏi tên bot → gõ: `Bao Chau Lead`
4. Nó hỏi username → gõ tên kết thúc bằng `bot`, ví dụ: `baochau_lead_bot` (nếu trùng thì thêm số).
5. BotFather trả về một dòng dài kiểu:
   `8123456789:AAF3xk9_abcdEFGH-ijklMNOP12345678`
   → Đây là **BOT TOKEN**. Copy giữ lại.
6. Bấm vào link bot vừa tạo (BotFather có gửi kèm), bấm **Start** và nhắn cho nó một chữ bất kỳ: `hi`
   → Bước này bắt buộc, không nhắn trước thì bot không được phép nhắn cho anh.
7. Lấy **CHAT ID**: mở trình duyệt, dán link này (thay `<TOKEN>` bằng token ở bước 5):
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
   Tìm đoạn `"chat":{"id":123456789` → số `123456789` là **CHAT ID**. Copy giữ lại.

> Muốn cả đội nhận thông báo: tạo một nhóm Telegram, thêm bot vào nhóm, nhắn một tin trong nhóm rồi làm lại bước 7 — chat id của nhóm là số âm (ví dụ `-1001234567890`), dùng số đó.

---

## Phần 2 — Dựng cầu nối Google Apps Script (7 phút)

1. Mở Google Sheet của anh:
   https://docs.google.com/spreadsheets/d/14_qwBs78s0vwufR4RnLPnTzzJyIpLIw1dL1gGl6LhWs/edit
2. Menu **Tiện ích mở rộng → Apps Script**.
3. Xoá hết code mẫu trong ô soạn thảo, dán **toàn bộ nội dung file `apps-script-lead.gs`** vào.
4. Sửa 2 dòng đầu:
   - `TELEGRAM_BOT_TOKEN` → dán token ở Phần 1
   - `TELEGRAM_CHAT_ID` → dán chat id ở Phần 1
   (`SHEET_ID` đã điền sẵn đúng sheet của anh.)
5. Bấm **Lưu** (hình đĩa mềm).
6. Chọn hàm `kiemTra` ở ô dropdown rồi bấm **Run**. Lần đầu Google hỏi quyền:
   **Review permissions → chọn tài khoản → Advanced → Go to … (unsafe) → Allow**.
   → Kiểm tra: Sheet có 1 dòng "Nguyễn Văn Test" và Telegram có 1 tin nhắn. Nếu chưa có tin Telegram, kiểm tra lại token/chat id và đã bấm Start cho bot chưa.
7. Bấm **Triển khai (Deploy) → Tuỳ chọn triển khai mới (New deployment)**:
   - Loại: **Ứng dụng web (Web app)**
   - Thực thi với tư cách (Execute as): **Tôi (Me)**
   - Ai có quyền truy cập (Who has access): **Bất kỳ ai (Anyone)** ← quan trọng, sai chỗ này là form không gửi được
   - Bấm **Triển khai**, copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/AKfy…/exec`)
8. Gửi URL đó cho tôi (hoặc tự dán: mở `Landing Page Bao Chau.dc.html`, tìm dòng `LEAD_API_URL = "";` và dán URL vào giữa hai dấu ngoặc kép).

---

## Phần 3 — Kiểm tra thật

Mở landing page, điền form bằng số điện thoại của anh, bấm Đăng ký.
Trong ~2 giây phải có: một dòng mới trong Sheet **và** một tin Telegram.

Nội dung tin Telegram:

```
🔔 LEAD MỚI — BẢO CHÂU

👤 Nguyễn Văn A
📞 0912345678          ← bấm vào là gọi luôn
🚗 Quan tâm: B số tự động
📍 Form: Hero
🕒 31/08/2026 14:22:05
🌐 Nguồn: facebook.com
```

---

## Lưu ý

- **Không cần trả phí**, không cần server. Apps Script cho phép ~20.000 lượt gửi/ngày — quá đủ.
- Cột "Vị trí form" cho biết khách điền ở form đầu trang (Hero) hay cuối trang — biết chỗ nào ra lead tốt hơn.
- Cột "Nguồn truy cập" cho biết khách đến từ Facebook, Google hay vào trực tiếp.
- Nếu mạng của khách lỗi lúc gửi, hệ thống tự thử lại 1 lần; vẫn lỗi thì lưu tạm trong máy khách và **anh sẽ không nhận được** — trường hợp này rất hiếm.
- Mỗi lần sửa code trong Apps Script, phải **Deploy → Manage deployments → Edit → Version: New version → Deploy** để bản mới có hiệu lực.
- Muốn thêm người nhận thông báo: dùng chat id của nhóm Telegram (xem ghi chú ở Phần 1).

## Số điện thoại anh gửi

Anh ghi số Telegram là **0379999120** (10 số), khác hotline **0378.999.120** một chữ số. Dù sao Telegram cũng không dùng số điện thoại để gửi thông báo được nên không ảnh hưởng — chỉ cần chat id ở Phần 1.
