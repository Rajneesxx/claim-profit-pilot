// Utility for sending emails via a configurable webhook (e.g., Make/Zapier/Apps Script/your backend)
// Stores config in localStorage so non-technical users can set it quickly

export type EmailAttachment = {
  filename: string;
  content_base64: string; // base64 without data URL prefix
  content_type?: string; // e.g. application/pdf
};

export type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  from?: string;
  replyTo?: string;
  metadata?: Record<string, any>;
};

const URL_KEY = 'email_webhook_url';
const TOKEN_KEY = 'email_webhook_token';

export const getEmailWebhookUrl = (): string => {
  try {
    return localStorage.getItem(URL_KEY) || '';
  } catch {
    return '';
  }
};

export const setEmailWebhookUrl = (url: string) => {
  try {
    localStorage.setItem(URL_KEY, url);
  } catch (e) {
    console.error('Failed to save email webhook URL', e);
  }
};

export const getEmailWebhookToken = (): string => {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const setEmailWebhookToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to save email webhook token', e);
  }
};

export async function sendEmailWithAttachment(payload: EmailPayload) {
  const webhookUrl = getEmailWebhookUrl();
  const token = getEmailWebhookToken();

  if (!webhookUrl) {
    console.warn('Email webhook URL not set. Use localStorage.setItem("email_webhook_url", "https://your-endpoint")');
    return { ok: false, reason: 'missing_webhook_url' } as const;
  }

  // Build body with optional token and basic validation
  const body = {
    ...payload,
    token: token || undefined,
    triggered_from: typeof window !== 'undefined' ? window.location.href : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  };

  try {
    // Try JSON first (best for most services)
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return { ok: true } as const;
    }

    // If non-OK, try no-cors mode (some endpoints accept but don't reply with CORS headers)
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify(body),
    });

    // In no-cors we cannot read status; assume success
    return { ok: true, assumed: true } as const;
  } catch (errJSON) {
    console.warn('Email JSON POST failed, trying URL-encoded fallback', errJSON);
    try {
      const form = new URLSearchParams();
      form.append('to', payload.to);
      form.append('subject', payload.subject);
      if (payload.text) form.append('text', payload.text);
      if (payload.html) form.append('html', payload.html);
      if (token) form.append('token', token);
      if (payload.attachments && payload.attachments.length) {
        // Send first attachment inline; services can parse JSON string for multiple
        form.append('attachments', JSON.stringify(payload.attachments));
      }

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        mode: 'no-cors',
        body: form.toString(),
      });
      return { ok: true, assumed: true } as const;
    } catch (errForm) {
      console.error('Email URL-encoded POST failed', errForm);
      return { ok: false, error: errForm } as const;
    }
  }
}
