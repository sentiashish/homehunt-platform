# Quick Start Guide

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 2: Run Development Server
```bash
npm run dev
# or
pnpm dev
```

### Step 3: Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Overview

### Main Pages
- **Home** (`/`) - Landing page with carousel
- **Properties** (`/properties`) - Browse all properties
- **Property Detail** (`/properties/1-8`) - Individual property pages
- **Admin Dashboard** (`/admin`) - Management interface

### Key Features
✅ Netflix-style property carousel  
✅ Apple/Airbnb clean design  
✅ Dark/Light mode support  
✅ Responsive mobile design  
✅ Smooth animations with Framer Motion  
✅ 8 premium property listings with real images  
✅ Advanced filtering system  
✅ Admin property management  

## File Structure

```
src/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── globals.css           ← Design system
│   ├── layout.tsx            ← Root layout
│   ├── properties/
│   │   ├── page.tsx          ← Listing page
│   │   └── [id]/page.tsx     ← Detail page
│   └── admin/
│       ├── page.tsx          ← Dashboard
│       ├── properties/       ← Management
│       └── inquiries/        ← Inquiries
├── components/               ← Reusable components
└── lib/properties.ts         ← Property data
```

## Customization

### Update Brand Name
Edit `components/Navbar.tsx` and `components/Footer.tsx`:
```typescript
<span className="text-lg font-semibold">Your Company Name</span>
```

### Change Accent Color
Edit `app/globals.css`:
```css
--accent-gold: #YOUR_COLOR_HERE;  /* Primary brand color */
```

### Add New Property
Edit `lib/properties.ts`:
```typescript
{
  id: '9',
  title: 'Property Name',
  location: 'City, State',
  price: 1000000,
  image: '/properties/image.jpg',
  bedrooms: 4,
  bathrooms: 3,
  area: 3000,
  featured: false,
  description: 'Description...',
  amenities: ['Amenity 1', 'Amenity 2'],
  yearBuilt: 2024,
}
```

### Update Contact Info
Edit `components/Footer.tsx`:
```typescript
Phone: '+1 (555) 123-4567'
Email: 'hello@homehunt.in'
Address: '123 Prestige Ave, NY 10001'
```

## Build & Deploy

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel deploy
```

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Styling |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |

## Component Usage

### PropertyCard
```tsx
<PropertyCard 
  property={property} 
  variant="grid" // or "featured"
/>
```

### PropertyCarousel
```tsx
<PropertyCarousel 
  properties={featuredProperties}
  title="Featured Properties"
  showTitle={true}
/>
```

### HeroSection
```tsx
<HeroSection
  title="Your Title"
  subtitle="Your subtitle"
  backgroundImage="/image.jpg"
  cta={{
    primary: { label: "Button 1", href: "/path" },
    secondary: { label: "Button 2", href: "/path" }
  }}
  showScrollIndicator={true}
/>
```

## Dark Mode

The app automatically supports dark mode. To test:

### In Browser DevTools
1. Open DevTools (F12)
2. Toggle dark mode in system preferences
3. Or add `dark` class to `<html>` element

### In Code
```tsx
<html className="dark">
  {/* Dark mode applied */}
</html>
```

## Common Tasks

### Add a Navigation Link
Edit `components/Navbar.tsx`:
```typescript
const navItems = [
  { label: 'Explore', href: '/properties' },
  { label: 'About', href: '#about' },
  { label: 'New Link', href: '/new-page' },  // Add here
];
```

### Change Hero Image
Edit `app/page.tsx`:
```tsx
<HeroSection
  backgroundImage="/your-image.jpg"  // Change this
  // ...
/>
```

### Modify Card Hover Effect
Edit `components/PropertyCard.tsx`:
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}  // Adjust scale here
  // ...
>
```

### Update Typography Size
Edit `app/globals.css`:
```css
h1 {
  @apply font-sans text-6xl md:text-7xl font-bold;  /* Adjust sizes */
}
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Styles Not Applying
```bash
# Clear Tailwind cache
rm -rf .next
npm run dev
```

### Images Not Loading
1. Ensure images are in `/public/` folder
2. Use absolute paths: `/image.jpg` (not `./image.jpg`)
3. Check file permissions

### Dark Mode Not Working
```bash
# Ensure Tailwind is configured with dark mode
# In tailwind.config.ts check: darkMode: ['class']
```

## Environment Setup

### No Environment Variables Required!
The app works out-of-the-box with sample data. To add a backend:

1. Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

2. Use in components:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Performance Tips

### Optimize Images
- Compress images before adding to `/public/`
- Use JPEG for photos, PNG for graphics
- Keep hero image under 500KB

### Lazy Load Components
```tsx
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  loading: () => <SkeletonLoader />,
});
```

### Monitor Bundle Size
```bash
npm run build
# Check output for bundle size analysis
```

## Helpful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)

## Getting Help

### Check Existing Code
Look at similar components for examples:
- Navigation: `components/Navbar.tsx`
- Cards: `components/PropertyCard.tsx`
- Forms: `app/properties/[id]/page.tsx`

### Common Issues
1. **TypeScript errors**: Check types in interfaces
2. **Styling issues**: Verify Tailwind classes are correct
3. **Animation stuttering**: Reduce number of animated elements

## Next Steps

1. ✅ Customize brand colors and name
2. ✅ Update property data with your listings
3. ✅ Add contact information
4. ✅ Deploy to Vercel
5. ✅ Connect backend API (optional)
6. ✅ Add user authentication (optional)

---

**Happy building! 🚀**
