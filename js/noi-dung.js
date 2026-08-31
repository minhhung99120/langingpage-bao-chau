/* ============================================================
   BẢO CHÂU — TOÀN BỘ NỘI DUNG CỦA TRANG
   js/noi-dung.js

   ĐÂY LÀ FILE DUY NHẤT CẦN SỬA khi đổi giá, đổi số suất,
   thêm câu hỏi, đổi hotline… Không cần đụng vào file khác.
   ============================================================ */

/* ------------------------------------------------------------
   1. KẾT NỐI — dán URL Google Apps Script vào đây
   Hướng dẫn dựng: HUONG-DAN-KET-NOI-FORM.md
   Để trống "" thì form vẫn chạy, chỉ hiện màn hình cảm ơn tại chỗ.
------------------------------------------------------------ */
const URL_NHAN_DANG_KY = "https://script.google.com/macros/s/AKfycbxx2DjWLi0EcpHHn4QjjQhA_aFgUHFqPWKrnUSFMld5Vql9JThXLBE3iG9N88QSLFlu/exec";

/* URL đọc số suất còn lại. Dùng CHUNG một URL Apps Script với URL_NHAN_DANG_KY
   ở trên — cùng một cầu nối, một Sheet, Sheet vẫn để "Chỉ mình tôi".
   Cách dựng: HUONG-DAN-KET-NOI-FORM.md
   Để trống thì trang dùng con số cố định ở mục UU_DAI bên dưới. */
const URL_NOI_DUNG_SHEET = "https://script.google.com/macros/s/AKfycbxx2DjWLi0EcpHHn4QjjQhA_aFgUHFqPWKrnUSFMld5Vql9JThXLBE3iG9N88QSLFlu/exec";

/* ------------------------------------------------------------
   2. THÔNG TIN LIÊN HỆ
------------------------------------------------------------ */
const THONG_TIN = {
  tenDayDu: "Văn phòng Tư vấn Tuyển sinh và Đào tạo lái xe Bảo Châu",
  hotline: "0378.999.120",          // dạng hiển thị
  hotlineSo: "0378999120",          // dạng dùng cho tel: và zalo.me
  email: "daotaolaixebaochau@gmail.com",
  diaChi: "Số 19, ngõ 126 Khuất Duy Tiến, Thanh Xuân, Hà Nội",
  gioLamViec: "8:00 – 17:30 · cả thứ 7 và Chủ nhật",
  facebook: "https://facebook.com/daylaixeotobaochau",
  youtube: "https://youtube.com/@daotaolaixebaochau360"
};

/* ------------------------------------------------------------
   3. ƯU ĐÃI / SỐ SUẤT CÒN LẠI
   Một nguồn duy nhất, hiển thị ở 4 chỗ: Hero, Khối 5, Khối 6.5, Khối 8.
   ĐỔI SỐ SUẤT: sửa đúng dòng "conLai" bên dưới.
------------------------------------------------------------ */
const UU_DAI = {
  conLai: 7,     // SỐ SUẤT CÒN LẠI — số dự phòng, dùng khi chưa nối Sheet
                 // hoặc khi Sheet trục trặc. Nối Sheet rồi thì sửa trên Sheet,
                 // thỉnh thoảng cập nhật số này cho khỏi lệch quá xa.
  tong: 20,      // tổng số suất mỗi tháng
  chuKyPoll: 300000,   // 5 phút đọc lại một lần, và chỉ khi khách đang xem tab
  chuKhiLoi: "Liên hệ để kiểm tra",   // chỉ dùng nếu conLai ở trên không phải là số
  hienUuDaiSinhVien: true               // dòng ưu đãi sinh viên ở Khối 6.5
};

/* ------------------------------------------------------------
   4. ẢNH NGĂN XẾP Ở HERO (vuốt / bấm để đổi)
------------------------------------------------------------ */

/* Tự động đổi ảnh sau bao nhiêu mili-giây. 5000 = 5 giây.
   Đặt 0 để tắt hẳn, khách phải tự vuốt.
   Tự dừng khi khách đang rê chuột lên ảnh hoặc đang mở tab khác. */
