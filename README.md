# HomeHunt

Premium real estate platform built with Next.js + Express + MongoDB. Browse properties, manage favorites, submit inquiries, and administer listings from a unified dashboard.

**Live:** [https://homehunt-platform.vercel.app](https://homehunt-platform.vercel.app)

## Features

✓ Property discovery with search, filters & wishlist  
✓ User authentication (signup/login/account)  
✓ Inquiry submission & tracking  
✓ Admin panel for property & content management  
✓ Mobile-first responsive design  
✓ Fallback data for offline browsing  

## Tech Stack

**Frontend:** Next.js 16 • React 19 • TypeScript • Tailwind CSS • Framer Motion  
**Backend:** Node.js • Express • MongoDB • JWT  
**UI:** Radix UI • Sonner • Lucide Icons

## Structure

```
├── frontend/          # Next.js app
│   ├── app/          # Routes & layouts
│   ├── components/   # UI components
│   ├── lib/          # API clients, auth
│   └── public/       # Assets
└── backend/          # Express API
    ├── controllers/  # Business logic
    ├── models/       # MongoDB schemas
    ├── routes/       # Endpoints
    └── middleware/   # Auth, errors
```

## Quick Start

**Backend:**
```bash
cd backend
npm install
cp .env.example .env  # or Copy-Item .env.example .env on Windows
npm run dev           # runs on :5000
```

**Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev           # runs on :3000
```

Test: http://localhost:5000/api/health

## Environment

**Backend .env:**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/homehunt
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

**Frontend .env.local:**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Commands

| Command | Purpose |
|---------|----------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | Check code quality |

## Deployment

**Frontend:** [Vercel](https://vercel.com) (recommended)  
**Backend:** [Render](https://render.com) or [Railway](https://railway.app)  
**Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

**Checklist:**
1. Deploy backend → test `/api/health`
2. Set `NEXT_PUBLIC_API_BASE_URL` on frontend → redeploy
3. Set `FRONTEND_URL` in backend for CORS
4. Verify: signup, login, properties, inquiries, admin routes

## License

MIT
