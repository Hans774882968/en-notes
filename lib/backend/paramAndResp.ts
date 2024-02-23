import { CnWord, Sentence, SentenceIdType, Word } from '@/db/models/types';
import { TableParams, TableResp } from '../table';

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
  sentenceId: SentenceIdType
  word: string
}

export interface LinkWordAndSentenceResp {
  created: boolean
  sentenceId: SentenceIdType
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
  id: SentenceIdType
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

export type GetWordListParams = TableParams<{
  word?: string
  note?: string
  ctime?: string[]
  mtime?: string[]
}>;

export type WordTableItem = Word & {
  complexity: number
  synonymCount: number
};

export type GetWordListResp = TableResp<WordTableItem>;

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
    id: SentenceIdType
    note: string
    sentence: string
  }
};

export type modelCountThisMonth = {
  total: number
  result: Map<string, number>
};

export type DashboardRecordResultItem = {
  date: string
  learn: number
  learnOrReview: number
};

export type RecordCountThisMonthResp = {
  learn: number
  learnOrReview: number
  data: DashboardRecordResultItem[]
};

export type PieChartItem = {
  name: string
  value: number
};

export type SynonymCountResp = Array<PieChartItem>;

export type SentenceCountOfWordResp = Array<PieChartItem>;

export type WordCountOfSentenceResp = Array<PieChartItem>;

export type ComplexityResp = {
  ranges: string[]
  values: number[]
};

export type DashboardResp = {
  recordCount: {
    word: RecordCountThisMonthResp
    cnWord: RecordCountThisMonthResp
    sentence: RecordCountThisMonthResp
  }
  synonymCount: SynonymCountResp
  sentenceCountOfWord: SentenceCountOfWordResp
  wordCountOfSentence: WordCountOfSentenceResp
  wordComplexity: ComplexityResp
  sentenceComplexity: ComplexityResp
  cnWordComplexity: ComplexityResp
};
