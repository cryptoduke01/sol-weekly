# Solana Weekly Roundup

A modern web application for publishing and archiving weekly Solana ecosystem updates with live blockchain data integration.

## 🚀 Features

- **Homepage** with hero section and latest roundup
- **Live Stats Dashboard** with real-time Solana metrics
- **Weekly Roundup Pages** with clean article layout and MDX support
- **Archive Page** with search and filtering
- **About Page** with project information
- **Responsive Design** optimized for all devices
- **SEO Optimized** with proper metadata and structured data

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **MDX** for content
- **SWR** for data fetching
- **Lucide React** for icons

## 📦 Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   pnpm dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🏗️ Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
sol-weekly-roundup/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── roundup/           # Roundup pages
│   ├── archive/           # Archive page
│   ├── about/             # About page
│   └── api/               # API routes
├── components/            # React components
├── content/              # MDX content files
│   └── roundups/         # Weekly roundup articles
├── lib/                  # Utility functions
├── public/               # Static assets
└── types/                # TypeScript types
```

## 📝 Adding New Roundups

1. Create a new `.mdx` file in `content/roundups/`
2. Use the following frontmatter structure:

```markdown
---
title: "Solana Weekly Roundup - Week X"
date: "2026-01-XX"
week: X
description: "Your description here"
categories: ["DeFi", "NFTs", "Infrastructure"]
featuredProjects:
  - name: "Project Name"
    logo: "/logos/project.png"
    description: "Project description"
    url: "https://project.com"
    category: "DeFi"
---

# Your content here
```

3. The roundup will automatically appear on the site!

## 🎨 Customization

### Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --solana-green: #14F195;
  --solana-purple: #9945FF;
  --solana-blue: #00D4FF;
  /* ... */
}
```

### Fonts

Update fonts in `app/layout.tsx`:

```typescript
import { YourFont } from 'next/font/google';
```

## 🔌 API Integration

The app uses the following APIs:

- **CoinGecko API** - SOL price and market data
- **DeFiLlama API** - TVL data
- **Solana RPC** - Network stats (optional)

For production, consider:
- Adding Helius API for enhanced data
- Implementing rate limiting
- Adding caching strategies

## 📊 Live Stats

The live stats component fetches data from `/api/solana-stats` and auto-refreshes every 30 seconds.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy!

The project is optimized for Vercel with:
- Automatic builds
- Edge functions support
- Image optimization

### Environment Variables

Optional environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
HELIUS_API_KEY=your_api_key_here
```

## 📄 License

MIT License - feel free to use this project for your own weekly roundup!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

- Twitter: [@yourusername](https://twitter.com)
- Email: contact@solweekly.com

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
