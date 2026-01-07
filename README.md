# Solana Weekly Roundup

A minimal, modern blog for weekly Solana ecosystem updates.

## 🚀 Quick Deploy to Vercel

### Step 1: Push to Git
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js

### Step 3: Add Environment Variables

**CRITICAL:** Go to Project Settings → Environment Variables and add:

```
NEWS_API_KEY=6ff4c01f39b74fe28f9ccf0906c33c13
```

**Important:** 
- Add for all environments (Production, Preview, Development)
- After adding, redeploy the project

### Step 4: Verify Build

- Check build logs in Vercel dashboard
- Should see "Build Successful"
- Visit your deployed URL

## 🛠️ Local Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── blog/           # Blog listing page
│   ├── roundup/        # Individual blog posts
│   └── support/         # Support page
├── components/          # React components
├── content/             # MDX blog content
└── lib/                 # Utilities
```

## 🔑 Environment Variables

Create `.env.local`:

```env
NEWS_API_KEY=your_newsapi_key_here
```

## 📝 Adding Content

See `CONTENT_GUIDE.md` for how to add weekly roundups.

## 🐛 Troubleshooting

### Default Next.js Page Shows on Vercel

1. **Check Environment Variables:**
   - Go to Vercel → Project Settings → Environment Variables
   - Ensure `NEWS_API_KEY` is set
   - Redeploy after adding

2. **Check Build Logs:**
   - Vercel Dashboard → Deployments → View Logs
   - Look for errors

3. **Clear Cache:**
   - Settings → Clear Build Cache
   - Redeploy

4. **Verify Files:**
   - Ensure `app/page.tsx` exists
   - Ensure `content/` folder is committed

## 📚 Documentation

- `CONTENT_GUIDE.md` - How to write blog posts
- `API_KEYS_GUIDE.md` - API key setup
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide
- `IMPLEMENTATION_GUIDE.md` - Technical details

## 🎨 Features

- ✅ Minimal, modern design
- ✅ Light/Dark mode
- ✅ Live Solana stats
- ✅ Real-time news feed
- ✅ Market sentiment data
- ✅ Reading mode with highlights
- ✅ Social sharing
- ✅ Responsive design
- ✅ SEO optimized

## 📄 License

MIT