const ANH_HERO_TU_DOI = 5000;

const ANH_HERO = [
  { src: "img/hero-giao-vien-hoc-vien.jpg", alt: "Giáo viên Bảo Châu ngồi ghế phụ hướng dẫn học viên đang cầm vô-lăng" },
  { src: "img/hero-huong-dan-can-so.jpg",   alt: "Giáo viên chỉ cách chuyển cần số trên xe tập lái" },
  { src: "img/hero-chan-ga-chan-phanh.jpg", alt: "Học viên đặt chân lên chân phanh và chân ga trong buổi học vỡ" }
];

/* ------------------------------------------------------------
   5. DẢI SỐ LIỆU (Khối 1.5)
   "dem" = số đích để chạy hiệu ứng đếm; bỏ "dem" thì hiện chữ tĩnh.
------------------------------------------------------------ */
const SO_LIEU = [
  { so: "10.000+", dem: 10000, duoi: "+", moTa: "Học viên đã học lái tại Bảo Châu" },
  { so: "10+",     dem: 10,    duoi: "+", moTa: "Năm Tư vấn Tuyển sinh và Đào tạo lái xe" },
  { so: "10+",                            moTa: "Sân tập trải khắp địa bàn Hà Nội" },
  { so: "1 – 1 – 1",                      moTa: "1 thầy – 1 trò – 1 xe" },
  { so: "Hợp đồng",                       moTa: "Hợp đồng đào tạo rõ ràng, minh bạch" }
];

/* ------------------------------------------------------------
   6. BẢNG GIÁ — PHẦN QUAN TRỌNG NHẤT
   ⚠ Giá, số giờ, số km DAT là SỐ THẬT. Không sửa khi chưa hỏi chủ trung tâm.

   Mỗi gói có:
     ten        — tên gói
     badge      — nhãn góc phải (bỏ trống thì không hiện)
     noiBat     — true = thẻ nền navy
     gia        — giá trọn gói
     gioHoc     — số giờ thực hành
     dongTruoc  — số tiền đóng trước khi vào lớp
     chiTiet    — nội dung từng dòng trong phần "Chi tiết gói".
                  Thiếu dòng nào thì trang tự hiện dấu "–" để giữ hàng so sánh.

   Thứ tự dòng do "hangMuc" của mỗi tab quyết định.
------------------------------------------------------------ */

/* Hai hàm nhỏ giúp phần dữ liệu bên dưới dễ đọc */
function buoiHoc(hocVo, saHinh, tongOn) {
  return "<strong>Học vỡ:</strong> " + hocVo +
         "<br><strong>Học sa hình:</strong> " + saHinh +
         "<br>+ " + tongOn;
}
function chayDat(soKm, loaiDuong) {
  return "<strong>Chạy DAT:</strong>" +
    '<div class="goi__dat">' +
      '<div class="goi__dat-km"><span class="goi__cham-dat">•</span><span>' + soKm + "</span></div>" +
      (loaiDuong ? '<div class="canh-bao">' + loaiDuong + "</div>" : "") +
    "</div>";
}

/* Nội dung dùng lại giữa các gói */
const MUC_KHAM = "Phí khám sức khoẻ";
const MUC_LY_THUYET = "Học lý thuyết + thi hết môn lý thuyết/thực hành + quản lý (làm hồ sơ, chụp ảnh, in ảnh, quản lý học viên…)";
const MUC_CABIN = "02h học cabin mô phỏng";
const MUC_SAN = "Phí thuê sân tập sa hình";
const MUC_LE_PHI_TU_NOP = 'Lệ phí thi sát hạch (645.000đ) — <span class="canh-bao">học viên tự nộp tại sân thi sát hạch</span>';
const MUC_LE_PHI_DA_GOM = "<strong>Đã bao gồm lệ phí thi sát hạch</strong> (645.000đ)";
const HS_THUONG = "Hồ sơ mở lớp khai giảng";
const HS_SOM = "Hồ sơ mở lớp khai giảng sớm. Học sớm, thi sớm trong khoảng 04 tháng";
const HS_SOM_NHAT = "Hồ sơ mở lớp khai giảng sớm nhất. Đăng ký học ngay, thi sớm trong khoảng 03 tháng";

