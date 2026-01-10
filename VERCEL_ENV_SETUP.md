# Vercel Environment Variables Setup ✅

## Required Variables in Vercel

Add these to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### 1. Admin Password
```
ADMIN_KEY=180476
```
- ✅ Already set locally
- ⚠️ **Add to Vercel now** (value: `180476`)
- ⚠️ **Must redeploy** after adding

### 2. Resend API Key (Already Have ✅)
```
RESEND_API_KEY=re_2fNezNf3_Mv2Fke2fQhfumo5ZAJ5wsQQ3
```
- ✅ You already have this
- **Permission Required:** Full Access (not just "Sending Access")

### 3. Resend Audience ID (MISSING ❌)
```
RESEND_AUDIENCE_ID=your_audience_id_here
```

**How to Get RESEND_AUDIENCE_ID:**

1. Go to https://resend.com/dashboard
2. Click **"Audiences"** in left sidebar  
3. Click **"Create Audience"** button
4. Name it: "Solana Weekly Subscribers" (or any name)
5. Click **"Create"**
6. **Copy the Audience ID** (long string like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
7. Add to Vercel environment variables
8. **Redeploy**

### 4. Other Variables (Optional)
```
NEWS_API_KEY=6ff4c01f39b74fe28f9ccf0906c33c13
HELIUS_API_KEY=68b0b212-d039-45da-a3f3-2417c3eca91c
```

## Checklist

### Admin Password Fix:
- [ ] Add `ADMIN_KEY=180476` to Vercel
- [ ] Select **Production** environment  
- [ ] Redeploy
- [ ] Test: Visit `/admin` → Enter `180476`

### Email Subscription Fix:
- [ ] Go to Resend Dashboard → Audiences
- [ ] Create Audience (if not exists)
- [ ] Copy Audience ID
- [ ] Add `RESEND_AUDIENCE_ID=your_id` to Vercel
- [ ] Verify API key has **Full Access** permissions
- [ ] Redeploy
- [ ] Test: Try subscribing with email

## API Key Permissions

**Required:** Full Access ✅

To check/change:
1. Resend Dashboard → API Keys
2. Find your key: `re_2fNezNf3_...`
3. Make sure it says **"Full Access"**
4. If it says "Sending Access" only, create new key with Full Access

## After Adding Variables

**CRITICAL:** After adding/changing ANY environment variable:
1. Go to **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete
5. Test your site

## Why RESEND_AUDIENCE_ID?

- Resend needs an "Audience" (like a mailing list folder) to store contacts
- You can't just store emails without an audience
- It's free to create an audience
- Takes 2 minutes to set up

---

**Quick Fix:**
1. Create Audience in Resend → Get Audience ID
2. Add `RESEND_AUDIENCE_ID` to Vercel
3. Add `ADMIN_KEY=180476` to Vercel (if not already)
4. Redeploy
5. Done! ✅

