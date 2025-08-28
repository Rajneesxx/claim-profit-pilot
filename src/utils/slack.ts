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
    console.warn('Slack webhook URL not set. Set via localStorage.setItem("slack_webhook_url", "https://hooks.slack.com/services/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")');
    return { ok: false, reason: 'missing_webhook_url' } as const;
  }

  const payload: SlackPayload = blocks ? { text: message, blocks } : { text: message };

  try {
    // Use no-cors and omit non-safelisted headers to avoid preflight; Slack will still parse JSON body
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
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

export function buildEmailCaptureBlocks(
  email: string,
  source: 'ROI Calculator' | 'PDF Request' | 'Other' = 'ROI Calculator',
  timestampLocal: string = new Date().toLocaleString()
) {
  return [
    {
      type: 'section',
      text: { type: 'mrkdwn', text: ':incoming_envelope: *Email Captured*' },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Email:*\n${email}` },
        { type: 'mrkdwn', text: `*Source:*\n${source}` },
        { type: 'mrkdwn', text: `*Time:*\n${timestampLocal}` },
      ],
    },
  ];
}
