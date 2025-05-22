'use server';

import { supabase } from '@/lib/file/supabaseClient';
import { changeFileExt } from './changeFileName';
import { convertBufferToWebp } from './webp-converter';

export async function uploadFile(formData: FormData, folderName: string) {
  const file = formData.get('file') as File;
  if (!file) return { error: 'No file provided' };

  const webpFile = await convertBufferToWebp(file);

  // Supabase Storage에 업로드
  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
    .upload(
      folderName ? `${folderName}/${changeFileExt(file.name, 'webp')}` : changeFileExt(file.name, 'webp'),
      webpFile,
      {
        contentType: 'image/webp',
        upsert: true, // 같은 이름이면 덮어쓰기
      },
    );

  if (error) return { error: error.message };
  return { data };
}
