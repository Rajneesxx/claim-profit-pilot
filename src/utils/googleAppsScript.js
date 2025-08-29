/**
 * GOOGLE APPS SCRIPT TEMPLATE FOR EMAIL CAPTURE
 * 
 * Copy this entire code to your Google Apps Script project.
 * Deploy as a web app with permissions set to "Anyone" and "Execute as me"
 */

function doPost(e) {
  try {
    console.log('=== GOOGLE APPS SCRIPT RECEIVED REQUEST ===');
    console.log('Request parameters:', e);
    console.log('Parameter object:', e.parameter);
    console.log('Post data:', e.postData);
    
    // Get the spreadsheet (replace with your spreadsheet ID)
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace this!
    const SHEET_NAME = 'Email Captures'; // Change if needed
    
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (error) {
      console.error('Failed to open spreadsheet:', error);
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Spreadsheet not found',
          message: 'Please update SPREADSHEET_ID in the script'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 9).setValues([[
        'Timestamp', 'Email', 'Subject', 'Source', 'Body', 'Date', 'User Agent', 'Origin', 'Token'
      ]]);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    }
    
    // Extract data from the request
    const emailData = {
      timestamp: new Date(),
      email: e.parameter.sender || e.parameter.email || '',
      subject: e.parameter.subject || '',
      source: e.parameter.source || '',
      body: e.parameter.body || '',
      date: e.parameter.date || '',
      userAgent: e.parameter.userAgent || '',
      origin: e.parameter.triggered_from || '',
      token: e.parameter.token || ''
    };
    
    console.log('Extracted email data:', emailData);
    
    // Validate required fields
    if (!emailData.email) {
      console.error('No email provided');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Email is required',
          received: e.parameter
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add data to spreadsheet
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
    
    console.log('✅ Successfully added row to spreadsheet');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email captured successfully',
        email: emailData.email,
        timestamp: emailData.timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ Error in doPost:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
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

// Test function you can run manually
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
  console.log('Test result:', result.getContent());
  return result.getContent();
}