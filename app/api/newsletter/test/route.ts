import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAllRoundups, getRoundupBySlug } from '@/lib/mdx';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { adminKey, testEmail, roundupSlug } = await request.json();

    // Validate admin key
    if (!process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Admin authentication is not configured' },
        { status: 500 }
      );
    }

    const providedKey = (adminKey || '').toString().trim();
    const envKey = (process.env.ADMIN_KEY || '').trim();

    if (providedKey !== envKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate test email
    if (!testEmail || !testEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid test email address' },
        { status: 400 }
      );
    }

    // Check Resend configuration
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend is not configured. RESEND_API_KEY is required.' },
        { status: 500 }
      );
    }

    // Get the roundup content
    let roundupContent = null;
    if (roundupSlug) {
      roundupContent = await getRoundupBySlug(roundupSlug);
    } else {
      // Get latest roundup if no slug provided
      const roundups = await getAllRoundups();
      roundupContent = roundups[0];
    }

    if (!roundupContent) {
      return NextResponse.json(
        { error: 'Roundup not found' },
        { status: 404 }
      );
    }

    // Prepare email content (same as newsletter)
    const emailSubject = `${roundupContent.title} | Solana Weekly Roundup`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${roundupContent.title}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 24px; font-weight: 300; margin-bottom: 10px;">Solana Weekly Roundup</h1>
            <p style="color: #666; font-size: 14px;">${new Date(roundupContent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-bottom: 20px;">
            <h2 style="font-size: 28px; font-weight: 300; margin-bottom: 15px;">${roundupContent.title}</h2>
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">${roundupContent.description}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #666; margin-bottom: 20px;">[Preview of newsletter content...]</p>
            <p style="margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solweekly.xyz'}/roundup/${roundupContent.slug}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 500;">
                Read Full Roundup →
              </a>
            </p>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
            <p><strong>TEST EMAIL</strong> - This is a test newsletter send.</p>
            <p style="margin-top: 10px;">By duke.sol | <a href="https://twitter.com/cryptoduke01" style="color: #666;">@cryptoduke01</a></p>
          </div>
        </body>
      </html>
    `;

    // Send test email
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Solana Weekly <newsletter@solweekly.xyz>';
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend test send error:', {
        error,
        message: error?.message,
        name: error?.name,
        statusCode: (error as any)?.statusCode,
        status: (error as any)?.status,
      });
      return NextResponse.json(
        { 
          error: `Failed to send test email: ${error.message || 'Unknown error'}`,
          details: error,
          hint: 'Check Resend Dashboard → Domains to verify your domain is fully verified, and check Vercel logs for more details.'
        },
        { status: 500 }
      );
    }

    if (!data) {
      console.error('Resend returned no data and no error');
      return NextResponse.json(
        { 
          error: 'Email send completed but no data returned',
          hint: 'Check Resend Dashboard → Emails to see if email was actually sent.'
        },
        { status: 500 }
      );
    }

    console.log('Test email sent successfully:', {
      messageId: data.id,
      to: testEmail,
      from: fromEmail,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${testEmail}`,
      messageId: data.id,
      roundup: roundupContent.title,
      hint: 'Check your inbox and spam folder. You can also check delivery status in Resend Dashboard → Emails.',
    });
  } catch (error: any) {
    console.error('Test send error:', error);
    return NextResponse.json(
      { error: `Failed to send test email: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

