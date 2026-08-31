/**
 * BẢO CHÂU — cầu nối giữa landing page và Google Sheet
 *
 * Làm 3 việc trên CÙNG MỘT Sheet:
 *   1. doPost  — nhận đăng ký từ form → ghi vào tab "DangKy" → báo Telegram
 *   2. doGet   — trả về số suất còn lại, đọc từ tab "NoiDung"
 *   3. chuanBiSheet — chạy 1 lần để tạo sẵn 2 tab đúng định dạng
 *
 * ⚠ SHEET GIỮ NGUYÊN QUYỀN "CHỈ MÌNH TÔI".
 * Script này chạy bằng quyền của chủ Sheet (Execute as: Me), nên nó đọc/ghi
 * được. Khách chỉ gọi tới script, không hề nhìn thấy Sheet.
 *
 * CÁCH DÙNG: xem HUONG-DAN-KET-NOI-FORM.md
 */

// ==== CẤU HÌNH — sửa 3 dòng dưới đây ====
var SHEET_ID = '14_qwBs78s0vwufR4RnLPnTzzJyIpLIw1dL1gGl6LhWs';
var TELEGRAM_BOT_TOKEN = 'DAN_TOKEN_BOT_VAO_DAY';
var TELEGRAM_CHAT_ID   = 'DAN_CHAT_ID_VAO_DAY';
// ========================================

var TAB_DANG_KY  = 'DangKy';   // nơi lưu khách đăng ký
var TAB_NOI_DUNG = 'NoiDung';  // nơi sửa số suất còn lại
var CACHE_GIAY   = 60;         // đệm 60s, đỡ phải mở Sheet mỗi lượt khách vào

var TIEU_DE = ['Thời gian', 'Họ tên', 'Số điện thoại', 'Hạng bằng', 'Vị trí form', 'Trang', 'Nguồn truy cập'];


/* ============================================================
   1. NHẬN ĐĂNG KÝ TỪ FORM
   ============================================================ */
function doPost(e) {
  var kq = { ok: false };
  try {
    var d = JSON.parse(e.postData.contents);
    var thoiGian = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');

    ghiDangKy([
      thoiGian,
      d.hoTen || '',
      "'" + (d.soDienThoai || ''),   // dấu ' để Sheet giữ số 0 đầu
      d.hangBang || '',
      d.viTri || '',
      d.trang || '',
      d.nguon || '(truy cập trực tiếp)'
    ]);

    guiTelegram(
      '🔔 <b>LEAD MỚI — BẢO CHÂU</b>\n\n' +
      '👤 <b>' + escapeHtml(d.hoTen || '') + '</b>\n' +
      '📞 <a href="tel:' + (d.soDienThoai || '') + '">' + (d.soDienThoai || '') + '</a>\n' +
      '🚗 Quan tâm: ' + escapeHtml(d.hangBang || '') + '\n' +
      '📍 Form: ' + escapeHtml(d.viTri || '') + '\n' +
      '🕒 ' + thoiGian + '\n' +
      '🌐 Nguồn: ' + escapeHtml(d.nguon || 'truy cập trực tiếp') + '\n' +
      '🎟 Còn lại: ' + docSuatChoTelegram()
    );

    kq.ok = true;
  } catch (err) {
    kq.error = String(err);
    try { guiTelegram('⚠️ Lỗi nhận lead: ' + String(err)); } catch (e2) {}
  }
  return traJson(JSON.stringify(kq));
}


/* ============================================================
   2. TRẢ VỀ SỐ SUẤT CÒN LẠI CHO TRANG
   Trang gọi tới đây; Sheet vẫn riêng tư hoàn toàn.
   ============================================================ */
function doGet(e) {
  var cache = CacheService.getScriptCache();
  var sanCo = cache.get('noidung');
  if (sanCo) return traJson(sanCo);

  var kq = {};
  try {
    var bang = layTab(TAB_NOI_DUNG).getDataRange().getValues();
    for (var i = 0; i < bang.length; i++) {
      var khoa = String(bang[i][0] || '').trim().toLowerCase();
      if (!khoa || khoa === 'khoa') continue;      // bỏ dòng tiêu đề
      kq[khoa] = bang[i][1];
    }
  } catch (err) {
    kq.loi = String(err);
  }

  var chu = JSON.stringify(kq);
  cache.put('noidung', chu, CACHE_GIAY);
  return traJson(chu);
}


