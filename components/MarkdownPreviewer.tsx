import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import dynamic from 'next/dynamic';
import rehypeSanitize from 'rehype-sanitize';
import styles from './md-editor-custom.module.scss';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface Props {
  value?: string
}

export default function MarkdownPreviewer({ value }: Props) {
  return (
    <MDEditor
      className={styles.editor}
      value={value}
      preview="preview"
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]]
      }}
      height={350}
      spellCheck={true} // seems useless
    />
  );
}
