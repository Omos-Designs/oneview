import config from "@/config";

/**
 * Branded email template wrapper
 * Provides consistent styling for all OneView emails
 */
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.appName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f9fafb;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #6e56cf 0%, #5d4ab0 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
    .button {
      display: inline-block;
      background-color: #6e56cf;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 9999px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #5d4ab0;
    }
    h1 {
      color: #1f2937;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px 0;
    }
    p {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }
    .highlight {
      background-color: #f3f4f6;
      border-left: 4px solid #6e56cf;
      padding: 16px;
      margin: 24px 0;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-links a {
      color: #6e56cf;
      text-decoration: none;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">${config.appName}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p style="margin-bottom: 8px;">
        <strong>${config.appName}</strong> - Your complete financial picture in one place
      </p>
      <p style="font-size: 13px; color: #9ca3af; margin-bottom: 16px;">
        ${config.domainName}
      </p>
      <p style="font-size: 12px; color: #9ca3af;">
        You're receiving this email because you signed up for ${config.appName}.
        <br>
        If you didn't sign up, you can safely ignore this email.
      </p>
      <div class="social-links">
        <a href="mailto:${config.resend.supportEmail}">Contact Support</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

/**
 * Waitlist welcome email template
 */
export const waitlistWelcomeEmail = (email: string) => {
  const content = `
    <h1>🎉 Welcome to the ${config.appName} Waitlist!</h1>

    <p>Hi there,</p>

    <p>
      Thank you for joining the <strong>${config.appName}</strong> waitlist! We're thrilled to have you on board as we build the future of personal finance management.
    </p>

    <div class="highlight">
      <p style="margin: 0;">
        <strong>What's ${config.appName}?</strong><br>
        ${config.appDescription}
      </p>
    </div>

    <p>
      We're working hard to launch and can't wait to show you what we've built. Here's what you can expect:
    </p>

    <ul style="color: #4b5563; line-height: 1.8;">
      <li><strong>Early access</strong> when we launch</li>
      <li><strong>Exclusive updates</strong> on our progress</li>
      <li><strong>Special pricing</strong> for early adopters</li>
      <li><strong>Direct input</strong> on features you want to see</li>
    </ul>

    <p>
      In the meantime, follow our journey and get a sneak peek at what we're building:
    </p>

    <center>
      <a href="https://${config.domainName}" class="button">
        Visit ${config.appName}
      </a>
    </center>

    <p>
      Have questions or feedback? Just reply to this email - we'd love to hear from you!
    </p>

    <p style="margin-top: 32px;">
      Best regards,<br>
      <strong>The ${config.appName} Team</strong>
    </p>
  `;

  return {
    subject: `Welcome to ${config.appName}! 🎉`,
    html: emailWrapper(content),
    text: `
Welcome to ${config.appName}!

Thank you for joining the ${config.appName} waitlist! We're thrilled to have you on board as we build the future of personal finance management.

What's ${config.appName}?
${config.appDescription}

We're working hard to launch and can't wait to show you what we've built. Here's what you can expect:

- Early access when we launch
- Exclusive updates on our progress
- Special pricing for early adopters
- Direct input on features you want to see

Visit us: https://${config.domainName}

Have questions or feedback? Just reply to this email - we'd love to hear from you!

Best regards,
The ${config.appName} Team
    `.trim(),
  };
};

/**
 * Generic notification email template (for future use)
 */
export const notificationEmail = (title: string, message: string, ctaText?: string, ctaUrl?: string) => {
  const content = `
    <h1>${title}</h1>
    <p>${message}</p>
    ${ctaText && ctaUrl ? `
      <center>
        <a href="${ctaUrl}" class="button">${ctaText}</a>
      </center>
    ` : ''}
  `;

  return {
    html: emailWrapper(content),
    text: `${title}\n\n${message}${ctaUrl ? `\n\n${ctaText}: ${ctaUrl}` : ''}`,
  };
};