/* ============================================================
   3. CHẠY 1 LẦN ĐỂ TẠO SẴN 2 TAB
   ============================================================ */
function chuanBiSheet() {
  var dk = layTab(TAB_DANG_KY);
  if (dk.getLastRow() === 0) {
    dk.appendRow(TIEU_DE);
    dk.getRange(1, 1, 1, TIEU_DE.length)
      .setFontWeight('bold').setBackground('#072644').setFontColor('#FFFFFF');
    dk.setFrozenRows(1);
    dk.setColumnWidth(1, 150);
    dk.setColumnWidth(2, 190);
    dk.setColumnWidth(3, 130);
    dk.setColumnWidth(4, 170);
  }

  var nd = layTab(TAB_NOI_DUNG);
  if (nd.getLastRow() === 0) {
    nd.appendRow(['khoa', 'gia_tri']);
    nd.appendRow(['suat_con_lai', 7]);
    nd.appendRow(['tong_suat', 20]);
    nd.getRange(1, 1, 1, 2)
      .setFontWeight('bold').setBackground('#072644').setFontColor('#FFFFFF');
    nd.setFrozenRows(1);
    nd.setColumnWidth(1, 180);
    nd.setColumnWidth(2, 120);
    nd.getRange('A2:A3').setNote('Không sửa cột này — trang tìm đúng tên khoá ở đây.');
  }

  SpreadsheetApp.flush();
  return 'Xong. Mở Sheet sẽ thấy 2 tab: ' + TAB_DANG_KY + ' và ' + TAB_NOI_DUNG;
}


/* ============================================================
   HÀM PHỤ
   ============================================================ */
function layTab(ten) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(ten);
  if (!sheet) sheet = ss.insertSheet(ten);
  return sheet;
}

function ghiDangKy(hang) {
  var sheet = layTab(TAB_DANG_KY);
  if (sheet.getLastRow() === 0) chuanBiSheet();
  sheet.appendRow(hang);
}

/* Đọc số suất để đính kèm vào tin Telegram — hỏng thì bỏ qua, không chặn việc ghi lead */
function docSuatChoTelegram() {
  try {
    var bang = layTab(TAB_NOI_DUNG).getDataRange().getValues();
    var con = '', tong = '';
    for (var i = 0; i < bang.length; i++) {
      var k = String(bang[i][0] || '').trim().toLowerCase();
      if (k === 'suat_con_lai') con = bang[i][1];
      if (k === 'tong_suat')    tong = bang[i][1];
    }
    return (con === '' ? '?' : con) + '/' + (tong === '' ? '?' : tong) + ' suất';
  } catch (err) {
    return 'không đọc được';
  }
}

function traJson(chuoi) {
  return ContentService.createTextOutput(chuoi).setMimeType(ContentService.MimeType.JSON);
}

function guiTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.indexOf('DAN_') === 0) return;
  UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
    method: 'post',
    payload: {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: 'true'
    },
    muteHttpExceptions: true
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


/* ============================================================
   KIỂM TRA — chạy trực tiếp trong Apps Script
   ============================================================ */

/** Kiểm tra chiều GHI: phải thấy 1 dòng trong tab DangKy + 1 tin Telegram */
function kiemTraGhi() {
  doPost({ postData: { contents: JSON.stringify({
    hoTen: 'Nguyễn Văn Test',
    soDienThoai: '0912345678',
    hangBang: 'B số tự động',
    viTri: 'Hero',
    trang: 'https://daotaolaixebaochau.com/',
    nguon: 'kiểm tra thủ công'
  }) } });
}

/** Kiểm tra chiều ĐỌC: xem Nhật ký (Execution log) phải in ra {"suat_con_lai":7,...} */
function kiemTraDoc() {
  CacheService.getScriptCache().remove('noidung');   // bỏ đệm để đọc số mới nhất
  var kq = doGet({}).getContent();
  Logger.log(kq);
  return kq;
}
