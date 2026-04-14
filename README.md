# HomeHunt

HomeHunt is a premium real estate platform for discovering, saving, and managing property listings. It combines a polished marketing site, authenticated user flows, and an admin console for content and listing management.

## Project Overview

HomeHunt is built for buyers and property teams who want a fast, visual, and trustworthy browsing experience. Users can explore featured listings, filter properties, save favorites, submit inquiries, and manage their account. Administrators can manage property data, inquiry status, and homepage content from dedicated admin routes.

## Key Features

- Property discovery with featured listings and detailed property pages
- Search, filter, and wishlist flows for logged-in users
- User signup, login, and account dashboard
- Inquiry submission and inquiry tracking
- Admin login, property management, and content editing
- Responsive UI designed for desktop and mobile
- Fallback data so the frontend still works if the backend is unavailable

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- UI system: Radix UI, Sonner, Lucide React
- Tooling: ESLint, TypeScript, PostCSS, pnpm/npm support

## Screenshots / Demo

This project is visual by design. If you deploy it, add live links here:

- Live frontend: add after deployment
- Live backend: add after deployment

Recommended screenshots to include in the repository or README:

- Homepage hero and featured properties
- Property listing page with filters
- Property detail page
- User account or wishlist page
- Admin dashboard and inquiry management

Current image assets are stored in `frontend/public/`, including premium property visuals used throughout the app.

## Repository Layout

- `frontend/` - Next.js app for the public site, user account pages, wishlist, and admin UI
- `backend/` - Express API, authentication, content, property, inquiry, and user routes
- `frontend/app/` - App Router pages and layouts
- `frontend/components/` - Shared UI and page components
- `frontend/lib/` - API clients, utilities, auth helpers, and local fallback data
- `frontend/public/` - Static images and icons
- `backend/controllers/` - Route handlers and business logic
- `backend/models/` - MongoDB/Mongoose models
- `backend/routes/` - API route definitions
- `backend/middleware/` - Auth and error handling

## Local Setup

1. Start the backend

	Windows PowerShell:
	- `cd backend`
	- `npm install`
	- `Copy-Item .env.example .env`
	- `npm run dev`

	macOS/Linux:
	- `cd backend`
	- `npm install`
	- `cp .env.example .env`
	- `npm run dev`

2. Start the frontend in a new terminal

	- `cd frontend`
	- `npm install`
	- `npm run dev`

3. Open the app

	- Frontend: http://localhost:3000
	- Backend health: http://localhost:5000/api/health

## Environment Variables

Backend `.env`:

- `PORT=5000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/homehunt`
- `JWT_SECRET=replace-with-strong-secret`
- `FRONTEND_URL=http://localhost:3000`

Frontend `.env.local`:

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`

If `NEXT_PUBLIC_API_BASE_URL` is not set, the frontend falls back to local defaults.

## Useful Commands

Frontend:

- `npm run dev`
- `npm run build`
- `npm run start`

Backend:

- `npm run dev`
- `npm run start`

## Deployment

Frontend deployment options:

- Vercel is the recommended host for the Next.js app.
- Set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL.

Backend deployment options:

- Render, Railway, or any Node.js host with MongoDB access.
- Use a managed MongoDB instance such as MongoDB Atlas.

Deployment checklist:

1. Provision a MongoDB database and update `MONGODB_URI`.
2. Deploy the backend and confirm `/api/health` is reachable.
3. Deploy the frontend and point it at the backend URL.
4. Verify authentication, property pages, inquiries, and admin routes.

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Verify locally with `npm run build` in the frontend and a backend smoke test.
4. Open a pull request with a short summary and test notes.

## License

MIT License. See `frontend/README.md` and `backend/README.md` for app-specific setup details.