/* 5 quyền lợi riêng của gói Cao cấp */
const QUYEN_LOI_CAO_CAP = {
  r8:  "Hỗ trợ học lý thuyết + thi hết môn + cabin",
  r9:  "Miễn phí 02h tập xe chip",
  r10: "Đưa đón đi học từng buổi",
  r11: "Đưa đón đi thi từng buổi",
  r12: "Miễn phí thi lại (nếu trượt)"
};

const BANG_GIA = [
  /* ===== TAB 1: B SỐ TỰ ĐỘNG — DAT 710km ===== */
  {
    ma: "A",
    ten: "B số tự động",
    hangMuc: ["r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11","r12","r13"],
    anh: { src: "img/khoi5-xe-vios-so-tu-dong.jpg", alt: "Cần số xe số tự động trên xe tập lái hạng B của Bảo Châu", w: 1600, h: 686 },
    goi: [
      {
        ma: "A1", ten: "Tiết kiệm", gia: "16.000.000đ", gioHoc: "20 giờ", dongTruoc: "5.000.000đ",
        chiTiet: {
          r1: HS_THUONG,
          r2: MUC_KHAM,
          r3: MUC_LY_THUYET,
          r5: buoiHoc("01 buổi x 1,5h", "02 buổi x 1,5h", "01 buổi tổng ôn x 1,5h"),
          r7: chayDat("Đủ 710km hạng B số tự động – 14h học", null),
          r13: MUC_LE_PHI_TU_NOP
        }
      },
      {
        ma: "A2", ten: "Tiêu chuẩn", badge: "Phổ biến nhất", noiBat: true,
        gia: "17.500.000đ", gioHoc: "22 giờ", dongTruoc: "5.000.000đ",
        chiTiet: {
          r1: HS_SOM,
          r2: MUC_KHAM,
          r3: MUC_LY_THUYET,
          r4: MUC_CABIN,
          r5: buoiHoc("02 buổi x 1,5h", "02 buổi x 1,5h", "01 buổi tổng ôn x 2h"),
          r6: MUC_SAN,
          r7: chayDat("Đủ 710km hạng B số tự động – 14h học", "Chạy cao tốc + đường tỉnh lộ + đỗ xe ngang dọc thực tế"),
          r13: MUC_LE_PHI_TU_NOP
        }
      },
      {
        ma: "A3", ten: "Cao cấp", gia: "26.000.000đ", gioHoc: "32 giờ", dongTruoc: "15.000.000đ",
        chiTiet: Object.assign({
          r1: HS_SOM_NHAT,
          r2: MUC_KHAM,
          r3: MUC_LY_THUYET,
          r4: MUC_CABIN,
          r5: buoiHoc("03 buổi x 2h", "02 buổi x 2h", "01 buổi tổng ôn x 2h"),
          r6: MUC_SAN,
          r7: chayDat("Đủ 710km hạng B số tự động – 20h học", "Chạy cao tốc + đường tỉnh lộ + đi phố + đường đèo + đỗ xe ngang dọc thực tế"),
          r13: MUC_LE_PHI_DA_GOM
        }, QUYEN_LOI_CAO_CAP)
      }
    ]
  },

  /* ===== TAB 2: B SỐ SÀN — DAT 810km ===== */
  {
    ma: "B",
    ten: "B số sàn",
    hangMuc: ["r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11","r12","r13"],
    anh: { src: "img/khoi5-xe-vios-so-san.jpg", alt: "Xe tập lái Bảo Châu chạy trên đường trong khu vực sân tập", w: 1500, h: 643 },
    goi: [
      {
        ma: "B1", ten: "Tiết kiệm", gia: "16.500.000đ", gioHoc: "26 giờ", dongTruoc: "5.000.000đ",
        chiTiet: {
          r1: HS_THUONG,
          r2: MUC_KHAM,
          r3: MUC_LY_THUYET,
          r5: buoiHoc("01 buổi x 1,5h", "02 buổi x 1,5h", "01 buổi tổng ôn x 1,5h"),
          r7: chayDat("Đủ 810km hạng B số sàn – 20h học", null),
          r13: MUC_LE_PHI_TU_NOP
        }
      },
      {
        ma: "B2", ten: "Tiêu chuẩn", badge: "Phổ biến nhất", noiBat: true,
        gia: "18.100.000đ", gioHoc: "28 giờ", dongTruoc: "5.000.000đ",
        chiTiet: {
          r1: HS_SOM,
          r2: MUC_KHAM,
          r3: MUC_LY_THUYET,
          r4: MUC_CABIN,
          r5: buoiHoc("02 buổi x 1,5h", "02 buổi x 1,5h", "01 buổi tổng ôn x 2h"),
          r6: MUC_SAN,
          r7: chayDat("Đủ 810km hạng B số sàn – 20h học", "Chạy cao tốc + đường tỉnh lộ + đỗ xe ngang dọc thực tế"),
          r13: MUC_LE_PHI_TU_NOP
        }
      },
      {
        ma: "B3", ten: "Cao cấp", gia: "27.000.000đ", gioHoc: "36 giờ", dongTruoc: "15.000.000đ",
        chiTiet: Object.assign({
          r1: HS_SOM_NHAT,
          r2: MUC_KHAM,
          r3: MUC_LY_THUYET,
          r4: MUC_CABIN,
          r5: buoiHoc("03 buổi x 2h", "02 buổi x 2h", "01 buổi tổng ôn x 2h"),
          r6: MUC_SAN,
          r7: chayDat("Đủ 810km hạng B số sàn – 24h học", "Chạy cao tốc + đường tỉnh lộ + đi phố + đường đèo + đỗ xe ngang dọc thực tế"),
          r13: MUC_LE_PHI_DA_GOM
        }, QUYEN_LOI_CAO_CAP)
      }
    ]
  },

  /* ===== TAB 3: C1 — DAT 825km, MỘT GÓI DUY NHẤT ===== */
  {
    ma: "C",
    ten: "C1",
    /* C1 chỉ có 1 thẻ nên không cần dòng "–" để so sánh */
    hangMuc: ["r1","r2","r3","r4","r5","r6","r7","r13","r14"],
    anh: { src: "img/khoi5-xe-kia-k250.jpg", alt: "Toàn cảnh sân tập với các bài sa hình", w: 1500, h: 643 },
    goi: [
      {
        ma: "C1", ten: "C1 — Tiêu chuẩn", badge: "Gói duy nhất", noiBat: true,
        gia: "21.400.000đ", gioHoc: "32 giờ", dongTruoc: "7.000.000đ",
        chiTiet: {
          r1: HS_SOM,
          r2: MUC_KHAM,
          r3: MUC_LY_THUYET,
          r4: MUC_CABIN,
          r5: buoiHoc("02 buổi x 1,5h", "02 buổi x 1,5h", "01 buổi tổng ôn x 2h"),
          r6: MUC_SAN,
          r7: chayDat("Đủ 825km hạng C1 – 24h học", "Chạy cao tốc + đường tỉnh lộ + đỗ xe ngang dọc thực tế"),
          r13: MUC_LE_PHI_TU_NOP,
          r14: "Xe học: Kia K250 (xe tải 3.500–7.500kg)"
        }
      }
    ]
  }
];

