import { Base64 } from 'js-base64';
import { SentenceIdType } from '@/db/models/types';

export interface BelongSentence {
  id: SentenceIdType
  text: string
}

export function encodeSentenceInfo({ id, text }: BelongSentence) {
  return Base64.encode(`${id}。 ${text}`);
}

export interface DecodedSentence {
  id: string
  text: string
}

export function decodeSentenceInfo(input: string): DecodedSentence {
  try {
    const out = Base64.decode(input);
    const [id = '', text = ''] = out.split('。 ');
    const resId = text ? id : '';
    return { id: resId, text };
  } catch (e) {
    return { id: '', text: '' };
  }
}
