# Admin Password Fix - New Password: 180476

## ✅ Password Changed

New admin password: **`180476`**

## Required Setup

### 1. Update Local (.env.local) - ✅ DONE
```
ADMIN_KEY=180476
```

### 2. Update Vercel Environment Variables - ⚠️ REQUIRED

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `ADMIN_KEY` in the list (or add it if it doesn't exist)
3. Set value to: `180476` (no spaces, just the numbers)
4. Select **Production** environment (and Preview/Development if needed)
5. Click **Save**
6. **CRITICAL:** Go to **Deployments** tab → Click **Redeploy** on latest deployment

### 3. Test Login

After redeploying:
1. Visit: `https://yoursite.com/admin`
2. Enter password: `180476`
3. Should login successfully ✅

## Common Issues

### "Invalid admin key" still showing?

**Check 1: Did you redeploy?**
- Old deployments use old environment variables
- **Must redeploy after changing ADMIN_KEY**

**Check 2: Value is correct?**
- Should be exactly: `180476`
- No spaces: ❌ ` 180476 ` or ✅ `180476`
- No quotes: ❌ `"180476"` or ✅ `180476`

**Check 3: Environment selected?**
- Make sure ADMIN_KEY is selected for **Production** environment
- Check Vercel → Settings → Environment Variables → See which environments are checked

**Check 4: Browser cache?**
- Clear browser cache
- Try incognito/private window
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## Quick Fix Command (if using Vercel CLI)

```bash
# Update ADMIN_KEY
vercel env add ADMIN_KEY production
# When prompted, enter: 180476

# Redeploy
vercel --prod
```

---

**New password:** `180476`  
**Update in Vercel and redeploy!** ✅

