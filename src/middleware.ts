import { defineMiddleware } from 'astro:middleware';
import { supabase } from './lib/supabase';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const protectedPaths = ['/dashboard'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    const accessToken = context.cookies.get('sb-access-token')?.value;

    if (!accessToken) {
      return context.redirect('/login');
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      context.cookies.delete('sb-access-token', { path: '/' });
      return context.redirect('/login');
    }

    context.locals.user = user;
  }

  return next();
});
