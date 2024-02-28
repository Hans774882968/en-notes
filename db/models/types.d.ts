export type Word = {
  word: string
  note: string
  ctime: string
  mtime: string
  sentences: Sentence[]
  itsSynonyms: Word[]
};

export type SentenceIdType = number | string;

export type Sentence = {
  id: SentenceIdType
  note: string
  sentence: string
  ctime: string
  mtime: string
  words: Word[]
};

export type CnWord = {
  word: string
  note: string
  ctime: string
  mtime: string
};
