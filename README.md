# ProNet - The Secure Professional Network

Built by R.D. Hodges · Navy Veteran · Self-Taught in Cybersecurity

## Overview

ProNet is a secure, privacy-first professional networking platform. One monthly price covers all features—no hidden charges, no data selling.

**Features:**
- 🔒 Privacy-first architecture (built by security experts)
- 💼 Job board with $2 postings (unlimited for Premium subscribers)
- 💬 Direct messaging between professionals
- 👤 Professional profiles with skill endorsements
- 🔐 Secure authentication with JWT tokens
- 💰 Single price model: $12.99/month for everything

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js Serverless Functions (Netlify)
- **Database:** Netlify Blobs (JSON storage)
- **Auth:** JWT tokens + Password hashing

## Project Structure

```
professional-network/
├── netlify/functions/          # Serverless backend
│   ├── auth/                   # Authentication endpoints
│   ├── profiles/               # Profile management
│   ├── jobs/                   # Job board
│   ├── messages/               # Messaging
│   ├── db.mts                  # Database utilities
│   └── auth-utils.mts          # Auth helpers
├── src/
│   ├── pages/                  # Page components
│   ├── components/             # Shared components
│   ├── App.tsx                 # Main app & routing
│   └── main.tsx                # Entry point
├── package.json
├── vite.config.ts
└── netlify.toml
```

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env.local` file:
```
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Start Dev Server
```bash
npm run dev
```

This starts both the React frontend and Netlify Functions locally at `http://localhost:5173`

### 4. Test the App
- Go to http://localhost:5173
- Register a new account
- Explore: Jobs, Profiles, Messages

## API Endpoints

### Authentication
- `POST /.netlify/functions/auth/register` - Register new user
- `POST /.netlify/functions/auth/login` - Login user

### Profiles
- `GET /.netlify/functions/profiles?username=xxx` - Get profile by username
- `PUT /.netlify/functions/profiles/update` - Update own profile (requires auth)
- `GET /.netlify/functions/profiles/search?q=xxx&skill=xxx&location=xxx` - Search profiles

### Jobs
- `POST /.netlify/functions/jobs` - Create job posting (requires auth)
- `GET /.netlify/functions/jobs/all` - Get all jobs
- `GET /.netlify/functions/jobs/search?q=xxx&location=xxx&company=xxx` - Search jobs

### Messages
- `POST /.netlify/functions/messages` - Send message (requires auth)
- `GET /.netlify/functions/messages/get?user=xxx@example.com` - Get conversation (requires auth)

## Authentication

All protected endpoints require:
```
Authorization: Bearer <token>
```

Tokens are JWT and valid for 30 days. Stored in localStorage on client.

## Deployment to Netlify

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: ProNet MVP"
git remote add origin https://github.com/YOUR_USERNAME/professional-network
git push -u origin main
```

### 2. Deploy to Netlify
```bash
npm run deploy
```

Or connect your GitHub repo to Netlify:
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Connect your GitHub account
4. Select the repository
5. Build command: `npm run build`
6. Publish directory: `dist`

### 3. Set Environment Variables
In Netlify dashboard → Site settings → Build & deploy → Environment:
```
JWT_SECRET=your-production-secret-key
```

## Next Steps (Post-MVP)

- [ ] GitHub OAuth integration
- [ ] Verified badges for security professionals
- [ ] Integration with SecretDex for credential verification
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Payment processing for job postings
- [ ] Admin dashboard

## Brand Attribution

All deployments should include:
```
Built by R.D. Hodges · Navy Veteran · Self-Taught in Cybersecurity
```

## License

Proprietary - TGE SC. All rights reserved.

---

**Questions? Contact:** tgerd101010@gmail.com
