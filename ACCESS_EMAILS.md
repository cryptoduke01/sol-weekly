# How to Access Email List

## Method 1: Direct File Access (Easiest)

**Location:** `data/subscribers.json`

**View emails:**
```bash
cat data/subscribers.json
```

**Or open in any text editor/IDE**

**Format:**
```json
[
  "email1@example.com",
  "email2@example.com"
]
```

---

## Method 2: Via API Endpoint (Recommended for Production)

### Setup Admin Key

1. **Add to `.env.local`:**
   ```env
   ADMIN_KEY=your_secret_key_here
   ```
   
   Example:
   ```env
   ADMIN_KEY=my_super_secret_key_12345
   ```

2. **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `ADMIN_KEY` with your secret value

### Access via API

**Local:**
```
http://localhost:3000/api/subscribe?key=your_secret_key_here
```

**Production:**
```
https://yoursite.com/api/subscribe?key=your_secret_key_here
```

**Response:**
```json
{
  "count": 2,
  "subscribers": [
    "email1@example.com",
    "email2@example.com"
  ]
}
```

---

## Method 3: Via Resend Dashboard (If Using Resend)

If you've configured Resend with `RESEND_AUDIENCE_ID`:

1. Go to https://resend.com/dashboard
2. Navigate to **Audiences**
3. Click on your audience
4. View all contacts there

---

## Quick Commands

**View email count:**
```bash
cat data/subscribers.json | jq '. | length'
```

**View all emails:**
```bash
cat data/subscribers.json | jq '.[]'
```

**Export to CSV:**
```bash
cat data/subscribers.json | jq -r '.[]' > emails.csv
```

---

## Security Note

⚠️ **Never commit `data/subscribers.json` or `.env.local` to Git!**
- Already added to `.gitignore`
- Keep `ADMIN_KEY` secret
- Don't share API endpoint URLs with the key publicly

