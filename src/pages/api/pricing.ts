import { supabase } from '../../lib/supabase';

export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.json();

    if (!data.client_name || !data.company_name || !data.slug || !data.header_title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: existingPage } = await supabase
      .from('pricing_pages')
      .select('id')
      .eq('slug', data.slug)
      .maybeSingle();

    if (existingPage) {
      return new Response(
        JSON.stringify({ error: 'Slug already exists. Please use a different slug.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    const categoryIds: string[] = [];
    for (let i = 0; i < (data.categories || []).length; i++) {
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

    const durationIds: string[] = [];
    for (let j = 0; j < (data.durations || []).length; j++) {
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

    for (let k = 0; k < (data.plans || []).length; k++) {
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

      for (let l = 0; l < (plan.features || []).length; l++) {
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
