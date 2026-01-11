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
  const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
  if (isVercel) {
    console.warn('File storage not available on Vercel. Use Resend contacts API.');
    // Don't throw - let caller handle gracefully
    return;
  }

  ensureDataDir();
  try {
    fs.writeFileSync(emailsFilePath, JSON.stringify(emails, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving subscribers:', error);
    throw error; // Throw so caller can handle
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

    // Try Resend first (if fully configured with audience ID)
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // FIRST: Check if email already exists using contacts.get()
        // Resend doesn't throw error on duplicate create, so we must check first
        try {
          const { data: existingContact, error: getError } = await resend.contacts.get({
            email: normalizedEmail,
          });
          
          // If contact exists (data is returned), it's a duplicate
          if (existingContact && !getError) {
            console.log('Duplicate email detected via get():', normalizedEmail);
            return NextResponse.json(
              { error: 'This email is already subscribed to our mailing list' },
              { status: 400 }
            );
          }
          
          // If error exists, check if it's 404 (not found) or something else
          if (getError) {
            // Resend error format: { message: string, name?: string }
            const errorMessage = String(getError?.message || '').toLowerCase();
            if (errorMessage.includes('not found') || errorMessage.includes('404')) {
              // Contact doesn't exist - proceed to create
              console.log('Email not found (404), will create new contact:', normalizedEmail);
            } else {
              // Other error - log but continue (will try to create anyway)
              console.warn('Error checking existing contact:', getError);
            }
          }
        } catch (getError: any) {
          // If contact doesn't exist, Resend might throw or return error
          const errorMessage = String(getError?.message || '').toLowerCase();
          if (errorMessage.includes('not found') || errorMessage.includes('404')) {
            // Contact doesn't exist - proceed to create
            console.log('Email not found (404), will create new contact:', normalizedEmail);
          } else {
            // Other error - log but continue (will try to create anyway)
            console.warn('Error checking existing contact:', getError?.message || getError);
            // Continue - creation might still work
          }
        }
        
        // SECOND: Create contact (only if not found above)
        try {
          await resend.contacts.create({
            email: normalizedEmail,
            audienceId: process.env.RESEND_AUDIENCE_ID,
          });

          // Also try to save to file (for admin panel) - optional
          try {
            const subscribers = getSubscribers();
            if (!subscribers.includes(normalizedEmail)) {
              subscribers.push(normalizedEmail);
              saveSubscribers(subscribers);
            }
          } catch (fileError) {
            // File save is optional if Resend works
            console.warn('Could not save to file (this is normal on Vercel):', fileError);
          }

          return NextResponse.json(
            { success: true, message: 'Successfully added to mailing list' },
            { status: 200 }
          );
        } catch (resendError: any) {
          console.error('Resend create error:', {
            message: resendError?.message,
            status: resendError?.status,
            statusCode: resendError?.statusCode,
            responseStatus: resendError?.response?.status,
            body: resendError?.body,
            data: resendError?.data,
            responseData: resendError?.response?.data,
            error: resendError,
          });
          
          // Check if email already exists in Resend (duplicate error from create)
          // Resend returns different error formats - check all possible locations
          const errorMessage = String(resendError?.message || '').toLowerCase();
          const errorStatus = resendError?.status || resendError?.statusCode || resendError?.response?.status || resendError?.response?.statusCode;
          const errorBody = resendError?.body || resendError?.data || resendError?.response?.data || resendError?.response?.body || {};
          const errorBodyStr = typeof errorBody === 'string' ? errorBody.toLowerCase() : JSON.stringify(errorBody).toLowerCase();
          
          // Log full error for debugging
          console.log('Duplicate check:', {
            errorMessage,
            errorStatus,
            errorBodyStr: errorBodyStr.substring(0, 200), // First 200 chars
            is422: errorStatus === 422,
            is409: errorStatus === 409,
            hasAlreadyExists: errorMessage.includes('already exists') || errorBodyStr.includes('already exists'),
            hasDuplicate: errorMessage.includes('duplicate') || errorBodyStr.includes('duplicate'),
          });
          
          // Check various duplicate error indicators
          // Common Resend duplicate errors: 422 (Unprocessable Entity), 409 (Conflict), or message contains "already exists"/"duplicate"
          if (errorStatus === 422 || 
              errorStatus === 409 ||
              errorMessage.includes('already exists') || 
              errorMessage.includes('duplicate') ||
              errorMessage.includes('already subscribed') ||
              errorMessage.includes('contact already exists') ||
              errorMessage.includes('already in audience') ||
              errorBodyStr.includes('already exists') ||
              errorBodyStr.includes('duplicate') ||
              errorBodyStr.includes('already in') ||
              errorBodyStr.includes('email already')) {
            console.log('Duplicate email detected:', normalizedEmail);
            return NextResponse.json(
              { error: 'This email is already subscribed to our mailing list' },
              { status: 400 }
            );
          }

          // If Resend fails and we're not on Vercel, fall through to file storage
          const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
          if (isVercel) {
            // On Vercel, if Resend fails, we can't use file storage - show error
            const errorMsg = resendError?.message || 'Failed to add contact to mailing list';
            return NextResponse.json(
              { error: `Subscription failed: ${errorMsg}` },
              { status: 500 }
            );
          }
          // On local, fall through to file storage
          console.warn('Resend failed, trying file storage:', resendError);
        }
      } catch (resendSetupError: any) {
        console.warn('Resend setup failed:', resendSetupError);
        // Fall through to file storage on local
      }
    }

    // File-based storage (works on local, not on Vercel)
    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    
    // On Vercel, file storage doesn't work
    if (isVercel) {
      // Check if we have Resend API key but no audience ID
      if (process.env.RESEND_API_KEY && !process.env.RESEND_AUDIENCE_ID) {
        return NextResponse.json(
          { 
            error: 'Email subscription requires RESEND_AUDIENCE_ID. You have RESEND_API_KEY but need to create an Audience in Resend Dashboard and add the Audience ID to Vercel environment variables.',
            help: 'Go to resend.com/dashboard → Audiences → Create Audience → Copy Audience ID → Add to Vercel'
          },
          { status: 503 }
        );
      }
      
      // If no Resend setup at all, show helpful error
      return NextResponse.json(
        { 
          error: 'Email subscription is not configured. Please set RESEND_AUDIENCE_ID in your Vercel environment variables.',
          help: 'Create an Audience in Resend Dashboard and add the Audience ID to Vercel'
        },
        { status: 503 }
      );
    }

    // Local file storage
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
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('key');

    // Check if ADMIN_KEY is configured
    if (!process.env.ADMIN_KEY) {
      console.error('ADMIN_KEY is not set in environment variables');
      return NextResponse.json(
        { 
          error: 'Admin authentication is not configured. Please set ADMIN_KEY in environment variables.',
          hint: 'ADMIN_KEY is NOT configured in Vercel. Add ADMIN_KEY=180476 to your Vercel environment variables and redeploy.'
        },
        { status: 500 }
      );
    }

    // Decode and normalize the key (handles URL encoding)
    let providedKey = '';
    try {
      providedKey = adminKey ? decodeURIComponent(adminKey).trim() : adminKey?.trim() || '';
    } catch {
      // If decode fails, use raw value (key might not be encoded)
      providedKey = (adminKey || '').trim();
    }
    
    const envKey = (process.env.ADMIN_KEY || '').trim();

    // Debug logging
    console.log('Admin key check:', {
      provided: providedKey,
      envKey: envKey,
      providedLength: providedKey.length,
      envLength: envKey.length,
      match: providedKey === envKey,
      envExists: !!envKey,
    });

    // Compare keys (case-sensitive, exact match)
    if (!providedKey || !envKey || providedKey !== envKey) {
      console.error('Admin key mismatch:', {
        provided: providedKey || '(empty)',
        envKeyValue: envKey || '(not set)',
        providedLength: providedKey.length,
        envLength: envKey.length,
        exactMatch: providedKey === envKey,
      });
      return NextResponse.json(
        { 
          error: 'Invalid admin key',
          hint: `Admin key ${envKey ? 'is configured' : 'is NOT configured'}. Provided: "${providedKey}" (length: ${providedKey.length}). Expected length: ${envKey.length}. Make sure ADMIN_KEY=180476 is set in Vercel environment variables (Production) and you redeployed after adding it.`
        },
        { status: 401 }
      );
    }

    // Get subscribers from Resend (primary source on Vercel)
    let subscribersList: string[] = [];
    
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data: contactsResponse, error: listError } = await resend.contacts.list({
          audienceId: process.env.RESEND_AUDIENCE_ID,
        });
        
        if (listError) {
          console.error('Resend contacts.list error:', listError);
          // If Resend fails, try file storage as fallback
        } else if (contactsResponse) {
          // Resend API returns { data: [...] } format
          if (Array.isArray(contactsResponse)) {
            subscribersList = contactsResponse
              .map((contact: any) => (contact.email || '').toLowerCase().trim())
              .filter((email: string, index: number) => {
                const contact = contactsResponse[index];
                return email && !contact?.unsubscribed;
              });
          } else if (contactsResponse.data && Array.isArray(contactsResponse.data)) {
            subscribersList = contactsResponse.data
              .map((contact: any) => (contact.email || '').toLowerCase().trim())
              .filter((email: string, index: number) => {
                const contact = contactsResponse.data[index];
                return email && !contact?.unsubscribed;
              });
          }
        }
      } catch (err: any) {
        console.error('Error fetching from Resend:', err?.message || err);
        // Fallback to file storage on error
      }
    }

    // Fallback: Get subscribers from file (if Resend failed or not configured)
    if (subscribersList.length === 0) {
      try {
        subscribersList = getSubscribers();
      } catch (fileError) {
        console.warn('Could not read file subscribers:', fileError);
        subscribersList = [];
      }
    }

    // Remove duplicates and sort
    const allSubscribers = Array.from(new Set(subscribersList)).sort();

    return NextResponse.json({
      count: allSubscribers.length,
      subscribers: allSubscribers,
    });
  } catch (error: any) {
    console.error('GET /api/subscribe error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch subscribers',
        hint: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
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

    // Validate admin key (handle special characters)
    const providedKey = (key || '').toString().trim();
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
  