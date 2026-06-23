const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vfexofjmvbpsceifegtc.supabase.co'
const supabaseKey = 'sb_publishable_VgEtkHAcUmCu-vdmbix-Rg_WhNoXz3k'
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const pricingPages = [
  {
    slug: 'maju-sejahtera',
    client_name: 'Budi Santoso',
    company_name: 'PT Maju Sejahtera',
    header_title: 'Solusi Omnichannel Terintegrasi untuk PT Maju Sejahtera',
    status: 'published',
    valid_until: '2026-12-31',
    categories: [
      { category_name: 'Omnichannel', category_icon: 'headphones', is_active: true, sort_order: 0 },
      { category_name: 'CRM Integration', category_icon: 'database', is_active: true, sort_order: 1 },
    ],
    durations: [
      { duration_label: '6 Bulan', duration_months: 6, is_active: true, sort_order: 0 },
      { duration_label: '12 Bulan', duration_months: 12, is_active: true, sort_order: 1 },
    ],
    plans: [
      {
        category_index: 0,
        duration_index: 0,
        plan_name: 'Starter',
        plan_description: 'Paket dasar untuk usaha kecil yang ingin mulai menggunakan omnichannel.',
        price: '1500000',
        price_suffix: 'per bulan',
        cta_text: 'Hubungi Kami',
        sort_order: 0,
        features: [
          { feature_category_name: 'WhatsApp Bisnis', feature_name: 'WhatsApp Centang Biru', sort_order: 0 },
          { feature_category_name: 'WhatsApp Bisnis', feature_name: 'Broadcast 1000/bulan', sort_order: 1 },
          { feature_category_name: 'Agen', feature_name: '3 Agen Aktif', sort_order: 2 },
          { feature_category_name: 'Fitur', feature_name: 'Chatbot Dasar', sort_order: 3 },
          { feature_category_name: 'Fitur', feature_name: 'Laporan Bulanan', sort_order: 4 },
        ],
      },
      {
        category_index: 0,
        duration_index: 0,
        plan_name: 'Professional',
        plan_description: 'Paket lengkap untuk bisnis menengah dengan kebutuhan komunikasi tinggi.',
        price: '3500000',
        price_suffix: 'per bulan',
        cta_text: 'Hubungi Kami',
        sort_order: 1,
        features: [
          { feature_category_name: 'WhatsApp Bisnis', feature_name: 'WhatsApp Centang Biru', sort_order: 0 },
          { feature_category_name: 'WhatsApp Bisnis', feature_name: 'Broadcast 5000/bulan', sort_order: 1 },
          { feature_category_name: 'Agen', feature_name: '10 Agen Aktif', sort_order: 2 },
          { feature_category_name: 'Fitur', feature_name: 'Chatbot AI', sort_order: 3 },
          { feature_category_name: 'Fitur', feature_name: 'Laporan Real-time', sort_order: 4 },
          { feature_category_name: 'Fitur', feature_name: 'API Access', sort_order: 5 },
        ],
      },
      {
        category_index: 0,
        duration_index: 1,
        plan_name: 'Enterprise',
        plan_description: 'Solusi enterprise dengan kapasitas unlimited dan support 24/7.',
        price: '',
        price_suffix: 'per bulan',
        cta_text: 'Konsultasi Gratis',
        sort_order: 2,
        features: [
          { feature_category_name: 'WhatsApp Bisnis', feature_name: 'WhatsApp Centang Biru', sort_order: 0 },
          { feature_category_name: 'WhatsApp Bisnis', feature_name: 'Broadcast Unlimited', sort_order: 1 },
          { feature_category_name: 'Agen', feature_name: 'Agen Unlimited', sort_order: 2 },
          { feature_category_name: 'Fitur', feature_name: 'Chatbot AI Premium', sort_order: 3 },
          { feature_category_name: 'Fitur', feature_name: 'Dedicated Account Manager', sort_order: 4 },
          { feature_category_name: 'Fitur', feature_name: 'SLA 99.9%', sort_order: 5 },
          { feature_category_name: 'Support', feature_name: 'Support 24/7', sort_order: 6 },
        ],
      },
    ],
  },
  {
    slug: 'berkah-digital',
    client_name: 'Rina Wijaya',
    company_name: 'CV Berkah Digital',
    header_title: 'Paket WhatsApp API untuk CV Berkah Digital',
    status: 'published',
    valid_until: '2026-09-30',
    categories: [
      { category_name: 'WhatsApp API', category_icon: 'chat', is_active: true, sort_order: 0 },
    ],
    durations: [
      { duration_label: '3 Bulan', duration_months: 3, is_active: true, sort_order: 0 },
      { duration_label: '6 Bulan', duration_months: 6, is_active: true, sort_order: 1 },
      { duration_label: '12 Bulan', duration_months: 12, is_active: true, sort_order: 2 },
    ],
    plans: [
      {
        category_index: 0,
        duration_index: 0,
        plan_name: 'Basic',
        plan_description: 'Paket dasar WhatsApp API untuk bisnis kecil.',
        price: '500000',
        price_suffix: 'per bulan',
        cta_text: 'Pesan Sekarang',
        sort_order: 0,
        features: [
          { feature_category_name: 'Benefit', feature_name: 'WhatsApp Verified', sort_order: 0 },
          { feature_category_name: 'Benefit', feature_name: 'Nama Masking', sort_order: 1 },
          { feature_category_name: 'Kapasitas', feature_name: '500 Pesan/bulan', sort_order: 2 },
          { feature_category_name: 'Agen', feature_name: '2 Agen', sort_order: 3 },
        ],
      },
      {
        category_index: 0,
        duration_index: 1,
        plan_name: 'Growth',
        plan_description: 'Paket untuk bisnis yang sedang berkembang.',
        price: '1200000',
        price_suffix: 'per bulan',
        cta_text: 'Pesan Sekarang',
        sort_order: 1,
        features: [
          { feature_category_name: 'Benefit', feature_name: 'WhatsApp Verified', sort_order: 0 },
          { feature_category_name: 'Benefit', feature_name: 'Nama Masking', sort_order: 1 },
          { feature_category_name: 'Kapasitas', feature_name: '5000 Pesan/bulan', sort_order: 2 },
          { feature_category_name: 'Agen', feature_name: '5 Agen', sort_order: 3 },
          { feature_category_name: 'Fitur', feature_name: 'Auto Reply', sort_order: 4 },
          { feature_category_name: 'Fitur', feature_name: 'Broadcast Scheduler', sort_order: 5 },
        ],
      },
      {
        category_index: 0,
        duration_index: 2,
        plan_name: 'Scale',
        plan_description: 'Paket untuk bisnis skala besar dengan volume tinggi.',
        price: '2800000',
        price_suffix: 'per bulan',
        cta_text: 'Hubungi Sales',
        sort_order: 2,
        features: [
          { feature_category_name: 'Benefit', feature_name: 'WhatsApp Verified', sort_order: 0 },
          { feature_category_name: 'Benefit', feature_name: 'Nama Masking', sort_order: 1 },
          { feature_category_name: 'Kapasitas', feature_name: 'Unlimited Pesan', sort_order: 2 },
          { feature_category_name: 'Agen', feature_name: '20 Agen', sort_order: 3 },
          { feature_category_name: 'Fitur', feature_name: 'Auto Reply AI', sort_order: 4 },
          { feature_category_name: 'Fitur', feature_name: 'API Integration', sort_order: 5 },
          { feature_category_name: 'Fitur', feature_name: 'Analytics Dashboard', sort_order: 6 },
          { feature_category_name: 'Support', feature_name: 'Priority Support', sort_order: 7 },
        ],
      },
    ],
  },
  {
    slug: 'teknologi-nusantara',
    client_name: 'Ahmad Hidayat',
    company_name: 'PT Teknologi Nusantara',
    header_title: 'Custom System Development untuk PT Teknologi Nusantara',
    status: 'published',
    valid_until: '2027-03-31',
    categories: [
      { category_name: 'System Custom', category_icon: 'code', is_active: true, sort_order: 0 },
      { category_name: 'Maintenance', category_icon: 'settings', is_active: true, sort_order: 1 },
    ],
    durations: [
      { duration_label: 'Project', duration_months: 1, is_active: true, sort_order: 0 },
      { duration_label: '6 Bulan', duration_months: 6, is_active: true, sort_order: 1 },
      { duration_label: '12 Bulan', duration_months: 12, is_active: true, sort_order: 2 },
    ],
    plans: [
      {
        category_index: 0,
        duration_index: 0,
        plan_name: 'MVP',
        plan_description: 'Pengembangan MVP untuk validasi ide bisnis Anda.',
        price: '15000000',
        price_suffix: 'per project',
        cta_text: 'Konsultasi',
        sort_order: 0,
        features: [
          { feature_category_name: 'Development', feature_name: 'UI/UX Design', sort_order: 0 },
          { feature_category_name: 'Development', feature_name: 'Frontend Development', sort_order: 1 },
          { feature_category_name: 'Development', feature_name: 'Backend API', sort_order: 2 },
          { feature_category_name: 'Deployment', feature_name: 'Cloud Hosting Setup', sort_order: 3 },
          { feature_category_name: 'Support', feature_name: '1 Bulan Support', sort_order: 4 },
        ],
      },
      {
        category_index: 0,
        duration_index: 1,
        plan_name: 'Professional',
        plan_description: 'Sistem lengkap untuk operasional bisnis perusahaan.',
        price: '45000000',
        price_suffix: 'per project',
        cta_text: 'Konsultasi',
        sort_order: 1,
        features: [
          { feature_category_name: 'Development', feature_name: 'UI/UX Design Premium', sort_order: 0 },
          { feature_category_name: 'Development', feature_name: 'Full Stack Development', sort_order: 1 },
          { feature_category_name: 'Development', feature_name: 'Database Architecture', sort_order: 2 },
          { feature_category_name: 'Integration', feature_name: '3rd Party Integration', sort_order: 3 },
          { feature_category_name: 'Testing', feature_name: 'QA Testing', sort_order: 4 },
          { feature_category_name: 'Deployment', feature_name: 'Cloud Deployment', sort_order: 5 },
          { feature_category_name: 'Support', feature_name: '6 Bulan Support', sort_order: 6 },
        ],
      },
      {
        category_index: 0,
        duration_index: 2,
        plan_name: 'Enterprise',
        plan_description: 'Solusi enterprise dengan arsitektur scalable dan high availability.',
        price: '',
        price_suffix: 'per project',
        cta_text: 'Request Proposal',
        sort_order: 2,
        features: [
          { feature_category_name: 'Development', feature_name: 'Enterprise Architecture', sort_order: 0 },
          { feature_category_name: 'Development', feature_name: 'Microservices', sort_order: 1 },
          { feature_category_name: 'Development', feature_name: 'High Availability Setup', sort_order: 2 },
          { feature_category_name: 'Integration', feature_name: 'Custom API Development', sort_order: 3 },
          { feature_category_name: 'Testing', feature_name: 'Load Testing', sort_order: 4 },
          { feature_category_name: 'Security', feature_name: 'Security Audit', sort_order: 5 },
          { feature_category_name: 'Deployment', feature_name: 'Multi-region Deployment', sort_order: 6 },
          { feature_category_name: 'Support', feature_name: '12 Bulan Support', sort_order: 7 },
          { feature_category_name: 'Support', feature_name: 'Dedicated Team', sort_order: 8 },
        ],
      },
      {
        category_index: 1,
        duration_index: 1,
        plan_name: 'Maintenance Basic',
        plan_description: 'Paket maintenance bulanan untuk menjaga sistem tetap optimal.',
        price: '5000000',
        price_suffix: 'per bulan',
        cta_text: 'Subscribe',
        sort_order: 3,
        features: [
          { feature_category_name: 'Maintenance', feature_name: 'Bug Fix', sort_order: 0 },
          { feature_category_name: 'Maintenance', feature_name: 'Server Monitoring', sort_order: 1 },
          { feature_category_name: 'Maintenance', feature_name: 'Backup Management', sort_order: 2 },
          { feature_category_name: 'Support', feature_name: 'Email Support', sort_order: 3 },
        ],
      },
      {
        category_index: 1,
        duration_index: 2,
        plan_name: 'Maintenance Premium',
        plan_description: 'Paket maintenance lengkap dengan update fitur berkala.',
        price: '12000000',
        price_suffix: 'per bulan',
        cta_text: 'Subscribe',
        sort_order: 4,
        features: [
          { feature_category_name: 'Maintenance', feature_name: 'Bug Fix Priority', sort_order: 0 },
          { feature_category_name: 'Maintenance', feature_name: 'Server Monitoring 24/7', sort_order: 1 },
          { feature_category_name: 'Maintenance', feature_name: 'Auto Scaling', sort_order: 2 },
          { feature_category_name: 'Update', feature_name: 'Monthly Feature Update', sort_order: 3 },
          { feature_category_name: 'Update', feature_name: 'Security Patches', sort_order: 4 },
          { feature_category_name: 'Support', feature_name: 'Priority Support', sort_order: 5 },
          { feature_category_name: 'Support', feature_name: 'Dedicated Engineer', sort_order: 6 },
        ],
      },
    ],
  },
]

