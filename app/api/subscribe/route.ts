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
  ensureDataDir();
  try {
    fs.writeFileSync(emailsFilePath, JSON.stringify(emails, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving subscribers:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Read existing subscribers
    const subscribers = getSubscribers();

    // Check if already subscribed
    if (subscribers.includes(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Add new subscriber to file
    subscribers.push(normalizedEmail);
    saveSubscribers(subscribers);

    // Add to Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Try to add to Resend contacts
        // Note: Resend requires audience ID for contacts API
        // For now, we'll store in file and you can manually import to Resend later
        // Or configure RESEND_AUDIENCE_ID in .env.local to auto-add contacts
        if (process.env.RESEND_AUDIENCE_ID) {
          await resend.contacts.create({
            email: normalizedEmail,
            audienceId: process.env.RESEND_AUDIENCE_ID,
          });
        }
      } catch (resendError: any) {
        console.error('Resend API error:', resendError);
        // Continue even if Resend fails - we've saved to file
      }
    }

    return NextResponse.json(
      { success: true, message: 'Successfully added to mailing list' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to view subscribers (for admin/debugging)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');

  // Simple admin key check (in production, use proper auth)
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscribers = getSubscribers();
  return NextResponse.json({
    count: subscribers.length,
    subscribers,
  });
}