/* ------------------------------------------------------------
   7. LỘ TRÌNH — 4 CHẶNG / 11 BƯỚC (Khối 6)
   Số thứ tự bước do trang tự đánh, cứ thêm/bớt trong mảng "buoc".
------------------------------------------------------------ */
const LO_TRINH = [
  {
    nhan: "Chặng 1", ten: "Chuẩn bị hồ sơ",
    anh: { src: "img/khoi6-chang1-ho-so.jpg", alt: "Nhân viên Bảo Châu hoàn thiện hồ sơ học viên tại văn phòng" },
    buoc: [
      "<strong>Đăng ký hồ sơ mở lớp</strong> — Bạn hoàn toàn có thể chọn đăng ký online hoặc đến trực tiếp văn phòng Bảo Châu.",
      "<strong>Khám sức khỏe hoàn thiện hồ sơ</strong> — Sau khi nộp hồ sơ, học viên được hướng dẫn đi khám sức khoẻ tổng quát tại phòng khám Bảo Châu liên kết."
    ]
  },
  {
    nhan: "Chặng 2", ten: "Lý thuyết và mô phỏng",
    anh: { src: "img/khoi6-chang2-ly-thuyet-cabin.jpg", alt: "Buổi học lý thuyết đông học viên trong hội trường" },
    buoc: [
      "<strong>Học luật + mô phỏng online</strong> — Bắt buộc phải đủ số giờ online hoặc offline theo quy định. Ngoài ra Bảo Châu sẽ kèm 1-1 lý thuyết cho học viên qua văn phòng ôn luyện.",
      "<strong>Kiểm tra hết môn lý thuyết + mô phỏng</strong>",
      "<strong>Học cabin</strong> — bắt buộc học đủ 2 giờ trên cabin điện tử."
    ]
  },
  {
    nhan: "Chặng 3", ten: "Thực hành trên xe",
    anh: { src: "img/khoi6-chang3-sa-hinh.jpg", alt: "Học viên tập bài sa hình, giáo viên hướng dẫn ngay cạnh xe" },
    buoc: [
      "<strong>Học thực hành cơ bản</strong> — Làm quen xe, thao tác nền.",
      "<strong>Chạy đường trường (DAT)</strong> — 710km hạng B tự động · 810km hạng B số sàn · 825km hạng C1.",
      "<strong>Học 11 bài thi sa hình</strong>"
    ]
  },
  {
    nhan: "Chặng 4", ten: "Về đích",
    anh: { src: "img/khoi6-chang4-tong-on-thi.jpg", alt: "Học viên tổng ôn, hai tay trên vô-lăng trước kỳ thi sát hạch" },
    buoc: [
      "<strong>Kiểm tra hết môn thực hành</strong>",
      "<strong>Tổng ôn sa hình + ôn xe chip</strong> — Ôn luyện trên xe và sân gắn thiết bị chấm điểm như thi thật.",
      "<strong>Thi sát hạch</strong> — Kỳ thi sát hạch gồm 3 phần thi: Lý thuyết, Sa hình, Đường trường."
    ]
  }
];

