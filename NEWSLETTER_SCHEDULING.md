# Newsletter Scheduling Guide 📅

## Current Setup ✅

Your newsletter is **already configured** to send automatically!

### Automated Schedule (Already Active)

**Location:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/newsletter/send",
      "schedule": "0 9 * * 5"
    }
  ]
}
```

**What this means:**
- 📅 **When:** Every Friday at 9:00 AM UTC
- 🎯 **What:** Sends the **latest** roundup to all subscribers
- ⚡ **Status:** Active (will run automatically)

---

## How It Works

### Automatic Send (Every Friday)

1. **Vercel Cron Job** triggers at 9 AM UTC every Friday
2. Calls `/api/newsletter/send` endpoint
3. Fetches the **latest** roundup (most recent date)
4. Sends to all subscribers in your Resend audience
5. Returns success/failure status

**No action needed** - it runs automatically! ✅

---

## Schedule Formats

The cron schedule format is: `minute hour day-of-month month day-of-week`

### Common Schedules:

| Schedule | Description |
|----------|-------------|
| `0 9 * * 5` | Every Friday at 9:00 AM UTC (current) |
| `0 10 * * 5` | Every Friday at 10:00 AM UTC |
| `0 9 * * 1` | Every Monday at 9:00 AM UTC |
| `0 0 * * 0` | Every Sunday at midnight UTC |
| `0 14 * * 5` | Every Friday at 2:00 PM UTC (10 AM EST) |

### Time Zone Notes:

- ⚠️ **Vercel Cron uses UTC time**
- Current schedule: `0 9 * * 5` = Friday 9 AM UTC
- This is **5 AM EST** or **2 AM PST** (adjust if needed)

---

## Manual Send (When You Need It)

### Option 1: API Endpoint

Send immediately to all subscribers:

```bash
curl -X POST https://www.solweekly.xyz/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"adminKey": "180476"}'
```

Send specific roundup:

```bash
curl -X POST https://www.solweekly.xyz/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "180476",
    "roundupSlug": "week-1-jan-4-10-2026"
  }'
```

### Option 2: Test First

Always test before sending to all subscribers:

```bash
curl -X POST https://www.solweekly.xyz/api/newsletter/test \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "180476",
    "testEmail": "your-email@gmail.com"
  }'
```

---

## Changing the Schedule

### Step 1: Update `vercel.json`

Edit the schedule in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/newsletter/send",
      "schedule": "0 14 * * 5"  // Change to Friday 2 PM UTC
    }
  ]
}
```

### Step 2: Commit and Push

```bash
git add vercel.json
git commit -m "Update newsletter schedule"
git push
```

### Step 3: Wait for Deployment

Vercel will automatically update the cron job after deployment.

---

## Weekly Workflow (Recommended)

### Friday Morning Routine:

1. **Write Roundup** (Thursday/Friday)
   - Create new `.mdx` file in `content/roundups/`
   - Use format: `week-X-jan-4-10-2026.mdx`

2. **Test Email** (Optional but recommended)
   ```bash
   curl -X POST https://www.solweekly.xyz/api/newsletter/test \
     -H "Content-Type: application/json" \
     -d '{
       "adminKey": "180476",
       "testEmail": "your-email@gmail.com"
     }'
   ```

3. **Push to Git**
   ```bash
   git add content/roundups/week-X-*.mdx
   git commit -m "Week X roundup"
   git push
   ```

4. **Automatic Send** (Friday 9 AM UTC)
   - Vercel cron job runs automatically
   - Sends latest roundup to all subscribers
   - Check Resend Dashboard → Emails for status

---

## Monitoring

### Check If Cron Ran:

1. **Vercel Dashboard** → **Your Project** → **Logs**
2. Filter for: `/api/newsletter/send`
3. Look for logs from Friday 9 AM UTC

### Check Email Delivery:

1. **Resend Dashboard** → **Emails**
2. See all sent emails with status
3. Monitor delivery, bounces, opens

### Verify Latest Roundup:

The cron job sends the **latest** roundup (by date). Make sure:
- ✅ New roundup file is committed to Git
- ✅ File is deployed to Vercel
- ✅ Roundup date is most recent

---

## Troubleshooting

### Cron Job Not Running:

1. ✅ Check `vercel.json` has cron configuration
2. ✅ Verify route `/api/newsletter/send` exists
3. ✅ Check Vercel logs for errors
4. ✅ Ensure latest deployment includes cron config

### Wrong Roundup Sent:

- Cron sends the **latest** roundup (by date)
- Make sure new roundup has the most recent date
- Check `getAllRoundups()` sorts by date descending

### Want to Skip This Week:

1. Don't create a new roundup file
2. Cron will still run but send the previous week's roundup
3. Or disable cron temporarily by removing from `vercel.json`

---

## Advanced: Multiple Schedules

You can have multiple cron jobs:

```json
{
  "crons": [
    {
      "path": "/api/newsletter/send",
      "schedule": "0 9 * * 5"
    },
    {
      "path": "/api/newsletter/reminder",
      "schedule": "0 10 * * 6"
    }
  ]
}
```

---

## Summary

✅ **Current Setup:** Sends automatically every Friday at 9 AM UTC  
✅ **Manual Send:** Use `/api/newsletter/send` endpoint  
✅ **Test First:** Use `/api/newsletter/test` endpoint  
✅ **Change Schedule:** Update `vercel.json` and redeploy  

**You're all set!** The newsletter will send automatically every Friday. 🎉

