/**
 * BẢO CHÂU — nhận lead từ landing page
 * Ghi vào Google Sheet + gửi thông báo Telegram ngay lập tức.
 *
 * CÁCH DÙNG: xem file HUONG-DAN-KET-NOI-FORM.md
 */

// ==== CẤU HÌNH — sửa 3 dòng dưới đây ====
var SHEET_ID = '14_qwBs78s0vwufR4RnLPnTzzJyIpLIw1dL1gGl6LhWs';
var TELEGRAM_BOT_TOKEN = 'DAN_TOKEN_BOT_VAO_DAY';
var TELEGRAM_CHAT_ID   = 'DAN_CHAT_ID_VAO_DAY';
// ========================================

var TIEU_DE = ['Thời gian', 'Họ tên', 'Số điện thoại', 'Hạng bằng', 'Vị trí form', 'Trang', 'Nguồn truy cập'];

function doPost(e) {
  var kq = { ok: false };
  try {
    var d = JSON.parse(e.postData.contents);
    var thoiGian = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');

    ghiSheet([
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
      '🌐 Nguồn: ' + escapeHtml(d.nguon || 'truy cập trực tiếp')
    );

    kq.ok = true;
  } catch (err) {
    kq.error = String(err);
    try { guiTelegram('⚠️ Lỗi nhận lead: ' + String(err)); } catch (e2) {}
  }
  return ContentService.createTextOutput(JSON.stringify(kq)).setMimeType(ContentService.MimeType.JSON);
}

function ghiSheet(hang) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(TIEU_DE);
    sheet.getRange(1, 1, 1, TIEU_DE.length)
      .setFontWeight('bold').setBackground('#072644').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 190);
    sheet.setColumnWidth(3, 130);
    sheet.setColumnWidth(4, 170);
  }
  sheet.appendRow(hang);
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

/** Chạy hàm này 1 lần để kiểm tra: phải thấy 1 dòng trong Sheet + 1 tin Telegram */
function kiemTra() {
  doPost({ postData: { contents: JSON.stringify({
    hoTen: 'Nguyễn Văn Test',
    soDienThoai: '0912345678',
    hangBang: 'B số tự động',
    viTri: 'Hero',
    trang: 'https://baochau.example/',
    nguon: 'kiểm tra thủ công'
  }) } });
}
