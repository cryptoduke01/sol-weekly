# Email Storage Guide

## Current Setup (File-Based Storage)

**How it works:**
- Emails are stored in `data/subscribers.json`
- Simple JSON array of email addresses
- Works immediately, no setup needed

**Pros:**
- ✅ No API keys needed
- ✅ Works right away
- ✅ Simple to manage

**Cons:**
- ❌ Not great for large lists
- ❌ No email sending built-in
- ❌ Manual management

---

## Better Option: Resend (Recommended)

**Why Resend?**
- Free tier: 3,000 emails/month, 100/day
- Built for developers
- Great Next.js/Vercel integration
- Automatic list management
- Can send emails later

### Setup Resend:

1. **Sign up:** https://resend.com
2. **Get API Key:** Dashboard → API Keys
3. **Create Audience:** Dashboard → Audiences (create one)
4. **Add to `.env.local`:**
   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_AUDIENCE_ID=your_audience_id_here
   ```
5. **Add to Vercel:** Project Settings → Environment Variables

**That's it!** The API route will automatically use Resend if the key is set.

---

## Alternative Options

### 1. Mailchimp
- Free tier: 500 contacts, 1,000 sends/month
- More features but heavier
- Requires Mailchimp API integration

### 2. ConvertKit
- Free tier: Up to 1,000 subscribers
- Great for creators
- Requires ConvertKit API

### 3. Buttondown
- Simple email newsletter
- Free tier available
- Good for writers

### 4. Database (Future)
- Store in database (PostgreSQL, MongoDB)
- More scalable
- Better for large lists
- Requires database setup

---

## Current Storage Location

**File:** `data/subscribers.json`

**Format:**
```json
[
  "user1@example.com",
  "user2@example.com"
]
```

**Access emails:**
- View file: `data/subscribers.json`
- Or use API: `GET /api/subscribe?key=YOUR_ADMIN_KEY`

---

## Adding Admin Key (Optional)

To view subscribers via API, add to `.env.local`:

```env
ADMIN_KEY=your_secret_key_here
```

Then visit:
```
https://yoursite.com/api/subscribe?key=your_secret_key_here
```

---

## Next Steps

1. **For now:** File-based storage works fine
2. **When ready:** Set up Resend (recommended)
3. **Later:** Move to database if list grows

The form works with either method - it will save to file automatically, and use Resend if configured.

