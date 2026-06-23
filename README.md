# Maxchat Dynamic Client Pricing System

Sistem internal untuk tim sales yang dapat menghasilkan halaman pricing khusus untuk setiap client.

## Tech Stack

- **Framework**: Astro 5 + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel (SSR)

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd sales-custom-pricing
npm install
```

### 2. Supabase Setup

1. Buat project di [Supabase](https://supabase.com)
2. Buat tabel: `pricing_pages`, `pricing_categories`, `pricing_durations`, `pricing_plans`, `pricing_features`
3. Buka **Authentication > Providers** dan enable Email provider
4. Buat user baru di **Authentication > Users**

### 3. Environment Variables

Copy `.env.local.example` ke `.env.local` dan isi:

```bash
cp .env.local.example .env.local
```

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
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
| `/dashboard` | List semua pricing (protected) |
| `/dashboard/create` | Buat pricing baru (protected) |
| `/dashboard/edit/[id]` | Edit pricing (protected) |
| `/p/[slug]` | Public pricing page (client view) |

## Database Schema

```
pricing_pages (header & meta)
├── pricing_categories (tab kategori)
├── pricing_durations (durasi langganan)
└── pricing_plans (plan per kategori + durasi)
    └── pricing_features (fitur per plan)
```

## Features

- Authentication & route protection
- Step-by-step wizard untuk create/edit pricing
- Dynamic kategori, durasi, plan, dan fitur
- Cascade delete
- Slug uniqueness validation
- Responsive design (mobile-friendly)
- Status management (draft/published)
