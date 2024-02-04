import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { KeyboardEventHandler } from 'react';
import dynamic from 'next/dynamic';
import rehypeSanitize from 'rehype-sanitize';
import styles from './md-editor-custom.module.scss';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface EditorProps {
  value?: string
  onChange?: (val?: string) => void
  onKeyDown?: KeyboardEventHandler
}

export default function MarkdownEditor({ value, onChange, onKeyDown }: EditorProps) {
  return (
    <MDEditor
      className={styles.editor}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]]
      }}
      height={500}
      spellCheck={true} // seems useless
    />
  );
}
