import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Initialize spreadsheet webhook configuration
try {
  if (!localStorage.getItem('spreadsheet_webhook_url')) {
    console.info('[Spreadsheet] Webhook URL not configured. Set via:');
    console.info('localStorage.setItem("spreadsheet_webhook_url", "your-webhook-url")');
  } else {
    console.info('[Spreadsheet] Webhook URL found in localStorage.');
  }
} catch (e) {
  console.warn('[Spreadsheet] Unable to access localStorage to configure webhook settings.', e);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
