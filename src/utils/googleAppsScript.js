/**
 * GOOGLE APPS SCRIPT TEMPLATE FOR EMAIL CAPTURE
 */
function doPost(e) {
  try {
    Logger.log("=== Incoming Request ===");
    Logger.log(JSON.stringify(e));

    const SPREADSHEET_ID = '1_E8qTa3xFAIrVnHEEcirNxNVsa2MxGCXuIxdhDTRenI';
    const SHEET_NAME = 'Email Captures';

    let spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    // Parse JSON or fallback to form-data
    let data = {};
    if (e.postData && e.postData.contents) {
      try { 
        data = JSON.parse(e.postData.contents); 
      } catch (_) { 
        data = e.parameter || {}; 
      }
    } else {
      data = e.parameter || {};
    }

    const emailData = {
      timestamp: new Date(),
      email: data.sender || data.email || '',
      subject: data.subject || '',
      source: data.source || '',
      body: data.body || '',
      date: data.date || data.timestamp || '',
      userAgent: data.userAgent || '',
      origin: data.triggered_from || '',
      token: data.token || ''
    };

    if (!emailData.email) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "No email" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Append row
    const rowData = [
      emailData.timestamp,
      emailData.email,
      emailData.subject,
      emailData.source,
      emailData.body,
      emailData.date,
      emailData.userAgent,
      emailData.origin,
      emailData.token
    ];
    sheet.appendRow(rowData);

    Logger.log('✅ Successfully added row to spreadsheet');

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Email captured successfully',
      email: emailData.email,
      timestamp: emailData.timestamp
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('❌ Error in doPost: ' + error);

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      stack: error.stack
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Google Apps Script is running',
      timestamp: new Date(),
      message: 'Use POST requests to capture emails'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function testEmailCapture() {
  const testData = {
    parameter: {
      sender: 'test@example.com',
      email: 'test@example.com',
      subject: 'Test Email Capture',
      source: 'Manual Test',
      body: 'This is a test email capture',
      date: new Date().toLocaleString(),
      userAgent: 'Test Agent',
      triggered_from: 'Manual Test'
    }
  };
  
  const result = doPost(testData);
  Logger.log('Test result: ' + result.getContent());
  return result.getContent();
}
