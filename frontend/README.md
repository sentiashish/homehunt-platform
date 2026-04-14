# HomeHunt Frontend

Next.js frontend for HomeHunt.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion

## Features

- Home, About, Contact, Properties, Property Detail, Wishlist, Account pages
- Admin UI routes under /admin
- Property cards, wishlist actions, inquiry flows
- API-backed content and property listing with fallback data

## Run locally

1. Install dependencies

- npm install

2. Start dev server

- npm run dev

3. Open

- http://localhost:3000

## Environment

Create frontend/.env.local if needed:

- NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

When not provided, frontend uses default local behavior and fallbacks.

## Scripts

- npm run dev
- npm run build
- npm run start
- npm run lint

## Important paths

- app/
- components/
- lib/
- public/

## Notes

- Run backend separately from ../backend for full API functionality.
- Admin login route: /admin/login
- Code splitting with dynamic imports
- Lazy loading of below-the-fold content
- Minimal third-party dependencies
- Mobile-first responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- **next**: 16.x
- **react**: 19.x
- **framer-motion**: 11.x
- **tailwindcss**: 4.x
- **lucide-react**: Icons
- **typescript**: Type safety

## Deployment

### Backend on Render / Railway

1. Create a new Web Service from `backend/`.
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Add environment variables from `.env.example`
5. Use a managed MongoDB URI (MongoDB Atlas recommended)

### Frontend on Vercel / Netlify

Set environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
```

### Vercel (Recommended for Frontend)
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Deployment
```bash
npm run build
npm start
```

## Final Output Checklist

- Clean repository structure with frontend + backend
- Dynamic content API integrated into frontend homepage
- Admin login and dashboard content editor
- Backend ready for Render / Railway deployment
- Frontend ready for Vercel / Netlify deployment

## Live URLs

- Frontend URL: `add-after-deploy`
- Backend URL: `add-after-deploy`

## Future Enhancements

- Property search with location autocomplete
- User authentication and saved favorites
- Advanced filtering with multiple criteria
- Email notifications for new listings
- Virtual property tours (3D/VR)
- Mobile app (React Native)
- Backend API integration
- Payment gateway integration
- Analytics and reporting

## License

MIT License - feel free to use for personal and commercial projects.

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for luxury real estate enthusiasts**
