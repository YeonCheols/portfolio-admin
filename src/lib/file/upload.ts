'use server';

import { supabase } from '@/lib/file/supabaseClient';

export async function uploadFile(formData: FormData, folderName: string) {
  const file = formData.get('file') as File;
  if (!file) return { error: 'No file provided' };

  // 파일명을 고유하게 생성(예시)
  const fileName = `${Date.now()}_${file.name}`;

  // Supabase Storage에 업로드
  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
    .upload(folderName ? `${folderName}/${fileName}` : fileName, file, {
      upsert: true, // 같은 이름이면 덮어쓰기
    });

  if (error) return { error: error.message };
  return { data };
}
