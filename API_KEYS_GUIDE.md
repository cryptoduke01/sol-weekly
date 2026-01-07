# API Keys Guide

## Current Status

**Good News:** The site works WITHOUT any API keys! 🎉

- ✅ **News API**: Uses CryptoCompare (free, no key needed)
- ✅ **Sentiment API**: Uses Binance (free, no key needed)
- ✅ **Solana Stats**: Uses CoinGecko (free, no key needed)

## Optional API Keys (For Better Data)

### 1. NewsAPI Key (Optional - Better News Quality)

**Why?** NewsAPI provides better quality, more recent news articles.

**Where to get it:**
1. Go to https://newsapi.org
2. Click "Get API Key" or "Sign Up"
3. Create a free account
4. Copy your API key from the dashboard

**Free Tier:**
- 100 requests/day (enough for most use cases)
- Developer tier: 250 requests/day

**How to add:**
1. Create `.env.local` file in project root
2. Add: `NEWS_API_KEY=your_key_here`
3. Restart your dev server

**Note:** The site works fine without this - it will use CryptoCompare instead.

---

### 2. Helius API Key (Optional - Better Wallet Stats)

**Why?** Provides more accurate active wallet counts and transaction data.

**Where to get it:**
1. Go to https://helius.dev
2. Sign up for free account
3. Get your API key from dashboard

**Free Tier:**
- Limited requests (check their site for current limits)
- Good for development

**How to add:**
Add to `.env.local`:
```
HELIUS_API_KEY=your_key_here
```

**Note:** Currently not used, but can be added for enhanced stats.

---

## What You DON'T Need

- ❌ **Binance API Key**: Not needed (public endpoints work fine)
- ❌ **CoinGecko API Key**: Not needed (free tier is sufficient)
- ❌ **CryptoCompare API Key**: Not needed (free tier works)

---

## Quick Setup (If You Want NewsAPI)

1. **Get API Key:**
   ```
   Visit: https://newsapi.org
   Sign up → Get API Key
   ```

2. **Create `.env.local` file:**
   ```bash
   # In project root
   touch .env.local
   ```

3. **Add your key:**
   ```env
   NEWS_API_KEY=your_actual_key_here
   ```

4. **Restart dev server:**
   ```bash
   pnpm dev
   ```

5. **Verify it's working:**
   - Check browser console for any errors
   - News should update from NewsAPI instead of CryptoCompare

## ✅ Current Setup

**NewsAPI Key is configured!**
- Key is stored in `.env.local` (not committed to git)
- News will fetch from NewsAPI first
- Falls back to CryptoCompare if NewsAPI fails
- Falls back to mock data if all APIs fail

---

## Current Setup (No Keys Needed)

The site is **fully functional** right now with:
- ✅ CryptoCompare news (free, no key)
- ✅ Binance sentiment (free, no key)
- ✅ CoinGecko stats (free, no key)

**You can ship it as-is!** API keys are optional enhancements.

---

## Troubleshooting

**If APIs fail:**
- The site automatically falls back to mock data
- Check browser console for errors
- Verify `.env.local` is in project root (not in a subfolder)
- Make sure to restart dev server after adding keys

**Rate Limits:**
- NewsAPI: 100 requests/day (free)
- Binance: 1200 requests/minute (very generous)
- CryptoCompare: Check their limits

