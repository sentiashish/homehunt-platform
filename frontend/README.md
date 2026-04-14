# HomeHunt Frontend

Next.js 16 + React 19 property discovery platform.

**Live:** [https://homehunt-platform.vercel.app](https://homehunt-platform.vercel.app)

## Quick Start

```bash
npm install
npm run dev    # http://localhost:3000
```

## Pages

- `/` — Homepage with hero & featured properties
- `/properties` — Browse & filter all listings
- `/properties/[id]` — Property details & inquiry
- `/login`, `/signup` — User authentication
- `/account` — User profile & saved properties
- `/admin/login` — Admin access
- `/admin/dashboard` — Manage content
- `/admin/properties` — Manage listings
- `/admin/inquiries` — View inquiries

## Stack

- **Next.js 16** — React framework
- **React 19** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Styling
- **Framer Motion** — Animations
- **Radix UI** — Accessible components

## Scripts

| Command | Purpose |
|---------|----------|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | Lint code |

## Environment

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Key Features

✓ Server-side rendering (SSR) for performance  
✓ Code splitting & lazy loading  
✓ Mobile-first responsive design  
✓ Offline fallback data  
✓ JWT-based authentication  
✓ Real-time inquiry submission  

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions) + iOS Safari, Chrome Mobile

## Deployment

**Frontend:** Deploy to [Vercel](https://vercel.com)  
**Environment:** Set `NEXT_PUBLIC_API_BASE_URL` to your backend URL

**Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## License

MIT
