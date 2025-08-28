// Lightweight Slack webhook utilities for frontend-only usage
// Note: For secure production use, prefer server-side/Edge Function with a secret.

export type SlackPayload = {
  text: string;
  blocks?: any[];
};

export const getSlackWebhookUrl = (): string => {
  try {
    return localStorage.getItem('slack_webhook_url') || '';
  } catch {
    return '';
  }
};

export const setSlackWebhookUrl = (url: string) => {
  try {
    localStorage.setItem('slack_webhook_url', url);
  } catch (e) {
    console.error('Failed to save Slack webhook URL to localStorage', e);
  }
};

export async function sendSlackMessage(message: string, blocks?: any[]) {
  const webhookUrl = getSlackWebhookUrl();
  if (!webhookUrl) {
    console.warn('Slack webhook URL not set. Use localStorage.setItem("slack_webhook_url", "https://hooks.slack.com/services/xxx")');
    return { ok: false, reason: 'missing_webhook_url' } as const;
  }

  const payload: SlackPayload = blocks ? { text: message, blocks } : { text: message };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'no-cors', // Slack doesn't send CORS headers; no-cors avoids browser blocking
      body: JSON.stringify(payload),
    });

    // With no-cors, we can't read status. Log as best-effort sent.
    console.info('Slack message sent (best-effort, no-cors).');
    return { ok: true } as const;
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return { ok: false, error } as const;
  }
}

export function buildSignInBlocks(email: string, timestampLocal: string) {
  return [
    {
      type: 'section',
      text: { type: 'mrkdwn', text: ':white_check_mark: *User Signed In*' },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Email:*\n${email}` },
        { type: 'mrkdwn', text: `*Time:*\n${timestampLocal}` },
      ],
    },
  ];
}
