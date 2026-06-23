'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { PricingPage } from '@/types/pricing'

export default function DashboardPage() {
  const [pricingPages, setPricingPages] = useState<PricingPage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchPricingPages = useCallback(async () => {
    const { data, error } = await supabase
      .from('pricing_pages')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPricingPages(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchPricingPages()
  }, [fetchPricingPages])

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pricing ini?')) return

    const { error } = await supabase
      .from('pricing_pages')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchPricingPages()
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('pricing_pages')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      fetchPricingPages()
    }
  }

  const handleDuplicate = async (page: PricingPage) => {
    const newSlug = prompt('Masukkan slug baru:', `${page.slug}-copy`)
    if (!newSlug) return

    const newClientName = prompt('Masukkan nama client baru:', `${page.client_name} (Copy)`)
    if (!newClientName) return

    const { data: fullPage } = await supabase
      .from('pricing_pages')
      .select(`
        *,
        categories:pricing_categories(*),
        durations:pricing_durations(*),
        plans:pricing_plans(*, features:pricing_features(*))
      `)
      .eq('id', page.id)
      .single()

    if (!fullPage) return

    const { data: newPage, error: pageError } = await supabase
      .from('pricing_pages')
      .insert({
        slug: newSlug,
        client_name: newClientName,
        company_name: fullPage.company_name,
        header_title: fullPage.header_title,
        status: 'draft',
        valid_until: fullPage.valid_until,
      })
      .select()
      .single()

    if (pageError || !newPage) {
      alert('Gagal menduplikasi pricing')
      return
    }

    const { data: newCategories } = await supabase
      .from('pricing_categories')
      .insert(
        fullPage.categories.map((c: any) => ({
          pricing_page_id: newPage.id,
          category_name: c.category_name,
          category_icon: c.category_icon,
          is_active: c.is_active,
          sort_order: c.sort_order,
        }))
      )
      .select()

    const { data: newDurations } = await supabase
      .from('pricing_durations')
      .insert(
        fullPage.durations.map((d: any) => ({
          pricing_page_id: newPage.id,
          duration_label: d.duration_label,
          duration_months: d.duration_months,
          is_active: d.is_active,
          sort_order: d.sort_order,
        }))
      )
      .select()

    if (newCategories && newDurations) {
      for (const plan of fullPage.plans) {
        const categoryIndex = fullPage.categories.findIndex((c: any) => c.id === plan.pricing_category_id)
        const durationIndex = fullPage.durations.findIndex((d: any) => d.id === plan.pricing_duration_id)

        const { data: newPlan } = await supabase
          .from('pricing_plans')
          .insert({
            pricing_page_id: newPage.id,
            pricing_category_id: newCategories[categoryIndex]?.id,
            pricing_duration_id: newDurations[durationIndex]?.id,
            plan_name: plan.plan_name,
            plan_description: plan.plan_description,
            price: plan.price,
            price_suffix: plan.price_suffix,
            cta_text: plan.cta_text,
            cta_url: plan.cta_url,
            sort_order: plan.sort_order,
          })
          .select()
          .single()

        if (newPlan && plan.features) {
          await supabase.from('pricing_features').insert(
            plan.features.map((f: any) => ({
              pricing_plan_id: newPlan.id,
              feature_category_name: f.feature_category_name,
              feature_name: f.feature_name,
              sort_order: f.sort_order,
            }))
          )
        }
      }
    }

    fetchPricingPages()
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; dot: string; label: string }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400', label: 'Draft' },
      published: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Published' },
      expired: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Expired' },
      archived: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Archived' },
    }
    return configs[status] || configs.draft
  }

  const stats = {
    total: pricingPages.length,
    published: pricingPages.filter(p => p.status === 'published').length,
    draft: pricingPages.filter(p => p.status === 'draft').length,
    expired: pricingPages.filter(p => p.status === 'expired').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola pricing page untuk client Anda</p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-sm shadow-orange-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Pricing Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Pricing</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              <p className="text-xs text-gray-500">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              <p className="text-xs text-gray-500">Draft</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
              <p className="text-xs text-gray-500">Expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Pricing</h2>
        </div>
        
        {pricingPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada pricing</h3>
            <p className="text-sm text-gray-500 mb-6">Buat pricing page pertama untuk client Anda</p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Pricing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dibuat
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pricingPages.map((page) => {
                  const statusConfig = getStatusConfig(page.status)
                  return (
                    <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{page.client_name}</p>
                          {page.company_name && (
                            <p className="text-xs text-gray-500">{page.company_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          /p/{page.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={page.status}
                          onChange={(e) => handleStatusChange(page.id, e.target.value)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border-0 cursor-pointer focus:ring-2 focus:ring-orange-500`}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="expired">Expired</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {page.valid_until
                          ? new Date(page.valid_until).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(page.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/edit/${page.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDuplicate(page)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Duplicate
                          </button>
                          {page.status === 'published' && (
                            <a
                              href={`/p/${page.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Preview
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(page.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
