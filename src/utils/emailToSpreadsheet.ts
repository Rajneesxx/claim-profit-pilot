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

    // 1) Prefer URL-encoded form (easiest for Apps Script to parse into e.parameter.sender)
    try {
      const formData = new URLSearchParams();
      // Explicit flat string fields for maximum compatibility
      formData.append('sender', String(payload.sender || ''));
      formData.append('email', String(payload.sender || ''));
      formData.append('subject', String(payload.subject || ''));
      formData.append('source', String(payload.source || ''));
      formData.append('body', String(payload.body || ''));
      formData.append('date', String(payload.date || ''));
      formData.append('timestamp', String(payload.timestamp || ''));
      formData.append('triggered_from', String(payload.triggered_from || ''));
      formData.append('userAgent', String(payload.userAgent || ''));
      if (token) formData.append('token', String(token));

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        mode: 'no-cors',
        body: formData.toString(),
      });

      console.info('✅ Email data sent via application/x-www-form-urlencoded');
      return { ok: true } as const;
    } catch (e) {
      console.warn('Form-encoded POST failed, trying sendBeacon/JSON', e);
    }

    // 2) Try navigator.sendBeacon with application/json
    try {
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        const beaconBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        const beaconOk = (navigator as any).sendBeacon(webhookUrl, beaconBlob);
        if (beaconOk) {
          console.info('✅ Email data sent via sendBeacon');
          return { ok: true } as const;
        }
      }
    } catch (e) {
      console.warn('sendBeacon failed, falling back to JSON fetch', e);
    }

    // 3) Fallback to JSON POST
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      console.info('✅ Email data sent via JSON');
      return { ok: true } as const;
    } catch (e) {
      console.error('JSON POST failed', e);
    }

    // If all strategies failed
    return { ok: false, reason: 'all_strategies_failed' } as const;
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
