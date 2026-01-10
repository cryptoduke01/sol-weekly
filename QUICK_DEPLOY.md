# Quick Deployment Guide 🚀

## ✅ Pre-Deployment Checklist

- [x] Admin page isolated (standalone, no Header/Footer/Loading)
- [x] Admin page accessible only via direct URL: `/admin`
- [x] All environment variables documented
- [x] Build configuration ready

## 🚀 Deploy to Vercel (5 Steps)

### Step 1: Environment Variables
Add these to Vercel Dashboard → Settings → Environment Variables:

```env
ADMIN_KEY=Akachukwu57#
RESEND_API_KEY=re_2fNezNf3_Mv2Fke2fQhfumo5ZAJ5wsQQ3
NEWS_API_KEY=6ff4c01f39b74fe28f9ccf0906c33c13
HELIUS_API_KEY=68b0b212-d039-45da-a3f3-2417c3eca91c
```

### Step 2: Deploy
```bash
# Via CLI
vercel

# Or via Dashboard: https://vercel.com/new
```

### Step 3: Configure Build Settings
- Framework: Next.js
- Build Command: `pnpm build`
- Output Directory: `.next` (default)
- Install Command: `pnpm install`

### Step 4: Redeploy After Adding Env Vars
- Go to Deployments → Latest → ... → Redeploy

### Step 5: Test
- Homepage: `https://yoursite.com`
- Admin: `https://yoursite.com/admin` (password: `Akachukwu57#`)
- Blog: `https://yoursite.com/blog`
- Support: `https://yoursite.com/support`

## 📝 Admin Access

- **URL:** Direct only - `/admin` (not linked anywhere)
- **Password:** `Akachukwu57#`
- **No Header/Footer/Loading** - Standalone page

## ⚠️ Important Notes

1. **File Storage:** `data/subscribers.json` works but resets on deployment
   - **Solution:** Use Resend contacts API (set `RESEND_AUDIENCE_ID`)

2. **Environment Variables:** Must be added to Vercel Dashboard
   - Don't commit `.env.local` to Git

3. **Build Test Locally:**
   ```bash
   pnpm build
   pnpm start
   ```

## 🐛 Troubleshooting

**Build fails?**
- Check all env vars are set in Vercel
- Run `pnpm build` locally to see errors

**Admin page not working?**
- Verify `ADMIN_KEY` matches in Vercel
- Check browser console for errors

**Emails not saving?**
- File storage resets on deployment
- Set up Resend contacts API for persistence

---

**Ready?** → Deploy to Vercel! 🚀

