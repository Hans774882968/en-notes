import { KeywordDefinition } from 'ajv';
import { SentenceIdType } from '@/db/models/types';
import { enWordRegex } from '@/db/const';
import { isLegalSentenceId } from '@/db/models/sentence';

export const sentenceIdValidatorSchema: KeywordDefinition = {
  keyword: 'sentenceIdLegal',
  type: 'string',
  validate: (schema: Record<string, any>, sentenceIdData: SentenceIdType) => {
    return isLegalSentenceId(sentenceIdData.toString().trim());
  }
};

export const enWordValidatorSchema: KeywordDefinition = {
  keyword: 'wordLegal',
  type: 'string',
  validate: (schema: Record<string, any>, wordData: string) => {
    return enWordRegex.test(wordData.trim());
  }
};
