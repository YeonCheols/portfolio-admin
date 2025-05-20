'use server';

const sharp = require('sharp');
/**
 * 이미지 버퍼를 무손실 WebP로 변환하고 변환된 버퍼를 반환하는 함수
 * @param {File} originFile - 변환할 파일
 * @returns {Promise<Buffer>} 변환된 WebP 이미지 버퍼
 */
export async function convertBufferToWebp(originFile: File) {
  const arrayBuffer = await originFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return await sharp(buffer).webp({ lossless: true }).toBuffer();
}
