import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { KeyboardEventHandler, useState } from 'react';
import { Statistics } from '@uiw/react-md-editor';
import { getLineCount } from '@/lib/utils';
import dynamic from 'next/dynamic';
import rehypeSanitize from 'rehype-sanitize';
import styles from './md-editor-custom.module.scss';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

// TODO: 目前似乎无法做到 disable editor https://github.com/uiwjs/react-md-editor/issues/269

interface EditorProps {
  value?: string
  onChange?: (val?: string) => void
  onKeyDown?: KeyboardEventHandler
  highlightBorder?: boolean
}

export default function MarkdownEditor({ value, onChange, onKeyDown, highlightBorder }: EditorProps) {
  const [lines, setLines] = useState(getLineCount(value));
  const [characters, setCharacters] = useState(value ? value.length : 0);

  const [lastValue, setLastValue] = useState('');

  if (value !== lastValue) {
    setLastValue(value || '');
    setLines(getLineCount(value));
    setCharacters(value ? value.length : 0);
  }

  // 目前 onStatistics 可有可无
  const onStatistics = (data: Statistics) => {
    setLines(data.lineCount);
    setCharacters(data.length);
  };

  return (
    <div>
      <MDEditor
        className={`${styles.editor} ${highlightBorder ? styles.modified : ''}`}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]]
        }}
        height={500}
        onStatistics={onStatistics}
      />
      <div className={styles.statistics}>
        <span>lines: {lines}</span>
        <span>characters: {characters}</span>
      </div>
    </div>
  );
}
