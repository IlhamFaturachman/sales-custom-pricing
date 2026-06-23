# Maxchat Dynamic Client Pricing System

Sistem internal untuk tim sales yang dapat menghasilkan halaman pricing khusus untuk setiap client.

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + App Router
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd sales-custom-pricing
npm install
```

### 2. Supabase Setup

1. Buat project di [Supabase](https://supabase.com)
2. Buka SQL Editor dan jalankan migration dari `supabase/migrations/001_create_pricing_tables.sql`
3. Buka **Authentication > Providers** dan enable Email provider
4. Buat user baru di **Authentication > Users**

### 3. Environment Variables

Copy `.env.local.example` ke `.env.local` dan isi:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Values bisa ditemukan di **Supabase Dashboard > Settings > API**

### 4. Run Development

```bash
npm run dev
```

Buka http://localhost:3000

## URL Structure

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/login` | Login sales |
| `/dashboard` | List semua pricing |
| `/dashboard/create` | Buat pricing baru |
| `/dashboard/edit/[id]` | Edit pricing |
| `/p/[slug]` | Public pricing page (client view) |

## Flow

### Sales Flow
1. Login ke dashboard
2. Buat pricing baru
3. Input client info, kategori, durasi, plan, dan fitur
4. Set status ke "Published"
5. Copy link `/p/[slug]` dan kirim ke client

### Client Flow
1. Buka link yang dikirim sales
2. Lihat pricing yang sudah dikustomisasi
3. Klik "Contact us" untuk hubungi sales

## Database Schema

```
pricing_pages (header & meta)
├── pricing_categories (tab kategori)
├── pricing_durations (durasi langganan)
└── pricing_plans (plan per kategori + durasi)
    └── pricing_features (fitur per plan)
```

## Features

- ✅ CRUD pricing page
- ✅ Dynamic kategori (tab)
- ✅ Dynamic durasi (6/12 bulan, dll)
- ✅ Dynamic pricing per kategori + durasi
- ✅ Dynamic fitur per plan
- ✅ Duplicate pricing
- ✅ Status management (draft/published/expired/archived)
- ✅ Expired page handling
- ✅ Responsive design
- ✅ Authentication

## Deployment

### Vercel

1. Push ke GitHub
2. Import project di Vercel
3. Add environment variables
4. Deploy

### Environment Variables di Vercel

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
