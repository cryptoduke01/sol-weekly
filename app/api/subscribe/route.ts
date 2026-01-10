import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

// Storage file path (simple file-based storage)
const emailsFilePath = path.join(process.cwd(), 'data', 'subscribers.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(emailsFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read existing emails
function getSubscribers(): string[] {
  ensureDataDir();
  if (!fs.existsSync(emailsFilePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(emailsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return [];
  }
}

// Save emails
function saveSubscribers(emails: string[]): void {
  // On Vercel, file system is read-only except /tmp (which is ephemeral)
  // So file storage only works in local development
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    console.warn('File storage not available on Vercel. Use Resend contacts API.');
    return; // Silently fail on Vercel - file storage is not available
  }

  ensureDataDir();
  try {
    fs.writeFileSync(emailsFilePath, JSON.stringify(emails, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving subscribers:', error);
    // Don't throw on local dev - might be permission issue
    if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
      throw error;
    }
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format more strictly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if we're on Vercel (production)
    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;

    // On Vercel, Resend is required (file system is read-only)
    if (isVercel) {
      if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
        return NextResponse.json(
          { 
            error: 'Email subscription is not configured. Please contact the administrator.',
            details: 'RESEND_API_KEY and RESEND_AUDIENCE_ID must be configured for email subscriptions to work.'
          },
          { status: 503 }
        );
      }

      // Use Resend on Vercel
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        try {
          await resend.contacts.create({
            email: normalizedEmail,
            audienceId: process.env.RESEND_AUDIENCE_ID,
          });

          return NextResponse.json(
            { success: true, message: 'Successfully added to mailing list' },
            { status: 200 }
          );
        } catch (resendError: any) {
          console.error('Resend API error:', resendError);
          
          // Check if email already exists in Resend
          const errorMessage = resendError?.message?.toLowerCase() || '';
          if (errorMessage.includes('already exists') || 
              errorMessage.includes('duplicate') ||
              errorMessage.includes('already subscribed') ||
              resendError?.status === 422 ||
              resendError?.response?.status === 422) {
            return NextResponse.json(
              { error: 'This email is already subscribed to our mailing list' },
              { status: 400 }
            );
          }

          // Other Resend errors - show specific message
          const errorMsg = resendError?.message || 'Failed to add contact to mailing list';
          return NextResponse.json(
            { error: `Subscription failed: ${errorMsg}` },
            { status: 500 }
          );
        }
      } catch (resendSetupError: any) {
        console.error('Resend setup error:', resendSetupError);
        return NextResponse.json(
          { error: 'Email service is temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }
    }

    // Local development: Try Resend first, fallback to file storage
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        try {
          await resend.contacts.create({
            email: normalizedEmail,
            audienceId: process.env.RESEND_AUDIENCE_ID,
          });

          // Also save to file for local admin panel
          try {
            const subscribers = getSubscribers();
            if (!subscribers.includes(normalizedEmail)) {
              subscribers.push(normalizedEmail);
              saveSubscribers(subscribers);
            }
          } catch (fileError) {
            // File save is optional if Resend works
            console.warn('Could not save to file:', fileError);
          }

          return NextResponse.json(
            { success: true, message: 'Successfully added to mailing list' },
            { status: 200 }
          );
        } catch (resendError: any) {
          // Check if email already exists
          const errorMessage = resendError?.message?.toLowerCase() || '';
          if (errorMessage.includes('already exists') || 
              errorMessage.includes('duplicate') ||
              resendError?.status === 422) {
            return NextResponse.json(
              { error: 'This email is already subscribed to our mailing list' },
              { status: 400 }
            );
          }
          // Fall through to file storage if Resend fails locally
          console.warn('Resend failed, trying file storage:', resendError);
        }
      } catch (resendSetupError) {
        console.warn('Resend setup failed, using file storage:', resendSetupError);
      }
    }

    // File-based storage (local development fallback)
    try {
      const subscribers = getSubscribers();

      // Check if already subscribed
      if (subscribers.includes(normalizedEmail)) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our mailing list' },
          { status: 400 }
        );
      }

      // Add new subscriber to file
      subscribers.push(normalizedEmail);
      saveSubscribers(subscribers);

      return NextResponse.json(
        { success: true, message: 'Successfully added to mailing list' },
        { status: 200 }
      );
    } catch (fileError: any) {
      console.error('File storage error:', fileError);
      return NextResponse.json(
        { error: `Failed to save email: ${fileError?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Subscribe error:', error);
    
    // Return specific error messages
    const errorMessage = error?.message || 'Failed to subscribe. Please try again.';
    
    return NextResponse.json(
      { 
        error: errorMessage.includes('already') || errorMessage.includes('duplicate') 
          ? 'This email is already subscribed to our mailing list'
          : errorMessage.includes('Resend') || errorMessage.includes('File storage')
          ? errorMessage
          : 'Failed to subscribe. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to view subscribers (for admin/debugging)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');

  // Check if ADMIN_KEY is configured
  if (!process.env.ADMIN_KEY) {
    console.error('ADMIN_KEY is not set in environment variables');
    return NextResponse.json(
      { error: 'Admin authentication is not configured. Please set ADMIN_KEY in environment variables.' },
      { status: 500 }
    );
  }

  // Simple admin key check (in production, use proper auth)
  // Trim whitespace from both keys for comparison
  const providedKey = adminKey?.trim() || '';
  const envKey = process.env.ADMIN_KEY.trim();

  if (providedKey !== envKey) {
    console.error('Admin key mismatch:', {
      providedLength: providedKey.length,
      envLength: envKey.length,
      match: providedKey === envKey,
    });
    return NextResponse.json(
      { error: 'Invalid admin key' },
      { status: 401 }
    );
  }

  const subscribers = getSubscribers();
  return NextResponse.json({
    count: subscribers.length,
    subscribers,
  });
}

// DELETE endpoint to remove a subscriber
export async function DELETE(request: Request) {
  try {
    const { email, key } = await request.json();

    // Check if ADMIN_KEY is configured
    if (!process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Admin authentication is not configured' },
        { status: 500 }
      );
    }

    // Validate admin key (trim whitespace)
    const providedKey = key?.trim() || '';
    const envKey = process.env.ADMIN_KEY.trim();

    if (providedKey !== envKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Read existing subscribers
    const subscribers = getSubscribers();
    const normalizedEmail = email.toLowerCase().trim();

    // Remove email if it exists
    const filteredSubscribers = subscribers.filter(
      (sub) => sub.toLowerCase().trim() !== normalizedEmail
    );

    // Only save if email was actually removed
    if (filteredSubscribers.length === subscribers.length) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    // Save updated list
    saveSubscribers(filteredSubscribers);

    // Also remove from Resend if configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.contacts.remove({
          email: normalizedEmail,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        });
      } catch (resendError: any) {
        console.error('Resend delete error:', resendError);
        // Continue even if Resend fails - we've removed from file
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email removed successfully',
      count: filteredSubscribers.length,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete email' },
      { status: 500 }
    );
  }
}
