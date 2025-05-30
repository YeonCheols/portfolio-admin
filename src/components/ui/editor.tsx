'use client';
import MDEditor from '@uiw/react-md-editor';
import { type EditorProps } from '@/types/editor';

export function Editor({ markdown, onEditorChange, ...props }: EditorProps) {
  return <MDEditor autoFocus value={markdown} onChange={e => onEditorChange(e as string)} {...props} />;
}
