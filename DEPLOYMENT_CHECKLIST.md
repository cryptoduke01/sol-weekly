# Vercel Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

```
NEWS_API_KEY=6ff4c01f39b74fe28f9ccf0906c33c13
```

**Important:** Add this for all environments (Production, Preview, Development)

### 2. Build Settings

Vercel should auto-detect Next.js, but verify:
- **Framework Preset:** Next.js
- **Build Command:** `pnpm build` (or `npm run build`)
- **Output Directory:** `.next` (default)
- **Install Command:** `pnpm install` (or `npm install`)

### 3. Node Version

Make sure Vercel uses Node 18+:
- Go to Project Settings → General → Node.js Version
- Set to: `18.x` or `20.x`

## 🔧 Common Issues & Fixes

### Issue: Default Next.js Page Shows

**Possible Causes:**
1. Build is failing silently
2. Environment variables not set
3. Content files not being included

**Fix:**
1. Check Vercel build logs for errors
2. Ensure `.env.local` variables are added to Vercel
3. Verify `content/` folder is committed to git

### Issue: Build Errors

**Check:**
- Tailwind CSS v4 compatibility
- Missing dependencies
- TypeScript errors

**Fix:**
```bash
# Test build locally first
pnpm build

# If it works locally, check Vercel logs
```

### Issue: API Routes Not Working

**Check:**
- Environment variables are set in Vercel
- API routes are in `app/api/` folder
- No CORS issues

## 📝 Deployment Steps

1. **Push to Git:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect to Vercel:**
   - Import your Git repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add `NEWS_API_KEY=6ff4c01f39b74fe28f9ccf0906c33c13`
   - Select all environments

4. **Deploy:**
   - Vercel will auto-deploy on push
   - Or click "Deploy" manually

5. **Verify:**
   - Check build logs for errors
   - Visit your deployed site
   - Test API routes: `your-site.vercel.app/api/news`

## 🚨 If Still Seeing Default Page

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → View Build Logs
   - Look for errors

2. **Verify File Structure:**
   - Ensure `app/page.tsx` exists
   - Ensure `app/layout.tsx` exists
   - Ensure `content/` folder is in repo

3. **Clear Cache:**
   - In Vercel: Settings → Clear Build Cache
   - Redeploy

4. **Check Root Directory:**
   - If repo is in subfolder, set Root Directory in Vercel settings

## ✅ Quick Test

After deployment, test these URLs:
- Homepage: `https://your-site.vercel.app/`
- Blog: `https://your-site.vercel.app/blog`
- API: `https://your-site.vercel.app/api/news`
- Support: `https://your-site.vercel.app/support`

All should work without showing default Next.js page.

