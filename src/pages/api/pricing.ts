---
import { supabase } from '../../lib/supabase';

export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.json();
    
    // Create pricing page
    const { data: page, error: pageError } = await supabase
      .from('pricing_pages')
      .insert({
        client_name: data.client_name,
        company_name: data.company_name,
        slug: data.slug,
        status: data.status,
        header_title: data.header_title,
        valid_until: data.valid_until
      })
      .select()
      .single();

    if (pageError) throw pageError;

    // Create categories
    for (let i = 0; i < data.categories.length; i++) {
      const cat = data.categories[i];
      const { data: category, error: catError } = await supabase
        .from('pricing_categories')
        .insert({
          pricing_page_id: page.id,
          category_name: cat.name,
          category_icon: cat.icon,
          sort_order: i
        })
        .select()
        .single();

      if (catError) throw catError;

      // Create durations
      for (let j = 0; j < data.durations.length; j++) {
        const dur = data.durations[j];
        const { data: duration, error: durError } = await supabase
          .from('pricing_durations')
          .insert({
            pricing_page_id: page.id,
            duration_label: dur.label,
            duration_months: dur.months,
            sort_order: j
          })
          .select()
          .single();

        if (durError) throw durError;

        // Create plans for this category and duration
        const categoryPlans = data.plans.filter(
          (p: any) => p.categoryIndex === i && p.durationIndex === j
        );

        for (let k = 0; k < categoryPlans.length; k++) {
          const plan = categoryPlans[k];
          const { data: planData, error: planError } = await supabase
            .from('pricing_plans')
            .insert({
              pricing_page_id: page.id,
              pricing_category_id: category.id,
              pricing_duration_id: duration.id,
              plan_name: plan.name,
              plan_description: plan.description,
              price: plan.price,
              price_suffix: plan.priceSuffix,
              cta_text: plan.ctaText,
              cta_url: plan.ctaUrl,
              sort_order: k
            })
            .select()
            .single();

          if (planError) throw planError;

          // Create features
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
      }
    }

    return new Response(JSON.stringify({ success: true, id: page.id }), {
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
