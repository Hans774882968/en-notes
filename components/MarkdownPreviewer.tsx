import '@uiw/react-md-editor/markdown-editor.css';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface Props {
  value?: string
}

export default function MarkdownPreviewer({ value }: Props) {
  return (
    <MDEditor value={value} preview="preview" />
  );
}
