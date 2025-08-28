// Slack bot token utilities for frontend-only usage
// Note: For secure production use, prefer server-side/Edge Function with a secret.

export type SlackMessage = {
  channel: string;
  text: string;
  blocks?: any[];
};

export const getSlackBotToken = (): string => {
  try {
    return localStorage.getItem('slack_bot_token') || '';
  } catch {
    return '';
  }
};

export const setSlackBotToken = (token: string) => {
  try {
    localStorage.setItem('slack_bot_token', token);
  } catch (e) {
    console.error('Failed to save Slack bot token to localStorage', e);
  }
};

export const getSlackChannel = (): string => {
  try {
    return localStorage.getItem('slack_channel') || '#general';
  } catch {
    return '#general';
  }
};

export const setSlackChannel = (channel: string) => {
  try {
    localStorage.setItem('slack_channel', channel);
  } catch (e) {
    console.error('Failed to save Slack channel to localStorage', e);
  }
};

export async function sendSlackMessage(message: string, blocks?: any[]) {
  const botToken = getSlackBotToken();
  const channel = getSlackChannel();
  
  if (!botToken) {
    console.warn('Slack bot token not set. Set via localStorage.setItem("slack_bot_token", "xoxb-your-bot-token") and localStorage.setItem("slack_channel", "#your-channel")');
    return { ok: false, reason: 'missing_bot_token' } as const;
  }

  const payload: SlackMessage = {
    channel,
    text: message,
    ...(blocks && { blocks })
  };

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (result.ok) {
      console.info('✅ Slack message sent successfully:', result);
      return { ok: true, result } as const;
    } else {
      console.error('❌ Slack API error:', result);
      return { ok: false, error: result.error } as const;
    }
  } catch (error) {
    console.error('❌ Error sending Slack message:', error);
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
