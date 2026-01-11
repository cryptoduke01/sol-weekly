# Weekly Newsletter Sending Guide 📧

## How to Send Newsletter Every Week

### Option 1: Manual Send (Admin Panel) - Recommended

1. **Create your weekly roundup** in `content/roundups/week-X.mdx`
2. **Login to admin panel**: Visit `/admin` → Enter password `180476`
3. **Send newsletter**: Use the "Send Newsletter" button (to be added)

### Option 2: API Endpoint (Direct)

Send POST request to `/api/newsletter/send`:

```bash
curl -X POST https://www.solweekly.xyz/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "180476",
    "roundupSlug": "week-1-jan-4-10-2026"
  }'
```

**Without roundupSlug** (sends latest):
```bash
curl -X POST https://www.solweekly.xyz/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"adminKey": "180476"}'
```

### Option 3: Automated (Cron Job)

Set up a weekly cron job to automatically send:

**Using Vercel Cron Jobs:**
1. Create `vercel.json` (or update existing)
2. Add cron configuration:

```json
{
  "crons": [{
    "path": "/api/newsletter/send",
    "schedule": "0 9 * * 5"
  }]
}
```

This sends every Friday at 9 AM UTC.

**Manual Cron (if using external server):**
```bash
# Add to crontab (runs every Friday at 9 AM)
0 9 * * 5 curl -X POST https://www.solweekly.xyz/api/newsletter/send -H "Content-Type: application/json" -d '{"adminKey":"180476"}'
```

## Required Setup

### 1. Domain Verification in Resend

**CRITICAL:** You must verify your domain in Resend before sending emails.

1. Go to Resend Dashboard → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `solweekly.xyz` (or your domain)
4. Add DNS records as instructed:
   - TXT record for domain verification
   - SPF record
   - DKIM records
5. Wait for verification (usually a few minutes)

### 2. Set FROM Email

Add to Vercel environment variables:

```env
RESEND_FROM_EMAIL=Solana Weekly <newsletter@solweekly.xyz>
```

**Important:**
- Email domain (`solweekly.xyz`) must be verified in Resend
- `newsletter@solweekly.xyz` is just an alias - doesn't need to exist
- Format: `"Name <email@domain.com>"`

### 3. Test Send First

Before sending to all subscribers, test:

```bash
# Send test email to yourself
curl -X POST https://www.solweekly.xyz/api/newsletter/test \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "180476",
    "testEmail": "your@email.com"
  }'
```

## Newsletter Content

The newsletter automatically:
- ✅ Uses the latest roundup (or specified `roundupSlug`)
- ✅ Formats as HTML email with proper styling
- ✅ Includes link to read full roundup
- ✅ Includes unsubscribe links
- ✅ Shows your name (duke.sol) and Twitter

## Email Limits

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Perfect for small newsletters

**If you exceed limits:**
- Upgrade Resend plan
- Or send in batches over multiple days

## Weekly Workflow

1. **Friday**: Write weekly roundup in `content/roundups/`
2. **Friday 9 AM**: Cron job automatically sends (or send manually)
3. **Check**: Verify emails were sent in Resend Dashboard → Emails

---

## Troubleshooting

### "Failed to send newsletter"
- Check domain is verified in Resend
- Check `RESEND_FROM_EMAIL` is set correctly
- Check Resend Dashboard for errors

### "No subscribers found"
- Make sure `RESEND_AUDIENCE_ID` is set
- Check subscribers exist in Resend Dashboard → Audiences

### Emails not arriving
- Check spam folder
- Verify domain is verified in Resend
- Check Resend Dashboard → Emails for delivery status

