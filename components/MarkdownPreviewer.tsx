import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { getLineCount } from '@/lib/utils';
import Skeleton from 'antd/lib/skeleton';
import dynamic from 'next/dynamic';
import rehypeSanitize from 'rehype-sanitize';
import styles from './md-editor-custom.module.scss';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { loading: () => <Skeleton paragraph={{ rows: 5 }} active />, ssr: false }
);

interface Props {
  value?: string
}

export default function MarkdownPreviewer({ value }: Props) {
  const lines = getLineCount(value);
  const characters = value ? value.length : 0;

  return (
    <div>
      <MDEditor
        className={styles.editor}
        value={value}
        preview="preview"
        hideToolbar={true}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]]
        }}
        height={500}
      />
      <div className={styles.statistics}>
        <span>lines: {lines}</span>
        <span>characters: {characters}</span>
      </div>
    </div>
  );
}
