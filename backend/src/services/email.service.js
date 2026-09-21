const nodemailer = require('nodemailer');

// Build auth object based on available credentials (EMAIL_PASS for App Password vs OAuth2)
const getAuthConfig = () => {
  // If EMAIL_PASS is set and looks like a 16-char Google App Password (no special chars like @)
  if (process.env.EMAIL_PASS && !process.env.EMAIL_PASS.includes('@') && process.env.EMAIL_PASS.length >= 16) {
    return {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    };
  }
  // Otherwise use OAuth2 with CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN
  return {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  };
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: getAuthConfig(),
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ Email server verification warning:', error.message);
    console.warn('💡 Tip: You can set EMAIL_PASS=<your-gmail-app-password> in .env to use Gmail App Passwords directly!');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"LAXMI CHIT FUNDS" <${process.env.EMAIL_USER}>`, // sender address
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

// 1. Welcome Registration Email
async function sendRegistertionEmail(userEmail, name) {
    const subject = "Welcome to LAXMI CHIT FUNDS";

    const text = `Hello ${name},

Welcome to LAXMI CHIT FUNDS!

Your account has been successfully registered.

Thank you for choosing our platform.

Best regards,
LAXMI CHIT FUNDS Team`;

    const html = `
        <div style="font-family: Arial, sans-serif; background-color: #0d111a; color: #f8fafc; padding: 24px; border-radius: 12px;">
          <h2 style="color: #06b6d4; margin-bottom: 16px;">Welcome to LAXMI CHIT FUNDS</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your account has been <strong style="color: #10b981;">successfully registered</strong>.</p>
          <p>We're excited to have you on board with our double-entry ledger platform.</p>
          <br>
          <p style="color: #94a3b8; font-size: 13px;">Best regards,<br><strong>LAXMI CHIT FUNDS Team</strong></p>
        </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

// 2. Money Sent / Debit Notification Email
async function sendTransactionEmail(userEmail, name, amount, toAccount, newBalance) {
    const subject = `₹${amount} Deducted - Money Transferred`;

    const text = `Hello ${name},

Your transaction has been completed successfully.

Type: DEBIT (Money Deducted)
Amount Deducted: ₹${amount}
Transferred To Account: ${toAccount}
Updated Account Balance: ₹${newBalance}

Thank you for using LAXMI CHIT FUNDS.

Best regards,
LAXMI CHIT FUNDS Team`;

    const html = `
        <div style="font-family: Arial, sans-serif; background-color: #0d111a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="color: #f43f5e; margin-bottom: 16px;">₹${amount} Deducted (DEBIT)</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your money transfer has been completed successfully.</p>

          <ul style="background-color: #1e293b; padding: 16px 24px; border-radius: 8px; list-style: none;">
              <li style="margin-bottom: 8px;"><strong>Transaction Type:</strong> <span style="color: #f43f5e; font-weight: bold;">DEBIT</span></li>
              <li style="margin-bottom: 8px;"><strong>Amount Deducted:</strong> <span style="color: #f43f5e; font-size: 16px; font-weight: bold;">-₹${amount}</span></li>
              <li style="margin-bottom: 8px;"><strong>Transferred To:</strong> <code>${toAccount}</code></li>
              <li><strong>Updated Account Balance:</strong> <span style="color: #10b981; font-weight: bold;">₹${newBalance}</span></li>
          </ul>

          <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">Best regards,<br><strong>LAXMI CHIT FUNDS Team</strong></p>
        </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

// 3. Money Received / Credit Notification Email
async function sendCreditEmail(userEmail, name, amount, fromAccount, newBalance) {
    const subject = `₹${amount} Credited - Money Received!`;

    const text = `Hello ${name},

You have received money in your account!

Type: CREDIT (Money Received)
Amount Credited: ₹${amount}
Received From Account: ${fromAccount}
Updated Account Balance: ₹${newBalance}

Thank you for using LAXMI CHIT FUNDS.

Best regards,
LAXMI CHIT FUNDS Team`;

    const html = `
        <div style="font-family: Arial, sans-serif; background-color: #0d111a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="color: #10b981; margin-bottom: 16px;">₹${amount} Received (CREDIT)</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>You have received funds into your account!</p>

          <ul style="background-color: #1e293b; padding: 16px 24px; border-radius: 8px; list-style: none;">
              <li style="margin-bottom: 8px;"><strong>Transaction Type:</strong> <span style="color: #10b981; font-weight: bold;">CREDIT</span></li>
              <li style="margin-bottom: 8px;"><strong>Amount Credited:</strong> <span style="color: #10b981; font-size: 16px; font-weight: bold;">+₹${amount}</span></li>
              <li style="margin-bottom: 8px;"><strong>Received From:</strong> <code>${fromAccount}</code></li>
              <li><strong>Updated Account Balance:</strong> <span style="color: #10b981; font-weight: bold;">₹${newBalance}</span></li>
          </ul>

          <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">Best regards,<br><strong>LAXMI CHIT FUNDS Team</strong></p>
        </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

// 4. Transaction Failed Email
async function sendTransactionFailedEmail(userEmail, name, amount, toAccount, reason) {
    const subject = "Transaction Failed ❌";

    const text = `Hello ${name},

We regret to inform you that your transaction could not be completed.

Attempted Amount: ₹${amount}
Recipient Account: ${toAccount}
Reason: ${reason}

No amount has been deducted from your account.

If you believe this is an error, please contact our support team.

Best regards,
LAXMI CHIT FUNDS Team`;

    const html = `
        <div style="font-family: Arial, sans-serif; background-color: #0d111a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #ef4444;">
          <h2 style="color: #ef4444; margin-bottom: 16px;">Transaction Failed ❌</h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>We regret to inform you that your transaction could not be completed.</p>

          <ul style="background-color: #1e293b; padding: 16px 24px; border-radius: 8px; list-style: none;">
              <li style="margin-bottom: 8px;"><strong>Attempted Amount:</strong> ₹${amount}</li>
              <li style="margin-bottom: 8px;"><strong>Recipient Account:</strong> <code>${toAccount}</code></li>
              <li style="margin-bottom: 8px;"><strong>Reason:</strong> <span style="color: #ef4444; font-weight: bold;">${reason}</span></li>
          </ul>

          <p style="color: #10b981; font-weight: bold;">No amount has been deducted from your account.</p>

          <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">Best regards,<br><strong>LAXMI CHIT FUNDS Team</strong></p>
        </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistertionEmail,
  sendTransactionEmail,
  sendCreditEmail,
  sendTransactionFailedEmail
};