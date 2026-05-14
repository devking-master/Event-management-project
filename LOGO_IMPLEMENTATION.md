# EventFlow Logo - Implementation Guide

## Quick Start

The EventFlow logo is available in multiple formats for easy integration across your entire application.

### 📦 Files Included

```
public/
  ├── eventflow-logo.html          # Interactive showcase (open in browser)
  ├── eventflow-logo.svg           # SVG vector format
components/
  └── EventFlowLogo.tsx            # React component
BRAND_GUIDELINES.md                # Complete brand guidelines
```

---

## 🚀 React Component Usage

### Installation
The component is already in your project at `components/EventFlowLogo.tsx`

### Basic Usage

```tsx
import { EventFlowLogo } from '@/components/EventFlowLogo';

// Full logo version
<EventFlowLogo size={200} />

// Icon only
<EventFlowLogo size={128} variant="icon-only" />

// Dark background
<EventFlowLogo size={200} variant="dark" />

// Transparent (no background)
<EventFlowLogo size={200} variant="transparent" />

// Static (no animation)
<EventFlowLogo size={200} animated={false} />

// Custom styling
<EventFlowLogo 
  size={150} 
  variant="full"
  className="custom-class"
/>
```

### Props

```typescript
interface EventFlowLogoProps {
  size?: number;                      // Size in pixels (default: 200)
  variant?: 'full' | 'icon-only' | 'dark' | 'transparent';
  animated?: boolean;                 // Enable animations (default: true)
  className?: string;                 // Custom CSS class
}
```

---

## 🎯 Implementation Examples

### Navbar/Header

```tsx
import { EventFlowLogo } from '@/components/EventFlowLogo';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-dark">
      <Link href="/">
        <EventFlowLogo size={45} variant="icon-only" />
      </Link>
      {/* Rest of navbar */}
    </nav>
  );
}
```

### Dashboard Header

```tsx
export function DashboardHeader() {
  return (
    <div className="flex items-center gap-4">
      <EventFlowLogo size={50} variant="dark" />
      <div>
        <h1>EventFlow Dashboard</h1>
        <p>Manage your events</p>
      </div>
    </div>
  );
}
```

### Hero Section

```tsx
export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <EventFlowLogo size={300} variant="full" className="mb-8" />
      <h1 className="text-5xl font-bold">Welcome to EventFlow</h1>
      <p className="text-xl text-gray-400">Premium Event Management</p>
    </section>
  );
}
```

### Mobile App Icon

```tsx
export function AppIcon() {
  return (
    <div className="w-128 h-128 rounded-3xl overflow-hidden bg-black">
      <EventFlowLogo size={128} variant="dark" />
    </div>
  );
}
```

### Favicon

```tsx
// In your next.config.ts or layout.tsx
<link rel="icon" href="/eventflow-logo.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/eventflow-logo.svg" />
```

---

## 🎨 SVG Usage

### Direct HTML

```html
<img src="/eventflow-logo.svg" alt="EventFlow" width="200" height="200" />
```

### CSS Background

```css
.logo-bg {
  background-image: url('/eventflow-logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 200px;
}
```

### NextJS Image Component

```tsx
import Image from 'next/image';

<Image 
  src="/eventflow-logo.svg" 
  alt="EventFlow" 
  width={200} 
  height={200}
  priority
/>
```

---

## 🌐 Web Integration

### HTML Implementation

```html
<!-- Full page showcase -->
<iframe src="/eventflow-logo.html" width="100%" height="600px"></iframe>

<!-- Or open directly -->
<!-- Visit /eventflow-logo.html in browser -->
```

### CSS Classes

The React component automatically includes animations. For static implementations:

```css
/* Add to your CSS if needed */
@keyframes spin-slow {
  from { transform: rotateX(0deg) rotateY(0deg); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}

.logo-animated {
  animation: spin-slow 20s linear infinite;
}
```

---

## 📱 Mobile Optimization

### Responsive Sizing

```tsx
export function ResponsiveLogo() {
  const [size, setSize] = useState(200);

  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth < 640 ? 100 : 200);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <EventFlowLogo size={size} />;
}
```

