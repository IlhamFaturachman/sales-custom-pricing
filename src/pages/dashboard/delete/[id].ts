---
import { supabase } from '../../../lib/supabase';

export async function POST({ params }: { params: { id: string } }) {
  try {
    const { error } = await supabase
      .from('pricing_pages')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return Astro.redirect('/dashboard');
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
}
---
