import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAllRoundups } from '@/lib/mdx';
import { generateNewsletterHTML, generateNewsletterText } from '@/lib/email-template';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { adminKey, roundupSlug } = await request.json();

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

    // Check Resend configuration
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
      return NextResponse.json(
        { error: 'Resend is not configured. RESEND_API_KEY and RESEND_AUDIENCE_ID are required.' },
        { status: 500 }
      );
    }

    // Get the roundup content
    let roundupContent = null;
    if (roundupSlug) {
      const roundups = await getAllRoundups();
      roundupContent = roundups.find(r => r.slug === roundupSlug);
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

    // Get all subscribers from Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    let subscribers: string[] = [];

    try {
      const { data: contactsResponse, error: listError } = await resend.contacts.list({
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });

      if (!listError && contactsResponse) {
        if (Array.isArray(contactsResponse)) {
          subscribers = contactsResponse
            .map((contact: any) => contact.email)
            .filter((email: string, index: number) => {
              const contact = contactsResponse[index];
              return email && !contact?.unsubscribed;
            });
        } else if (contactsResponse.data && Array.isArray(contactsResponse.data)) {
          subscribers = contactsResponse.data
            .map((contact: any) => contact.email)
            .filter((email: string, index: number) => {
              const contact = contactsResponse.data[index];
              return email && !contact?.unsubscribed;
            });
        }
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers from Resend' },
        { status: 500 }
      );
    }

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers found' },
        { status: 400 }
      );
    }

    // Prepare email content using template
    const emailSubject = `${roundupContent.title} | Solana Weekly Roundup`;
    const emailHtml = generateNewsletterHTML(roundupContent, false);
    const emailText = generateNewsletterText(roundupContent, false);

    // Send email to all subscribers
    // Resend doesn't support batch sending to audience directly, so send individually
    // But we'll use Promise.all for efficiency (send multiple in parallel)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Solana Weekly <newsletter@solweekly.xyz>';
    const results = [];
    
    // Send in batches to avoid rate limits (10 at a time)
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (email) => {
        try {
          const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: emailSubject,
            html: emailHtml,
            text: emailText,
          });

          if (error) {
            console.error(`Error sending to ${email}:`, error);
            return { email, success: false, error: error.message };
          }
          return { email, success: true, messageId: data?.id };
        } catch (err: any) {
          console.error(`Error sending to ${email}:`, err);
          return { email, success: false, error: err.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches to avoid rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = subscribers.length - successCount;

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${successCount} subscribers${failCount > 0 ? ` (${failCount} failed)` : ''}`,
      total: subscribers.length,
      sent: successCount,
      failed: failCount,
      roundup: roundupContent.title,
    });
  } catch (error: any) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: `Failed to send newsletter: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

