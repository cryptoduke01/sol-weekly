# Content Guide - Easy Blog Writing

Just write your weekly content in plain markdown! No need to worry about MDX syntax errors.

## File Format

Create a new file in `content/roundups/` with this format:

**Filename:** `week-X-month-day-year.mdx` (e.g., `week-4-jan-22-28-2026.mdx`)

## Frontmatter (Required at top of file)

```yaml
---
title: "Solana Weekly Roundup - Week X"
date: "2026-01-XX"
week: X
description: "Your one-line description here"
categories: ["DeFi", "NFTs", "Infrastructure"]
featuredProjects:
  - name: "Project Name"
    logo: "/logos/project.png"
    description: "What it does"
    url: "https://project.com"
    category: "DeFi"
---
```

## Content Writing

After the frontmatter, just write your content in **plain markdown**:

```markdown
# Week X: Date Range

Your introduction paragraph here.

## Section Title

Write whatever you want:
- Bullet points work
- **Bold text** works
- *Italic* works
- Links work: [text](url)
- Numbers like $8.3B (+5.2%) work fine
- Special chars like ~400ms work fine
- Code blocks work:

\`\`\`javascript
const code = "works";
\`\`\`

## Another Section

More content here. Write naturally!
```

## What Works

✅ All standard markdown  
✅ Special characters: `$`, `%`, `()`, `[]`, `{}`, `~`, `+`, `-`  
✅ Numbers and percentages  
✅ Links and images  
✅ Code blocks  
✅ Lists (ordered and unordered)  
✅ Headings (H1-H6)  

## What to Avoid

❌ Don't use JSX syntax like `<Component />`  
❌ Don't use curly braces for expressions `{variable}`  

## Quick Template

Copy this and fill it in:

```markdown
---
title: "Solana Weekly Roundup - Week X"
date: "2026-01-XX"
week: X
description: "Brief description"
categories: ["DeFi"]
featuredProjects: []
---

# Week X: Date Range

Your content starts here. Write naturally!

## Top Stories

### Story Title

Content about the story...

## Protocol Updates

Updates here...

## DeFi Movements

DeFi news here...

## Market Metrics

- SOL Price: $XXX.XX
- Weekly Volume: $XXB
- TVL: $X.XB
```

That's it! Just write markdown and it will work perfectly.

