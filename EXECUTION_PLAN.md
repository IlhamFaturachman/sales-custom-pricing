# 🚀 COMPLETE EXECUTION PLAN - Maxchat Sales Custom Pricing System

**Last Updated**: 2026-06-23  
**Project**: sales-custom-pricing  
**Framework**: Astro 5 + TypeScript + Supabase  
**Deployment**: Vercel (SSR)

---

## 📋 EXECUTIVE SUMMARY

This document contains **step-by-step instructions** to completely rework and fix the Maxchat Sales Custom Pricing system. Follow these instructions **EXACTLY** in the order specified.

### What Needs to Be Done:
1. ✅ Add authentication middleware to protect dashboard routes
2. ✅ Rework landing page (modernize, better UX)
3. ✅ Rework login page (improve design, add session handling)
4. ✅ Add logout functionality
5. ✅ Fix dashboard (auth protection, better UI)
6. ✅ Rework create page (step-by-step wizard)
7. ✅ Add edit page (based on create wizard)
8. ✅ Fix delete (cascade delete child records)
9. ✅ Fix API (transactions, slug validation)
10. ✅ Ensure public pricing page matches template 100%
11. ✅ Test everything end-to-end

---

## 🏗️ CURRENT PROJECT STRUCTURE

```
sales-custom-pricing/
├── src/
│   ├── components/          # EMPTY - no reusable components
│   ├── layouts/
│   │   ├── Base.astro       # Root HTML shell
│   │   └── Dashboard.astro  # Dashboard layout with sidebar
│   ├── lib/
│   │   └── supabase.ts      # Supabase client (uses import.meta.env)
│   └── pages/
│       ├── index.astro      # Landing page
│       ├── login.astro      # Login form
│       ├── p/
│       │   └── [slug].astro # Public pricing page (MOST IMPORTANT)
│       ├── dashboard/
│       │   ├── index.astro  # Dashboard listing
│       │   ├── create.astro # Create pricing (complex form)
│       │   └── delete/
│       │       └── [id].ts  # Delete endpoint
│       └── api/
│           ├── auth.ts      # Login API
│           └── pricing.ts   # Create pricing API
├── public/
│   └── _astro/              # Pre-built CSS/JS/SVG from maxchat.id
├── template-pricing.html    # REFERENCE TEMPLATE (must match 100%)
├── package.json             # Astro 5, Supabase, Vercel adapter
├── astro.config.mjs         # SSR mode, Vercel adapter
└── vercel.json              # Build config
```

---

## 🗄️ DATABASE SCHEMA

**IMPORTANT**: These tables already exist in Supabase. No migrations needed.

```sql
pricing_pages
├── id (UUID, PK)
├── client_name (text, required)
├── company_name (text, required)
├── slug (text, required, should be unique)
├── status (text: 'draft' | 'published' | 'expired' | 'archived')
├── header_title (text, required)
├── valid_until (date, nullable)
└── created_at (timestamp, auto)

pricing_categories (FK: pricing_page_id → pricing_pages.id)
├── id (UUID, PK)
├── pricing_page_id (UUID, FK)
├── category_name (text)
├── category_icon (text: 'system' | 'omnichannel' | 'whatsapp' | 'maintenance')
└── sort_order (integer)

pricing_durations (FK: pricing_page_id → pricing_pages.id)
├── id (UUID, PK)
├── pricing_page_id (UUID, FK)
├── duration_label (text, e.g., "6 Bulan")
├── duration_months (integer)
└── sort_order (integer)

pricing_plans (FK: pricing_page_id, pricing_category_id, pricing_duration_id)
├── id (UUID, PK)
├── pricing_page_id (UUID, FK)
├── pricing_category_id (UUID, FK → pricing_categories.id)
├── pricing_duration_id (UUID, FK → pricing_durations.id)
├── plan_name (text)
├── plan_description (text)
├── price (integer, nullable — null = "Hubungi Kami")
├── price_suffix (text, default: 'per bulan')
├── cta_text (text, default: 'Contact us')
├── cta_url (text, nullable)
└── sort_order (integer)

pricing_features (FK: pricing_plan_id → pricing_plans.id)
├── id (UUID, PK)
├── pricing_plan_id (UUID, FK)
├── feature_category_name (text)
├── feature_name (text)
└── sort_order (integer)
```

**Relationships:**
```
pricing_pages (1) → (many) pricing_categories
pricing_pages (1) → (many) pricing_durations
pricing_pages (1) → (many) pricing_plans
pricing_categories (1) → (many) pricing_plans
pricing_durations (1) → (many) pricing_plans
pricing_plans (1) → (many) pricing_features
```

---

## ⚠️ CRITICAL ISSUES TO FIX

