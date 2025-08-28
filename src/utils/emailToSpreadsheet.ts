// Email to Spreadsheet utilities for sending email data to Google Sheets via webhook
// This can work with Zapier webhooks, Google Apps Script, or any webhook service

export type EmailData = {
  sender: string;
  subject: string;
  date: string;
  body: string;
  source: string;
  timestamp: string;
};

export const getWebhookUrl = (): string => {
  try {
    return localStorage.getItem('spreadsheet_webhook_url') || '';
  } catch {
    return '';
  }
};

export const setWebhookUrl = (url: string) => {
  try {
    localStorage.setItem('spreadsheet_webhook_url', url);
  } catch (e) {
    console.error('Failed to save webhook URL to localStorage', e);
  }
};

export const getWebhookToken = (): string => {
  try {
    return localStorage.getItem('spreadsheet_webhook_token') || '';
  } catch {
    return '';
  }
};

export const setWebhookToken = (token: string) => {
  try {
    localStorage.setItem('spreadsheet_webhook_token', token);
  } catch (e) {
    console.error('Failed to save webhook token to localStorage', e);
  }
};

export async function appendToSpreadsheet(emailData: EmailData) {
  const webhookUrl = getWebhookUrl();
  const token = getWebhookToken();
  
  if (!webhookUrl) {
    console.warn('Spreadsheet webhook URL not set. Set via localStorage.setItem("spreadsheet_webhook_url", "your-webhook-url")');
    return { ok: false, reason: 'missing_webhook_url' } as const;
  }

  try {
    const payload: Record<string, any> = {
      ...emailData,
      triggered_from: window.location.origin,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };
    if (token) payload.token = token;

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify(payload),
    });

    // Since we're using no-cors, we can't read the response
    // but the request should have been sent
    console.info('✅ Email data sent to spreadsheet successfully');
    return { ok: true } as const;
  } catch (error) {
    console.error('❌ Error sending email data to spreadsheet:', error);
    return { ok: false, error } as const;
  }
}

export function buildEmailData(
  email: string,
  source: 'ROI Calculator' | 'PDF Request' | 'Sign In' | 'Other' = 'ROI Calculator',
  subject?: string,
  body?: string
): EmailData {
  const timestamp = new Date().toISOString();
  const localTime = new Date().toLocaleString();
  
  return {
    sender: email,
    subject: subject || `${source} - Email Capture`,
    date: localTime,
    body: body || `Email captured from ${source} at ${localTime}`,
    source,
    timestamp,
  };
}