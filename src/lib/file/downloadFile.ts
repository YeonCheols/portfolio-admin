'use client';

interface DownloadFileProps {
  type: 'file' | 'url';
  file?: File;
  url?: string;
  downloadFileName?: string;
}

export function downloadFile({ type, file, url, downloadFileName }: DownloadFileProps) {
  if (type === 'file' && file) {
    const url = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName || file.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  if (type === 'url' && url) {
    const a = document.createElement('a');
    a.href = url + '?download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
