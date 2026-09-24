# ProNet Deployment Guide

## Ship It Right Now (5 minutes)

### Step 1: Create a GitHub repo
```bash
cd professional-network
git init
git add .
git commit -m "ProNet MVP - Built by R.D. Hodges"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/professional-network
git push -u origin main
```

### Step 2: Deploy to Netlify (Free tier works)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**OR** Connect GitHub → Netlify directly:
1. Go to https://app.netlify.com/start
2. Click "Connect to GitHub"
3. Authorize & select your repo
4. Netlify auto-detects the config
5. Click "Deploy site"

### Step 3: Set environment variables
In Netlify dashboard:
- Site settings → Build & deploy → Environment
- Add: `JWT_SECRET=change-this-to-something-random`

## Test Live
Your site is live at: `https://your-site-name.netlify.app`

1. Register an account
2. Create a profile
3. Post a job ($2 test)
4. Message another user

## Domain Setup (Optional)
In Netlify dashboard → Domain management:
- Add custom domain (yourname.com)
- Follow DNS instructions

## Important Notes

- **Data is stored in Netlify Blobs** - persists across deploys
- **JWT tokens last 30 days** - users stay logged in
- **Free Netlify tier includes**:
  - Unlimited builds
  - Unlimited bandwidth
  - Up to 125,000 requests/month (plenty for MVP)
  - 100MB blob storage (enough for 10k+ profiles)

## Scale Later

When you need:
- **More storage** → Upgrade Netlify plan or add PostgreSQL
- **Real-time** → Add Socket.io or Supabase Realtime
- **Payments** → Add Stripe integration to `/functions`
- **Analytics** → Enable Netlify Analytics
- **SEO** → Add static site generation with Astro

## Monitoring

Watch your logs:
```bash
netlify logs --function auth/login
netlify logs --function jobs/search
```

## Troubleshooting

**Functions not running?**
```bash
netlify functions:invoke auth/register
```

**Build fails?**
```bash
npm run build
npm run preview
```

**Need to change code?**
```bash
git add .
git commit -m "Fix: message"
git push origin main
# Netlify auto-deploys
```

---

That's it. You're live. 🚀
