# Next.js + Tailwind Standards

**Platform-Agnostic Instructions**

This module provides Next.js development standards with Tailwind CSS for React applications using the App Router.

---

## Server vs Client Components

**Default to Server Components:**
- Server Components are the default in App Router
- Use for: static content, data fetching, SEO-critical pages
- Benefits: smaller bundle, faster initial load, direct database/API access

**Use Client Components when:**
- Need interactivity (onClick, onChange, useState, useEffect)
- Need browser APIs (localStorage, window, document)
- Need React Context providers/consumers
- Mark with `'use client'` directive at top of file

```tsx
// ✅ Server Component (default)
export default async function ProductsPage() {
  const products = await db.products.findMany();
  return <ProductList products={products} />;
}

// ✅ Client Component (interactive)
'use client';
import { useState } from 'react';

export function ProductFilter() {
  const [filter, setFilter] = useState('all');
  return <select value={filter} onChange={e => setFilter(e.target.value)}>...</select>;
}
```

---

## App Router Conventions

**File-system routing:**
- `app/page.tsx` → `/`
- `app/products/page.tsx` → `/products`
- `app/products/[id]/page.tsx` → `/products/123`
- `app/(dashboard)/layout.tsx` → Shared layout for group

**Special files:**
- `layout.tsx` – Shared UI that persists across pages
- `page.tsx` – Route UI
- `loading.tsx` – Loading state (Suspense boundary)
- `error.tsx` – Error boundary
- `not-found.tsx` – 404 page

---

## Data Fetching

**Server Components:**

```tsx
// Fetch at component level
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 } // ISR: revalidate every 60s
  });
  return <div>{data.title}</div>;
}

// Or use database directly
import { db } from '@/lib/db';

export default async function Page() {
  const posts = await db.post.findMany();
  return <PostList posts={posts} />;
}
```

**Route Handlers (API routes):**

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}
```

---

## Next.js Optimizations

**Images:**

```tsx
import Image from 'next/image';

// ✅ CORRECT: Optimized with width/height
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>

// Or with fill for responsive containers
<div className="relative w-full h-64">
  <Image
    src="/bg.jpg"
    alt="Background"
    fill
    className="object-cover"
  />
</div>
```

**Links:**

```tsx
import Link from 'next/link';

// ✅ CORRECT: Prefetches on hover
<Link href="/products" className="link-nav">
  Products
</Link>

// For external links
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External
</a>
```

**Fonts:**

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Metadata and SEO

```tsx
// Static metadata
export const metadata = {
  title: 'My App',
  description: 'App description',
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.imageUrl],
    },
  };
}
```

---

## Tailwind Integration

Follow the React Tailwind component/utility architecture:
- Use utilities for layout and spacing
- Use component classes for controls (`.btn-primary`, `.input`, `.card`)
- See `react-tailwind` module for complete Tailwind standards

---

## Success Metrics

- ✅ Server Components used by default
- ✅ Client Components marked with `'use client'`
- ✅ `next/image` for all images
- ✅ `next/link` for internal navigation
- ✅ Metadata/SEO configured
- ✅ Loading and error states implemented
- ✅ Tailwind component classes defined
