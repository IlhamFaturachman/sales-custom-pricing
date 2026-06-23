export type PricingPageStatus = 'draft' | 'published' | 'expired' | 'archived'

export interface PricingPage {
  id: string
  slug: string
  client_name: string
  company_name: string | null
  header_title: string
  status: PricingPageStatus
  valid_until: string | null
  created_at: string
  updated_at: string
}

export interface PricingCategory {
  id: string
  pricing_page_id: string
  category_name: string
  category_icon: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface PricingDuration {
  id: string
  pricing_page_id: string
  duration_label: string
  duration_months: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface PricingPlan {
  id: string
  pricing_page_id: string
  pricing_category_id: string
  pricing_duration_id: string
  plan_name: string
  plan_description: string | null
  price: number | null
  price_suffix: string
  cta_text: string
  cta_url: string | null
  sort_order: number
  created_at: string
}

export interface PricingFeature {
  id: string
  pricing_plan_id: string
  feature_category_name: string
  feature_name: string
  sort_order: number
  created_at: string
}

export interface PricingPageWithRelations extends PricingPage {
  categories: PricingCategory[]
  durations: PricingDuration[]
  plans: (PricingPlan & {
    features: PricingFeature[]
  })[]
}

export interface CreatePricingPageInput {
  slug: string
  client_name: string
  company_name?: string
  header_title?: string
  status?: PricingPageStatus
  valid_until?: string
  categories: CreateCategoryInput[]
  durations: CreateDurationInput[]
  plans: CreatePlanInput[]
}

export interface CreateCategoryInput {
  category_name: string
  category_icon?: string
  is_active?: boolean
  sort_order?: number
}

export interface CreateDurationInput {
  duration_label: string
  duration_months: number
  is_active?: boolean
  sort_order?: number
}

export interface CreatePlanInput {
  category_index: number
  duration_index: number
  plan_name: string
  plan_description?: string
  price?: number
  price_suffix?: string
  cta_text?: string
  cta_url?: string
  sort_order?: number
  features: CreateFeatureInput[]
}

export interface CreateFeatureInput {
  feature_category_name: string
  feature_name: string
  sort_order?: number
}
