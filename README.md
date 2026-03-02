# Portfolio — MERN Stack

A full-stack portfolio website with admin authentication and visitor analytics dashboard.

## Tech Stack
- **Frontend**: React 18 + Vite + React Router + Recharts
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (full-stack) or Netlify (frontend) + Render (backend)

## Project Structure
```
portfolio1/
├── client/          # React + Vite frontend
├── server/          # Express + MongoDB backend
├── vercel.json      # Vercel deployment config
├── netlify.toml     # Netlify deployment config
└── README.md
```

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & install
```bash
git clone <repo-url>
cd portfolio1

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Run development servers
```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open http://localhost:5173

### 4. Create admin account
Navigate to http://localhost:5173/admin/login → click "Create admin account" (first-time setup).

## Deployment

### Option A: Vercel (full-stack)
1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
4. Deploy

### Option B: Netlify (frontend) + Render (backend)
1. Deploy `server/` to Render as a Web Service
   - Build command: `npm install`
   - Start command: `npm start`
   - Add env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
2. Deploy `client/` to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Update `netlify.toml` redirect with your Render backend URL
   - Add env var: `VITE_API_URL=https://your-backend.onrender.com`

## Features
- ✅ Animated portfolio with 7 sections
- ✅ Dark/light theme toggle
- ✅ Admin login with JWT authentication
- ✅ Automatic visitor tracking (IP, page, user-agent, referrer)
- ✅ Analytics dashboard (total visits, daily chart, recent visitors table)
- ✅ One admin account setup
- ✅ Deployment-ready for Vercel and Netlify
