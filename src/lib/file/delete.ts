'use server';

import { supabase } from './supabaseClient';

/**
 * Supabase public URL 배열에서 파일 경로만 일괄 추출하는 함수
 * @param {string[]} publicUrls - Supabase public URL 배열
 * @param {string} bucketName - 버킷 이름 (예: 'product_img')
 * @returns {string[]} 파일 경로 배열 (예: ['user1/abc.jpg', ...])
 */
function extractSupabasePaths(publicUrls: string[]) {
  const marker = `/object/public/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/`;
  return publicUrls
    .map(url => {
      const idx = url.indexOf(marker);
      if (idx === -1) return null;
      return url.substring(idx + marker.length);
    })
    .filter(Boolean) as string[];
}

// 업로드한 파일 URL 배열로 요청
export const deleteFile = async (filePaths: string[]) => {
  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
    .remove(extractSupabasePaths(filePaths));
  if (error) throw error;
  return data;
};
