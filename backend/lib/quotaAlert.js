const nodemailer = require('nodemailer');

// Edit the email content here.
const EMAIL_SUBJECT = 'Game Genie Wordle: OpenAI credits have run out';
const EMAIL_BODY = 'OpenAI reported insufficient quota. Game Genie is serving fallback words until credits are added.';

// One email per cooldown window, so a burst of failing requests does not flood the inbox.
// In memory, so it resets on a server restart.
const COOLDOWN_MS = 6 * 60 * 60 * 1000;
let lastSentAt = 0;

function isQuotaError(err) {
  return err?.code === 'insufficient_quota' || err?.error?.code === 'insufficient_quota';
}

async function sendAlert() {
  const { ALERT_GMAIL_USER, ALERT_GMAIL_APP_PASSWORD, ALERT_EMAIL_TO } = process.env;
  if (!ALERT_GMAIL_USER || !ALERT_GMAIL_APP_PASSWORD || !ALERT_EMAIL_TO) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: ALERT_GMAIL_USER, pass: ALERT_GMAIL_APP_PASSWORD }
  });
  await transporter.sendMail({
    from: ALERT_GMAIL_USER,
    to: ALERT_EMAIL_TO,
    subject: EMAIL_SUBJECT,
    text: EMAIL_BODY
  });
}

// Fire-and-forget: never throws and never delays the request that triggered it.
function notifyIfQuotaExhausted(err) {
  if (!isQuotaError(err)) return;
  const now = Date.now();
  if (now - lastSentAt < COOLDOWN_MS) return;
  lastSentAt = now;
  sendAlert().catch(mailErr => {
    lastSentAt = 0; // allow a retry on the next quota error
    console.error('⚠️ Quota alert email failed:', mailErr.message);
  });
}

module.exports = { notifyIfQuotaExhausted, isQuotaError };
