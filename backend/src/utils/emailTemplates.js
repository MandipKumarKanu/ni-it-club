/**
 * Email Templates with Neobrutalist Design
 * Matching the UI's bold, colorful aesthetic
 */

const colors = {
  black: "#000000",
  white: "#FFFFFF",
  neon: "#fabb0e",
  cyan: "#087fef",
  pink: "#ff00ff",
  blue: "#08708d",
};

/**
 * Base email template with neobrutalist styling
 */
const getBaseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NI-IT Club</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Space Grotesk', sans-serif;
      background-color: #f5f5f5;
      background-image: radial-gradient(#000 1px, transparent 1px);
      background-size: 40px 40px;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${colors.white};
    }
    
    .header {
      background-color: ${colors.black};
      padding: 30px 20px;
      text-align: center;
      border: 4px solid ${colors.black};
    }
    
    .header h1 {
      margin: 0;
      color: ${colors.neon};
      font-size: 36px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -1px;
    }
    
    .content {
      padding: 40px 30px;
      border-left: 4px solid ${colors.black};
      border-right: 4px solid ${colors.black};
    }
    
    .footer {
      background-color: ${colors.black};
      color: ${colors.white};
      padding: 30px;
      text-align: center;
      border: 4px solid ${colors.black};
      font-weight: 700;
    }
    
    .btn {
      display: inline-block;
      padding: 16px 32px;
      background-color: ${colors.neon};
      color: ${colors.black};
      text-decoration: none;
      font-weight: 900;
      font-size: 18px;
      text-transform: uppercase;
      border: 4px solid ${colors.black};
      box-shadow: 8px 8px 0px 0px ${colors.black};
      margin: 20px 0;
      letter-spacing: 0.5px;
    }
    
    .otp-box {
      background-color: ${colors.neon};
      border: 4px solid ${colors.black};
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      box-shadow: 8px 8px 0px 0px ${colors.black};
    }
    
    .otp-code {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: 8px;
      color: ${colors.black};
      margin: 10px 0;
    }
    
    .info-box {
      background-color: ${colors.cyan};
      border: 4px solid ${colors.black};
      padding: 20px;
      margin: 20px 0;
      color: ${colors.white};
      font-weight: 700;
    }
    
    .warning-box {
      background-color: ${colors.pink};
      border: 4px solid ${colors.black};
      padding: 20px;
      margin: 20px 0;
      color: ${colors.white};
      font-weight: 700;
    }
    
    h2 {
      font-size: 28px;
      font-weight: 900;
      text-transform: uppercase;
      margin: 0 0 20px 0;
      color: ${colors.black};
    }
    
    p {
      font-size: 16px;
      line-height: 1.6;
      color: ${colors.black};
      font-weight: 700;
      margin: 15px 0;
    }
    
    .social-links {
      margin: 20px 0;
    }
    
    .social-links a {
      display: inline-block;
      margin: 0 5px;
      padding: 10px 15px;
      background-color: ${colors.white};
      border: 3px solid ${colors.white};
      text-decoration: none;
      font-weight: 900;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>NI-IT CLUB</h1>
    </div>
    ${content}
    <div class="footer">
      <p style="color: ${colors.white}; margin: 0 0 10px 0;">National Infotech College, Birgunj</p>
      <p style="color: ${colors.neon}; font-size: 14px; margin: 0;">Where Innovation Meets Community 🚀</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Reset Password OTP Email Template
 */
const getResetPasswordOTPTemplate = (otp, userName = "User") => {
  const content = `
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>Hey ${userName}! 👋</p>
      <p>We received a request to reset your password. Here's your OTP to proceed:</p>
      
      <div class="otp-box">
        <p style="margin: 0; font-size: 14px; font-weight: 900; text-transform: uppercase;">Your OTP Code</p>
        <div class="otp-code">${otp}</div>
        <p style="margin: 10px 0 0 0; font-size: 14px; font-weight: 700;">Valid for 10 minutes ⏰</p>
      </div>
      
      <div class="info-box">
        <p style="color: ${colors.white}; margin: 0;">
          ℹ️ Enter this code in the reset password page to create your new password.
        </p>
      </div>
      
      <div class="warning-box">
        <p style="color: ${colors.white}; margin: 0;">
          ⚠️ If you didn't request this, please ignore this email or contact us immediately.
        </p>
      </div>
      
      <p style="margin-top: 30px;">Stay awesome! 💪</p>
      <p style="font-weight: 900;">— The NI-IT Club Team</p>
    </div>
  `;

  return getBaseTemplate(content);
};

/**
 * Contact Form Thank You Email Template
 */
const getContactThankYouTemplate = (name, subject, category = "General") => {
  const categoryEmojis = {
    general: "💬",
    membership: "👥",
    events: "📅",
    support: "🆘",
  };

  const categoryColors = {
    general: colors.cyan,
    membership: colors.pink,
    events: colors.blue,
    support: colors.neon,
  };

  const categoryKey = category.toLowerCase();
  const emoji = categoryEmojis[categoryKey] || "💬";
  const categoryColor = categoryColors[categoryKey] || colors.cyan;

  const content = `
    <div class="content">
      <h2>Thanks for reaching out! ${emoji}</h2>
      <p>Hey ${name}! 👋</p>
      <p>We've received your message and we're pumped to help you out!</p>
      
      <div class="info-box" style="background-color: ${categoryColor};">
        <p style="color: ${colors.white}; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">
          ${emoji} ${category}
        </p>
        <p style="color: ${colors.white}; margin: 0; font-weight: 900; font-size: 18px;">
          "${subject}"
        </p>
      </div>
      
      <p>Our team will review your message and get back to you within <strong>24 hours</strong>. ⚡</p>
      
      <div style="background-color: ${colors.neon}; border: 4px solid ${colors.black}; padding: 20px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; font-weight: 900;">
          💡 While you wait...
        </p>
        <p style="margin: 10px 0 0 0;">
          Check out our latest events, join our community, or explore our projects!
        </p>
      </div>
      
      <p style="margin-top: 30px;">Keep coding, keep creating! 🚀</p>
      <p style="font-weight: 900;">— The NI-IT Club Team</p>
    </div>
  `;

  return getBaseTemplate(content);
};

/**
 * Contact Form Admin Notification Email Template
 */
const getContactNotificationTemplate = (contactData) => {
  const { name, email, subject, message, category = "General" } = contactData;

  const categoryEmojis = {
    general: "💬",
    membership: "👥",
    events: "📅",
    support: "🆘",
  };

  const categoryColors = {
    general: colors.cyan,
    membership: colors.pink,
    events: colors.blue,
    support: colors.neon,
  };

  const categoryKey = category.toLowerCase();
  const emoji = categoryEmojis[categoryKey] || "💬";
  const categoryColor = categoryColors[categoryKey] || colors.cyan;

  const content = `
    <div class="content">
      <h2>New Contact Form Submission! 📬</h2>
      
      <div class="info-box" style="background-color: ${categoryColor};">
        <p style="color: ${colors.white}; margin: 0; font-size: 14px; text-transform: uppercase;">
          ${emoji} Category: ${category}
        </p>
      </div>
      
      <div style="background-color: #f5f5f5; border: 4px solid ${colors.black}; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 15px 0;"><strong>FROM:</strong> ${name}</p>
        <p style="margin: 0 0 15px 0;"><strong>EMAIL:</strong> <a href="mailto:${email}" style="color: ${colors.cyan}; font-weight: 900;">${email}</a></p>
        <p style="margin: 0 0 15px 0;"><strong>SUBJECT:</strong> ${subject}</p>
        <hr style="border: 2px solid ${colors.black}; margin: 15px 0;">
        <p style="margin: 0;"><strong>MESSAGE:</strong></p>
        <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
      </div>
      
      <p style="margin-top: 30px; font-size: 14px;">Reply to this message promptly to maintain our awesome response time! ⚡</p>
    </div>
  `;

  return getBaseTemplate(content);
};

module.exports = {
  getResetPasswordOTPTemplate,
  getContactThankYouTemplate,
  getContactNotificationTemplate,
};