async function seed() {
  console.log('🌱 Starting seed...')

  // Sign in as admin
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@maxchat.id',
    password: 'password123',
  })

  if (authError) {
    console.error('❌ Auth error:', authError.message)
    return
  }

  console.log('✅ Authenticated as:', authData.user.email)

  for (const pageData of pricingPages) {
    const { categories, durations, plans, ...pageInfo } = pageData

    // Check if page already exists
    const { data: existing } = await supabase
      .from('pricing_pages')
      .select('id')
      .eq('slug', pageInfo.slug)
      .single()

    if (existing) {
      console.log(`⏭️  Page "${pageInfo.slug}" already exists, skipping...`)
      continue
    }

    // Create page
    const { data: page, error: pageError } = await supabase
      .from('pricing_pages')
      .insert(pageInfo)
      .select()
      .single()

    if (pageError) {
      console.error(`❌ Error creating page "${pageInfo.slug}":`, pageError)
      continue
    }

    console.log(`✅ Created page: ${pageInfo.company_name} (${pageInfo.slug})`)

    // Create categories
    const { data: createdCategories, error: catError } = await supabase
      .from('pricing_categories')
      .insert(
        categories.map((cat) => ({
          ...cat,
          pricing_page_id: page.id,
        }))
      )
      .select()

    if (catError) {
      console.error(`❌ Error creating categories:`, catError)
      continue
    }

    console.log(`  📁 Created ${createdCategories.length} categories`)

    // Create durations
    const { data: createdDurations, error: durError } = await supabase
      .from('pricing_durations')
      .insert(
        durations.map((dur) => ({
          ...dur,
          pricing_page_id: page.id,
        }))
      )
      .select()

    if (durError) {
      console.error(`❌ Error creating durations:`, durError)
      continue
    }

    console.log(`  ⏱️  Created ${createdDurations.length} durations`)

    // Create plans with features
    for (const planInput of plans) {
      const category = createdCategories[planInput.category_index]
      const duration = createdDurations[planInput.duration_index]

      if (!category || !duration) {
        console.warn(`  ⚠️  Skipping plan "${planInput.plan_name}" - missing category or duration`)
        continue
      }

      const { data: plan, error: planError } = await supabase
        .from('pricing_plans')
        .insert({
          pricing_page_id: page.id,
          pricing_category_id: category.id,
          pricing_duration_id: duration.id,
          plan_name: planInput.plan_name,
          plan_description: planInput.plan_description,
          price: planInput.price ? parseFloat(planInput.price) : null,
          price_suffix: planInput.price_suffix,
          cta_text: planInput.cta_text,
          sort_order: planInput.sort_order,
        })
        .select()
        .single()

      if (planError) {
        console.error(`  ❌ Error creating plan "${planInput.plan_name}":`, planError)
        continue
      }

      if (planInput.features.length > 0) {
        const { error: featError } = await supabase
          .from('pricing_features')
          .insert(
            planInput.features.map((feat) => ({
              pricing_plan_id: plan.id,
              feature_category_name: feat.feature_category_name,
              feature_name: feat.feature_name,
              sort_order: feat.sort_order,
            }))
          )

        if (featError) {
          console.error(`  ❌ Error creating features for "${planInput.plan_name}":`, featError)
        }
      }

      console.log(`  💰 Created plan: ${planInput.plan_name} (${planInput.features.length} features)`)
    }
  }

  console.log('\n✨ Seed completed!')
}

seed().catch(console.error)