/* ------------------------------------------------------------
   8. CÂU HỎI THƯỜNG GẶP — 10 CÂU (Khối 7)
   ⚠ Thứ tự xếp theo mạch quan tâm của người mới tìm hiểu, KHÔNG xếp ngẫu nhiên:
     câu 1–3 "tôi có học được không" → câu 4–6 nhóm tiền
     → câu 7–9 chi tiết vận hành → câu 10 đẩy sang CTA.
   THÊM CÂU MỚI: chèn vào đúng nhóm, đừng thêm vào cuối.
------------------------------------------------------------ */
const CAU_HOI = [
  {
    hoi: "Chưa từng cầm vô-lăng, học được không?",
    dap: "Được. Bắt đầu bằng buổi học thực hành cơ bản để làm quen xe và thao tác nền. Mỗi buổi 1 thầy – 1 trò – 1 xe nên không phải học ghép hay chờ tới lượt; bài nào chưa chắc thì tập lại bài đó, thầy đi cùng từng lượt."
  },
  {
    hoi: "Mất bao lâu thì có bằng?",
    dap: "Nộp hồ sơ tới khai giảng dưới 1 tháng; khai giảng tới ngày thi 3–4 tháng theo quy định. Gói Tiêu chuẩn khoảng 4 tháng, Cao cấp khoảng 3 tháng; gói Tiết kiệm không cam kết mốc cụ thể vì phụ thuộc lịch khai giảng và lịch thi của đơn vị tổ chức."
  },
  {
    hoi: "Đi làm giờ hành chính, học vào lúc nào?",
    dap: "Giờ thực hành do bạn và thầy tự thống nhất, không có lịch cứng. Trung tâm dạy cả thứ 7 và Chủ nhật; buổi tối thường đến 20h, sắp xếp được thì 21–22h. Lý thuyết học online nên không chiếm giờ làm."
  },
  {
    hoi: "Học phí đã gồm những gì, còn phải trả thêm khoản nào?",
    dap: "Đã gồm hồ sơ mở lớp khai giảng, phí khám sức khoẻ, học lý thuyết và thi hết môn, làm hồ sơ và chụp in ảnh, học vỡ, sa hình, tổng ôn, chạy DAT đủ km, công thầy và xăng xe. Chưa gồm lệ phí thi sát hạch 645.000đ — nộp trực tiếp cho đơn vị tổ chức thi theo quy định Nhà nước, Bảo Châu không thu khoản này; gói Cao cấp đã bao gồm."
  },
  {
    hoi: "Có trả góp không?",
    dap: "Có, lãi suất 0% cho tất cả hạng và tất cả gói. Bảo Châu tự cho học viên nợ, không qua công ty tài chính nên không thẩm định hồ sơ, không điều kiện. Lịch 4 đợt: hồ sơ mở lớp, sau khai giảng, trước buổi học lái thứ 2, trước buổi chạy DAT thứ 2."
  },
  {
    hoi: "Có chương trình hỗ trợ học phí không?",
    dap: "Có. Ngoài ưu đãi từng đợt khai giảng, Bảo Châu dành một số suất học bổng cho sinh viên và học viên có hoàn cảnh khó khăn. Số suất và mức hỗ trợ thay đổi theo từng đợt — bạn liên hệ tư vấn viên để được xét cụ thể."
  },
  {
    hoi: "Phần lý thuyết học online hay offline?",
    dap: "Lý thuyết học online qua Zoom và trên website của nhà trường, chủ động theo thời gian của bạn. Tuỳ từng thời điểm, theo quy định bạn có thể phải lên trung tâm học trực tiếp một số buổi. Dù online hay offline, kết quả thi vẫn phụ thuộc phần lớn vào việc bạn tự ôn bộ 600 câu — tư vấn viên sẽ nhắc lịch và hỗ trợ suốt quá trình."
  },
  {
    hoi: "Tôi tự đi khám sức khoẻ ở ngoài được không?",
    dap: "Được, nếu bạn không tiện qua phòng khám liên kết của Bảo Châu. Hai lưu ý bắt buộc: phòng khám phải được cấp phép khám sức khoẻ lái xe, và kết quả phải kèm phiếu xét nghiệm nước tiểu rời. Giấy khám sai quy chuẩn có thể bị từ chối khi đăng ký thi, nên bạn gửi ảnh cho tư vấn viên kiểm tra trước khi nộp hồ sơ."
  },
  {
    hoi: "Thi lần đầu chưa đạt thì sao?",
    dap: "Phí đăng ký thi lại 700.000đ, cộng phí phần bị trượt: lý thuyết 100.000đ, sa hình 350.000đ, đường trường 80.000đ. Ôn lại lý thuyết miễn phí — online hoặc lên văn phòng học trực tiếp với thầy; phần thực hành đăng ký bổ túc 350.000đ/giờ. Gói Cao cấp được miễn phí thi lại."
  },
  {
    hoi: "Vì sao cần tư vấn trước khi vào khoá?",
    dap: "Mỗi người một nhu cầu: xe gia đình số tự động, chạy dịch vụ, hay lái xe tải. Mười phút tư vấn giúp bạn chọn đúng hạng bằng, đúng gói theo quỹ thời gian và ngân sách, nắm rõ lộ trình học — thi trước khi đóng đồng nào. Tư vấn miễn phí, không ép đăng ký."
  }
];

/* ------------------------------------------------------------
   9. LỰA CHỌN TRONG FORM ĐĂNG KÝ
------------------------------------------------------------ */
const HANG_BANG = ["B số tự động", "B số sàn", "C1", "Chưa biết, cần tư vấn"];

/* Bấm Đăng ký xong, giữ trạng thái "Đang gửi…" bao nhiêu mili-giây rồi mới
   hiện màn hình cảm ơn. Đây là nhịp nghỉ cho khách kịp thấy thao tác đã
   nhận — KHÔNG phải thời gian chờ mạng, đơn đã gửi ngầm từ trước.
   Đặt 0 thì hiện cảm ơn tức thì. */
const CHO_CAM_ON = 1500;
