'use server';

import { supabase } from '@/lib/file/supabaseClient';

// fileName: 업로드 시 저장한 파일명
export async function getFileUrl(fileName: string) {
  const { data } = await supabase.storage.from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!).getPublicUrl(fileName);

  return { url: data.publicUrl };
}
