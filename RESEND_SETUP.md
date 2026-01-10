# Resend Setup Guide 📧

## What is RESEND_AUDIENCE_ID?

**Audience ID** is required to store contacts in Resend. It's like a mailing list/folder where all your subscribers are stored.

## How to Get RESEND_AUDIENCE_ID

### Step 1: Create an Audience in Resend

1. Go to https://resend.com/dashboard
2. Click **"Audiences"** in the left sidebar
3. Click **"Create Audience"** button
4. Enter a name (e.g., "Solana Weekly Subscribers")
5. Click **"Create"**
6. You'll see your Audience - **copy the Audience ID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 2: Add to Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add:
   ```
   RESEND_AUDIENCE_ID=your_audience_id_here
   ```
3. Select **Production** (and Preview/Development if needed)
4. Click **Save**
5. **Redeploy** your project

## API Key Permissions

### Required Permissions: **FULL ACCESS** ✅

Your Resend API key needs **Full Access** to manage contacts:
- ✅ Create contacts
- ✅ List contacts  
- ✅ Delete contacts
- ✅ Send emails

### How to Check/Change Permissions:

1. Go to https://resend.com/dashboard
2. Click **"API Keys"** in left sidebar
3. Find your API key (or create a new one)
4. Select **"Full Access"** permissions
5. Save

**Note:** If your key has "Sending Access" only, it won't work for managing contacts. You need Full Access.

## Required Environment Variables in Vercel

```env
RESEND_API_KEY=re_2fNezNf3_Mv2Fke2fQhfumo5ZAJ5wsQQ3
RESEND_AUDIENCE_ID=your_audience_id_here  # ⚠️ REQUIRED for email storage
ADMIN_KEY=180476
```

## Quick Setup Checklist

- [ ] Created Audience in Resend Dashboard
- [ ] Copied Audience ID
- [ ] Added `RESEND_AUDIENCE_ID` to Vercel environment variables
- [ ] Verified API key has **Full Access** permissions
- [ ] Redeployed after adding environment variables
- [ ] Tested email subscription

---

**Still having issues?** Make sure you:
1. Created the Audience (not just have the API key)
2. Copied the correct Audience ID
3. Added it to Vercel (not just local .env.local)
4. Redeployed after adding

