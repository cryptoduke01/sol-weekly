# Admin Password Fix - Final Solution 🔐

## Issue: Admin Password Returns 500 Error

The 500 error means `ADMIN_KEY` is **NOT set in Vercel environment variables**.

## Solution: Set ADMIN_KEY in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project: `sol-weekly-roundup` (or your project name)
3. Go to **Settings** → **Environment Variables**

### Step 2: Add ADMIN_KEY
1. Click **"Add New"**
2. **Key**: `ADMIN_KEY`
3. **Value**: `180476`
4. **Environment**: Select **Production** (and Preview/Development if needed)
5. Click **"Save"**

### Step 3: Redeploy
**CRITICAL:** After adding environment variables, you MUST redeploy!

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to finish

**OR** trigger a new deployment:
- Push a commit to your GitHub repo
- Or manually redeploy from Vercel dashboard

## Verify It's Working

1. Visit `/admin` page
2. Enter password: `180476`
3. Should login successfully (no more 500 error)

## Debugging

If still getting 500 error after redeploy:

### Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → **Logs**
2. Look for errors mentioning `ADMIN_KEY`
3. Check if key is actually set

### Verify Environment Variable
```bash
# In Vercel, the env var should be:
ADMIN_KEY=180476
```

**NOT:**
- `ADMIN_KEY="180476"` (no quotes needed)
- `ADMIN_KEY = 180476` (no spaces)
- `admin_key=180476` (case-sensitive, must be uppercase)

## Current Status

✅ Admin password: `180476`
✅ Admin endpoint: `/api/subscribe?key=180476`
✅ Error handling improved with better messages

## Environment Variables Checklist

Make sure these are ALL set in Vercel:

```
✅ ADMIN_KEY=180476
✅ RESEND_API_KEY=re_2fNezNf3_Mv2Fke2fQhfumo5ZAJ5wsQQ3
✅ RESEND_AUDIENCE_ID=your_audience_id_here
✅ RESEND_FROM_EMAIL=Solana Weekly <newsletter@solweekly.xyz>
✅ NEXT_PUBLIC_SITE_URL=https://www.solweekly.xyz
```

**If any are missing, add them and redeploy!**

