/* ============================================================
   BẢO CHÂU — ĐO LƯỜNG QUẢNG CÁO
   js/theo-doi.js

   Nạp trong <head>, chạy trước nội dung trang.

   ⚠ ĐỂ TRỐNG ID THÌ FILE NÀY KHÔNG LÀM GÌ CẢ — không gọi ra ngoài,
   không đặt cookie, không gửi dữ liệu đi đâu. Điền ID vào là bật.
   ============================================================ */

/* ------------------------------------------------------------
   DÁN PIXEL ID VÀO ĐÂY
   Lấy ở Meta Events Manager, là dãy 15–16 chữ số.
   Cách lấy: xem HUONG-DAN-FACEBOOK-PIXEL.md
------------------------------------------------------------ */
var FACEBOOK_PIXEL_ID = "922199400952564";


(function () {
  "use strict";

  /* Hàm gửi sự kiện. Luôn tồn tại, kể cả khi chưa bật Pixel — nhờ vậy
     js/app.js cứ gọi thoải mái mà không cần kiểm tra gì. */
  window.bcSuKien = function () {};

  if (!FACEBOOK_PIXEL_ID) return;   // chưa điền ID: dừng hẳn tại đây

  /* Đoạn khởi tạo chuẩn của Meta */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  fbq("init", FACEBOOK_PIXEL_ID);
  fbq("track", "PageView");

  /* ⚠ TUYỆT ĐỐI KHÔNG gửi họ tên hay số điện thoại sang Facebook.
     Trang chính sách bảo mật đã cam kết với khách: các công cụ đo lường
     "ghi nhận hành vi ở dạng ẩn danh, không kèm tên hay số điện thoại".
     Chỉ được gửi: khách điền form nào, quan tâm hạng bằng nào. */
  window.bcSuKien = function (ten, thamSo) {
    try { fbq("track", ten, thamSo || {}); } catch (e) {}
  };
})();
