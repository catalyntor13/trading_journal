// ─── Shared styles for all email templates ───
const brandColor = '#f97316';
const darkBg = '#0f172a';
const textColor = '#1e293b';
const mutedColor = '#64748b';

const baseWrapper = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #f1f5f9;
  padding: 40px 20px;
`;

const cardStyle = `
  max-width: 560px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
`;

const headerStyle = `
  background-color: ${darkBg};
  padding: 32px 36px;
  text-align: center;
`;

const contentStyle = `
  padding: 36px;
`;

const footerStyle = `
  background-color: #f8fafc;
  padding: 24px 36px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
`;

// ─── Payment Confirmation Email ───
export function paymentConfirmationEmail({
    name,
    amount,
    plan,
    endDate,
}: {
    name: string;
    amount: string;
    plan: string;
    endDate: string;
}) {
    return `
    <div style="${baseWrapper}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <h1 style="margin: 0; font-size: 24px; color: ${brandColor}; letter-spacing: 2px;">MARS</h1>
          <p style="margin: 4px 0 0; font-size: 11px; color: #94a3b8; letter-spacing: 3px; text-transform: uppercase;">Trading Journal</p>
        </div>

        <div style="${contentStyle}">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; background-color: #dcfce7; border-radius: 50px; padding: 10px 28px;">
              <span style="font-size: 14px; font-weight: 700; color: #16a34a; letter-spacing: 1px;">✓ Payment Confirmed</span>
            </div>
          </div>

          <p style="font-size: 15px; color: ${textColor}; margin: 0 0 20px;">
            Hi <strong>${name}</strong>,
          </p>
          <p style="font-size: 14px; color: ${mutedColor}; line-height: 1.7; margin: 0 0 24px;">
            Your payment has been successfully processed. Thank you for subscribing to MARS Trading Journal!
          </p>

          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: ${mutedColor};">Plan</td>
                <td style="padding: 8px 0; font-size: 13px; color: ${textColor}; font-weight: 600; text-align: right;">${plan}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: ${mutedColor}; border-top: 1px solid #e2e8f0;">Amount</td>
                <td style="padding: 8px 0; font-size: 13px; color: ${textColor}; font-weight: 600; text-align: right;">$${amount} USD</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: ${mutedColor}; border-top: 1px solid #e2e8f0;">Active Until</td>
                <td style="padding: 8px 0; font-size: 13px; color: ${textColor}; font-weight: 600; text-align: right;">${endDate}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: ${mutedColor}; line-height: 1.7; margin: 0 0 24px;">
            Your subscription will renew automatically. You can manage it anytime from the <strong>Settings</strong> page in your dashboard.
          </p>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: ${brandColor}; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 8px;">
              Go to Dashboard
            </a>
          </div>
        </div>

        <div style="${footerStyle}">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            © ${new Date().getFullYear()} IDTORO SRL · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: ${brandColor}; text-decoration: none;">MARS Trading Journal</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

// ─── Subscription Cancelled Email ───
export function subscriptionCancelledEmail({
    name,
    endDate,
}: {
    name: string;
    endDate: string;
}) {
    return `
    <div style="${baseWrapper}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <h1 style="margin: 0; font-size: 24px; color: ${brandColor}; letter-spacing: 2px;">MARS</h1>
          <p style="margin: 4px 0 0; font-size: 11px; color: #94a3b8; letter-spacing: 3px; text-transform: uppercase;">Trading Journal</p>
        </div>

        <div style="${contentStyle}">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; background-color: #fef2f2; border-radius: 50px; padding: 10px 28px;">
              <span style="font-size: 14px; font-weight: 700; color: #dc2626; letter-spacing: 1px;">Subscription Cancelled</span>
            </div>
          </div>

          <p style="font-size: 15px; color: ${textColor}; margin: 0 0 20px;">
            Hi <strong>${name}</strong>,
          </p>
          <p style="font-size: 14px; color: ${mutedColor}; line-height: 1.7; margin: 0 0 24px;">
            We're sorry to see you go. Your MARS Pro subscription has been cancelled. You will continue to have access to all Pro features until the end of your current billing period.
          </p>

          <div style="background-color: #fffbeb; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #fde68a;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: ${mutedColor};">Status</td>
                <td style="padding: 8px 0; font-size: 13px; color: #dc2626; font-weight: 600; text-align: right;">Cancelled</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: ${mutedColor}; border-top: 1px solid #fde68a;">Access Until</td>
                <td style="padding: 8px 0; font-size: 13px; color: ${textColor}; font-weight: 600; text-align: right; border-top: 1px solid #fde68a;">${endDate}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: ${mutedColor}; line-height: 1.7; margin: 0 0 24px;">
            Changed your mind? You can renew your subscription anytime from the <strong>Settings</strong> page in your dashboard. We'd love to have you back!
          </p>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="display: inline-block; background-color: ${darkBg}; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 8px;">
              Renew Subscription
            </a>
          </div>
        </div>

        <div style="${footerStyle}">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            © ${new Date().getFullYear()} IDTORO SRL · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: ${brandColor}; text-decoration: none;">MARS Trading Journal</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

// ─── Subscription Renewed Email ───
export function subscriptionRenewedEmail({
    name,
    amount,
    endDate,
}: {
    name: string;
    amount: string;
    endDate: string;
}) {
    return `
    <div style="${baseWrapper}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <h1 style="margin: 0; font-size: 24px; color: ${brandColor}; letter-spacing: 2px;">MARS</h1>
          <p style="margin: 4px 0 0; font-size: 11px; color: #94a3b8; letter-spacing: 3px; text-transform: uppercase;">Trading Journal</p>
        </div>

        <div style="${contentStyle}">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; background-color: #eff6ff; border-radius: 50px; padding: 10px 28px;">
              <span style="font-size: 14px; font-weight: 700; color: #2563eb; letter-spacing: 1px;">🎉 Welcome Back!</span>
            </div>
          </div>

          <p style="font-size: 15px; color: ${textColor}; margin: 0 0 20px;">
            Hi <strong>${name}</strong>,
          </p>
          <p style="font-size: 14px; color: ${mutedColor}; line-height: 1.7; margin: 0 0 24px;">
            Great news! Your MARS Pro subscription has been successfully renewed. You now have full access to all Pro features again.
          </p>

          <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #bbf7d0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: ${mutedColor};">Status</td>
                <td style="padding: 8px 0; font-size: 13px; color: #16a34a; font-weight: 600; text-align: right;">Active</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: ${mutedColor}; border-top: 1px solid #bbf7d0;">Amount</td>
                <td style="padding: 8px 0; font-size: 13px; color: ${textColor}; font-weight: 600; text-align: right; border-top: 1px solid #bbf7d0;">$${amount} USD</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: ${mutedColor}; border-top: 1px solid #bbf7d0;">Active Until</td>
                <td style="padding: 8px 0; font-size: 13px; color: ${textColor}; font-weight: 600; text-align: right; border-top: 1px solid #bbf7d0;">${endDate}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: ${mutedColor}; line-height: 1.7; margin: 0 0 24px;">
            Your subscription will renew automatically each month. You can manage it anytime from the <strong>Settings</strong> page.
          </p>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: ${brandColor}; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 8px;">
              Go to Dashboard
            </a>
          </div>
        </div>

        <div style="${footerStyle}">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            © ${new Date().getFullYear()} IDTORO SRL · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: ${brandColor}; text-decoration: none;">MARS Trading Journal</a>
          </p>
        </div>
      </div>
    </div>
  `;
}
