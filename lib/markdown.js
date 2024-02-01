import * as DOMPurify from 'dompurify';
import { marked } from 'marked';

export function parseMarkdown(data) {
  try {
    const unsafeMarkdownHTMLCode = marked.parse(data);
    return DOMPurify.sanitize(unsafeMarkdownHTMLCode);
  } catch (e) {
    return '';
  }
}
