# EventFlow - TypeScript + Tailwind Event Management System

A premium, futuristic event management platform built with cutting-edge technologies and a luxury 3D brand identity.

## ✨ Features

### Core Functionality
- **Event Management**: Create, manage, and track events with advanced scheduling
- **Smart Date/Time System**: 
  - Start & End date/time tracking
  - Automatic event status transitions (upcoming → ongoing → ended)
  - Status-based event filtering
- **Transportation Management**: Built-in transportation options for guests
- **Ticket System**: Multiple ticket types with pricing flexibility
- **Premium Branding**: 
  - Futuristic 3D EventFlow logo
  - Multiple logo variants (full, icon-only, dark, transparent)
  - Professional brand guidelines

### Technical Stack
- Next.js App Router with TypeScript
- Tailwind CSS with dark theme
- MongoDB + Mongoose ORM
- JWT authentication with HTTP-only cookies
- bcrypt password hashing
- Protected dashboard routes
- Framer Motion animations
- Responsive mobile design

## 🎨 EventFlow Brand & Logo

### Premium 3D Logo
The new EventFlow logo features:
- **Style**: Futuristic 3D glassmorphism design
- **Colors**: Neon Purple (#A855F7), Hot Pink (#EC4899), Cyan (#06B6D4)
- **Effects**: Smooth animations, glowing accents, depth effects
- **Quality**: Startup/investor-ready professional grade

### Logo Files
- `public/eventflow-logo.html` - Interactive showcase
- `public/eventflow-logo.svg` - SVG vector format
- `components/EventFlowLogo.tsx` - React component

### Quick Usage
```tsx
import { EventFlowLogo } from '@/components/EventFlowLogo';

// Full animated logo
<EventFlowLogo size={200} variant="full" />

// Icon only (for navbar)
<EventFlowLogo size={45} variant="icon-only" />

// Dark background optimized
<EventFlowLogo size={200} variant="dark" />

// Static version
<EventFlowLogo size={200} animated={false} />
```

See `LOGO_IMPLEMENTATION.md` for detailed usage guides.

## 🗓️ Event Management

### Start & End Date/Time
Events now support detailed scheduling:
```typescript
// Create event with start/end times
{
  title: "Tech Summit",
  startDate: "2026-07-15T10:00",
  endDate: "2026-07-15T18:00",
  transportationAvailable: true,
  // ... other fields
}
```

### Automatic Status Management
Events automatically transition between statuses:
- **upcoming**: Before start date
- **ongoing**: Between start and end dates
- **ended**: After end date

### Status Filtering
```typescript
// Fetch events by status
GET /api/events?status=upcoming
GET /api/events?status=ongoing
GET /api/events?status=ended
```

## 📚 Documentation

- `BRAND_GUIDELINES.md` - Complete branding standards
- `LOGO_IMPLEMENTATION.md` - Logo integration guide
- `CHANGELOG.md` - All updates and changes

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=change_this_to_a_long_random_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run development server:

```bash
npm run dev
```

## Pages

- `/` Landing page
- `/signup` Register
- `/login` Login
- `/dashboard` Protected organizer dashboard
- `/events` Public event listing
- `/events/[id]` Event details

## Key Updates (v2.0)

✅ Fixed Button component loading state  
✅ Added Start/End Date & Time to events  
✅ Implemented automatic event status system  
✅ Created premium 3D EventFlow logo  
✅ Added comprehensive branding guidelines  

See `CHANGELOG.md` for detailed changelog.

## Security

- JWT authentication with secure tokens
- HTTP-only cookies (not accessible via JavaScript)
- bcrypt password hashing
- Protected dashboard routes requiring organizer role
- Environment variables for sensitive data

**Important**: Do not hardcode your MongoDB URI or JWT secret inside your code. Always keep them in `.env.local`.

## Project Structure

```
app/
  ├── api/                 # API routes
  ├── dashboard/           # Protected organizer dashboard
  ├── events/              # Event listing & details
  ├── login/               # Auth pages
  └── signup/
components/
  ├── ui/                  # Reusable UI components
  ├── EventFlowLogo.tsx    # Premium 3D logo component
  └── [other components]
models/                    # MongoDB schemas
public/                    # Static assets & logo files
lib/                       # Utilities (DB, JWT, etc.)
types/                     # TypeScript interfaces
```

## Brand Assets

- **Logo Showcase**: Open `public/eventflow-logo.html` in browser
- **SVG Format**: Use `public/eventflow-logo.svg` directly
- **React Component**: Import from `components/EventFlowLogo.tsx`
- **Guidelines**: Read `BRAND_GUIDELINES.md`

## Performance & Quality

- ✓ Premium startup-quality branding
- ✓ Smooth 60fps animations
- ✓ Mobile-optimized responsive design
- ✓ TypeScript for type safety
- ✓ SEO-friendly Next.js setup
- ✓ Production-ready code

## License

Private - EventFlow Brand Identity & System
