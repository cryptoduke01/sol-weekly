# Admin Login Fix 🔧

## Issue: "Invalid admin key" on Deployed Site

### ✅ Solution: Verify ADMIN_KEY in Vercel

## Step-by-Step Fix:

### 1. Check Vercel Environment Variables

Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

**Required Variable:**
```
ADMIN_KEY=Akachukwu57#
```

### 2. Important Notes:

⚠️ **Special Characters:**
- The password contains `#` - make sure it's included
- No extra spaces before/after
- Value should be exactly: `Akachukwu57#`

⚠️ **Environment Selection:**
- Select **ALL** environments: Production, Preview, Development
- Admin should work in all environments

### 3. Verify the Variable:

1. **Check it exists:**
   - Should see `ADMIN_KEY` in the list
   - Value should be `Akachukwu57#` (with the `#`)

2. **Check for typos:**
   - `Akachukwu57#` (correct)
   - `Akachukwu57` (missing `#`) ❌
   - `akachukwu57#` (lowercase) ❌
   - ` Akachukwu57# ` (extra spaces) ❌

### 4. Redeploy After Adding/Changing:

**CRITICAL:** After adding/changing `ADMIN_KEY`:
1. Go to **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### 5. Test Login:

1. Visit: `https://yoursite.com/admin`
2. Enter: `Akachukwu57#`
3. Should login successfully ✅

## 🐛 Troubleshooting

### Still Getting "Invalid admin key"?

**Check 1: Variable Format**
```env
# ✅ Correct
ADMIN_KEY=Akachukwu57#

# ❌ Wrong (missing #)
ADMIN_KEY=Akachukwu57

# ❌ Wrong (extra spaces)
ADMIN_KEY= Akachukwu57# 

# ❌ Wrong (quotes - don't add quotes!)
ADMIN_KEY="Akachukwu57#"
```

**Check 2: Environment Selection**
- Make sure `ADMIN_KEY` is selected for **Production** environment
- Also select for Preview and Development if needed

**Check 3: Redeployed?**
- Did you redeploy after adding the variable?
- Old deployments use old environment variables
- **Always redeploy after adding/changing env vars**

**Check 4: Variable Name**
- Make sure it's exactly `ADMIN_KEY` (uppercase, underscore)
- Not `admin_key`, `ADMIN_KEY_`, or `ADMINKEY`

**Check 5: Browser Cache**
- Clear browser cache
- Try incognito/private window
- Try different browser

### Debug Steps:

1. **Check Vercel Logs:**
   - Go to Vercel → Your Project → **Logs**
   - Look for errors mentioning `ADMIN_KEY`

2. **Test API Directly:**
   ```
   https://yoursite.com/api/subscribe?key=Akachukwu57#
   ```
   - Should return JSON with subscribers (if authorized)
   - Should return 401 if wrong key

3. **Verify Deployment:**
   - Check latest deployment build logs
   - Make sure build succeeded
   - Check if `ADMIN_KEY` is listed in "Environment Variables" section

## ✅ Quick Checklist

- [ ] `ADMIN_KEY` exists in Vercel environment variables
- [ ] Value is exactly `Akachukwu57#` (with `#`)
- [ ] Selected for Production environment (and Preview/Development if needed)
- [ ] Redeployed after adding/changing the variable
- [ ] Cleared browser cache or tried incognito
- [ ] Verified deployment build succeeded

## 🚀 Quick Fix Command

If you have Vercel CLI installed:

```bash
# Add ADMIN_KEY
vercel env add ADMIN_KEY production
# When prompted, enter: Akachukwu57#

# Redeploy
vercel --prod
```

---

**Still not working?** 
- Double-check the value has no extra spaces
- Make sure `#` is included
- Redeploy after any changes
- Check Vercel deployment logs for errors

