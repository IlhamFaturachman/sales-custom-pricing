import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'

function formatPrice(price: number | null): string {
  if (price === null) return 'Hubungi Kami'
  return `Rp. ${price.toLocaleString('id-ID')}`
}

function generateFeatureHTML(features: any[]): string {
  const grouped: Record<string, any[]> = {}
  features.forEach(f => {
    if (!grouped[f.feature_category_name]) grouped[f.feature_category_name] = []
    grouped[f.feature_category_name].push(f)
  })

  return Object.entries(grouped).map(([category, feats]) => `
                                <div>
                                  <div class="mt-4 mb-2 capitalize">
                                    <b>${category}</b>
                                  </div>
                                </div>
                                ${feats.map(f => `
                                <div>
                                  <div class="flex items-start capitalize">
                                    <img
                                      class="mr-4 mt-[4px] h-[16px] w-[16px]"
                                      src="/_astro/check-yellow.f86eb9a2.svg"
                                      alt="check-icon"
                                    /><span>${f.feature_name}</span>
                                  </div>
                                </div>`).join('')}`).join('')
}

function generatePlanCard(plan: any, isActive: boolean): string {
  const priceDisplay = plan.price === null ? 'Hubungi Kami' : formatPrice(plan.price)
  const priceSuffix = plan.price === null ? '' : `<span class="font-light text-sm"> ${plan.price_suffix || 'per bulan'}</span>`
  
  const waUrl = plan.cta_url || `https://wa.me/6281234511449?text=Halo%20Maxchat,%20saya%20tertarik%20untuk%20menggunakan%20layanan%20Maxchat`
  const ctaLabel = plan.cta_text || 'Contact us'

  return `
                      <div
                        class="flex flex-col gap-y-4 items-stretch justify-items-stretch"
                      >
                        <div
                          class="w-[280px] bg-white rounded-xl overflow-clip shadow-[0_2px_20px_rgba(255,115,0,0.2)] flex flex-col"
                        >
                          <div
                            class="mt-2 px-3 py-2 flex items-center relative"
                          >
                            <p class="text-sm font-semibold font-sora">
                              <span class="text-green-500">${plan.plan_name}</span>
                            </p>
                          </div>
                          <div class="ml-3 pt-1">
                            <div class="mb-4">
                              <p>
                                <span class="text-xl font-semibold font-sora"
                                  >${priceDisplay}</span
                                >${priceSuffix}
                              </p>
                            </div>
                          </div>
                          <div
                            class="px-3 flex flex-col justify-between pb-2 pt-2 mt-auto"
                          >
                            <a
                              href="${waUrl}"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="btn primary w-full md rounded-lg font-semibold text-center"
                              aria-label="${ctaLabel}"
                            >
                              ${ctaLabel}
                            </a>
                          </div>
                          <div class="p-4 min-h-[200px]">
                            <p class="text-sm">
                              ${plan.plan_description || ''}
                            </p>
                          </div>
                        </div>
                        <div class="mt-8">
                          <div id="accordion">
                            <div class="">
                              <button
                                type="button"
                                class="btn accordion w-full base rounded-lg !p-3 md:!px-4 md:!py-6 ${isActive ? 'active' : ''}"
                              >
                                <div
                                  class="flex justify-between text-left text-base md:text-lg"
                                >
                                  Anda akan mendapatkan<img
                                    class="ml-4"
                                    src="/_astro/chevron-down.ea170c7f.svg"
                                    alt="chevron-icon"
                                  />
                                </div>
                              </button>
                              <div
                                class="transition-all overflow-hidden text-left text-sm text-neutral-500 delay-75 duration-300 hover:text-neutral-500 md:text-base px-4 ${isActive ? 'h-auto pb-3' : 'max-h-0'}"
                              >
                                ${generateFeatureHTML(plan.features || [])}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>`
}

function generateCategoryTabs(categories: any[], activeIndex: number): string {
  const icons: Record<string, string> = {
    'omnichannel': '/_astro/omnichannel-active.5275cfd7.svg',
    'whatsapp': '/_astro/wa.973797de.svg',
    'wa': '/_astro/wa.973797de.svg',
    'system': '/_astro/system.9f773c00.svg',
    'code': '/_astro/system.9f773c00.svg',
    'maintenance': '/_astro/system.9f773c00.svg',
    'settings': '/_astro/system.9f773c00.svg',
  }

  return categories.map((cat, i) => {
    const icon = icons[cat.category_icon?.toLowerCase()] || icons[cat.category_name?.toLowerCase()] || icons['system']
    const isActive = i === activeIndex
    return `<button
                          type="button"
                          data-category-id="${cat.id}"
                          class="category-tab px-6 py-4 transition-colors duration-150 ease-in-out ${isActive ? 'border-primary border-b-4' : 'border-b-4 border-neutral-300'}"
                        >
                          <div
                            class="flex gap-3 text-[22px] font-bold capitalize"
                          >
                            <img
                              src="${icon}"
                              alt="icon"
                            /><span
                              class="transition duration-150 ease-in-out ${isActive ? 'text-primary' : 'text-neutral-400'}"
                              >${cat.category_name}</span
                            >
                          </div>
                        </button>`
  }).join('')
}

