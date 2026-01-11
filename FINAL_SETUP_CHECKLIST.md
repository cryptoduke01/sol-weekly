# ✅ Final Setup Checklist - Ready to Send Newsletter!

## ✅ Step 1: DNS Verified (DONE!)
Your domain is verified in Resend. Great work! 🎉

---

## Step 2: Set Environment Variables in Vercel

Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

### Required Variables:

1. **RESEND_FROM_EMAIL** (Required)
   ```
   RESEND_FROM_EMAIL=Solana Weekly <newsletter@solweekly.xyz>
   ```
   ⚠️ **Important:** Replace `solweekly.xyz` with your actual verified domain if different.

2. **ADMIN_KEY** (Should already be set)
   ```
   ADMIN_KEY=180476
   ```

3. **RESEND_API_KEY** (Should already be set)
   ```
   RESEND_API_KEY=re_2fNezNf3_Mv2Fke2fQhfumo5ZAJ5wsQQ3
   ```

4. **RESEND_AUDIENCE_ID** (Should already be set)
   ```
   RESEND_AUDIENCE_ID=your_audience_id_here
   ```

5. **NEXT_PUBLIC_SITE_URL** (Optional but recommended)
   ```
   NEXT_PUBLIC_SITE_URL=https://www.solweekly.xyz
   ```

### After Adding Variables:
✅ **REQUIRED:** Redeploy your site (push a commit or redeploy from dashboard)

---

## Step 3: Test Newsletter Sending

### Option A: Test Email (Send to yourself first)

```bash
curl -X POST https://www.solweekly.xyz/api/newsletter/test \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "180476",
    "testEmail": "your-email@gmail.com"
  }'
```

**Replace:**
- `your-email@gmail.com` with your actual email address
- `www.solweekly.xyz` with your actual domain if different

### Option B: Test from Admin Panel (if we add button)

Or visit `/admin` and use the test email feature (if implemented).

---

## Step 4: Verify Test Email Arrived

1. ✅ Check your inbox (and spam folder)
2. ✅ Email should come from: `newsletter@solweekly.xyz` (or your domain)
3. ✅ Subject: Latest roundup title
4. ✅ Should contain newsletter preview

**If test email works:** ✅ You're ready to send to all subscribers!

**If test email fails:** Check Vercel logs for errors

---

## Step 5: Send Newsletter (When Ready)

### Option A: Manual Send (API)

Send to all subscribers:
```bash
curl -X POST https://www.solweekly.xyz/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"adminKey": "180476"}'
```

Send specific roundup:
```bash
curl -X POST https://www.solweekly.xyz/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "180476",
    "roundupSlug": "week-1-jan-4-10-2026"
  }'
```

### Option B: Automated (Cron Job) - Already Configured! ✅

Your site is already configured to send **every Friday at 9 AM UTC** automatically!

**To enable/disable:**
- The cron job is in `vercel.json`
- It sends the **latest** roundup automatically
- No action needed - it will run every Friday

### Option C: Create Admin Button (Future Enhancement)

We can add a "Send Newsletter" button to `/admin` page for easier sending.

---

## Step 6: Monitor Newsletter Sends

### Check Resend Dashboard:
1. Go to **Resend Dashboard** → **Emails**
2. See all sent emails with delivery status
3. Check for bounces, opens, clicks (if enabled)

### Check Vercel Logs:
1. Go to **Vercel Dashboard** → **Your Project** → **Logs**
2. Filter for `/api/newsletter/send`
3. Check for any errors

---

## Quick Checklist ✅

- [x] DNS records verified in Resend ✅
- [ ] `RESEND_FROM_EMAIL` set in Vercel
- [ ] `ADMIN_KEY` set in Vercel (should be done)
- [ ] `RESEND_API_KEY` set in Vercel (should be done)
- [ ] `RESEND_AUDIENCE_ID` set in Vercel (should be done)
- [ ] Site redeployed after adding variables
- [ ] Test email sent successfully
- [ ] Test email received ✅
- [ ] Ready to send to all subscribers! 🚀

---

## Troubleshooting

### "Failed to send email" error:
- ✅ Check `RESEND_FROM_EMAIL` format: `"Name <email@domain.com>"`
- ✅ Domain must be verified in Resend (you did this ✅)
- ✅ Check Vercel logs for specific error

### "No subscribers found":
- ✅ Make sure `RESEND_AUDIENCE_ID` is correct
- ✅ Check Resend Dashboard → Audiences → Your Audience has contacts

### Test email not arriving:
- ✅ Check spam folder
- ✅ Wait 1-2 minutes (email delivery can be delayed)
- ✅ Check Resend Dashboard → Emails for status
- ✅ Verify FROM email is correct

---

## Next Steps After Setup:

1. ✅ **Weekly Workflow:**
   - Write roundup in `content/roundups/week-X.mdx`
   - Test send on Friday morning
   - Manual send or let cron job send automatically

2. ✅ **Monitor Performance:**
   - Check Resend Dashboard for open rates
   - Monitor bounce rates
   - Adjust send times if needed

3. ✅ **Future Enhancements:**
   - Add "Send Newsletter" button to admin panel
   - Add email analytics tracking
   - Add unsubscribe functionality (basic one exists)

---

## You're Almost There! 🎉

**Right now:**
1. Set `RESEND_FROM_EMAIL` in Vercel
2. Redeploy
3. Send test email
4. If test works → You're ready to send! 🚀

