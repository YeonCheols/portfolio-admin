'use client';
import toast from 'react-hot-toast';

// 이미지 파일 확장자 유효성체크 함수
export function validateFileType(file: File) {
  const fileName = file.name;
  const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

  if (['jpg', 'jpeg', 'png'].includes(ext)) {
    return true;
  }
  toast.error('jpg, jpeg, png 파일만 업로드할 수 있습니다.');
  return false;
}

export function checkFileSize(file: File, maxSizeMB: number): boolean {
  const maxSize = maxSizeMB * 1024 * 1024;

  if (file.size <= maxSize) {
    return true;
  }
  toast.error(`파일은 최대 ${maxSizeMB}MB 까지 업로드할 수 있습니다.`);
  return false;
}

export function validateFileCommon(e: React.FormEvent<HTMLInputElement>, maxSizeMB: number = 1) {
  const file = e.currentTarget.files?.[0] as File;
  const isValid = file && validateFileType(file) && checkFileSize(file, maxSizeMB);

  if (!isValid) {
    e.currentTarget.value = '';
    return false;
  }
  return true;
}
