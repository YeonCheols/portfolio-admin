'use client';
import toast from 'react-hot-toast';

export function validateFileType(file: File) {
  if (!file) return;

  // 파일 확장자 추출
  const fileName = file.name;
  const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

  if (['jpg', 'jpeg', 'png'].includes(ext)) return true;

  setTimeout(() => {
    toast.error('jpg, jpeg, png 파일만 업로드할 수 있습니다.');
  }, 1000);
  return false;
}
