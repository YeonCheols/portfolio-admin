import { type MDEditorProps } from '@uiw/react-md-editor';

export interface EditorProps extends MDEditorProps {
  markdown: string;
  onEditorChange: (markdown: string) => void;
}
