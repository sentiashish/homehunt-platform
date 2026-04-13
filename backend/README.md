# Backend Service

Express + MongoDB backend for Megaplex Prime.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

## API

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/content`
- `PUT /api/content` (requires Bearer token)

## Admin credentials

- Email: `admin@gmail.com`
- Password: `1234`
