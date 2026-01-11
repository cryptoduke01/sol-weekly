import { Roundup } from './types';

export function generateNewsletterHTML(
  roundup: Roundup,
  isTest: boolean = false
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solweekly.xyz';
  const dateFormatted = new Date(roundup.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Get preview text (first 200 characters of content, clean HTML)
  const previewText = roundup.content
    .replace(/[#*\[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .substring(0, 200)
    .trim() + '...';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${roundup.title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 300; color: #ffffff; letter-spacing: -0.5px;">Solana Weekly Roundup</h1>
              <p style="margin: 12px 0 0 0; font-size: 14px; color: #cccccc; font-weight: 300;">${dateFormatted}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 300; line-height: 1.2; color: #000000; letter-spacing: -0.5px;">${roundup.title}</h2>
              
              ${roundup.description ? `
              <p style="margin: 0 0 32px 0; font-size: 18px; line-height: 1.6; color: #666666; font-weight: 300;">${roundup.description}</p>
              ` : ''}

              <!-- Preview Section -->
              <div style="background-color: #f9f9f9; border-left: 3px solid #000000; padding: 24px; margin: 32px 0; border-radius: 4px;">
                <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.7; color: #333333; font-weight: 300;">${previewText}</p>
                
                <!-- CTA Button -->
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 24px;">
                  <tr>
                    <td style="text-align: center;">
                      <a href="${siteUrl}/roundup/${roundup.slug}" 
                         style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; letter-spacing: 0.3px;">
                        Read Full Roundup →
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              ${isTest ? `
              <!-- Test Badge -->
              <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 6px; margin: 24px 0; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #856404; font-weight: 500;">🧪 TEST EMAIL</p>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px 40px 40px; background-color: #f9f9f9; border-top: 1px solid #eeeeee;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <p style="margin: 0; font-size: 13px; color: #999999; line-height: 1.6;">
                      This email was sent to subscribers of Solana Weekly Roundup.<br>
                      Weekly updates from the Solana ecosystem, delivered every Friday.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 20px 0; border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee;">
                    <p style="margin: 0; font-size: 12px; color: #666666;">
                      <a href="${siteUrl}" style="color: #666666; text-decoration: none; margin: 0 12px;">Visit Website</a>
                      <span style="color: #cccccc;">•</span>
                      <a href="${siteUrl}/support" style="color: #666666; text-decoration: none; margin: 0 12px;">Support</a>
                      <span style="color: #cccccc;">•</span>
                      <a href="#" style="color: #666666; text-decoration: none; margin: 0 12px;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 20px;">
                    <p style="margin: 0; font-size: 13px; color: #999999;">
                      By <a href="https://twitter.com/cryptoduke01" style="color: #000000; text-decoration: none; font-weight: 500;">duke.sol</a> | 
                      <a href="https://twitter.com/cryptoduke01" style="color: #666666; text-decoration: none;">@cryptoduke01</a>
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 11px; color: #bbbbbb;">
                      © ${new Date().getFullYear()} Solana Weekly Roundup. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateNewsletterText(roundup: Roundup, isTest: boolean = false): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solweekly.xyz';
  const dateFormatted = new Date(roundup.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const previewText = roundup.content
    .replace(/[#*\[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .substring(0, 500)
    .trim() + '...';

  return `
Solana Weekly Roundup
${dateFormatted}

${roundup.title}

${roundup.description ? `${roundup.description}\n\n` : ''}

${previewText}

Read full roundup: ${siteUrl}/roundup/${roundup.slug}

---

${isTest ? '🧪 TEST EMAIL\n\n' : ''}
By duke.sol | @cryptoduke01
Visit: ${siteUrl}
Unsubscribe: [Unsubscribe link]
  `.trim();
}

