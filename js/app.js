/* ============================================================
   BẢO CHÂU — LOGIC TRANG
   js/app.js
   Toàn bộ nội dung lấy từ js/noi-dung.js — file này chỉ lo dựng và chạy.
   ============================================================ */
(function () {
  "use strict";

  var MOBILE = "(max-width: 760px)";
  var giamChuyenDong = window.matchMedia("(prefers-reduced-motion: reduce)");

  function $(sel, goc) { return (goc || document).querySelector(sel); }
  function $$(sel, goc) { return Array.prototype.slice.call((goc || document).querySelectorAll(sel)); }

  /* ==========================================================
     1. ĐỒNG BỘ THÔNG TIN LIÊN HỆ TỪ noi-dung.js
     ========================================================== */
  function dongBoLienHe() {
    var tel = "tel:" + THONG_TIN.hotlineSo;
    var zalo = "https://zalo.me/" + THONG_TIN.hotlineSo;
    $$("[data-bc]").forEach(function (el) {
      switch (el.getAttribute("data-bc")) {
        case "hotline":     el.textContent = THONG_TIN.hotline; break;
        case "hotline-nut": el.textContent = "Gọi " + THONG_TIN.hotline; break;
        case "tel":         el.href = tel; break;
        case "zalo":        el.href = zalo; break;
        case "email":       el.href = "mailto:" + THONG_TIN.email; el.textContent = THONG_TIN.email; break;
        case "dia-chi":     el.textContent = THONG_TIN.diaChi; break;
        case "gio":         el.textContent = THONG_TIN.gioLamViec; break;
        case "ten-day-du":  el.textContent = THONG_TIN.tenDayDu; break;
        case "facebook":    el.href = THONG_TIN.facebook; break;
        case "youtube":     el.href = THONG_TIN.youtube; break;
      }
    });
  }

  /* ==========================================================
     2. SỐ SUẤT CÒN LẠI — MỘT NGUỒN, HIỂN THỊ Ở 4 CHỖ
     Hero · Khối 5 · Khối 6.5 · Khối 8. Đổi số thì cả 4 chỗ crossfade.
     ========================================================== */
  var khoaHienTai = null;   // "7/20" — đổi tử hoặc mẫu đều vẽ lại
  var soDangHien = null;    // con số đang hiện trên màn hình
  var rafSuat = null;

  function chuSuat(n, kieu) {
    if (n === null || n === undefined || isNaN(n)) return UU_DAI.chuKhiLoi;
    return kieu === "the" ? n + "/" + UU_DAI.tong : "Còn " + n + "/" + UU_DAI.tong + " suất";
  }

  function veSuat(n) {
    $$("[data-suat]").forEach(function (el) {
      el.textContent = chuSuat(n, el.getAttribute("data-suat"));
    });
  }

  /* Chạy số từ chỗ đang hiện về số đích, cùng kiểu easing với dải số liệu
     ở Khối 1.5. Trang mở ra hiện đủ 20/20 rồi mới đếm ngược về số thật,
     thay cho kiểu nháy đổi số đột ngột trước đây. */
  function chayVeSo(den) {
    if (rafSuat) { cancelAnimationFrame(rafSuat); rafSuat = null; }
    var tu = soDangHien;
    soDangHien = den;

    // Lần vẽ đầu, số không đổi, hoặc máy đặt giảm chuyển động → nhảy thẳng
    if (tu === null || tu === den || giamChuyenDong.matches) { veSuat(den); return; }

    var t0 = performance.now(), dai = 900;
    function buoc(t) {
      var p = Math.min((t - t0) / dai, 1);
      var e = 1 - Math.pow(1 - p, 3);
      veSuat(Math.round(tu + (den - tu) * e));
      if (p < 1) { rafSuat = requestAnimationFrame(buoc); }
      else { rafSuat = null; veSuat(den); }
    }
    rafSuat = requestAnimationFrame(buoc);
  }

  function datSuat(n) {
    /* Báo sang đồng hồ TRƯỚC lần thoát sớm bên dưới: lần gọi đầu tiên số
       chưa đổi so với mặc định nhưng đồng hồ vẫn cần biết còn bao nhiêu suất. */
    suatChoDongHo = n;
    veDongHo();

    var khoa = n + "/" + UU_DAI.tong;
    if (khoa === khoaHienTai) return;
    khoaHienTai = khoa;
    chayVeSo(n);
  }

  /* Đọc dữ liệu trả về — nhận cả CSV (Google Sheet xuất bản) lẫn JSON (API riêng) */
  function docNoiDung(chu) {
    var s = chu.replace(/^\uFEFF/, "").trim();
    if (s.charAt(0) === "{" || s.charAt(0) === "[") {
      try { return JSON.parse(s); } catch (e) { return {}; }
    }
    var kq = {};
    s.split(/\r?\n/).forEach(function (dong) {
      var o = tachCsv(dong);
      if (o.length < 2) return;
      var khoa = o[0].trim().toLowerCase();
      if (!khoa || khoa === "khoa") return;   // bỏ dòng tiêu đề
      kq[khoa] = o[1].trim();
    });
    return kq;
  }

  /* Tách một dòng CSV, hiểu được ô đặt trong dấu ngoặc kép */
  function tachCsv(dong) {
    var o = [], dem = "", trongNgoac = false;
    for (var i = 0; i < dong.length; i++) {
      var c = dong.charAt(i);
      if (c === '"') {
        if (trongNgoac && dong.charAt(i + 1) === '"') { dem += '"'; i++; }
        else trongNgoac = !trongNgoac;
      } else if (c === "," && !trongNgoac) { o.push(dem); dem = ""; }
      else dem += c;
    }
    o.push(dem);
    return o;
  }

  function khoiTaoSuat() {
    /* Hiện ngay con số mặc định, không hiệu ứng — đây là điểm xuất phát.
       Số thật đọc từ Sheet sẽ đếm ngược từ đây xuống. */
    datSuat(UU_DAI.conLai);
    if (!URL_NOI_DUNG_SHEET) return;

    var keo = function () {
      fetch(URL_NOI_DUNG_SHEET, { cache: "no-store" })
        .then(function (r) { return r.text(); })
        .then(function (chu) {
          var d = docNoiDung(chu);
          var tong = parseInt(d.tong_suat != null ? d.tong_suat : d.tongSuat, 10);
          if (!isNaN(tong) && tong > 0) UU_DAI.tong = tong;
          var n = parseInt(d.suat_con_lai != null ? d.suat_con_lai
                  : d.suatConLai != null ? d.suatConLai : d.remaining, 10);
          // Chỉ nhận số hợp lý: 0 → tổng suất. Ngoài khoảng đó là gõ nhầm
          // (số âm, hoặc gõ 50 khi tổng chỉ 20) → bỏ qua, giữ nguyên số đang hiện.
          if (!isNaN(n) && n >= 0 && n <= UU_DAI.tong) datSuat(n);

          /* Gia hạn ưu đãi — ô "gia_han" ở tab NoiDung. Chỉ đụng tới khi Sheet
             thật sự có khoá đó, để người sửa noi-dung.js không bị Sheet trống ghi đè. */
          if ("gia_han" in d || "giaHan" in d) {
            var gh = docGiaHan(d.gia_han != null ? d.gia_han : d.giaHan);
            if (gh !== null) DEM_NGUOC.giaHan = gh;
            veDongHo();
          }
        })
        .catch(function () {
          /* Sheet lỗi / mất mạng / bị chặn → KHÔNG đổi gì cả, giữ nguyên số
             mặc định 20/20. Đây là chiều an toàn: hiện đủ suất thì không tạo
             cảm giác khan hiếm giả. */
        });
    };
    keo();
    // Chỉ đọc lại khi khách đang thực sự xem. Tab để nền cả ngày mà vẫn gọi
    // đều đặn là phí — và Apps Script có giới hạn lượt chạy đồng thời.
    setInterval(function () {
      if (document.visibilityState === "visible") keo();
    }, UU_DAI.chuKyPoll);
  }

  /* ==========================================================
     2.5. ĐỒNG HỒ ĐẾM NGƯỢC ƯU ĐÃI — HERO + KHỐI 8
     Đếm về 00:00 ngày (ngayHetUuDai + 1) hằng tháng, theo GIỜ VIỆT NAM.

     ⚠ Cố ý KHÔNG dùng múi giờ của máy khách. Máy đặt sai múi giờ — chuyện
       thường gặp trên điện thoại mua lại — sẽ ra hạn lệch cả tiếng, mà đây
       là con số khách dựa vào để quyết định đăng ký ngay hay để mai.
       Việt Nam không có giờ mùa hè nên +07 cố định là đúng quanh năm.

     Số suất về 0 thì đồng hồ về 0 luôn, kể cả còn thời gian: còn giờ mà
     hết suất thì cũng không giữ được suất nào, hiện số đang chạy là nói dối.
     ========================================================== */
  var LECH_VN = 7 * 3600000;

  var BU_GIA_HAN  = { "3ngay": 3 * 86400000, "24h": 86400000, "7h": 7 * 3600000 };

  /* ⚠ Gia hạn KHÔNG được lộ ra ngoài. Trang chỉ đổi con số đang đếm, không
     có nhãn nào báo "đã gia hạn" — khách biết hạn co giãn được thì lần sau
     không việc gì phải vội. Đây là yêu cầu của Hùng, đừng thêm lại. */

  /* Người gõ vào ô Sheet là người, không phải máy. Nhận cả mấy cách viết
     hay gặp; gõ sai hẳn thì trả null để bên gọi giữ nguyên giá trị cũ. */
  var DOI_TEN_GIA_HAN = {
    "3ngay": "3ngay", "3ngày": "3ngay", "3d": "3ngay",
    "24h": "24h", "24gio": "24h", "24giờ": "24h", "1ngay": "24h", "1ngày": "24h",
    "7h": "7h", "7gio": "7h", "7giờ": "7h"
  };

  function docGiaHan(gt) {
    var v = String(gt == null ? "" : gt).trim().toLowerCase().replace(/[\s.\-_]/g, "");
    if (v === "" || v === "khong" || v === "không") return "";
    return DOI_TEN_GIA_HAN[v] || null;
  }

  var suatChoDongHo = null;   // null = chưa đọc được số suất → đồng hồ cứ chạy
  var dsDongHo = [];
  var nhipDongHo = null;

  function oDongHo(goc, ten) { return goc.querySelector('[data-dh="' + ten + '"]'); }
  function hai(n) { return n < 10 ? "0" + n : String(n); }

  /* Mốc hết ưu đãi, tính bằng mốc thời gian tuyệt đối (epoch ms).
     Date.UTC(...) - LECH_VN = đúng thời điểm 00:00 giờ Việt Nam của ngày đó. */
  function hanUuDai(bayGio) {
    var vn = new Date(bayGio + LECH_VN);
    var ngayChot = (parseInt(DEM_NGUOC.ngayHetUuDai, 10) || 9) + 1;
    var moc = Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), ngayChot, 0, 0, 0) - LECH_VN;
    return moc + (BU_GIA_HAN[DEM_NGUOC.giaHan] || 0);
  }

  function veDongHo() {
    if (!dsDongHo.length) return;

    var bayGio = Date.now();
    var con = hanUuDai(bayGio) - bayGio;

    var hetSuat = (suatChoDongHo !== null && suatChoDongHo <= 0);
    var hetGio  = (con <= 0);
    var het     = hetSuat || hetGio;

    var ngay = 0, gio = 0, phut = 0, giay = 0, gap = false;
    if (!het) {
      ngay = Math.floor(con / 86400000);
      gio  = Math.floor(con / 3600000) % 24;
      phut = Math.floor(con / 60000) % 60;
      giay = Math.floor(con / 1000) % 60;
      gap  = con < 86400000;      // dưới 24 giờ mới đổi sang đỏ
    }

    /* Hết suất được báo trước hết giờ: khách hỏi "hết giờ hay hết suất" thì
       câu trả lời đúng là hết suất — đó mới là lý do không đăng ký được. */
    var loiNhan = !het ? ""
      : hetSuat ? "Đã hết suất ưu đãi tháng này. Để lại số, Bảo Châu báo ngay khi có suất mới."
                : "Ưu đãi tháng này đã kết thúc. Đợt mới mở lại từ ngày 1 tháng sau.";

    dsDongHo.forEach(function (goc) {
      oDongHo(goc, "ngay").textContent = hai(ngay);
      oDongHo(goc, "gio").textContent  = hai(gio);
      oDongHo(goc, "phut").textContent = hai(phut);
      oDongHo(goc, "giay").textContent = hai(giay);

      goc.classList.toggle("dong-ho--gap", gap);
      goc.classList.toggle("dong-ho--het", het);

      oDongHo(goc, "nhan").textContent = het ? "Ưu đãi tháng này" : "Ưu đãi kết thúc sau";

      var loi = oDongHo(goc, "loi-nhan");
      loi.hidden = !loiNhan;
      loi.textContent = loiNhan;

      /* Trình đọc màn hình: đọc cả dãy số mỗi giây là tra tấn. Chỉ để một
         nhãn tĩnh, cập nhật thầm lặng (aria-live="off" đặt sẵn trong HTML). */
      oDongHo(goc, "day").setAttribute("aria-label", het ? loiNhan :
        "Ưu đãi kết thúc sau " + ngay + " ngày " + gio + " giờ " + phut + " phút");
    });
  }

  function khoiTaoDongHo() {
    dsDongHo = $$("[data-dong-ho]");
    if (!dsDongHo.length) return;

    if (!DEM_NGUOC.bat) {
      dsDongHo.forEach(function (g) { g.remove(); });
      dsDongHo = [];
      return;
    }

    /* Giá trị đặt sẵn trong noi-dung.js cũng phải qua cửa kiểm tra */
    var gh = docGiaHan(DEM_NGUOC.giaHan);
    DEM_NGUOC.giaHan = (gh === null) ? "" : gh;

    veDongHo();
    if (nhipDongHo) clearInterval(nhipDongHo);
    nhipDongHo = setInterval(veDongHo, 1000);

    /* Điện thoại khoá màn hình thì trình duyệt bóp nhịp setInterval, mở lại
       đồng hồ sẽ trễ vài giây. Vẽ ngay một lần khi khách quay lại tab. */
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") veDongHo();
    });
  }

  /* ==========================================================
     3. KHỐI 1.5 — DẢI SỐ LIỆU
     ⚠ Cả 5 dòng số dùng chung cỡ chữ .so-lieu__so, không đặt cỡ riêng.
     ========================================================== */
  function renderSoLieu() {
    var boc = $("[data-so-lieu]");
    if (!boc) return;
    boc.innerHTML = SO_LIEU.map(function (o, i) {
      var attr = o.dem ? ' data-count="' + o.dem + '" data-suffix="' + (o.duoi || "") + '"' : "";
      return '<div class="so-lieu__o" data-reveal' + (i ? ' data-reveal-delay="' + i * 80 + '"' : "") + ">" +
               '<div class="so-lieu__khung"><div class="so-lieu__so"' + attr + ">" + o.so + "</div></div>" +
               '<div class="so-lieu__mo-ta">' + o.moTa + "</div>" +
             "</div>";
    }).join("");
  }

  /* ==========================================================
     4. HERO — NGĂN XẾP 3 ẢNH
     Đổi ảnh bằng: vuốt ngang, bấm nhanh, 2 mũi tên, 3 chấm.
     Chỉ ảnh đang ở trước mới phóng scale(1.05) khi hover.
     ========================================================== */
  function khoiTaoNganXep() {
    var boc = $("[data-ngan-xep]");
    if (!boc) return;

    boc.innerHTML =
      ANH_HERO.map(function (a, i) {
        return '<div class="ngan-xep__lop"><img src="' + a.src + '" alt="' + a.alt + '" ' +
               (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') +
               ' decoding="async" width="1200" height="900"></div>';
      }).join("") +
      '<button type="button" class="ngan-xep__mui-ten ngan-xep__mui-ten--truoc" aria-label="Ảnh trước">‹</button>' +
      '<button type="button" class="ngan-xep__mui-ten ngan-xep__mui-ten--sau" aria-label="Ảnh sau">›</button>' +
      '<div class="ngan-xep__cham">' +
        ANH_HERO.map(function (_, i) {
          return '<button type="button" aria-label="Ảnh ' + (i + 1) + '"></button>';
        }).join("") +
      "</div>";

    var lop = $$(".ngan-xep__lop", boc);
    var cham = $$(".ngan-xep__cham button", boc);
    var hen = null;

    /* CỌC BÀI: coc[0] là lá trên cùng, coc[cuối] là lá dưới đáy.
       Đổi ảnh = rút lá dưới đáy lên đầu. Lá đang ở đầu tụt xuống thành lá
       thứ 2 — vẫn nằm ngay sau, không bị vứt đi. */
    var coc = lop.map(function (_, i) { return i; });
    var truocDo = null;

    function ve(coHieuUng, huong) {
      // Gỡ lớp cũ rồi ép tính lại, nếu không animation sẽ không chạy lại
      lop.forEach(function (el) { el.classList.remove("la-truoc", "len", "lui"); });
      void boc.offsetWidth;

      if (coHieuUng) boc.style.setProperty("--huong", huong > 0 ? "1" : "-1");
      var tren = coc[0];

      lop.forEach(function (el, i) {
        if (i === tren) {
          el.classList.add("la-truoc");
          if (coHieuUng) el.classList.add("len");     // lá cuối được rút lên đầu
        } else if (coHieuUng && i === truocDo) {
          el.classList.add("lui");                    // lá đầu tụt xuống thứ 2
        }
        el.setAttribute("data-vi-tri", i === tren ? "0" : "1");
      });

      cham.forEach(function (b, i) { b.setAttribute("aria-current", String(i === tren)); });
    }

    /* Rút lá dưới đáy lên đầu — chiều mặc định, cũng là chiều tự động chạy */
    function rutLaCuoi() {
      truocDo = coc[0];
      coc.unshift(coc.pop());
      ve(true, 1);
      henLai();
    }

    /* Ngược lại: trả lá đang ở đầu xuống đáy, lá thứ 2 lộ ra */
    function traLaDau() {
      truocDo = coc[0];
      coc.push(coc.shift());
      ve(true, -1);
      henLai();
    }

    /* Bấm chấm: xoay cọc cho đúng ảnh đó lên đầu, giữ nguyên thứ tự tương đối */
    function toi(i) {
      if (coc[0] === i) return;
      truocDo = coc[0];
      var p = coc.indexOf(i);
      coc = coc.slice(p).concat(coc.slice(0, p));
      ve(true, 1);
      henLai();
    }

    /* ---- Tự động rút bài ----
       Dừng khi khách rê chuột lên ảnh, khi tab bị ẩn, hoặc máy đặt chế độ
       giảm chuyển động. Khách tự vuốt thì đếm lại từ đầu. */
    function dungHen() { if (hen) { clearTimeout(hen); hen = null; } }

    function henLai() {
      dungHen();
      if (!ANH_HERO_TU_DOI || giamChuyenDong.matches || lop.length < 2) return;
      hen = setTimeout(function () {
        if (document.visibilityState === "visible" && !boc.classList.contains("dang-hover")) rutLaCuoi();
        else henLai();
      }, ANH_HERO_TU_DOI);
    }

    ve(false, 0);
    henLai();

    $(".ngan-xep__mui-ten--truoc", boc).addEventListener("click", function (e) { e.stopPropagation(); traLaDau(); });
    $(".ngan-xep__mui-ten--sau", boc).addEventListener("click", function (e) { e.stopPropagation(); rutLaCuoi(); });
    cham.forEach(function (b, i) {
      b.addEventListener("click", function (e) { e.stopPropagation(); toi(i); });
    });

    boc.addEventListener("mouseenter", function () { boc.classList.add("dang-hover"); });
    boc.addEventListener("mouseleave", function () { boc.classList.remove("dang-hover"); });

    var keoX = null, keoY = 0, keoT = 0;
    boc.addEventListener("pointerdown", function (e) { keoX = e.clientX; keoY = e.clientY; keoT = Date.now(); });
    function thaTay(e) {
      if (keoX === null) return;
      var dx = e.clientX - keoX;
      var dy = e.clientY - keoY;
      var nhanh = Date.now() - keoT < 600;
      keoX = null;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) return; // vuốt dọc: bỏ qua
      if (Math.abs(dx) > 40) return dx < 0 ? rutLaCuoi() : traLaDau();
      if (nhanh) rutLaCuoi();
    }
    boc.addEventListener("pointerup", thaTay);
    boc.addEventListener("pointercancel", function () { keoX = null; });
  }

  /* ==========================================================
     5. KHỐI 5 — BẢNG GIÁ (phần khó nhất)
     3 tab · thẻ gói render từ BANG_GIA · accordion mở/đóng ĐỘC LẬP
     · cân chiều cao các dòng cùng data-pkg-row để thẳng một hàng ngang.
     ========================================================== */
  function htmlTheGoi(goi, hangMuc) {
    var id = "chi-tiet-" + goi.ma;
    var muc = hangMuc.map(function (k) {
      var nd = goi.chiTiet[k];
      return nd
        ? '<div class="goi__muc" data-pkg-row="' + k + '">' + nd + "</div>"
        : '<div class="goi__muc goi__muc--trong" data-pkg-row="' + k + '">–</div>';
    }).join("");

    return '<article class="goi' + (goi.noiBat ? " goi--navy" : "") + '">' +
        '<div class="goi__dau" data-pkg-row="h0">' +
          '<div class="goi__ten">' + goi.ten + "</div>" +
          (goi.badge ? '<div class="goi__badge">' + goi.badge + "</div>" : "") +
        "</div>" +
        '<div class="goi__gia">' + goi.gia + "</div>" +
        '<div class="goi__tom-tat" data-pkg-row="h1">' +
          '<div class="goi__dong" data-pkg-row="h1a">' +
            '<span class="goi__nhan">Giờ học thực hành</span>' +
            '<span class="goi__gia-tri">' + goi.gioHoc + "</span></div>" +
          '<div class="goi__dong" data-pkg-row="h1b">' +
            '<span class="goi__nhan">Đóng trước vào lớp</span>' +
            '<span class="goi__gia-tri">' + goi.dongTruoc + "</span></div>" +
        "</div>" +
        '<button type="button" class="goi__mo" aria-expanded="false" aria-controls="' + id + '">' +
          "<span>Chi tiết gói</span>" +
          '<span class="goi__mui-ten" aria-hidden="true">▼</span>' +
        "</button>" +
        '<div class="goi__panel" id="' + id + '"><div class="goi__panel-inner">' + muc + "</div></div>" +
      "</article>";
  }

  function renderBangGia() {
    var boc = $("[data-hoc-phi]");
    if (!boc) return;

    var tabs = '<div class="tab-bar" role="tablist" aria-label="Chọn hạng bằng">' +
      '<div class="tab-bar__chi-bao" aria-hidden="true"></div>' +
      BANG_GIA.map(function (t, i) {
        return '<button type="button" class="tab-bar__nut" role="tab" id="tab-' + t.ma + '"' +
               ' aria-selected="' + (i === 0) + '" aria-controls="panel-' + t.ma + '">' + t.ten + "</button>";
      }).join("") + "</div>";

    var panels = BANG_GIA.map(function (t, i) {
      return '<div class="tab-panel" id="panel-' + t.ma + '" role="tabpanel" aria-labelledby="tab-' + t.ma + '"' +
             (i === 0 ? "" : " hidden") + ">" +
          '<div class="goi-luoi' + (t.goi.length === 1 ? " goi-luoi--don" : "") + '" data-pkg-grid>' +
            t.goi.map(function (g) { return htmlTheGoi(g, t.hangMuc); }).join("") +
          "</div>" +
          '<div class="o-anh hoc-phi__anh">' +
            '<img src="' + t.anh.src + '" alt="' + t.anh.alt + '" loading="lazy" decoding="async" width="' +
            t.anh.w + '" height="' + t.anh.h + '">' +
          "</div>" +
        "</div>";
    }).join("");

    boc.innerHTML = tabs + panels;

    var chiBao = $(".tab-bar__chi-bao", boc);
    var nutTab = $$(".tab-bar__nut", boc);
    var panelEls = $$(".tab-panel", boc);

    nutTab.forEach(function (nut, i) {
      nut.addEventListener("click", function () {
        nutTab.forEach(function (n, j) { n.setAttribute("aria-selected", String(i === j)); });
        panelEls.forEach(function (p, j) { p.hidden = i !== j; });
        chiBao.style.transform = "translateX(" + i * 100 + "%)";
        canHangGoi();
      });
    });

    /* Mở/đóng chi tiết — mỗi gói độc lập, mở gói này không đóng gói kia */
    $$(".goi__mo", boc).forEach(function (nut) {
      nut.addEventListener("click", function () {
        var panel = document.getElementById(nut.getAttribute("aria-controls"));
        var dangMo = nut.getAttribute("aria-expanded") === "true";
        nut.setAttribute("aria-expanded", String(!dangMo));
        if (dangMo) {
          panel.style.maxHeight = "0px";
          panel.style.opacity = "0";
        } else {
          /* thiết kế chốt 1400px; chỉ nới thêm nếu nội dung thật sự cao hơn để không bị cắt */
          var can = panel.firstElementChild.scrollHeight + 24;
          panel.style.maxHeight = Math.max(1400, can) + "px";
          panel.style.opacity = "1";
        }
      });
    });
  }

  /* Gom các dòng cùng data-pkg-row trong cùng data-pkg-grid, lấy chiều cao lớn
     nhất rồi set minHeight cho tất cả — các thẻ luôn thẳng một đường ngang. */
  function canHangGoi() {
    $$("[data-pkg-grid]").forEach(function (grid) {
      if (grid.offsetParent === null) return; // tab đang ẩn: đo được 0, bỏ qua
      var nhom = {};
      $$("[data-pkg-row]", grid).forEach(function (el) {
        el.style.minHeight = "";
        var k = el.getAttribute("data-pkg-row");
        (nhom[k] || (nhom[k] = [])).push(el);
      });
      Object.keys(nhom).forEach(function (k) {
        var ds = nhom[k];
        if (ds.length < 2) return;
        var max = 0;
        ds.forEach(function (el) { max = Math.max(max, el.getBoundingClientRect().height); });
        ds.forEach(function (el) { el.style.minHeight = max + "px"; });
      });
    });
  }

  /* ==========================================================
     6. KHỐI 6 — LỘ TRÌNH (4 chặng / 11 bước, số bước tự đánh)
     ========================================================== */
  function renderLoTrinh() {
    var boc = $("[data-lo-trinh]");
    if (!boc) return;
    var stt = 0;
    boc.innerHTML = LO_TRINH.map(function (c) {
      var buoc = c.buoc.map(function (b) {
        stt += 1;
        return "<li>" +
            '<span class="chang__so">' + stt + "</span>" +
            '<span class="chang__buoc">' + b + "</span>" +
          "</li>";
      }).join("");
      return '<div class="chang" data-reveal>' +
          '<div class="chang__chu">' +
            '<div class="chang__nhan">' + c.nhan + "</div>" +
            '<h3 class="chang__ten">' + c.ten + "</h3>" +
            '<ol class="chang__ds">' + buoc + "</ol>" +
          "</div>" +
          '<div class="chang__anh">' +
            '<img src="' + c.anh.src + '" alt="' + c.anh.alt + '" loading="lazy" decoding="async" width="900" height="675">' +
          "</div>" +
        "</div>";
    }).join("");
  }

  /* ==========================================================
     7. KHỐI 7 — FAQ (accordion, chỉ mở 1 câu tại một thời điểm)
     ========================================================== */
  function renderFaq() {
    var boc = $("[data-faq]");
    if (!boc) return;
    boc.innerHTML = CAU_HOI.map(function (c, i) {
      return '<div class="faq__muc">' +
          '<button type="button" class="faq__nut" aria-expanded="false" aria-controls="faq-' + i + '">' +
            '<span class="faq__cau-hoi">' + c.hoi + "</span>" +
            '<span class="faq__icon" aria-hidden="true">+</span>' +
          "</button>" +
          '<div class="faq__panel" id="faq-' + i + '" role="region">' +
            '<p class="faq__tra-loi">' + c.dap + "</p>" +
          "</div>" +
        "</div>";
    }).join("");

    var nut = $$(".faq__nut", boc);
    function dong(n) {
      var p = document.getElementById(n.getAttribute("aria-controls"));
      n.setAttribute("aria-expanded", "false");
      $(".faq__icon", n).textContent = "+";
      p.style.maxHeight = "0px";
      p.style.opacity = "0";
    }
    nut.forEach(function (n) {
      n.addEventListener("click", function () {
        var dangMo = n.getAttribute("aria-expanded") === "true";
        nut.forEach(dong);
        if (dangMo) return;
        var p = document.getElementById(n.getAttribute("aria-controls"));
        n.setAttribute("aria-expanded", "true");
        $(".faq__icon", n).textContent = "−";
        p.style.maxHeight = Math.max(460, p.firstElementChild.scrollHeight + 24) + "px";
        p.style.opacity = "1";
      });
    });
  }

  /* ==========================================================
     8. FORM ĐĂNG KÝ — DÙNG CHUNG HERO + KHỐI 8
     ========================================================== */
  function guiLead(lead, viTri) {
    if (!URL_NHAN_DANG_KY) return Promise.resolve();
    var payload = JSON.stringify({
      hoTen: lead.hoTen,
      soDienThoai: lead.soDienThoai,
      hangBang: lead.hangBang,
      viTri: viTri,
      trang: location.href,
      nguon: document.referrer,
      thoiGian: new Date().toISOString()
    });
    /* text/plain BẮT BUỘC: tránh CORS preflight mà Apps Script không xử lý được */
    var post = function () {
      return fetch(URL_NHAN_DANG_KY, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: payload,
        /* Trang hiện màn hình cảm ơn ngay rồi mới gửi ngầm, nên khách có thể
           đóng tab lúc request chưa xong. keepalive bảo trình duyệt cứ gửi
           cho xong dù trang đã đóng. Thiếu cờ này là mất đơn. */
        keepalive: true
      });
    };
    return post().catch(post).catch(function () {
      try { localStorage.setItem("bc_lead_loi_" + Date.now(), payload); } catch (e) {}
    });
  }

  /* Trang có hai form (Hero và cuối trang). Chúng phải dùng CHUNG trạng thái:
     khách điền ở một chỗ rồi cuộn tới chỗ kia thấy form vẫn trống sẽ dễ điền
     lại, thành hai đơn trùng cho cùng một người. */
  var cacFormCamOn = [];   // hàm chuyển sang màn hình cảm ơn của từng form
  var daGuiLead = false;   // đã có form nào gửi chưa

  function taoForm(host, viTri) {
    host.innerHTML =
      '<div class="form-dk">' +
        '<div class="form-dk__tieu-de">Nhận tư vấn miễn phí</div>' +
        "<form novalidate>" +
          '<input type="text" name="hoten" autocomplete="name" aria-label="Họ và tên" placeholder="Họ và tên">' +
          '<input type="tel" name="sdt" autocomplete="tel" inputmode="numeric" aria-label="Số điện thoại" placeholder="Số điện thoại">' +
          '<select name="hang" aria-label="Hạng muốn học">' +
            HANG_BANG.map(function (h) { return '<option value="' + h + '">' + h + "</option>"; }).join("") +
          "</select>" +
          '<div class="form-dk__loi" role="alert" hidden></div>' +
          '<button type="submit" class="form-dk__gui">Đăng ký</button>' +
        "</form>" +
      "</div>";

    var the = $(".form-dk", host);
    var form = $("form", the);
    var oLoi = $(".form-dk__loi", the);
    var nut = $(".form-dk__gui", the);

    function hienCamOn() {
      the.innerHTML =
        '<div class="form-dk__tieu-de">Nhận tư vấn miễn phí</div>' +
        '<div class="form-dk__xong">' +
          '<div class="form-dk__xong-tieu-de">Đã nhận thông tin của bạn</div>' +
          '<div class="form-dk__xong-mo-ta">Tư vấn viên Bảo Châu sẽ gọi lại trong ít phút.</div>' +
        "</div>";
    }
    cacFormCamOn.push(hienCamOn);

    /* Form kia đã gửi trước rồi thì form này cũng cảm ơn luôn — xảy ra khi
       trang dựng form thứ hai sau khi form thứ nhất đã gửi xong. */
    if (daGuiLead) return hienCamOn();

    function baoLoi(chu) {
      oLoi.textContent = chu;
      oLoi.hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (daGuiLead) return;   // cờ dùng chung: một form gửi rồi thì khoá cả hai
      var hoTen = form.hoten.value.trim();
      var soDienThoai = form.sdt.value.replace(/[^0-9]/g, "");
      if (hoTen.length < 2) return baoLoi("Bạn nhập giúp họ tên nhé.");
      if (!/^0\d{9}$/.test(soDienThoai)) return baoLoi("Số điện thoại cần 10 số, bắt đầu bằng 0.");

      oLoi.hidden = true;
      daGuiLead = true;
      nut.disabled = true;
      nut.textContent = "Đang gửi…";
      var hangBang = form.hang.value;

      /* Báo Facebook NGAY tại đây, KHÔNG chờ Apps Script trả lời.
         Apps Script mất 1,5–3 giây. Nếu để trong .then() mà khách đóng tab
         trong khoảng chờ đó thì sự kiện không bao giờ bắn, dù đơn đã ghi
         vào Sheet — mất lead trong báo cáo quảng cáo.
         Bắn ở đây là đúng: từ giây phút này trang đã coi như nhận đơn, kể
         cả khi mạng lỗi (có cơ chế lưu tạm rồi vẫn báo thành công).
         KHÔNG gửi họ tên và số điện thoại. */
      bcSuKien("Lead", { content_name: viTri, content_category: hangBang });

      /* Gửi ngầm ngay, không chặn giao diện. Mọi giá trị đã lấy ra biến ở
         trên rồi nên không sao khi thẻ form bị thay mất sau đó. */
      guiLead({ hoTen: hoTen, soDienThoai: soDienThoai, hangBang: hangBang }, viTri);

      /* Chờ đúng CHO_CAM_ON rồi mới hiện cảm ơn.
         Đây KHÔNG phải chờ Apps Script — việc gửi đã chạy ngầm ở trên rồi.
         Đây là nhịp nghỉ cố tình: hiện cảm ơn tức thì thì thao tác trôi tuột,
         khách không kịp thấy gì nên không chắc đã gửi được chưa.
         Khác chỗ cũ ở điểm quan trọng: thời gian chờ này CỐ ĐỊNH, không phụ
         thuộc mạng. Apps Script có chậm 5 giây thì khách vẫn chỉ chờ chừng này. */
      setTimeout(function () {
        cacFormCamOn.forEach(function (hien) { hien(); });
      }, CHO_CAM_ON);
    });
  }

  /* Nhiều khách gọi thẳng chứ không điền form — đếm cả hành vi đó,
     nếu không quảng cáo sẽ tưởng những lượt ấy là thất bại. */
  function khoiTaoBamGoi() {
    $$('a[href^="tel:"]').forEach(function (a) {
      a.addEventListener("click", function () { bcSuKien("Contact", { content_name: "Gọi điện" }); });
    });
    $$('a[href*="zalo.me"]').forEach(function (a) {
      a.addEventListener("click", function () { bcSuKien("Contact", { content_name: "Zalo" }); });
    });
  }

  function khoiTaoForm() {
    $$("[data-form]").forEach(function (host) {
      taoForm(host, host.getAttribute("data-form"));
    });
  }

  /* ==========================================================
     9. HIỆU ỨNG REVEAL KHI CUỘN
     (a) phần tử đã nằm trong khung hình lúc tải thì không ẩn (tránh nhấp nháy)
     (b) cuộn nhanh vượt qua thì quét lại, hiện những phần đã ra khỏi khung hình
     ========================================================== */
  var quetLaiReveal = null;

  function khoiTaoReveal() {
    var ease = "cubic-bezier(0.22, 1, 0.36, 1)";
    var vh = window.innerHeight;
    var cho = [];
    $$("[data-reveal]").forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.92) return;
      el.style.opacity = "0";
      el.style.transform = el.hasAttribute("data-reveal-scale") ? "scale(0.97)" : "translateY(24px)";
      el.style.transition = "opacity 600ms " + ease + ", transform 600ms " + ease;
      cho.push(el);
    });
    if (!cho.length) return;

    function hien(el) {
      el.style.opacity = "1";
      el.style.transform = el.hasAttribute("data-reveal-scale") ? "scale(1)" : "translateY(0)";
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { hien(el); }, parseInt(el.getAttribute("data-reveal-delay") || "0", 10));
        io.unobserve(el);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -15% 0px" });

    cho.forEach(function (el) { io.observe(el); });

    quetLaiReveal = function () {
      cho.forEach(function (el) {
        if (el.style.opacity === "1") return;
        if (el.getBoundingClientRect().bottom < 0) { hien(el); io.unobserve(el); }
      });
    };
  }

  /* ==========================================================
     10. ĐẾM SỐ (Khối 1.5) — chạy đúng một lần
     ========================================================== */
  function khoiTaoDemSo() {
    var els = $$("[data-count]");
    if (!els.length) return;
    function chay(el) {
      var dich = parseInt(el.getAttribute("data-count"), 10);
      var duoi = el.getAttribute("data-suffix") || "";
      var t0 = performance.now();
      function buoc(t) {
        var p = Math.min((t - t0) / 1500, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(dich * e).toLocaleString("vi-VN") + duoi;
        if (p < 1) requestAnimationFrame(buoc);
      }
      requestAnimationFrame(buoc);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        chay(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ==========================================================
     11. CUỘN: PARALLAX (Hero 0.14 · Khối 8 0.18) + THANH CTA MOBILE
     ========================================================== */
  function khoiTaoCuon() {
    var thanh = $(".thanh-cta");
    var hero = $("[data-hero]");
    var cuoi = $("[data-final-cta]");
    var raf = null;

    function xuLy() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        $$("[data-parallax]").forEach(function (el) {
          var chu = el.parentElement;
          if (!chu) return;
          var r = chu.getBoundingClientRect();
          if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
          var he = parseFloat(el.getAttribute("data-parallax")) || 0.15;
          var lech = (r.top + r.height / 2 - window.innerHeight / 2) * -he;
          el.style.transform = "translate3d(0," + lech.toFixed(1) + "px,0)";
        });

        if (quetLaiReveal) quetLaiReveal();

        if (thanh) {
          var quaHero = hero ? window.scrollY > hero.offsetHeight * 0.75 : false;
          var toiCuoi = cuoi ? cuoi.getBoundingClientRect().top < window.innerHeight : false;
          thanh.classList.toggle("hien", quaHero && !toiCuoi);
        }
      });
    }

    window.addEventListener("scroll", xuLy, { passive: true });
    window.addEventListener("resize", xuLy, { passive: true });
    xuLy();
  }

  /* ==========================================================
     12. KHỞI ĐỘNG
     Dựng nội dung trước, rồi mới gắn hiệu ứng (reveal cần phần tử đã có).
     ========================================================== */
  function batDau() {
    dongBoLienHe();
    renderSoLieu();
    khoiTaoNganXep();
    renderBangGia();
    renderLoTrinh();
    renderFaq();
    khoiTaoForm();
    khoiTaoBamGoi();
    khoiTaoSuat();
    khoiTaoDongHo();

    khoiTaoReveal();
    khoiTaoDemSo();
    khoiTaoCuon();

    /* Cân hàng ngang: chạy khi mount, khi đổi tab (trong renderBangGia),
       khi resize và khi font tải xong (font đổi làm lệch chiều cao chữ). */
    requestAnimationFrame(canHangGoi);
    window.addEventListener("resize", canHangGoi);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(canHangGoi);

    /* Đổi qua/lại ngưỡng mobile làm bố cục thẻ gói đổi hẳn — cân lại hàng */
    window.matchMedia(MOBILE).addEventListener("change", canHangGoi);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", batDau);
  } else {
    batDau();
  }
})();
