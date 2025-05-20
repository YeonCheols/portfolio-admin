// 파일 확장자를 수정해서 반환
export function changeFileExt(filename: string, newExt: 'webp' | 'jpg' | 'png') {
  const dotExt = newExt.startsWith('.') ? newExt : '.' + newExt;
  const base = filename.substring(0, filename.lastIndexOf('.'));
  return base + dotExt;
}
