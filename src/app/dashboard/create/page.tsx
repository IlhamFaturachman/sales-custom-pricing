'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CategoryInput {
  category_name: string
  category_icon: string
  is_active: boolean
}

interface DurationInput {
  duration_label: string
  duration_months: number
  is_active: boolean
}

interface FeatureInput {
  feature_category_name: string
  feature_name: string
}

interface PlanInput {
  category_index: number
  duration_index: number
  plan_name: string
  plan_description: string
  price: string
  price_suffix: string
  cta_text: string
  features: FeatureInput[]
}

const STEPS = [
  { id: 1, name: 'Info Dasar', icon: '📋' },
  { id: 2, name: 'Kategori', icon: '📑' },
  { id: 3, name: 'Durasi', icon: '⏱️' },
  { id: 4, name: 'Plans & Fitur', icon: '💰' },
]

export default function CreatePricingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const [slug, setSlug] = useState('')
  const [clientName, setClientName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [headerTitle, setHeaderTitle] = useState(
    'Solusi terintegrasi untuk hubungan pelanggan, penjualan, dan komunikasi massa bisnis anda'
  )
  const [validUntil, setValidUntil] = useState('')

  const [categories, setCategories] = useState<CategoryInput[]>([
    { category_name: 'Omnichannel', category_icon: '', is_active: true },
    { category_name: 'Whatsapp API Only', category_icon: '', is_active: true },
    { category_name: 'System Custom', category_icon: '', is_active: true },
  ])

  const [durations, setDurations] = useState<DurationInput[]>([
    { duration_label: '6 Bulan', duration_months: 6, is_active: true },
    { duration_label: '12 Bulan', duration_months: 12, is_active: true },
  ])

  const [plans, setPlans] = useState<PlanInput[]>([
    {
      category_index: 0,
      duration_index: 0,
      plan_name: 'Pro',
      plan_description: 'Layanan yang cocok digunakan untuk usaha kecil yang menginginkan WhatsApp nya terverifikasi.',
      price: '850000',
      price_suffix: 'per bulan',
      cta_text: 'Contact us',
      features: [
        { feature_category_name: 'Benefit WhatsApp Bisnis', feature_name: 'Nama Masking*' },
        { feature_category_name: 'Benefit WhatsApp Bisnis', feature_name: 'WhatsApp Centang Biru*' },
        { feature_category_name: 'Benefit WhatsApp Bisnis', feature_name: 'Pengguna Aktif Bulanan Tak Terbatas' },
        { feature_category_name: 'Agen Multi', feature_name: '5 Agen' },
        { feature_category_name: 'Agen Multi', feature_name: 'Assignment Agen Otomatis' },
      ],
    },
    {
      category_index: 0,
      duration_index: 0,
      plan_name: 'Business',
      plan_description: 'Layanan yang cocok dipakai usaha level menengah dengan kebutuhan broadcast cukup banyak.',
      price: '2500000',
      price_suffix: 'per bulan',
      cta_text: 'Contact us',
      features: [
        { feature_category_name: 'Benefit WhatsApp Bisnis', feature_name: 'Nama Masking*' },
        { feature_category_name: 'Benefit WhatsApp Bisnis', feature_name: 'WhatsApp Centang Biru*' },
        { feature_category_name: 'Agen Multi', feature_name: '20 Agen' },
      ],
    },
    {
      category_index: 0,
      duration_index: 0,
      plan_name: 'Enterprise',
      plan_description: 'Layanan untuk bisnis skala besar dengan performa omnichannel yang lebih oke.',
      price: '',
      price_suffix: 'per bulan',
      cta_text: 'Contact us',
      features: [
        { feature_category_name: 'Benefit WhatsApp Bisnis', feature_name: 'Nama Masking*' },
        { feature_category_name: 'Benefit WhatsApp Bisnis', feature_name: 'WhatsApp Centang Biru*' },
        { feature_category_name: 'Agen Multi', feature_name: 'Kustomisasi Jumlah Agen' },
      ],
    },
  ])

  const [expandedPlan, setExpandedPlan] = useState<number | null>(0)

  const addCategory = () => {
    setCategories([...categories, { category_name: '', category_icon: '', is_active: true }])
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const updateCategory = (index: number, field: keyof CategoryInput, value: string | boolean) => {
    const updated = [...categories]
    updated[index] = { ...updated[index], [field]: value }
    setCategories(updated)
  }

  const addDuration = () => {
    setDurations([...durations, { duration_label: '', duration_months: 0, is_active: true }])
  }

  const removeDuration = (index: number) => {
    setDurations(durations.filter((_, i) => i !== index))
  }

  const updateDuration = (index: number, field: keyof DurationInput, value: string | number | boolean) => {
    const updated = [...durations]
    updated[index] = { ...updated[index], [field]: value }
    setDurations(updated)
  }

  const addPlan = () => {
    setPlans([
      ...plans,
      {
        category_index: 0,
        duration_index: 0,
        plan_name: '',
        plan_description: '',
        price: '',
        price_suffix: 'per bulan',
        cta_text: 'Contact us',
        features: [],
      },
    ])
    setExpandedPlan(plans.length)
  }

  const removePlan = (index: number) => {
    setPlans(plans.filter((_, i) => i !== index))
    if (expandedPlan === index) setExpandedPlan(null)
  }

  const updatePlan = (index: number, field: keyof PlanInput, value: string | number) => {
    const updated = [...plans]
    updated[index] = { ...updated[index], [field]: value }
    setPlans(updated)
  }

  const addFeature = (planIndex: number) => {
    const updated = [...plans]
    updated[planIndex].features.push({ feature_category_name: '', feature_name: '' })
    setPlans(updated)
  }

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const updated = [...plans]
    updated[planIndex].features = updated[planIndex].features.filter((_, i) => i !== featureIndex)
    setPlans(updated)
  }

  const updateFeature = (planIndex: number, featureIndex: number, field: keyof FeatureInput, value: string) => {
    const updated = [...plans]
    updated[planIndex].features[featureIndex] = {
      ...updated[planIndex].features[featureIndex],
      [field]: value,
    }
    setPlans(updated)
  }

  const canNext = () => {
    if (currentStep === 1) return slug && clientName
    if (currentStep === 2) return categories.length > 0 && categories.every(c => c.category_name)
    if (currentStep === 3) return durations.length > 0 && durations.every(d => d.duration_label && d.duration_months > 0)
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: page, error: pageError } = await supabase
        .from('pricing_pages')
        .insert({
          slug,
          client_name: clientName,
          company_name: companyName || null,
          header_title: headerTitle,
          status: 'draft',
          valid_until: validUntil || null,
        })
        .select()
        .single()

      if (pageError) throw pageError

      const { data: createdCategories, error: catError } = await supabase
        .from('pricing_categories')
        .insert(
          categories.map((cat, idx) => ({
            pricing_page_id: page.id,
            category_name: cat.category_name,
            category_icon: cat.category_icon || null,
            is_active: cat.is_active,
            sort_order: idx,
          }))
        )
        .select()

      if (catError) throw catError

      const { data: createdDurations, error: durError } = await supabase
        .from('pricing_durations')
        .insert(
          durations.map((dur, idx) => ({
            pricing_page_id: page.id,
            duration_label: dur.duration_label,
            duration_months: dur.duration_months,
            is_active: dur.is_active,
            sort_order: idx,
          }))
        )
        .select()

      if (durError) throw durError

      for (const planInput of plans) {
        const category = createdCategories[planInput.category_index]
        const duration = createdDurations[planInput.duration_index]

        if (!category || !duration) continue

        const { data: plan, error: planError } = await supabase
          .from('pricing_plans')
          .insert({
            pricing_page_id: page.id,
            pricing_category_id: category.id,
            pricing_duration_id: duration.id,
            plan_name: planInput.plan_name,
            plan_description: planInput.plan_description || null,
            price: planInput.price ? parseFloat(planInput.price) : null,
            price_suffix: planInput.price_suffix,
            cta_text: planInput.cta_text,
            sort_order: 0,
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
                sort_order: idx,
              }))
            )

          if (featError) throw featError
        }
      }

      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: string) => {
    if (!price) return 'Contact Us!'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(parseInt(price))
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Buat Pricing Baru</h1>
        <p className="text-sm text-gray-500 mt-1">Buat halaman pricing custom untuk client Anda</p>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => {
                  if (step.id <= currentStep || canNext()) setCurrentStep(step.id)
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentStep === step.id
                    ? 'bg-orange-50 border-2 border-orange-200 shadow-sm'
                    : currentStep > step.id
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    currentStep === step.id
                      ? 'bg-orange-500 text-white'
                      : currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="text-left hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-orange-700' : currentStep > step.id ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    Step {step.id}
                  </p>
                  <p className={`text-xs ${
                    currentStep === step.id ? 'text-orange-500' : currentStep > step.id ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </p>
                </div>
              </button>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-green-300' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar</h2>
                <p className="text-sm text-gray-500">Isi informasi dasar pricing page</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
                  <span className="inline-flex items-center px-4 bg-gray-50 text-gray-500 text-sm font-medium border-r border-gray-200">
                    /p/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="flex-1 px-4 py-3 border-0 focus:ring-0 sm:text-sm"
                    placeholder="pt-abc"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">URL unik untuk pricing page client. Contoh: pt-abc, telkom-indonesia</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all sm:text-sm"
                  placeholder="PT ABC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Perusahaan
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all sm:text-sm"
                  placeholder="PT ABC Indonesia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Awal
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    Draft
                  </span>
                  <p className="mt-1 text-xs text-gray-400">Bisa diubah setelah dibuat</p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Title
                </label>
                <textarea
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  rows={3}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all sm:text-sm resize-none"
                  placeholder="Judul yang ditampilkan di halaman pricing"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Categories */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Kategori</h2>
                  <p className="text-sm text-gray-500">Tab kategori pricing (Omnichannel, WA API, dll)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah
              </button>
            </div>

            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-gray-400 border border-gray-200">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={cat.category_name}
                    onChange={(e) => updateCategory(idx, 'category_name', e.target.value)}
                    placeholder="Nama kategori"
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                  />
                  <label className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={cat.is_active}
                      onChange={(e) => updateCategory(idx, 'is_active', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600">Aktif</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeCategory(idx)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <p className="text-gray-500">Belum ada kategori</p>
                <button
                  type="button"
                  onClick={addCategory}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Kategori
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Durations */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Durasi</h2>
                  <p className="text-sm text-gray-500">Pilihan durasi langganan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addDuration}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah
              </button>
            </div>

            <div className="space-y-3">
              {durations.map((dur, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-gray-400 border border-gray-200">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={dur.duration_label}
                    onChange={(e) => updateDuration(idx, 'duration_label', e.target.value)}
                    placeholder="Label (6 Bulan)"
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={dur.duration_months}
                      onChange={(e) => updateDuration(idx, 'duration_months', parseInt(e.target.value) || 0)}
                      placeholder="Bulan"
                      className="w-24 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-center"
                    />
                    <span className="text-sm text-gray-500">bulan</span>
                  </div>
                  <label className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={dur.is_active}
                      onChange={(e) => updateDuration(idx, 'is_active', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Aktif</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeDuration(idx)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Plans & Features */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Plans & Fitur</h2>
                  <p className="text-sm text-gray-500">Konfigurasi plan pricing dan fitur</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addPlan}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Plan
              </button>
            </div>

            <div className="space-y-4">
              {plans.map((plan, planIdx) => (
                <div key={planIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Plan Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedPlan(expandedPlan === planIdx ? null : planIdx)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                        planIdx === 0 ? 'bg-green-100 text-green-600' :
                        planIdx === 1 ? 'bg-orange-100 text-orange-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {plan.plan_name ? plan.plan_name[0] : '#'}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{plan.plan_name || `Plan ${planIdx + 1}`}</p>
                        <p className="text-sm text-gray-500">{formatPrice(plan.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {plan.features.length} fitur
                      </span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedPlan === planIdx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Plan Content */}
                  {expandedPlan === planIdx && (
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <div className="pt-4 space-y-4">
                        {/* Plan Info */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                            <select
                              value={plan.category_index}
                              onChange={(e) => updatePlan(planIdx, 'category_index', parseInt(e.target.value))}
                              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            >
                              {categories.map((cat, idx) => (
                                <option key={idx} value={idx}>{cat.category_name || `Kategori ${idx + 1}`}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Durasi</label>
                            <select
                              value={plan.duration_index}
                              onChange={(e) => updatePlan(planIdx, 'duration_index', parseInt(e.target.value))}
                              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            >
                              {durations.map((dur, idx) => (
                                <option key={idx} value={idx}>{dur.duration_label || `Durasi ${idx + 1}`}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Plan</label>
                            <input
                              type="text"
                              value={plan.plan_name}
                              onChange={(e) => updatePlan(planIdx, 'plan_name', e.target.value)}
                              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                              placeholder="Pro"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                              <input
                                type="number"
                                value={plan.price}
                                onChange={(e) => updatePlan(planIdx, 'price', e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                placeholder="850000"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
                            <textarea
                              value={plan.plan_description}
                              onChange={(e) => updatePlan(planIdx, 'plan_description', e.target.value)}
                              rows={2}
                              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none"
                              placeholder="Deskripsi plan"
                            />
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-700">Fitur</label>
                            <button
                              type="button"
                              onClick={() => addFeature(planIdx)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Tambah Fitur
                            </button>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {plan.features.map((feat, featIdx) => (
                              <div key={featIdx} className="flex items-center gap-2 group/feat">
                                <input
                                  type="text"
                                  value={feat.feature_category_name}
                                  onChange={(e) => updateFeature(planIdx, featIdx, 'feature_category_name', e.target.value)}
                                  placeholder="Kategori"
                                  className="w-40 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs"
                                />
                                <input
                                  type="text"
                                  value={feat.feature_name}
                                  onChange={(e) => updateFeature(planIdx, featIdx, 'feature_name', e.target.value)}
                                  placeholder="Nama fitur"
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeFeature(planIdx, featIdx)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover/feat:opacity-100"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delete Plan */}
                        <div className="pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => removePlan(planIdx)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus Plan Ini
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.push('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {currentStep > 1 ? 'Sebelumnya' : 'Batal'}
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => canNext() && setCurrentStep(currentStep + 1)}
                disabled={!canNext()}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-200"
              >
                Selanjutnya
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-green-200"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Pricing
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
