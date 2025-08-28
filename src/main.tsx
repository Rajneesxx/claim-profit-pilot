import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Initialize spreadsheet webhook configuration
try {
  const defaultWebhook = 'https://script.google.com/macros/s/AKfycbxIL4ufHkEWZ0PaLf7qY5maX3GSxrPLBN2ovLIVb2gNbcv9SJ2lBMRAE5EKiHoHKt-GKw/exec';
  const existing = localStorage.getItem('spreadsheet_webhook_url');
  if (!existing) {
    localStorage.setItem('spreadsheet_webhook_url', defaultWebhook);
    console.info('[Spreadsheet] Default webhook URL set to Google Apps Script endpoint.');
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
