export const SUPABASE_PUBLIC_URL = 'https://riumhqlxdmsxwsjstqgl.supabase.co';

export const buildImageUrl = (path?: string | null): string => {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) {
    return `${SUPABASE_PUBLIC_URL}${path}`;
  }
  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${path}`;
};
