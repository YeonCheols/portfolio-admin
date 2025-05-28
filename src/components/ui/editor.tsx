'use client';
import MDEditor from '@uiw/react-md-editor';

export function Editor({ markdown, onChange }: { markdown: string; onChange: (markdown: string) => void }) {
  return <MDEditor autoFocus height={1000} value={markdown} onChange={e => onChange(e as string)} />;
}
