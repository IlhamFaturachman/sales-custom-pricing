# Dynamic Client Pricing System - Product Requirements Document (PRD)

## Overview

Membangun sistem internal untuk tim sales yang dapat menghasilkan halaman pricing khusus untuk setiap client.

Saat ini perusahaan sudah memiliki halaman pricing resmi dengan desain, layout, struktur section, dan styling yang sudah final.

Sistem yang dibangun **tidak boleh mengubah desain halaman pricing tersebut**.

Tujuan sistem adalah memungkinkan sales membuat pricing yang berbeda untuk setiap client tanpa perlu membuat halaman baru atau mengubah pricing page utama.

---

# Business Problem

Setiap client dapat menerima penawaran harga yang berbeda berdasarkan:

- Negosiasi
- Diskon khusus
- Partnership
- Volume transaksi
- Enterprise agreement
- Promo tertentu

Saat ini pricing bersifat statis.

Tim sales membutuhkan cara untuk:

1. Membuat pricing khusus per client.
2. Mengirim link pricing ke client.
3. Mengelola pricing yang sudah pernah dibuat.
4. Melakukan duplicate pricing untuk client lain.

---

# Core Concept

```text
1 Pricing Template
+
Many Client Pricing Data
=
Many Personalized Pricing Pages
```

Artinya:

- Layout selalu sama
- Struktur selalu sama
- Styling selalu sama
- Komponen selalu sama

Yang berubah hanya datanya.

---

# Example

## Official Pricing

```text
Starter
Rp 1.000.000

Business
Rp 2.000.000
```

## Client A

```text
Starter
Rp 800.000

Business
Rp 1.500.000
```

## Client B

```text
Starter
Rp 700.000

Business
Rp 1.300.000
```

## Client C

```text
Starter
Rp 900.000

Business
Rp 1.800.000
```

Semua client melihat halaman yang identik secara visual.

Yang berubah hanya data pricing.

---

# Technical Constraints

## Important Rules

### DO

- Simpan data pricing per client.
- Gunakan satu template pricing page.
- Render data berdasarkan slug.
- Gunakan database sebagai source of truth.

### DON'T

- Jangan simpan HTML per client.
- Jangan membuat template berbeda per client.
- Jangan menduplikasi halaman pricing.
- Jangan membuat landing page baru untuk setiap client.
- Jangan mengubah desain pricing page existing.

---

# Tech Stack

Gunakan:

```text
Next.js 15
TypeScript
App Router

Supabase
PostgreSQL
```

Deployment:

```text
Vercel
Supabase
```

---

# Application Flow

## Internal Flow (Sales)

```text
Login

↓

Create Pricing

↓

Input Client Information

↓

Input Pricing Data

↓

Publish

↓

Generate URL

↓

Send To Client
```

---

## External Flow (Client)

```text
Open URL

↓

View Pricing

↓

Contact Sales
```

---

# URL Structure

Examples:

```text
/p/pt-abc

/p/pt-bca

/p/telkom-indonesia
```

Dynamic route:

```text
/p/[slug]
```

---

# Dashboard Features

## List Pricing

Sales dapat melihat seluruh pricing yang pernah dibuat.

---

## Create Pricing

Sales dapat membuat pricing baru.

---

## Edit Pricing

Sales dapat mengubah pricing yang sudah dibuat.

---

## Delete Pricing

Sales dapat menghapus pricing.

---

## Duplicate Pricing

Sales dapat melakukan cloning pricing.

Contoh:

```text
PT ABC

↓

Duplicate

↓

PT XYZ
```

Semua konfigurasi pricing otomatis tersalin.

---

# Public Pricing Page

Route:

```text
/p/[slug]
```

Page harus:

1. Menggunakan template pricing existing.
2. Mengambil data berdasarkan slug.
3. Menampilkan pricing sesuai data client.
4. Tidak mengubah struktur visual halaman.

---

# Database Design

## pricing_pages

```sql
id uuid primary key

slug text unique

client_name text

company_name text

status text

valid_until timestamp

created_at timestamp

updated_at timestamp
```

---

## pricing_plans

```sql
id uuid primary key

pricing_page_id uuid

plan_name text

plan_description text

price numeric

cta_text text

cta_url text

sort_order integer

created_at timestamp
```

---

## pricing_features

```sql
id uuid primary key

pricing_plan_id uuid

feature_name text

sort_order integer
```

---

# Relationships

```text
Pricing Page
 └── Plans
      └── Features
```

---

# Status Management

Available status:

```text
draft
published
expired
archived
```

Rules:

## Draft

Tidak dapat diakses publik.

## Published

Dapat diakses publik.

## Expired

Menampilkan halaman expired.

## Archived

Tidak dapat diakses publik.

---

# Expired Page

Jika pricing sudah expired:

Tampilkan:

```text
Pricing telah kadaluarsa.

Silakan hubungi sales Anda untuk mendapatkan penawaran terbaru.
```

---

# Authentication

Dashboard harus memerlukan login.

Public page tidak memerlukan login.

Protected:

```text
/dashboard/*
```

Public:

```text
/p/[slug]
```

---

# Data Volume Expectations

Data sangat kecil.

Estimasi:

- Puluhan sales
- Ratusan pricing page
- Ribuan pricing item

Tidak perlu optimasi kompleks.

Fokus pada:

- Simplicity
- Maintainability
- Developer Experience

---

# Performance Requirements

- Fast page load.
- Minimal dependencies.
- No microservice.
- No separate backend.
- No queue system.
- No unnecessary complexity.

Supabase menjadi single source of truth.

---

# Deliverables

Generate:

1. Next.js project structure.
2. Supabase schema.
3. SQL migration.
4. TypeScript types.
5. Repository layer.
6. Authentication flow.
7. Dashboard CRUD.
8. Duplicate pricing feature.
9. Public pricing page.
10. Expired pricing handling.
11. Vercel deployment configuration.
12. Environment variable setup.

---

# Final Instruction

Saya akan memberikan source HTML halaman pricing existing setelah ini.

Analisis halaman tersebut dan pertahankan:

- Layout
- Visual hierarchy
- Section structure
- User experience
- Responsive behavior

Semirip mungkin dengan halaman existing.

Jangan melakukan redesign.
Jangan mengganti struktur bisnis halaman.
Jangan membuat UI baru yang berbeda dari pricing page yang sudah ada.