### Mobile-First

```tsx
// Tailwind CSS approach
<div className="flex items-center justify-center">
  <EventFlowLogo 
    size={100}  // Mobile
    className="sm:w-[150px] md:w-[200px]"
  />
</div>
```

---

## 🎬 Animation Control

### Disable Animations

```tsx
// For performance-critical contexts
<EventFlowLogo size={200} animated={false} />
```

### Custom Animation Speed

```tsx
// Extend the component with custom CSS
<EventFlowLogo 
  size={200} 
  className="opacity-75"
  style={{ 
    '--animation-duration': '30s' 
  } as React.CSSProperties}
/>
```

---

## 🎨 Color Variations

The logo uses the following color palette:

```ts
const colors = {
  primary: '#A855F7',    // Neon Purple
  secondary: '#EC4899',  // Hot Pink
  accent: '#06B6D4',     // Cyan Glow
  background: '#0A0E1B', // Deep Black
};
```

To modify colors, edit the component or override with CSS:

```css
.logo-canvas {
  --primary-color: #a855f7;
  --secondary-color: #ec4899;
  --accent-color: #06b6d4;
}
```

---

## 📊 Size Guidelines

| Context | Size | Notes |
|---------|------|-------|
| **Favicon** | 32px | SVG format |
| **Mobile App** | 40-45px | Navbar |
| **Mobile Icon** | 128-192px | App icon |
| **Website Navbar** | 40-50px | Header logo |
| **Hero Section** | 200-400px | Large display |
| **Social Media** | 512x512px | Profile picture |
| **Print** | 4-5cm | Minimum size |

---

## ⚡ Performance Tips

1. **Use SVG for scalability**: Never resize raster images
2. **Lazy load on mobile**: Disable animations on slower devices
3. **Optimize animations**: Use `transform` and `opacity` only
4. **Cache assets**: Serve SVG from CDN for best performance
5. **Preload in critical paths**: Add `priority` to Next.js Image

---

## 🔧 Customization

### Create Theme Variants

```tsx
// components/LogoVariants.tsx
import { EventFlowLogo } from './EventFlowLogo';

export function LogoLight() {
  return <EventFlowLogo variant="transparent" animated />;
}

export function LogoDark() {
  return <EventFlowLogo variant="dark" animated />;
}

export function LogoIcon() {
  return <EventFlowLogo variant="icon-only" size={40} />;
}
```

### Export for External Use

```tsx
// For branding materials
export function LogoExport() {
  return (
    <div className="space-y-8 p-8 bg-white">
      <div className="border-2 border-gray-300 p-8">
        <EventFlowLogo size={300} variant="full" animated={false} />
      </div>
      <button onClick={() => {
        // Download or print logo
      }}>
        Download Logo
      </button>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Logo not showing in production

```tsx
// Ensure SVG is in public folder
// Check Next.js build output
// Verify path is correct relative to public/
```

### Animations not smooth

```tsx
// Disable animations on low-end devices
const isLowEnd = navigator.hardwareConcurrency < 4;
<EventFlowLogo animated={!isLowEnd} />
```

### Colors look different

```tsx
// Verify color profile
// Check for color filters/overlays
// Ensure background contrast
// Test on different monitors
```

---

## 📚 Additional Resources

- **View Showcase**: Open `public/eventflow-logo.html` in browser
- **Brand Guidelines**: Read `BRAND_GUIDELINES.md`
- **React Component**: `components/EventFlowLogo.tsx`
- **SVG File**: `public/eventflow-logo.svg`

---

## ✅ Checklist for Implementation

- [ ] Add logo to navbar
- [ ] Update favicon
- [ ] Add to hero section
- [ ] Create app icon
- [ ] Update dashboard header
- [ ] Add to loading states
- [ ] Test on mobile
- [ ] Test animations
- [ ] Update branding materials
- [ ] Share with team/stakeholders

---

## 📞 Support

For questions or additional logo variations, refer to `BRAND_GUIDELINES.md` or contact the design team.

**Version**: 1.0  
**Last Updated**: 2026  
**Status**: Production Ready
