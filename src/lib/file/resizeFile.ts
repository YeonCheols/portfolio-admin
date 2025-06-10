'use client';
import imageCompression from 'browser-image-compression';
import { downloadFile } from './downloadFile';

export async function resizeFile(currentFile: File, maxSizeMB: number = 1) {
  const file = await imageCompression(currentFile, {
    maxSizeMB,
    useWebWorker: true,
  });

  downloadFile({ type: 'file', file });
}
