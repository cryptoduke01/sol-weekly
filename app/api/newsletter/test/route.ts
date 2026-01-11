import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAllRoundups, getRoundupBySlug } from '@/lib/mdx';
import { generateNewsletterHTML, generateNewsletterText } from '@/lib/email-template';

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

    // Prepare email content using template
    const emailSubject = `${roundupContent.title} | Solana Weekly Roundup`;
    const emailHtml = generateNewsletterHTML(roundupContent, true);
    const emailText = generateNewsletterText(roundupContent, true);

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

