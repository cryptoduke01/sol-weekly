# Deployment Checklist 🚀

## Pre-Deployment Checklist

### ✅ Code Ready
- [x] All features implemented
- [x] Admin page isolated (no links, only direct route access)
- [x] Loading screens removed from admin page
- [x] Email signup working
- [x] Blog content ready

### 🔑 Environment Variables (Add to Vercel)

**Required:**
```env
ADMIN_KEY=Akachukwu57#
RESEND_API_KEY=re_2fNezNf3_Mv2Fke2fQhfumo5ZAJ5wsQQ3
NEWS_API_KEY=6ff4c01f39b74fe28f9ccf0906c33c13
```

**Optional:**
```env
RESEND_AUDIENCE_ID=your_audience_id_here  # If using Resend contacts
HELIUS_API_KEY=68b0b212-d039-45da-a3f3-2417c3eca91c  # For enhanced stats
ADMIN_KEY=Akachukwu57#  # Already set
```

### 📦 Build & Test Locally

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Test production build locally
pnpm start
```

## Vercel Deployment Steps

### 1. Push to Git (if using Git)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository (or drag & drop)
4. Configure:
   - **Framework Preset:** Next.js
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### 3. Add Environment Variables

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add each variable:
   - `ADMIN_KEY` = `Akachukwu57#`
   - `RESEND_API_KEY` = `re_2fNezNf3_Mv2Fke2fQhfumo5ZAJ5wsQQ3`
   - `NEWS_API_KEY` = `6ff4c01f39b74fe28f9ccf0906c33c13`
   - `HELIUS_API_KEY` = `68b0b212-d039-45da-a3f3-2417c3eca91c` (optional)
   - `RESEND_AUDIENCE_ID` = your_audience_id (optional)

3. Select **Environment:** Production, Preview, Development (all)

4. Click **Save**

### 4. Redeploy After Adding Variables

- Go to **Deployments** tab
- Click **...** (three dots) on latest deployment
- Click **Redeploy**

## Post-Deployment Checks

### ✅ Verify These Work:

1. **Homepage**
   - [ ] Loading screen works
   - [ ] Latest blog displays
   - [ ] Market sentiment shows
   - [ ] AI news summary loads

2. **Blog Pages**
   - [ ] Blog list page (`/blog`)
   - [ ] Individual blog posts (`/roundup/[slug]`)
   - [ ] Reading mode works
   - [ ] Share modal works

3. **Support Page**
   - [ ] `/support` displays
   - [ ] QR codes generate
   - [ ] Copy addresses works

4. **Email Signup**
   - [ ] Form submits successfully
   - [ ] Success modal appears
   - [ ] Error handling works (duplicate email)
   - [ ] Emails saved to `data/subscribers.json`

5. **Admin Panel**
   - [ ] `/admin` accessible (direct URL only)
   - [ ] Login with `Akachukwu57#` works
   - [ ] Subscribers list displays
   - [ ] Export CSV works
   - [ ] Delete emails works

6. **Live Stats**
   - [ ] Stats bar appears at bottom
   - [ ] Expand/collapse works
   - [ ] Data refreshes

## Security Checklist

- [x] `.env.local` in `.gitignore` ✅
- [x] `data/subscribers.json` in `.gitignore` ✅
- [x] Admin page not linked anywhere ✅
- [x] Admin key protected ✅
- [ ] HTTPS enabled (Vercel default)
- [ ] Environment variables set in Vercel

## Domain Configuration (Optional)

If you have a custom domain:

1. Go to Vercel → Project → **Settings** → **Domains**
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## Monitoring & Analytics

- ✅ Vercel Analytics already integrated
- View analytics: Vercel Dashboard → **Analytics**

## Troubleshooting

### Build Fails
- Check environment variables are set
- Check `pnpm build` works locally
- Check console logs in Vercel deployment

### API Routes Not Working
- Verify environment variables in Vercel
- Check API route logs in Vercel Dashboard
- Test endpoints with `curl` or Postman

### Admin Page Not Working
- Verify `ADMIN_KEY` is set correctly
- Check browser console for errors
- Verify route is `/admin` (not linked anywhere)

### Emails Not Saving
- Check `data/` directory exists in Vercel (may need Vercel KV or database for production)
- Consider using Resend contacts API
- Check API route logs

## Important Notes

⚠️ **File Storage in Production:**
- Local file storage (`data/subscribers.json`) works on Vercel
- However, it's ephemeral - files reset on each deployment
- **Recommendation:** Use Resend contacts API or a database for production

💡 **For Production Email Storage:**
1. Set up Resend Audience (recommended)
2. Add `RESEND_AUDIENCE_ID` to environment variables
3. Emails will sync to Resend automatically

## Ready to Deploy? 🚀

Run:
```bash
pnpm build
```

If build succeeds, you're ready! Deploy to Vercel.

---

**Admin Access:**
- URL: `https://yoursite.com/admin`
- Password: `Akachukwu57#`
- Not linked anywhere - direct URL only

