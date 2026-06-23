import { createClient } from '@/lib/supabase/server'
import type {
  PricingPage,
  PricingPageWithRelations,
  CreatePricingPageInput,
  PricingPageStatus,
} from '@/types/pricing'

export class PricingRepository {
  private async getSupabase() {
    return await createClient()
  }

  async getAll(): Promise<PricingPage[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('pricing_pages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getById(id: string): Promise<PricingPageWithRelations | null> {
    const supabase = await this.getSupabase()

    const { data: page, error: pageError } = await supabase
      .from('pricing_pages')
      .select('*')
      .eq('id', id)
      .single()

    if (pageError) throw pageError
    if (!page) return null

    const [categoriesResult, durationsResult, plansResult] = await Promise.all([
      supabase
        .from('pricing_categories')
        .select('*')
        .eq('pricing_page_id', id)
        .order('sort_order'),
      supabase
        .from('pricing_durations')
        .select('*')
        .eq('pricing_page_id', id)
        .order('sort_order'),
      supabase
        .from('pricing_plans')
        .select('*')
        .eq('pricing_page_id', id)
        .order('sort_order'),
    ])

    const plans = plansResult.data || []

    const featuresResult = plans.length > 0
      ? await supabase
          .from('pricing_features')
          .select('*')
          .in('pricing_plan_id', plans.map(p => p.id))
          .order('sort_order')
      : { data: [] }

    const features = featuresResult.data || []

    return {
      ...page,
      categories: categoriesResult.data || [],
      durations: durationsResult.data || [],
      plans: plans.map(plan => ({
        ...plan,
        features: features.filter(f => f.pricing_plan_id === plan.id),
      })),
    }
  }

  async getBySlug(slug: string): Promise<PricingPageWithRelations | null> {
    const supabase = await this.getSupabase()

    const { data: page, error: pageError } = await supabase
      .from('pricing_pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (pageError) throw pageError
    if (!page) return null

    return this.getById(page.id)
  }

  async create(input: CreatePricingPageInput): Promise<PricingPage> {
    const supabase = await this.getSupabase()

    const { data: page, error: pageError } = await supabase
      .from('pricing_pages')
      .insert({
        slug: input.slug,
        client_name: input.client_name,
        company_name: input.company_name,
        header_title: input.header_title,
        status: input.status || 'draft',
        valid_until: input.valid_until,
      })
      .select()
      .single()

    if (pageError) throw pageError

    // Create categories
    if (input.categories.length > 0) {
      const { data: categories, error: catError } = await supabase
        .from('pricing_categories')
        .insert(
          input.categories.map((cat, idx) => ({
            pricing_page_id: page.id,
            category_name: cat.category_name,
            category_icon: cat.category_icon,
            is_active: cat.is_active ?? true,
            sort_order: cat.sort_order ?? idx,
          }))
        )
        .select()

      if (catError) throw catError

      // Create durations
      const { data: durations, error: durError } = await supabase
        .from('pricing_durations')
        .insert(
          input.durations.map((dur, idx) => ({
            pricing_page_id: page.id,
            duration_label: dur.duration_label,
            duration_months: dur.duration_months,
            is_active: dur.is_active ?? true,
            sort_order: dur.sort_order ?? idx,
          }))
        )
        .select()

      if (durError) throw durError

      // Create plans with features
      for (const planInput of input.plans) {
        const category = categories[planInput.category_index]
        const duration = durations[planInput.duration_index]

        if (!category || !duration) continue

        const { data: plan, error: planError } = await supabase
          .from('pricing_plans')
          .insert({
            pricing_page_id: page.id,
            pricing_category_id: category.id,
            pricing_duration_id: duration.id,
            plan_name: planInput.plan_name,
            plan_description: planInput.plan_description,
            price: planInput.price,
            price_suffix: planInput.price_suffix || 'per bulan',
            cta_text: planInput.cta_text || 'Contact us',
            cta_url: planInput.cta_url,
            sort_order: planInput.sort_order ?? 0,
          })
          .select()
          .single()

        if (planError) throw planError

        if (planInput.features.length > 0) {
          const { error: featError } = await supabase
            .from('pricing_features')
            .insert(
              planInput.features.map((feat, idx) => ({
                pricing_plan_id: plan.id,
                feature_category_name: feat.feature_category_name,
                feature_name: feat.feature_name,
                sort_order: feat.sort_order ?? idx,
              }))
            )

          if (featError) throw featError
        }
      }
    }

    return page
  }

  async update(id: string, input: Partial<CreatePricingPageInput>): Promise<PricingPage> {
    const supabase = await this.getSupabase()

    const { data: page, error: pageError } = await supabase
      .from('pricing_pages')
      .update({
        slug: input.slug,
        client_name: input.client_name,
        company_name: input.company_name,
        header_title: input.header_title,
        status: input.status,
        valid_until: input.valid_until,
      })
      .eq('id', id)
      .select()
      .single()

    if (pageError) throw pageError

    // If categories, durations, plans are provided, replace them
    if (input.categories || input.durations || input.plans) {
      // Get existing plan IDs first
      const { data: existingPlans } = await supabase
        .from('pricing_plans')
        .select('id')
        .eq('pricing_page_id', id)

      // Delete features for existing plans
      if (existingPlans && existingPlans.length > 0) {
        await supabase
          .from('pricing_features')
          .delete()
          .in('pricing_plan_id', existingPlans.map(p => p.id))
      }

      // Delete plans, categories, durations
      await supabase.from('pricing_plans').delete().eq('pricing_page_id', id)
      await supabase.from('pricing_categories').delete().eq('pricing_page_id', id)
      await supabase.from('pricing_durations').delete().eq('pricing_page_id', id)

      // Recreate
      if (input.categories && input.durations && input.plans) {
        await this.create({
          slug: page.slug,
          client_name: page.client_name,
          company_name: input.company_name,
          header_title: input.header_title,
          status: input.status,
          valid_until: input.valid_until,
          categories: input.categories,
          durations: input.durations,
          plans: input.plans,
        })
      }
    }

    return page
  }

  async delete(id: string): Promise<void> {
    const supabase = await this.getSupabase()
    const { error } = await supabase.from('pricing_pages').delete().eq('id', id)
    if (error) throw error
  }

  async duplicate(id: string, newSlug: string, newClientName: string): Promise<PricingPage> {
    const existing = await this.getById(id)
    if (!existing) throw new Error('Pricing page not found')

    const newPage = await this.create({
      slug: newSlug,
      client_name: newClientName,
      company_name: existing.company_name ?? undefined,
      header_title: existing.header_title,
      status: 'draft',
      valid_until: existing.valid_until ?? undefined,
      categories: existing.categories.map(c => ({
        category_name: c.category_name,
        category_icon: c.category_icon ?? undefined,
        is_active: c.is_active,
        sort_order: c.sort_order,
      })),
      durations: existing.durations.map(d => ({
        duration_label: d.duration_label,
        duration_months: d.duration_months,
        is_active: d.is_active,
        sort_order: d.sort_order,
      })),
      plans: existing.plans.map(p => ({
        category_index: existing.categories.findIndex(c => c.id === p.pricing_category_id),
        duration_index: existing.durations.findIndex(d => d.id === p.pricing_duration_id),
        plan_name: p.plan_name,
        plan_description: p.plan_description ?? undefined,
        price: p.price ?? undefined,
        price_suffix: p.price_suffix,
        cta_text: p.cta_text,
        cta_url: p.cta_url ?? undefined,
        sort_order: p.sort_order,
        features: p.features.map(f => ({
          feature_category_name: f.feature_category_name,
          feature_name: f.feature_name,
          sort_order: f.sort_order,
        })),
      })),
    })

    return newPage
  }

  async updateStatus(id: string, status: PricingPageStatus): Promise<void> {
    const supabase = await this.getSupabase()
    const { error } = await supabase
      .from('pricing_pages')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  }
}

export const pricingRepository = new PricingRepository()