### Issue #1: NO AUTHENTICATION MIDDLEWARE
**Severity**: 🔴 CRITICAL  
**Current State**: Anyone can access `/dashboard`, `/dashboard/create`, `/dashboard/edit/[id]` without logging in.  
**Impact**: Security vulnerability - unauthorized access to sensitive pricing data.

### Issue #2: EDIT PAGE DOES NOT EXIST
**Severity**: 🔴 CRITICAL  
**Current State**: Dashboard links to `/dashboard/edit/${page.id}` but no such route exists → 404 error.  
**Impact**: Cannot edit existing pricing pages.

### Issue #3: NO CASCADE DELETE
**Severity**: 🟡 HIGH  
**Current State**: Deleting a `pricing_page` does NOT delete child records (categories, durations, plans, features).  
**Impact**: Orphaned data accumulates in database.

### Issue #4: NO API TRANSACTIONS
**Severity**: 🟡 HIGH  
**Current State**: Create pricing does sequential inserts without transaction wrapping.  
**Impact**: If insert fails midway, partial data is left in database.

### Issue #5: NO SLUG UNIQUENESS VALIDATION
**Severity**: 🟡 HIGH  
**Current State**: No check if slug already exists before creating pricing page.  
**Impact**: Duplicate slugs cause routing conflicts on `/p/[slug]`.

### Issue #6: NO LOGOUT MECHANISM
**Severity**: 🟡 HIGH  
**Current State**: Once logged in, user cannot logout. Cookie persists indefinitely.  
**Impact**: Poor UX, security risk on shared computers.

### Issue #7: ENV VAR NAME MISMATCH
**Severity**: 🟡 MEDIUM  
**Current State**: `.env.local.example` uses `NEXT_PUBLIC_SUPABASE_URL` but code uses `import.meta.env.SUPABASE_URL`.  
**Impact**: Confusion during setup.

### Issue #8: README IS OUTDATED
**Severity**: 🟡 MEDIUM  
**Current State**: README says "Next.js 15" but actual stack is Astro 5.  
**Impact**: Misleading documentation.

---

## 🎯 EXECUTION STEPS

Follow these steps **IN ORDER**. Do NOT skip any step.

---

### STEP 1: ADD AUTHENTICATION MIDDLEWARE

**Objective**: Protect all dashboard routes from unauthorized access.

**What to Do**:

1. Create file: `src/middleware.ts`

2. Add this EXACT code:

```typescript
import { defineMiddleware } from 'astro:middleware';
import { supabase } from './lib/supabase';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  // Protected routes - require authentication
  const protectedPaths = ['/dashboard', '/dashboard/create', '/dashboard/edit'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtected) {
    // Get access token from cookie
    const accessToken = context.cookies.get('sb-access-token')?.value;
    
    if (!accessToken) {
      // No token - redirect to login
      return context.redirect('/login');
    }
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      // Invalid token - clear cookie and redirect to login
      context.cookies.delete('sb-access-token', { path: '/' });
      return context.redirect('/login');
    }
    
    // Valid user - attach to context for use in pages
    context.locals.user = user;
  }
  
  // Public routes - allow access
  return next();
});
```

3. Update `src/env.d.ts` to add type definition:

```typescript
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      email: string;
    };
  }
}
```

**Verification**:
- Try accessing `/dashboard` without login → should redirect to `/login`
- Try accessing `/dashboard/create` without login → should redirect to `/login`
- Login first → then access `/dashboard` → should work

---

### STEP 2: ADD LOGOUT FUNCTIONALITY

**Objective**: Allow users to logout and clear session.

**What to Do**:

1. Create file: `src/pages/api/logout.ts`

2. Add this EXACT code:

```typescript
export async function POST() {
  // Clear the access token cookie
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'sb-access-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
    }
  });
}
```

3. Update `src/layouts/Dashboard.astro`:
   - Find the sidebar section
   - Add logout button at the bottom of sidebar nav

**Add this HTML after the nav items**:

```html
<div style="position: absolute; bottom: 24px; left: 16px; right: 16px;">
  <button id="logoutBtn" class="nav-item" style="width: 100%; cursor: pointer; background: none; border: none; text-align: left;">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
    Logout
  </button>
</div>
```

4. Add this script at the end of `<body>` in `Dashboard.astro`:

```html
<script>
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    if (confirm('Yakin ingin logout?')) {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    }
  });
</script>
```

**Verification**:
- Login → go to dashboard → click logout → should redirect to login
- Try accessing `/dashboard` after logout → should redirect to login

---

### STEP 3: FIX ENV VAR DOCUMENTATION

**Objective**: Update `.env.local.example` to use correct Astro env var names.

**What to Do**:

1. Open `.env.local.example`

2. Replace entire content with:

