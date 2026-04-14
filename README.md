# Assignment Megaplex Prime

HomeHunt is organized as two independent apps in one repository.

- frontend/: Next.js 16 app (user site + admin UI)
- backend/: Express + MongoDB API

## Project structure

- frontend/
- backend/

## Local setup

1. Install and start backend

	Windows PowerShell:
	- cd backend
	- npm install
	- Copy-Item .env.example .env
	- npm run dev

	macOS/Linux:
	- cd backend
	- npm install
	- cp .env.example .env
	- npm run dev

2. Install and start frontend (new terminal)

	- cd frontend
	- npm install
	- npm run dev

3. Open apps

	- Frontend: http://localhost:3000
	- Backend health: http://localhost:5000/api/health

## Environment variables

Backend (.env):
- PORT=5000
- MONGODB_URI=mongodb://127.0.0.1:27017/homehunt
- JWT_SECRET=replace-with-strong-secret
- FRONTEND_URL=http://localhost:3000

Frontend (.env.local, optional):
- NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

If NEXT_PUBLIC_API_BASE_URL is not set, frontend falls back to local defaults.

## Useful commands

Frontend:
- npm run dev
- npm run build
- npm run start

Backend:
- npm run dev
- npm run start

## Notes

- Run frontend and backend in separate terminals.
- If a port is already in use, stop the old process or use another port.
- App docs:
  - frontend/README.md
  - backend/README.md
