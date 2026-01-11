# DNS Records Setup for Resend 📧

## Step-by-Step Guide: Add DNS Records to Vercel

### What You Need to Add:

You need to add **3 DNS records** to Vercel:

1. ✅ **1 DKIM Record** (TXT)
2. ✅ **2 SPF Records** (1 MX + 1 TXT)
3. ⚠️ **DMARC** (Optional - skip for now)

---

## Step 1: Open Vercel DNS Settings

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your project: `sol-weekly-roundup` (or your project name)
3. Go to **Settings** tab
4. Click **Domains** in the left sidebar
5. Find your domain: `solweekly.xyz` (or your domain)
6. Click on the domain name
7. Click **DNS Records** tab (or **"Configure DNS"**)

---

## Step 2: Add DKIM Record (Required)

**Type:** `TXT`  
**Name:** `resend._domainkey`  
**Value:** Copy the full value from Resend (the long string starting with `p=MIGfMA0GCSqGSIb3DQEB...`)  
**TTL:** `Auto` (or `3600`)

**How to add in Vercel:**
1. Click **"Add Record"** button
2. Select **Type:** `TXT`
3. Enter **Name:** `resend._domainkey`
4. Paste the full **Value** from Resend (copy the complete string from the DKIM section)
5. Set **TTL:** `Auto` or `3600`
6. Click **Save**

**⚠️ Important:** Make sure you copy the **complete** DKIM value from Resend. It's a very long string (starts with `p=MIGfMA0GCSqGSIb3DQEB...`).

---

## Step 3: Add SPF Records (Required - 2 records)

### SPF Record 1: MX Record

**Type:** `MX`  
**Name:** `send`  
**Value:** `feedback-smtp.eu-west-1.amazonses.com` (or the full value shown in Resend)  
**TTL:** `60`  
**Priority:** `10`

**How to add in Vercel:**
1. Click **"Add Record"** button
2. Select **Type:** `MX`
3. Enter **Name:** `send`
4. Enter **Value:** The full MX value from Resend (looks like `feedback-smtp.eu-west-...`)
5. Set **TTL:** `60`
6. Set **Priority:** `10`
7. Click **Save**

### SPF Record 2: TXT Record

**Type:** `TXT`  
**Name:** `send`  
**Value:** `v=spf1 include:amazonses.com ~all` (or the full value shown in Resend)  
**TTL:** `60`

**How to add in Vercel:**
1. Click **"Add Record"** button
2. Select **Type:** `TXT`
3. Enter **Name:** `send`
4. Paste the full **Value** from Resend (starts with `v=spf1 include:amazons...`)
5. Set **TTL:** `60`
6. Click **Save**

---

## Step 4: Verify Records in Resend

**IMPORTANT:** DNS records can take 5-60 minutes to propagate.

1. Wait at least **5-10 minutes** after adding all records
2. Go back to **Resend Dashboard** → **Domains** → Your domain
3. Click the **"Verify Records"** button at the top
4. Resend will check if all DNS records are correct

**If verification fails:**
- Wait 15-30 more minutes (DNS propagation takes time)
- Double-check that all values are copied correctly (no extra spaces, complete values)
- Make sure the **Name** field exactly matches: `resend._domainkey` and `send`
- Try clicking "Verify Records" again

---

## Summary: Records to Add

| Type | Name | Value | TTL | Priority |
|------|------|-------|-----|----------|
| TXT | `resend._domainkey` | (Full DKIM string from Resend) | Auto | - |
| MX | `send` | (MX value from Resend) | 60 | 10 |
| TXT | `send` | (SPF value from Resend) | 60 | - |

**Total: 3 records** ✅

---

## Troubleshooting

### "Records not found" error:
- ✅ Wait longer (DNS can take up to 48 hours, but usually 5-30 minutes)
- ✅ Check that values are copied **completely** (no truncation)
- ✅ Verify Name field is exact: `resend._domainkey` (not `resend_domainkey` or `resend.domainkey`)
- ✅ Make sure you're adding to the **correct domain** in Vercel

### "Invalid format" error:
- ✅ Make sure DKIM value is the complete string (very long, starts with `p=`)
- ✅ Make sure SPF TXT value starts with `v=spf1`
- ✅ Remove any extra spaces or quotes when copying

### Vercel DNS not showing records:
- ✅ Make sure you're in **Settings** → **Domains** → **Your Domain** → **DNS Records**
- ✅ Refresh the page after adding records
- ✅ Check if your domain is managed by Vercel (some domains need DNS configured at your registrar)

---

## After Verification ✅

Once all records are verified in Resend:
1. ✅ Your domain status will show as **"Verified"**
2. ✅ You can now send emails using: `newsletter@solweekly.xyz`
3. ✅ Update `RESEND_FROM_EMAIL` in Vercel if needed

---

## Next Steps

After DNS records are verified:
1. ✅ Test newsletter: Send a test email using `/api/newsletter/test`
2. ✅ Send newsletter: Use `/api/newsletter/send` or wait for Friday's cron job
3. ✅ Monitor: Check Resend Dashboard → Emails for delivery status