```env
# Supabase Configuration
# Get these from: Supabase Dashboard > Settings > API

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. Update `README.md`:
   - Change "Next.js 15" to "Astro 5"
   - Change all `NEXT_PUBLIC_SUPABASE_*` references to `SUPABASE_*`
   - Update tech stack section

**Verification**:
- `.env.local.example` should use `SUPABASE_URL` (not `NEXT_PUBLIC_SUPABASE_URL`)

---

### STEP 4: FIX DELETE WITH CASCADE

**Objective**: Delete pricing page AND all child records.

**What to Do**:

1. Open `src/pages/dashboard/delete/[id].ts`

2. Replace entire content with:

```typescript
import { supabase } from '../../../lib/supabase';

export async function POST({ params }: { params: { id: string } }) {
  const pageId = params.id;
  
  try {
    // Step 1: Get all plan IDs for this page
    const { data: plans } = await supabase
      .from('pricing_plans')
      .select('id')
      .eq('pricing_page_id', pageId);
    
    const planIds = plans?.map(p => p.id) || [];
    
    // Step 2: Delete all features for these plans
    if (planIds.length > 0) {
      const { error: featError } = await supabase
        .from('pricing_features')
        .delete()
        .in('pricing_plan_id', planIds);
      
      if (featErrors) throw featErrors;
    }
    
    // Step 3: Delete all plans
    const { error: planError } = await supabase
      .from('pricing_plans')
      .delete()
      .eq('pricing_page_id', pageId);
    
    if (planError) throw planError;
    
    // Step 4: Delete all categories
    const { error: catError } = await supabase
      .from('pricing_categories')
      .delete()
      .eq('pricing_page_id', pageId);
    
    if (catError) throw catError;
    
    // Step 5: Delete all durations
    const { error: durError } = await supabase
      .from('pricing_durations')
      .delete()
      .eq('pricing_page_id', pageId);
    
    if (durError) throw durError;
    
    // Step 6: Delete the pricing page
    const { error: pageError } = await supabase
      .from('pricing_pages')
      .delete()
      .eq('id', pageId);
    
    if (pageError) throw pageError;
    
    // Success - redirect to dashboard
    return new Response(null, {
      status: 302,
      headers: { Location: '/dashboard' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
}
```

**Verification**:
- Create a pricing page with categories, durations, plans, features
- Delete it
- Check Supabase dashboard → all child records should be deleted

---

### STEP 5: FIX CREATE API WITH TRANSACTIONS & VALIDATION

**Objective**: Add transaction wrapping and slug uniqueness validation.

**What to Do**:

1. Open `src/pages/api/pricing.ts`

2. Replace entire content with:

```typescript
import { supabase } from '../../lib/supabase';

export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.json();
    
    // VALIDATION 1: Check slug uniqueness
    const { data: existingPage } = await supabase
      .from('pricing_pages')
      .select('id')
      .eq('slug', data.slug)
      .single();
    
    if (existingPage) {
      return new Response(
        JSON.stringify({ error: 'Slug already exists. Please use a different slug.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // VALIDATION 2: Check required fields
    if (!data.client_name || !data.company_name || !data.slug || !data.header_title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // STEP 1: Create pricing page
    const { data: page, error: pageError } = await supabase
      .from('pricing_pages')
      .insert({
        client_name: data.client_name,
        company_name: data.company_name,
        slug: data.slug,
        status: data.status || 'draft',
        header_title: data.header_title,
        valid_until: data.valid_until || null
      })
      .select()
      .single();
    
    if (pageError) throw pageError;
    const pageId = page.id;
    
    // STEP 2: Create categories
    const categoryIds: string[] = [];
    for (let i = 0; i < data.categories.length; i++) {
      const cat = data.categories[i];
      const { data: category, error: catError } = await supabase
        .from('pricing_categories')
        .insert({
          pricing_page_id: pageId,
          category_name: cat.name,
          category_icon: cat.icon,
          sort_order: i
        })
        .select()
        .single();
      
      if (catError) throw catError;
      categoryIds.push(category.id);
    }
    
    // STEP 3: Create durations
    const durationIds: string[] = [];
    for (let j = 0; j < data.durations.length; j++) {
      const dur = data.durations[j];
      const { data: duration, error: durError } = await supabase
        .from('pricing_durations')
        .insert({
          pricing_page_id: pageId,
          duration_label: dur.label,
          duration_months: dur.months,
          sort_order: j
        })
        .select()
        .single();
      
      if (durError) throw durError;
      durationIds.push(duration.id);
    }
    
    // STEP 4: Create plans
    for (let k = 0; k < data.plans.length; k++) {
      const plan = data.plans[k];
      const categoryId = categoryIds[plan.categoryIndex];
      const durationId = durationIds[plan.durationIndex];
      
      if (!categoryId || !durationId) {
        throw new Error('Invalid category or duration index for plan');
      }
      
      const { data: planData, error: planError } = await supabase
        .from('pricing_plans')
        .insert({
          pricing_page_id: pageId,
          pricing_category_id: categoryId,
          pricing_duration_id: durationId,
          plan_name: plan.name,
          plan_description: plan.description,
          price: plan.price ? parseInt(plan.price) : null,
          price_suffix: plan.priceSuffix || 'per bulan',
          cta_text: plan.ctaText || 'Contact us',
          cta_url: plan.ctaUrl || null,
          sort_order: k
        })
        .select()
        .single();
      
      if (planError) throw planError;
      
      // STEP 5: Create features for this plan
      for (let l = 0; l < plan.features.length; l++) {
        const feat = plan.features[l];
        const { error: featError } = await supabase
          .from('pricing_features')
          .insert({
            pricing_plan_id: planData.id,
            feature_category_name: feat.category,
            feature_name: feat.name,
            sort_order: l
          });
        
        if (featError) throw featError;
      }
    }
    
    return new Response(JSON.stringify({ success: true, id: pageId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    // If any error occurs, try to cleanup orphaned data
    // (In production, use database transactions for atomicity)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

**Verification**:
- Try creating pricing with duplicate slug → should get error "Slug already exists"
- Create pricing with all fields → should succeed
- Check database → all records should be created

---

### STEP 6: REWORK LANDING PAGE

**Objective**: Modernize landing page design.

**What to Do**:

1. Open `src/pages/index.astro`

2. Keep the same structure but improve styling:
   - Use Tailwind-like utility classes (inline styles are OK)
   - Add smooth scroll behavior
   - Improve CTA buttons with better hover effects
   - Add subtle animations

3. Key sections to keep:
   - Navbar (sticky, blur backdrop)
   - Hero (gradient badge, H1, 2 CTA buttons)
   - Features grid (6 cards)
   - CTA section (gradient banner)
   - Footer (dark background)

4. **IMPORTANT**: Make sure all CTAs link to `/login` (not `/dashboard`)

**Current design is OK** - just polish it. No major rewrite needed.

**Verification**:
- Visit `/` → should see landing page
- Click any CTA → should go to `/login`

---

### STEP 7: REWORK LOGIN PAGE

**Objective**: Improve login page design and error handling.

**What to Do**:

1. Open `src/pages/login.astro`

2. Keep two-panel design (left decorative, right form)

3. Improve:
   - Better error message display
   - Loading state on submit button
   - Smooth transitions

4. Add this check at the top of frontmatter:

```typescript
// Check if already logged in
const accessToken = Astro.cookies.get('sb-access-token')?.value;
if (accessToken) {
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (user) {
    return Astro.redirect('/dashboard');
  }
}
```

**Verification**:
- Visit `/login` when already logged in → should redirect to `/dashboard`
- Visit `/login` when not logged in → should show login form
- Enter wrong credentials → should show error
- Enter correct credentials → should redirect to `/dashboard`

---

### STEP 8: REWORK CREATE PAGE (STEP-BY-STEP WIZARD)

**Objective**: Convert create form to step-by-step wizard for better UX.

**What to Do**:

1. Open `src/pages/dashboard/create.astro`

2. Replace entire content with wizard-style form:

**STEP 1 OF WIZARD: Basic Information**
```html
<div id="step1" class="wizard-step">
  <h2>Step 1: Basic Information</h2>
  <div class="grid grid-2">
    <div class="form-group">
      <label class="form-label">Nama Client *</label>
      <input type="text" name="client_name" class="form-input" required />
    </div>
    <div class="form-group">
      <label class="form-label">Nama Perusahaan *</label>
      <input type="text" name="company_name" class="form-input" required />
    </div>
  </div>
  <div class="grid grid-2">
    <div class="form-group">
      <label class="form-label">Slug URL *</label>
      <input type="text" name="slug" class="form-input" required pattern="[a-z0-9-]+" />
      <small class="text-gray-500">Only lowercase letters, numbers, and hyphens</small>
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <select name="status" class="form-input form-select">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label class="form-label">Judul Header *</label>
    <input type="text" name="header_title" class="form-input" required />
  </div>
  <div class="form-group">
    <label class="form-label">Valid Sampai</label>
    <input type="date" name="valid_until" class="form-input" />
  </div>
  <button type="button" onclick="nextStep(2)" class="btn btn-primary">Next →</button>
</div>
```

**STEP 2 OF WIZARD: Categories**
```html
<div id="step2" class="wizard-step" style="display: none;">
  <h2>Step 2: Categories</h2>
  <p class="text-gray-500 mb-4">Add product categories (e.g., System, Omnichannel, WhatsApp)</p>
  <div id="categories"></div>
  <button type="button" onclick="addCategory()" class="btn btn-secondary">+ Add Category</button>
  <div style="display: flex; gap: 12px; margin-top: 24px;">
    <button type="button" onclick="prevStep(1)" class="btn btn-secondary">← Back</button>
    <button type="button" onclick="nextStep(3)" class="btn btn-primary">Next →</button>
  </div>
</div>
```

**STEP 3 OF WIZARD: Durations**
```html
<div id="step3" class="wizard-step" style="display: none;">
  <h2>Step 3: Durations</h2>
  <p class="text-gray-500 mb-4">Add subscription durations (e.g., 6 months, 12 months)</p>
  <div id="durations"></div>
  <button type="button" onclick="addDuration()" class="btn btn-secondary">+ Add Duration</button>
  <div style="display: flex; gap: 12px; margin-top: 24px;">
    <button type="button" onclick="prevStep(2)" class="btn btn-secondary">← Back</button>
    <button type="button" onclick="nextStep(4)" class="btn btn-primary">Next →</button>
  </div>
</div>
```

**STEP 4 OF WIZARD: Plans**
```html
<div id="step4" class="wizard-step" style="display: none;">
  <h2>Step 4: Pricing Plans</h2>
  <p class="text-gray-500 mb-4">Add pricing plans for each category and duration combination</p>
  <div id="plans"></div>
  <button type="button" onclick="addPlan()" class="btn btn-secondary">+ Add Plan</button>
  <div style="display: flex; gap: 12px; margin-top: 24px;">
    <button type="button" onclick="prevStep(3)" class="btn btn-secondary">← Back</button>
    <button type="button" onclick="nextStep(5)" class="btn btn-primary">Review →</button>
  </div>
</div>
```

**STEP 5 OF WIZARD: Review & Submit**
```html
<div id="step5" class="wizard-step" style="display: none;">
  <h2>Step 5: Review & Submit</h2>
  <div id="review"></div>
  <div style="display: flex; gap: 12px; margin-top: 24px;">
    <button type="button" onclick="prevStep(4)" class="btn btn-secondary">← Back</button>
    <button type="submit" class="btn btn-primary">Save Pricing Page</button>
  </div>
</div>
```

3. Add wizard navigation script:

```javascript
let currentStep = 1;

function nextStep(step) {
  // Validate current step before proceeding
  if (currentStep === 1 && !validateStep1()) return;
  if (currentStep === 2 && categories.length === 0) {
    alert('Please add at least one category');
    return;
  }
  if (currentStep === 3 && durations.length === 0) {
    alert('Please add at least one duration');
    return;
  }
  
  document.getElementById('step' + currentStep).style.display = 'none';
  document.getElementById('step' + step).style.display = 'block';
  currentStep = step;
  
  if (step === 5) renderReview();
}

function prevStep(step) {
  document.getElementById('step' + currentStep).style.display = 'none';
  document.getElementById('step' + step).style.display = 'block';
  currentStep = step;
}

function validateStep1() {
  const form = document.getElementById('createForm');
  const clientName = form.client_name.value;
  const companyName = form.company_name.value;
  const slug = form.slug.value;
  const headerTitle = form.header_title.value;
  
  if (!clientName || !companyName || !slug || !headerTitle) {
    alert('Please fill all required fields');
    return false;
  }
  
  if (!/^[a-z0-9-]+$/.test(slug)) {
    alert('Slug must contain only lowercase letters, numbers, and hyphens');
    return false;
  }
  
  return true;
}

function renderReview() {
  const form = document.getElementById('createForm');
  const formData = new FormData(form);
  
  const review = document.getElementById('review');
  review.innerHTML = `
    <div class="card mb-4">
      <div class="card-body">
        <h3 class="card-title mb-4">Basic Information</h3>
        <p><strong>Client:</strong> ${formData.get('client_name')}</p>
        <p><strong>Company:</strong> ${formData.get('company_name')}</p>
        <p><strong>Slug:</strong> /p/${formData.get('slug')}</p>
        <p><strong>Status:</strong> ${formData.get('status')}</p>
        <p><strong>Header:</strong> ${formData.get('header_title')}</p>
      </div>
    </div>
    <div class="card mb-4">
      <div class="card-body">
        <h3 class="card-title mb-4">Categories (${categories.length})</h3>
        ${categories.map(c => `<p>• ${c.name} (${c.icon})</p>`).join('')}
      </div>
    </div>
    <div class="card mb-4">
      <div class="card-body">
        <h3 class="card-title mb-4">Durations (${durations.length})</h3>
        ${durations.map(d => `<p>• ${d.label} (${d.months} months)</p>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h3 class="card-title mb-4">Plans (${plans.length})</h3>
        ${plans.map((p, i) => `
          <div style="margin-bottom: 12px; padding: 12px; background: #f9fafb; border-radius: 8px;">
            <strong>Plan ${i + 1}:</strong> ${p.name}<br/>
            <strong>Category:</strong> ${categories[p.categoryIndex]?.name || 'N/A'}<br/>
            <strong>Duration:</strong> ${durations[p.durationIndex]?.label || 'N/A'}<br/>
            <strong>Price:</strong> ${p.price ? 'Rp ' + parseInt(p.price).toLocaleString('id-ID') : 'Hubungi Kami'}<br/>
            <strong>Features:</strong> ${p.features.length} items
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
```

4. Keep existing category/duration/plan rendering logic (addCategory, addDuration, addPlan, etc.)

5. Update form submit handler to show better error messages:

```javascript
document.getElementById('createForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  
  try {
    const data = {
      client_name: formData.get('client_name'),
      company_name: formData.get('company_name'),
      slug: formData.get('slug'),
      status: formData.get('status'),
      header_title: formData.get('header_title'),
      valid_until: formData.get('valid_until') || null,
      categories: categories.map(c => ({ name: c.name, icon: c.icon })),
      durations: durations.map(d => ({ label: d.label, months: d.months })),
      plans: plans.map(p => ({
        categoryIndex: p.categoryIndex,
        durationIndex: p.durationIndex,
        name: p.name,
        description: p.description,
        price: p.price ? parseInt(p.price) : null,
        priceSuffix: p.priceSuffix,
        ctaText: p.ctaText,
        ctaUrl: p.ctaUrl,
        features: p.features
      }))
    };
    
    const response = await fetch('/api/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      window.location.href = '/dashboard';
    } else {
      const errorData = await response.json();
      alert('Error: ' + (errorData.error || 'Failed to create pricing page'));
    }
  } catch (err) {
    alert('Network error. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Pricing Page';
  }
});
```

**Verification**:
- Go to `/dashboard/create`
- Fill step 1 → click Next → should go to step 2
- Add category → click Next → should go to step 3
- Add duration → click Next → should go to step 4
- Add plan → click Review → should show summary
- Click Save → should create and redirect to `/dashboard`

---

### STEP 9: CREATE EDIT PAGE

**Objective**: Create edit page based on create wizard, pre-populated with existing data.

**What to Do**:

1. Create file: `src/pages/dashboard/edit/[id].astro`

2. Copy content from `create.astro`

3. Modify frontmatter to fetch existing data:

```typescript
import Dashboard from '../../layouts/Dashboard.astro';
import { supabase } from '../../../lib/supabase';

const { id } = Astro.params;

// Fetch pricing page
const { data: page, error: pageError } = await supabase
  .from('pricing_pages')
  .select('*')
  .eq('id', id)
  .single();

if (pageError || !page) {
  return Astro.redirect('/dashboard');
}

// Fetch categories
const { data: categories } = await supabase
  .from('pricing_categories')
  .select('*')
  .eq('pricing_page_id', id)
  .order('sort_order');

// Fetch durations
const { data: durations } = await supabase
  .from('pricing_durations')
  .select('*')
  .eq('pricing_page_id', id)
  .order('sort_order');

// Fetch plans
const { data: plans } = await supabase
  .from('pricing_plans')
  .select('*')
  .eq('pricing_page_id', id)
  .order('sort_order');

// Fetch features
const planIds = plans?.map(p => p.id) || [];
const { data: features } = planIds.length > 0
  ? await supabase.from('pricing_features').select('*').in('pricing_plan_id', planIds).order('sort_order')
  : { data: [] };

// Attach features to plans
const plansWithFeatures = plans?.map(plan => ({
  ...plan,
  features: features?.filter(f => f.pricing_plan_id === plan.id) || []
})) || [];
```

4. Update form to pre-populate values:

```html
<input type="text" name="client_name" class="form-input" required value={page.client_name} />
<input type="text" name="company_name" class="form-input" required value={page.company_name} />
<!-- etc -->
```

5. Update JavaScript to initialize with existing data:

```javascript
// Initialize with existing data
let categories = [
  // Map from server data
];

let durations = [
  // Map from server data
];

let plans = [
  // Map from server data with features
];

// Render on page load
renderCategories();
renderDurations();
renderPlans();
```

6. Update form submit to use PUT method:

```javascript
const response = await fetch(`/api/pricing/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

7. Create UPDATE API endpoint: `src/pages/api/pricing/[id].ts`

```typescript
import { supabase } from '../../../lib/supabase';

export async function PUT({ params, request }: { params: { id: string }, request: Request }) {
  const pageId = params.id;
  const data = await request.json();
  
  try {
    // Update pricing page
    const { error: pageError } = await supabase
      .from('pricing_pages')
      .update({
        client_name: data.client_name,
        company_name: data.company_name,
        slug: data.slug,
        status: data.status,
        header_title: data.header_title,
        valid_until: data.valid_until
      })
      .eq('id', pageId);
    
    if (pageError) throw pageError;
    
    // Delete old child records
    const { data: oldPlans } = await supabase
      .from('pricing_plans')
      .select('id')
      .eq('pricing_page_id', pageId);
    
    const oldPlanIds = oldPlans?.map(p => p.id) || [];
    
    if (oldPlanIds.length > 0) {
      await supabase.from('pricing_features').delete().in('pricing_plan_id', oldPlanIds);
    }
    await supabase.from('pricing_plans').delete().eq('pricing_page_id', pageId);
    await supabase.from('pricing_categories').delete().eq('pricing_page_id', pageId);
    await supabase.from('pricing_durations').delete().eq('pricing_page_id', pageId);
    
    // Recreate categories
    const categoryIds: string[] = [];
    for (let i = 0; i < data.categories.length; i++) {
      const cat = data.categories[i];
      const { data: category, error: catError } = await supabase
        .from('pricing_categories')
        .insert({
          pricing_page_id: pageId,
          category_name: cat.name,
          category_icon: cat.icon,
          sort_order: i
        })
        .select()
        .single();
      if (catError) throw catError;
      categoryIds.push(category.id);
    }
    
    // Recreate durations
    const durationIds: string[] = [];
    for (let j = 0; j < data.durations.length; j++) {
      const dur = data.durations[j];
      const { data: duration, error: durError } = await supabase
        .from('pricing_durations')
        .insert({
          pricing_page_id: pageId,
          duration_label: dur.label,
          duration_months: dur.months,
          sort_order: j
        })
        .select()
        .single();
      if (durError) throw durError;
      durationIds.push(duration.id);
    }
    
    // Recreate plans and features
    for (let k = 0; k < data.plans.length; k++) {
      const plan = data.plans[k];
      const categoryId = categoryIds[plan.categoryIndex];
      const durationId = durationIds[plan.durationIndex];
      
      const { data: planData, error: planError } = await supabase
        .from('pricing_plans')
        .insert({
          pricing_page_id: pageId,
          pricing_category_id: categoryId,
          pricing_duration_id: durationId,
          plan_name: plan.name,
          plan_description: plan.description,
          price: plan.price ? parseInt(plan.price) : null,
          price_suffix: plan.priceSuffix || 'per bulan',
          cta_text: plan.ctaText || 'Contact us',
          cta_url: plan.ctaUrl || null,
          sort_order: k
        })
        .select()
        .single();
      if (planError) throw planError;
      
      for (let l = 0; l < plan.features.length; l++) {
        const feat = plan.features[l];
        const { error: featError } = await supabase
          .from('pricing_features')
          .insert({
            pricing_plan_id: planData.id,
            feature_category_name: feat.category,
            feature_name: feat.name,
            sort_order: l
          });
        if (featError) throw featError;
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

**Verification**:
- Go to `/dashboard`
- Click Edit on a pricing page
- Should see wizard with all fields pre-populated
- Make changes → click Save → should update and redirect to `/dashboard`

---

### STEP 10: VERIFY PUBLIC PRICING PAGE MATCHES TEMPLATE

**Objective**: Ensure `/p/[slug]` matches `template-pricing.html` 100%.

**What to Do**:

1. Open `template-pricing.html` in browser
2. Open `/p/[existing-slug]` in browser
3. Compare visually:
   - Header title styling ✓
   - Category tabs (desktop) ✓
   - Duration toggle ✓
   - Plan cards (280px width, shadow, rounded) ✓
   - Price display (Rp format) ✓
   - CTA button (primary style) ✓
   - Accordion "Anda akan mendapatkan" ✓
   - Features with check icons ✓
   - Footer (orange background) ✓
   - Mobile responsive (no category tabs, only duration) ✓

4. Check CSS files in `public/_astro/`:
   - `index.f93530f0.css`
   - `index.17256798.css`
   - `index.2c480ef4.css`

5. **IMPORTANT**: The current `/p/[slug].astro` already uses these CSS files and matches the template structure. No changes needed unless visual differences are found.

**Verification**:
- Compare template HTML vs rendered `/p/[slug]` HTML
- Should be identical in structure and styling

---

### STEP 11: END-TO-END TESTING

**Objective**: Test complete user flow from start to finish.

**Test Cases**:

#### Test 1: Unauthenticated Access
1. Clear cookies / use incognito
2. Try to access `/dashboard` → should redirect to `/login`
3. Try to access `/dashboard/create` → should redirect to `/login`

#### Test 2: Login Flow
1. Go to `/login`
2. Enter wrong credentials → should show error
3. Enter correct credentials → should redirect to `/dashboard`
4. Check cookie `sb-access-token` exists

#### Test 3: Already Logged In
1. While logged in, visit `/login` → should redirect to `/dashboard`

#### Test 4: Create Pricing (Happy Path)
1. Login
2. Go to `/dashboard/create`
3. Fill Step 1: Basic Info (client: "Test Client", company: "PT Test", slug: "test-client-2026", header: "Test Header")
4. Click Next
5. Add category: "System" with icon "system"
6. Click Next
7. Add duration: "6 Bulan" with 6 months
8. Click Next
9. Add plan:
   - Category: System
   - Duration: 6 Bulan
   - Name: "Basic Plan"
   - Price: 500000
   - CTA: "Contact us"
   - Add feature: category "Core", name "Unlimited messages"
10. Click Review
11. Verify summary shows all data
12. Click Save
13. Should redirect to `/dashboard`
14. Check `/p/test-client-2026` → should show pricing page

#### Test 5: Edit Pricing
1. Go to `/dashboard`
2. Click Edit on "test-client-2026"
3. Change client name to "Test Client Updated"
4. Add another category: "WhatsApp"
5. Save
6. Check `/dashboard` → should show updated name
7. Check `/p/test-client-2026` → should show new category

#### Test 6: Delete Pricing
1. Go to `/dashboard`
2. Click Delete on "test-client-2026"
3. Confirm deletion
4. Should redirect to `/dashboard`
5. Check database → all related records should be deleted

#### Test 7: Duplicate Slug
1. Create pricing with slug "duplicate-test"
2. Try to create another with slug "duplicate-test"
3. Should get error "Slug already exists"

#### Test 8: Logout
1. Click logout button in sidebar
2. Confirm logout
3. Should redirect to `/login`
4. Try to access `/dashboard` → should redirect to `/login`

#### Test 9: Public Pricing Page
1. Create a published pricing page
2. Visit `/p/[slug]` without login
3. Should see pricing page (no auth required)
4. Test category tabs (click each tab)
5. Test duration toggle (click each duration)
6. Test accordion (expand/collapse)
7. Test CTA button (should open WhatsApp or custom URL)
8. Test mobile view (resize browser < 768px)

**Verification**:
All tests should pass. Fix any issues found.

---

## 📊 PROGRESS TRACKING

Use this checklist to track completion:

- [ ] Step 1: Authentication middleware added
- [ ] Step 2: Logout functionality added
- [ ] Step 3: Env var documentation fixed
- [ ] Step 4: Delete with cascade fixed
- [ ] Step 5: Create API with validation fixed
- [ ] Step 6: Landing page reworked
- [ ] Step 7: Login page reworked
- [ ] Step 8: Create page wizard implemented
- [ ] Step 9: Edit page created
- [ ] Step 10: Public pricing page verified
- [ ] Step 11: End-to-end tests passed

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot read property 'user' of undefined"
**Solution**: Make sure `src/env.d.ts` exists with proper type definitions (see Step 1).

### Issue: Middleware not running
**Solution**: Make sure file is named exactly `src/middleware.ts` (not `middleware.js`).

### Issue: Edit page shows 404
**Solution**: Make sure file path is `src/pages/dashboard/edit/[id].astro` (with square brackets).

### Issue: Cascade delete not working
**Solution**: Check that delete endpoint deletes features FIRST (before plans), then plans, then categories/durations, then page.

### Issue: Public pricing page styling broken
**Solution**: Check that CSS files exist in `public/_astro/`:
- `index.f93530f0.css`
- `index.17256798.css`
- `index.2c480ef4.css`

### Issue: Login redirect loop
**Solution**: Check that login page checks for existing session and redirects to dashboard if already logged in.

---

## 📝 FINAL NOTES

1. **DO NOT** modify `public/_astro/` files - these are pre-built assets from maxchat.id
2. **DO NOT** change the database schema - tables already exist
3. **DO** test after each step before moving to next
4. **DO** commit after each major step
5. **DO** run `npm run dev` to test locally
6. **DO** run `npm run build` to check for build errors before deploying

---

## 🎉 SUCCESS CRITERIA

The project is complete when:
- ✅ All dashboard routes are protected by authentication
- ✅ Users can login and logout
- ✅ Users can create pricing pages via step-by-step wizard
- ✅ Users can edit existing pricing pages
- ✅ Users can delete pricing pages (with cascade)
- ✅ Slug uniqueness is enforced
- ✅ Public pricing pages match template 100%
- ✅ All end-to-end tests pass
- ✅ No console errors
- ✅ Responsive design works on mobile

---

**END OF EXECUTION PLAN**

