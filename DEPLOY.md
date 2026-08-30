# Hướng dẫn deploy landing page Bảo Châu lên Hostinger

Thứ tự: **máy tính → GitHub → Hostinger**. Làm một lần đầu mất khoảng 45–60 phút, từ lần sau mỗi lần sửa chỉ còn 2 câu lệnh.

---

## BƯỚC 1 — Cài Node.js

1. Vào `nodejs.org`, tải bản **LTS** cho hệ điều hành của anh, cài như phần mềm thường.
2. Mở **Terminal** (macOS) hoặc **PowerShell** (Windows), kiểm tra:
   ```bash
   node -v
   npm -v
   ```
   Hiện ra 2 dãy số là xong. Nếu báo "command not found" thì đóng hẳn terminal, mở lại.

## BƯỚC 2 — Cài Git và Claude Code

```bash
# Git: macOS có sẵn, Windows tải ở git-scm.com
git --version

# Claude Code
npm install -g @anthropic-ai/claude-code
claude --version
```

Khai báo tên và email cho Git (chỉ làm một lần):
```bash
git config --global user.name "Tên của anh"
git config --global user.email "email@cua-anh.com"
```

## BƯỚC 3 — Tạo thư mục dự án và giải nén bộ handoff

```bash
mkdir ~/landing-baochau
cd ~/landing-baochau
```

Giải nén file zip handoff vào đúng thư mục này. Sau khi giải nén, trong `~/landing-baochau` phải có:
`README.md`, `PROMPT-CLAUDE-CODE.md`, `DEPLOY.md`, `HUONG-DAN-KET-NOI-FORM.md`, `apps-script-lead.gs`, `img/`, `reference/`.

Mở thử `reference/Landing Page Bao Chau.dc.html` bằng trình duyệt — đây là bản thiết kế chạy thật, dùng để so sánh trong lúc dựng lại.

## BƯỚC 4 — Để Claude Code dựng trang tĩnh

```bash
cd ~/landing-baochau
claude
```

Mở `PROMPT-CLAUDE-CODE.md`, copy toàn bộ phần dưới dấu `---` và dán vào Claude Code, Enter.

Claude Code sẽ tạo `index.html`, `chinh-sach-bao-mat.html`, `css/`, `js/`. Khi nó xong, xem thử:
```bash
npx serve
```
Mở địa chỉ nó in ra (thường `http://localhost:3000`). Kiểm tra 6 việc:
- Thu nhỏ cửa sổ tới cỡ điện thoại — không được có thanh cuộn ngang.
- Bấm thử 3 tab học phí, vuốt ngăn xếp 3 ảnh ở Hero, mở/đóng vài câu FAQ.
- **Bảng giá**: bấm "Chi tiết gói" ở từng thẻ — mở gói này không được đóng gói kia; mở cả 3 gói cùng lúc thì các dòng bên trong phải **thẳng hàng ngang** với nhau.
- Đổi tab học phí rồi mở lại chi tiết — hàng vẫn phải thẳng (nếu lệch là hàm cân chiều cao chưa chạy lại sau khi đổi tab).
- Điền form bằng số điện thoại thật của anh — phải thấy nút "Đang gửi…" rồi ra màn hình cảm ơn.
- Mở `chinh-sach-bao-mat.html` — vào được từ link ở footer và có nút về trang chủ.
- Cuộn nhanh xuống cuối rồi cuộn lên — không khối nào bị mất chữ.

Có chỗ nào lệch so với bản `reference/`, nói thẳng với Claude Code, ví dụ: *"Bảng giá trên mobile không cuộn ngang được, sửa lại theo README"*. Nhấn `Ctrl+C` để thoát.

## BƯỚC 5 — Đẩy code lên GitHub

1. Vào `github.com`, **New repository**, tên `landing-baochau`, chọn **Private**, **không** tích thêm README hay .gitignore, bấm Create.
2. Ở terminal, trong `~/landing-baochau`:

```bash
# bỏ bộ thiết kế tham chiếu ra khỏi repo cho gọn (tuỳ ý, giữ lại cũng không sao)
echo "reference/" > .gitignore
echo "node_modules/" >> .gitignore

git init
git add .
git commit -m "Landing page Bao Chau - ban dau"
git branch -M main
git remote add origin https://github.com/TEN-GITHUB-CUA-ANH/landing-baochau.git
git push -u origin main
```

GitHub sẽ hỏi đăng nhập. Nếu nó đòi mật khẩu, dùng **Personal Access Token**: GitHub → ảnh đại diện → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → tích quyền `repo` → copy dãy ký tự và dán vào chỗ hỏi mật khẩu.

Vào lại trang repo trên GitHub, thấy đủ file là xong.

## BƯỚC 6 — Trỏ tên miền và deploy trên Hostinger

