import { supabase } from '../../../lib/supabase';

export async function POST({ params }: { params: { id: string } }) {
  const pageId = params.id;

  try {
    const { data: plans } = await supabase
      .from('pricing_plans')
      .select('id')
      .eq('pricing_page_id', pageId);

    const planIds = plans?.map(p => p.id) || [];

    if (planIds.length > 0) {
      const { error: featError } = await supabase
        .from('pricing_features')
        .delete()
        .in('pricing_plan_id', planIds);

      if (featError) throw featError;
    }

    const { error: planError } = await supabase
      .from('pricing_plans')
      .delete()
      .eq('pricing_page_id', pageId);

    if (planError) throw planError;

    const { error: catError } = await supabase
      .from('pricing_categories')
      .delete()
      .eq('pricing_page_id', pageId);

    if (catError) throw catError;

    const { error: durError } = await supabase
      .from('pricing_durations')
      .delete()
      .eq('pricing_page_id', pageId);

    if (durError) throw durError;

    const { error: pageError } = await supabase
      .from('pricing_pages')
      .delete()
      .eq('id', pageId);

    if (pageError) throw pageError;

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
