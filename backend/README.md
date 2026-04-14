# HomeHunt Backend

Express + MongoDB API for HomeHunt.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT auth for admin endpoints

## Run locally

Windows PowerShell:
- npm install
- Copy-Item .env.example .env
- npm run dev

macOS/Linux:
- npm install
- cp .env.example .env
- npm run dev

Server default:
- http://localhost:5000

Health check:
- GET /api/health

## Environment variables

Set in backend/.env:

- PORT=5000
- MONGODB_URI=mongodb://127.0.0.1:27017/homehunt
- JWT_SECRET=replace-with-strong-secret
- FRONTEND_URL=http://localhost:3000

## Scripts

- npm run dev
- npm run start

## API overview

Auth:
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me

Content:
- GET /api/content
- PUT /api/content (admin token required)

Properties:
- GET /api/properties
- GET /api/properties/:id
- POST /api/properties (admin token required)
- PUT /api/properties/:id (admin token required)
- DELETE /api/properties/:id (admin token required)

Inquiries:
- POST /api/inquiries
- GET /api/inquiries (admin token required)
- PATCH /api/inquiries/:id/status (admin token required)

Users:
- GET /api/users

## Default admin credentials

- Email: admin@gmail.com
- Password: 1234
