# Email Not Received - Troubleshooting Guide 🔍

## Quick Checks (Do These First!)

### 1. Check Resend Dashboard for Email Status

**Most Important:** Check if Resend actually sent the email:

1. Go to **Resend Dashboard**: https://resend.com/emails
2. Look for your test email in the list
3. Check the **Status** column:
   - ✅ **Sent** - Email was sent successfully (check spam folder)
   - ⚠️ **Pending** - Still processing (wait 1-2 minutes)
   - ❌ **Failed** - There was an error (click to see details)
   - 📧 **Delivered** - Email reached inbox
   - 🚫 **Bounced** - Email was rejected

**What to do:**
- If status is **"Sent"** or **"Delivered"** → Check spam/junk folder
- If status is **"Failed"** → Click on it to see error details
- If status is **"Pending"** → Wait 1-2 minutes and refresh

---

### 2. Check Spam/Junk Folder

Emails from new domains often go to spam:
- ✅ Check **Spam/Junk** folder
- ✅ Check **Promotions** tab (Gmail)
- ✅ Mark as "Not Spam" if found
- ✅ Add `newsletter@solweekly.xyz` to contacts

---

### 3. Check API Response

When you ran the test, what was the response?

**Good response:**
```json
{
  "success": true,
  "message": "Test email sent to your@email.com",
  "messageId": "e469853e-624a-4d28-8efa-0a27c0ae5700",
  "roundup": "..."
}
```

**Error response:**
```json
{
  "error": "Failed to send test email: [error message]"
}
```

**If you got an error:**
- Copy the error message
- Check Vercel logs (see below)
- Verify environment variables are set

---

### 4. Check Vercel Logs

Check what actually happened on the server:

1. Go to **Vercel Dashboard** → **Your Project** → **Logs**
2. Filter for: `/api/newsletter/test`
3. Look for:
   - ✅ Success messages
   - ❌ Error messages
   - 🔍 "Resend test send error" logs

**Common errors:**
- `RESEND_FROM_EMAIL` not set
- Domain not verified
- Invalid FROM email format
- API key issues

---

### 5. Verify FROM Email Format

Check your `RESEND_FROM_EMAIL` in Vercel:

**Correct format:**
```
Solana Weekly <newsletter@solweekly.xyz>
```

**Wrong formats:**
- ❌ `newsletter@solweekly.xyz` (missing name)
- ❌ `Solana Weekly newsletter@solweekly.xyz` (missing brackets)
- ❌ `"Solana Weekly" <newsletter@solweekly.xyz>` (extra quotes)

---

### 6. Verify Domain is Fully Verified

Even if DNS records are verified, check domain status:

1. Go to **Resend Dashboard** → **Domains**
2. Click on your domain: `solweekly.xyz`
3. Check status:
   - ✅ **Verified** - Good to go
   - ⚠️ **Pending** - Wait for verification
   - ❌ **Failed** - Check DNS records again

**If domain shows "Verified":**
- ✅ You're good
- ✅ Check Resend Dashboard → Emails for delivery status

---

## Common Issues & Fixes

### Issue 1: Email in Spam

**Symptom:** API returns success, but email not in inbox

**Fix:**
1. Check spam folder
2. Mark as "Not Spam"
3. Add to contacts
4. Wait for reputation to build (can take weeks)

---

### Issue 2: Domain Not Fully Verified

**Symptom:** API returns success but email fails in Resend dashboard

**Fix:**
1. Check Resend Dashboard → Domains
2. Verify all DNS records are correct
3. Click "Verify Records" again
4. Wait 5-10 minutes after DNS changes

---

### Issue 3: FROM Email Format Wrong

**Symptom:** API returns error about FROM email

**Fix:**
1. Check `RESEND_FROM_EMAIL` in Vercel
2. Format: `Name <email@domain.com>`
3. Must use verified domain
4. Redeploy after changing

---

### Issue 4: Email Bounced

**Symptom:** Resend dashboard shows "Bounced"

**Fix:**
1. Check Resend Dashboard → Emails → Click on email → See bounce reason
2. Common reasons:
   - Invalid email address
   - Recipient mailbox full
   - Recipient server blocking
3. For test emails, use a real, active email address

---

### Issue 5: Rate Limits

**Symptom:** API returns error about rate limits

**Fix:**
1. Resend free tier: 3,000 emails/month, 100 emails/day
2. Check Resend Dashboard → Usage
3. Wait or upgrade plan

---

## Debug Steps (Run These)

### Step 1: Test API Endpoint

Run this curl command (replace with your actual values):

```bash
curl -X POST https://www.solweekly.xyz/api/newsletter/test \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "180476",
    "testEmail": "your-real-email@gmail.com"
  }' \
  -v
```

**What to check:**
- HTTP status code (200 = success, 500 = error)
- Response body (look for error messages)
- Replace `your-real-email@gmail.com` with YOUR actual email

---

### Step 2: Check Response

**If successful:**
```json
{
  "success": true,
  "message": "Test email sent to your@email.com",
  "messageId": "...",
  "roundup": "..."
}
```
→ Go to Resend Dashboard and check email status

**If error:**
```json
{
  "error": "Failed to send test email: [message]"
}
```
→ Copy error message and check troubleshooting above

---

### Step 3: Check Resend Dashboard

1. Go to https://resend.com/emails
2. Find your test email (look for the `messageId` from API response)
3. Click on it to see:
   - Status
   - Delivery details
   - Error messages (if any)

---

## Still Not Working?

### Check These:

1. ✅ **Domain fully verified?** (Resend Dashboard → Domains)
2. ✅ **RESEND_FROM_EMAIL set correctly?** (Vercel → Environment Variables)
3. ✅ **Site redeployed after adding RESEND_FROM_EMAIL?** (Required!)
4. ✅ **Using real email address for test?** (Not test@example.com)
5. ✅ **Checked spam folder?**
6. ✅ **Checked Resend Dashboard → Emails for status?**

---

## Next Steps

Once email arrives:
- ✅ Test email works → You're ready to send newsletters!
- ✅ Use `/api/newsletter/send` to send to all subscribers
- ✅ Or wait for Friday's automatic cron job

---

## Need More Help?

Check:
- Resend Dashboard → Emails (delivery status)
- Vercel Dashboard → Logs (server errors)
- Email spam folder (first-time sends often go to spam)