function generateDurationButtons(durations: any[], activeIndex: number): string {
  return durations.map((dur, i) => {
    const isActive = i === activeIndex
    return `<button
                          data-duration-id="${dur.id}"
                          class="duration-btn px-4 py-1.5 rounded-full font-semibold transition-all duration-200 ${isActive ? 'bg-white text-orange-600 shadow-lg' : 'flex items-center gap-1 text-gray-700 hover:text-orange-600'}"
                        >
                          <span>${dur.duration_label}</span>
                        </button>`
  }).join('')
}

function generatePlanGroups(categories: any[], durations: any[], plansByCategoryAndDuration: Record<string, Record<string, any[]>>): string {
  let html = ''
  
  categories.forEach((cat, catIndex) => {
    durations.forEach((dur, durIndex) => {
      const plans = plansByCategoryAndDuration[cat.id]?.[dur.id] || []
      const isDefault = catIndex === 0 && durIndex === 0
      
      html += `<div class="plan-group" data-category-id="${cat.id}" data-duration-id="${dur.id}" style="display: ${isDefault ? '' : 'none'}">
                      <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
                      >
                        ${plans.map((p, i) => generatePlanCard(p, i === 0)).join('\n')}
                      </div>
                    </div>`
    })
  })
  
  return html
}

function generateMobilePlans(plans: any[]): string {
  return plans.map((plan, i) => {
    const priceDisplay = plan.price === null ? 'Hubungi Kami' : formatPrice(plan.price)
    const priceSuffix = plan.price === null ? '' : `<span class="font-light text-sm"> ${plan.price_suffix || 'per bulan'}</span>`
    
    const waUrl = plan.cta_url || `https://wa.me/6281234511449?text=Halo%20Maxchat,%20saya%20tertarik%20untuk%20menggunakan%20layanan%20Maxchat`
    const ctaLabel = plan.cta_text || 'Contact us'

    return `<div class="swiper-slide">
                          <div class="flex-col items-center justify-center">
                            <div class="flex justify-center">
                              <div
                                class="w-[280px] bg-white rounded-xl overflow-clip shadow-[0_2px_20px_rgba(255,115,0,0.2)] flex flex-col"
                              >
                                <div
                                  class="mt-2 px-3 py-2 flex items-center relative"
                                >
                                  <p class="text-sm font-semibold font-sora">
                                    <span class="text-green-500">${plan.plan_name}</span>
                                  </p>
                                </div>
                                <div class="ml-3 pt-1">
                                  <div class="mb-4">
                                    <p>
                                      <span class="text-xl font-semibold font-sora"
                                        >${priceDisplay}</span
                                      >${priceSuffix}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  class="px-3 flex flex-col justify-between pb-2 pt-2 mt-auto"
                                >
                                  <a
                                    href="${waUrl}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn primary w-full md rounded-lg font-semibold text-center"
                                    aria-label="${ctaLabel}"
                                  >
                                    ${ctaLabel}
                                  </a>
                                </div>
                                <div class="p-4 min-h-[200px]">
                                  <p class="text-sm">
                                    ${plan.plan_description || ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="mt-8 max-w-sm mx-auto">
                              <div id="accordion">
                                <div class="">
                                  <button
                                    type="button"
                                    class="btn accordion w-full base rounded-lg !p-3 md:!px-4 md:!py-6"
                                  >
                                    <div
                                      class="flex justify-between text-left text-base md:text-lg"
                                    >
                                      Anda akan mendapatkan<img
                                        class="ml-4"
                                        src="/_astro/chevron-down.ea170c7f.svg"
                                        alt="chevron-icon"
                                      />
                                    </div>
                                  </button>
                                  <div
                                    class="transition-all overflow-hidden text-left text-sm text-neutral-500 delay-75 duration-300 hover:text-neutral-500 md:text-base px-4 max-h-0"
                                  >
                                    ${generateFeatureHTML(plan.features || [])}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>`
  }).join('')
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page, error } = await supabase
    .from('pricing_pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !page) {
    notFound()
  }

  const [categoriesResult, durationsResult, plansResult] = await Promise.all([
    supabase.from('pricing_categories').select('*').eq('pricing_page_id', page.id).order('sort_order'),
    supabase.from('pricing_durations').select('*').eq('pricing_page_id', page.id).order('sort_order'),
    supabase.from('pricing_plans').select('*').eq('pricing_page_id', page.id).order('sort_order'),
  ])

  const categories = categoriesResult.data || []
  const durations = durationsResult.data || []
  const plans = plansResult.data || []

  const planIds = plans.map((p) => p.id)
  const featuresResult =
    planIds.length > 0
      ? await supabase
          .from('pricing_features')
          .select('*')
          .in('pricing_plan_id', planIds)
          .order('sort_order')
      : { data: [] }

  const features = featuresResult.data || []

  const plansWithFeatures = plans.map((plan) => ({
    ...plan,
    features: features.filter((f) => f.pricing_plan_id === plan.id),
  }))

  // Group plans by category and duration
  const plansByCategoryAndDuration: Record<string, Record<string, any[]>> = {}
  categories.forEach(cat => {
    plansByCategoryAndDuration[cat.id] = {}
    durations.forEach(dur => {
      plansByCategoryAndDuration[cat.id][dur.id] = plansWithFeatures.filter(
        p => p.pricing_category_id === cat.id && p.pricing_duration_id === dur.id
      )
    })
  })

  // Get first category and first duration for default view
  const firstCat = categories[0]
  const firstDur = durations[0]
  const defaultPlans = firstCat && firstDur ? plansByCategoryAndDuration[firstCat.id]?.[firstDur.id] || [] : []

  // Generate category tabs HTML
  const categoryTabsHTML = generateCategoryTabs(categories, 0)

  // Generate duration buttons HTML
  const durationButtonsHTML = generateDurationButtons(durations, 0)

  // Generate plan groups HTML (for tab switching)
  const planGroupsHTML = generatePlanGroups(categories, durations, plansByCategoryAndDuration)

  // Generate mobile plans HTML
  const mobilePlansHTML = generateMobilePlans(defaultPlans)

  // Read pricing template
  const templatePath = path.join(process.cwd(), 'src/app/p/[slug]/pricing-template.html')
  let template = fs.readFileSync(templatePath, 'utf-8')

  // Replace dynamic parts
  // 1. Replace title
  template = template.replace(
    /Solusi terintegrasi untuk hubungan pelanggan, penjualan,\s*dan komunikasi massa bisnis anda/,
    page.header_title
  )

  // 2. Replace category tabs
  template = template.replace(
    /<button\s*type="button"\s*class="px-6 py-4 transition-colors duration-150 ease-in-out border-primary border-b-4"\s*>\s*<div\s*class="flex gap-3 text-\[22px\] font-bold capitalize"\s*>\s*<img\s*src="\/_astro\/omnichannel-active\.5275cfd7\.svg"\s*alt="icon"\s*\/><span\s*class="transition duration-150 ease-in-out text-primary"\s*>Omnichannel<\/span\s*>\s*<\/div><\/button\s*><button\s*type="button"\s*class="px-6 py-4 transition-colors duration-150 ease-in-out border-b-4 border-neutral-300"\s*>\s*<div\s*class="flex gap-3 text-\[22px\] font-bold capitalize"\s*>\s*<img\s*src="\/_astro\/wa\.973797de\.svg"\s*alt="icon"\s*\/><span\s*class="transition duration-150 ease-in-out text-neutral-400"\s*>Whatsapp API Only<\/span\s*>\s*<\/div><\/button\s*><button\s*type="button"\s*class="px-6 py-4 transition-colors duration-150 ease-in-out border-b-4 border-neutral-300"\s*>\s*<div\s*class="flex gap-3 text-\[22px\] font-bold capitalize"\s*>\s*<img\s*src="\/_astro\/system\.9f773c00\.svg"\s*alt="icon"\s*\/><span\s*class="transition duration-150 ease-in-out text-neutral-400"\s*>System Custom<\/span\s*>\s*<\/div>\s*<\/button>/,
    categoryTabsHTML
  )

  // 3. Replace duration buttons
  template = template.replace(
    /<button\s*class="px-4 py-1\.5 rounded-full font-semibold transition-all duration-200 bg-white text-orange-600 shadow-lg"\s*>\s*6 Bulan<\/button\s*><button\s*class="px-4 py-1\.5 rounded-full font-semibold transition-all duration-200 flex items-center gap-1 text-gray-700 hover:text-orange-600"\s*>\s*<span>12 Bulan<\/span>\s*<\/button>/,
    durationButtonsHTML
  )

  // 4. Replace desktop plans section with plan groups
  const desktopStartMarker = `<div
                        class="flex flex-col gap-y-4 items-stretch justify-items-stretch"
                      >`
  const desktopEndMarker = `</div>
                    </div>
                  </div>
                  <div>
                    <div class="my-6 block md:hidden">`

  const desktopStart = template.indexOf(desktopStartMarker)
  const desktopEnd = template.indexOf(desktopEndMarker)

  if (desktopStart !== -1 && desktopEnd !== -1) {
    template = template.substring(0, desktopStart) + planGroupsHTML + '\n' + template.substring(desktopEnd)
  }

  // 5. Replace mobile plans section
  const mobileStartMarker = `<div class="swiper">
                        <div class="swiper-wrapper">`
  const mobileEndMarker = `</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`

  const mobileStart = template.indexOf(mobileStartMarker)
  const mobileEnd = template.indexOf(mobileEndMarker)

  if (mobileStart !== -1 && mobileEnd !== -1) {
    template = template.substring(0, mobileStart + mobileStartMarker.length) + '\n' + mobilePlansHTML + '\n' + template.substring(mobileEnd)
  }

  return (
    <div 
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: template }} 
    />
  )
}
