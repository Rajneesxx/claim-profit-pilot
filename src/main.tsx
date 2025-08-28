import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getSlackWebhookUrl, setSlackWebhookUrl } from './utils/slack';

const DEFAULT_SLACK_WEBHOOK = 'https://hooks.slack.com/services/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';

// Initialize Slack webhook URL in localStorage for frontend usage
try {
  if (!getSlackWebhookUrl()) {
    setSlackWebhookUrl(DEFAULT_SLACK_WEBHOOK);
    console.info('[Slack] Webhook URL configured from app defaults.');
  }
} catch (e) {
  console.warn('[Slack] Unable to access localStorage to configure webhook URL.', e);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
