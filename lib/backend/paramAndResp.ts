import { CnWord, Sentence, Word } from '@/db/models/types';
import { GroupedCountResultItem } from 'sequelize';

export interface ExportParams {
  junctionTables?: string
  separate?: string
}

export interface SearchParams {
  search: string
}

export interface AddWordSynonymParams {
  lhs: string
  rhs: string
}

export interface AddWordSynonymResp {
  created: boolean
  lhs: Word
  rhs: Word
}

export interface LinkWordAndSentenceParams {
  sentenceId: string
  word: string
}

export interface LinkWordAndSentenceResp {
  created: boolean
  sentenceId: string
  word: string
}

export interface UpsertWordParams {
  note: string
  word: string
}

export interface UpsertCnWordParams {
  note: string
  word: string
}

export interface CreateSentenceParams {
  note: string
  sentence: string
}

export interface UpdateSentenceParams {
  id: string
  note: string
  sentence: string
}

export type WordSearchResp = {
  result: Word[]
};

export type CnWordSearchResp = {
  result: CnWord[]
};

export type SentenceSearchResp = {
  result: Sentence[]
};

export type GetWordParams = {
  word: string
};

export type GetWordResp = {
  word: Word | null
};

export type UpsertWordResp = {
  created: boolean
  word?: Word
};

export type GetCnWordResp = {
  word: CnWord | null
};

export type UpsertCnWordResp = {
  created: boolean
  word?: CnWord
};

export type GetSentenceParams = {
  sentence: string
};

export type GetSentenceResp = {
  sentence: Sentence | null
};

export type CreateSentenceResp = {
  sentence: Sentence
};

export type UpdateSentenceResp = {
  affectedCount: number
  sentence: {
    id: string
    note: string
    sentence: string
  }
};

export type modelCountThisMonth = {
  total: number
  result: GroupedCountResultItem[]
};

export type RecordCountThisMonthResp = {
  word: modelCountThisMonth
  cnWord: modelCountThisMonth
  sentence: modelCountThisMonth
};
