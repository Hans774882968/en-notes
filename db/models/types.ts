export type Word = {
  word: string
  note: string
  ctime: string
  mtime: string
  sentences: Sentence[]
  itsSynonyms: Word[]
};

export type Sentence = {
  id: string
  note: string
  sentence: string
  ctime: string
  mtime: string
};

export type CnWord = {
  word: string
  note: string
  ctime: string
  mtime: string
};
