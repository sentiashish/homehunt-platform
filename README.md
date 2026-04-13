# Luxe Properties - Premium Real Estate Platform

A production-grade luxury real estate platform featuring a premium frontend plus a full-stack backend/admin content system.

## Full-Stack Architecture

- Frontend: Next.js 16 + React 19 + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Admin Auth: Hardcoded email/password login with JWT session token
- Dynamic CMS Model: One content document powering all editable landing content

## Design System Overview

### Color Palette (Apple/Airbnb Inspired)
- **Background Light**: #FFFFFF
- **Background Dark**: #000000
- **Text (Light)**: #000000
- **Text (Dark)**: #FFFFFF
- **Accent Gold**: #D4AF37
- **Grays**: Refined grayscale (#FAFAFA - #212121)
- **Borders**: #EEEEEE (light), #333333 (dark)

### Typography
- **Headings**: System fonts (-apple-system, BlinkMacSystemFont, Inter, Segoe UI)
- **Body**: Inter (300-800 weights)
- **Display**: Clean, minimal, professional

### Key Design Features
- Netflix-style horizontal scrolling carousels with smooth animations
- Apple-inspired clean, minimal interface
- Airbnb-style property cards with premium imagery
- Smooth page transitions and micro-interactions
- Dark/Light mode support
- Fully responsive mobile-first design

## Project Structure

```
/app
  ├── layout.tsx              # Root layout with metadata & fonts
  ├── globals.css             # Design system & theme tokens
  ├── page.tsx                # Landing page with hero & carousel
  ├── properties/
  │   ├── page.tsx            # Property listing with grid/list view
  │   └── [id]/
  │       └── page.tsx        # Property details page
  └── admin/
      ├── layout.tsx          # Admin layout with sidebar
      ├── page.tsx            # Dashboard overview
      ├── properties/
      │   └── page.tsx        # Manage properties
      └── inquiries/
          └── page.tsx        # Manage inquiries

/components
  ├── Navbar.tsx              # Fixed navigation with mobile menu
  ├── HeroSection.tsx         # Full-screen hero with images
  ├── PropertyCard.tsx        # Featured & grid card variants
  ├── PropertyCarousel.tsx    # Netflix-style carousel
  ├── FilterSidebar.tsx       # Advanced filtering
  ├── Footer.tsx              # Company information & links
  ├── SkeletonLoader.tsx      # Loading states
  └── PageTransition.tsx      # Page entry animations

/lib
  ├── properties.ts           # Property data & interfaces

/public
  ├── hero-bg.jpg             # Hero background image
  └── properties/
      ├── mansion-1.jpg
      ├── villa-2.jpg
      ├── penthouse-3.jpg
      ├── estate-4.jpg
      ├── mansion-5.jpg
      ├── townhouse-6.jpg
      ├── beachfront-7.jpg
      └── countryside-8.jpg
```

## Features

### Frontend
- **Landing Page**: Hero section, featured carousel, statistics, testimonials
- **Properties Listing**: Grid/list view toggle, advanced filters, search
- **Property Details**: Image gallery, amenities, inquiry form, similar properties
- **Admin Dashboard**: Property management, inquiry tracking
- **Navigation**: Sticky navbar with smooth scroll effects
- **Responsive Design**: Mobile-optimized for all breakpoints

### User Experience
- Netflix-style carousel with smooth hover effects
- Framer Motion animations (scale, fade, stagger)
- Image optimization and lazy loading
- Smooth page transitions
- Interactive property cards with scale-up effect
- Form validation and error handling
- Dark mode support

### Technical Highlights
- Built with Next.js 16 (latest App Router)
- TypeScript for type safety
- Tailwind CSS v4 with custom design tokens
- Framer Motion for premium animations
- Responsive images with Next.js Image component
- Server-side rendering (SSR) for performance
- Optimized bundle size

## Getting Started

### 1) Frontend Setup

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd luxe-properties

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 2) Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend default URL: `http://localhost:5000`

### Environment Variables

Frontend `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Backend `.env`:

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/megaplex-prime
JWT_SECRET=replace-with-strong-secret
FRONTEND_URL=http://localhost:3000
```

### Admin Credentials

- Email: `admin@gmail.com`
- Password: `1234`

Admin routes:

- `/admin/login`
- `/admin/dashboard`

## API Endpoints

Public:

- `GET /api/content` -> Fetch all website content

Admin (protected with Bearer token):

- `POST /api/auth/login` -> Login admin
- `PUT /api/content` -> Update all content

## Dynamic Content Model

Stored in MongoDB as one editable content document:

```json
{
  "hero": { "title": "", "subtitle": "" },
  "overview": "",
  "connectivity": "",
  "amenities": [{ "title": "", "description": "" }],
  "about": "",
  "constructionUpdates": [{ "label": "", "value": "" }],
  "faqs": [{ "question": "", "answer": "" }]
}
```

On first backend start, default content is automatically seeded if no document exists.

## Color Token Reference

### Light Mode
```css
--background: #FFFFFF
--foreground: #000000
--primary: #000000
--secondary: #F5F5F5
--accent: #D4AF37 (Gold)
--border: #EEEEEE
--muted: #EEEEEE
```

### Dark Mode
```css
--background: #000000
--foreground: #FFFFFF
--primary: #FFFFFF
--secondary: #1A1A1A
--accent: #D4AF37 (Gold)
--border: #333333
--muted: #424242
```

## Component Showcase

### PropertyCard Component
- Featured variant: Large image with overlay text on hover
- Grid variant: Compact card with price, location, and details
- Netflix-style scale-up animation on hover
- Responsive image handling

### PropertyCarousel Component
- Horizontal scroll with smooth animation
- Navigation arrows appear on hover
- Responsive to all screen sizes
- Staggered entrance animations

### HeroSection Component
- Full-screen background image
- Gradient overlay for text readability
- CTA buttons with hover effects
- Animated scroll indicator

## Customization

### Updating Colors
Edit `/app/globals.css` CSS variables under `:root`:
```css
--accent-gold: #D4AF37  /* Primary accent color */
--gray-50: #FAFAFA     /* Light backgrounds */
```

### Adding Properties
Update `/lib/properties.ts` with new property data:
```typescript
{
  id: '9',
  title: 'New Property',
  location: 'City, State',
  price: 1000000,
  image: '/properties/image.jpg',
  bedrooms: 4,
  bathrooms: 3,
  area: 3000,
  featured: false,
  // ... additional fields
}
```

### Animation Tuning
Modify Framer Motion props in components:
```typescript
whileHover={{ scale: 1.05 }}  // Adjust scale value
transition={{ duration: 0.3 }} // Change animation speed
```

## Performance Optimizations

- Images use Next.js Image component for automatic optimization
- CSS-in-JS compiled to static CSS with Tailwind
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