### 6.1 Trỏ tên miền (nếu tên miền không mua ở Hostinger)
Trong hPanel Hostinger, vào **Websites → chọn site → Dashboard**, tìm 2 dòng **nameserver** (dạng `ns1.dns-parking.com`). Vào nơi anh mua tên miền, thay nameserver bằng 2 dòng đó. Chờ 1–24 giờ để lan truyền.

### 6.2 Cách A — Deploy tự động bằng Git (khuyến nghị)
1. hPanel → **Websites → Dashboard → Advanced → GIT**.
2. **Repository**: `https://github.com/TEN-GITHUB-CUA-ANH/landing-baochau.git` · **Branch**: `main` · **Directory**: để trống (nghĩa là `public_html`).
3. Repo private thì Hostinger sẽ hiện một **SSH key** — copy nó, vào GitHub repo → **Settings → Deploy keys → Add deploy key**, dán vào, lưu. Quay lại Hostinger bấm **Create**.
4. Bấm **Deploy** (hoặc bật **Auto deployment** rồi copy Webhook URL, dán vào GitHub repo → Settings → Webhooks → Add webhook, Content type `application/json`).

Mở tên miền — trang đã lên.

### 6.3 Cách B — Upload tay (nếu không dùng Git)
hPanel → **File Manager** → vào `public_html` → xoá file `default.php` nếu có → kéo thả `index.html`, `css/`, `js/`, `img/` vào. Xong.

### 6.4 Bật HTTPS
hPanel → **Security → SSL** → cấp chứng chỉ miễn phí cho tên miền → bật **Force HTTPS**.

---

## Từ lần sau, mỗi khi muốn sửa trang

```bash
cd ~/landing-baochau
claude          # nói việc cần sửa, ví dụ: "đổi giá gói Tiêu chuẩn B số sàn thành 18.500.000đ"
npx serve       # xem thử
# hài lòng thì:
git add .
git commit -m "Cap nhat gia goi Tieu chuan"
git push
```

Nếu đã bật Auto deployment ở bước 6.2 thì `git push` là trang tự cập nhật. Nếu không, vào hPanel → GIT → bấm **Deploy**.

**Sửa nhanh không cần Claude Code:** mở `js/noi-dung.js` bằng bất kỳ trình soạn thảo (khuyên dùng VS Code) — giá gói, nội dung chi tiết từng gói, số suất còn lại, hotline, 10 câu FAQ đều nằm trong file đó, sửa xong `git add . && git commit -m "..." && git push`.

**Thay ảnh:** đặt ảnh mới vào `img/` **trùng tên file cũ** là xong, không cần sửa code. Ảnh nên xuất ngang ≤1600px và nén dưới 150KB (dùng `squoosh.app`).

---

## Vài lỗi hay gặp

| Hiện tượng | Nguyên nhân và cách xử lý |
|---|---|
| Mở tên miền ra trang mặc định của Hostinger | Còn file `default.php` trong `public_html`, xoá đi. |
| Trang lên nhưng không có ảnh | Thư mục `img/` chưa được đẩy lên, hoặc tên file sai chữ hoa/thường (Linux phân biệt). |
| `git push` báo `rejected` | Có thay đổi trên GitHub chưa lấy về: chạy `git pull --rebase` rồi push lại. |
| Sửa xong nhưng trang cũ vẫn hiện | Cache trình duyệt: `Ctrl+Shift+R` (macOS `Cmd+Shift+R`). |
| Trang bị cuộn ngang trên điện thoại | Có phần tử vượt khung: nói Claude Code *"tìm phần tử gây tràn ngang ở mobile và sửa"*. |
| Các dòng trong bảng giá không thẳng hàng | Hàm cân chiều cao chưa chạy lại: nói Claude Code *"gọi lại hàm cân hàng bảng giá sau khi đổi tab, sau resize và sau document.fonts.ready"*. |
| Điền form xong mà Sheet không có dòng mới | Chưa dán URL Web App, hoặc deploy Apps Script chọn sai quyền truy cập — phải là **Anyone**. Xem lại `HUONG-DAN-KET-NOI-FORM.md` Phần 2. |
| Font chữ không đúng | Thiếu link Google Fonts trong `<head>`, hoặc mạng chặn — có thể tải font về `css/fonts/`. |

## Nên làm sau khi trang đã chạy
1. **Nối form vào Google Sheet + Telegram** — làm theo `HUONG-DAN-KET-NOI-FORM.md` (code backend đã viết sẵn ở `apps-script-lead.gs`). Chưa nối thì đăng ký của khách **không lưu ở đâu cả** — việc này quan trọng nhất, làm trước khi chạy quảng cáo.
2. **Cắm Google Analytics 4 và Meta Pixel** để đo chuyển đổi khi chạy quảng cáo. Nhớ khai báo trang `chinh-sach-bao-mat.html` trong tài khoản quảng cáo — Facebook và Google đều đòi link chính sách bảo mật.
3. **Google Search Console** — thêm tên miền, gửi sitemap.
4. Sao lưu: repo GitHub đã là bản sao lưu, thêm hPanel → Backups để chắc.
