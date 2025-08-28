import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getSlackWebhookUrl, setSlackWebhookUrl } from './utils/slack';

const DEFAULT_SLACK_WEBHOOK = 'https://hooks.slack.com/services/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';

// Initialize Slack webhook URL in localStorage for frontend usage
try {
  const current = getSlackWebhookUrl();
  const OLD_WEBHOOKS = [
    'https://hooks.slack.com/services/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',
  ];

  if (!current || OLD_WEBHOOKS.includes(current)) {
    setSlackWebhookUrl(DEFAULT_SLACK_WEBHOOK);
    console.info('[Slack] Webhook URL configured from app defaults.');
  } else {
    console.info('[Slack] Using existing webhook URL from localStorage.');
  }
} catch (e) {
  console.warn('[Slack] Unable to access localStorage to configure webhook URL.', e);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
