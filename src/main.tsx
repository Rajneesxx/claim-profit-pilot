import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getSlackBotToken, setSlackChannel } from './utils/slack';

// Initialize Slack bot configuration in localStorage for frontend usage
try {
  const botToken = getSlackBotToken();
  
  if (!botToken) {
    console.info('[Slack] Bot token not configured. Set via:');
    console.info('localStorage.setItem("slack_bot_token", "xoxb-your-bot-token")');
    console.info('localStorage.setItem("slack_channel", "#your-channel")');
  } else {
    console.info('[Slack] Bot token found in localStorage.');
  }
  
  // Set default channel if not configured
  if (!localStorage.getItem('slack_channel')) {
    setSlackChannel('#general');
    console.info('[Slack] Default channel set to #general.');
  }
} catch (e) {
  console.warn('[Slack] Unable to access localStorage to configure bot settings.', e);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
