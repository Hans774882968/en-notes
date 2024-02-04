export const UPSERT_WORD_EXCEPTION = (e) => ({
  msg: e.message || 'upsert word exception',
  retcode: 1500
});

export const WORD_NOT_FOUND = (word) => ({
  msg: `word "${word}" not found`,
  retcode: 1600
});

export const LHS_RHS_SHOULD_NOT_EQUAL = (word) => ({
  msg: `Word 1 and Word 2 should not be equal, but got "${word}"`,
  retcode: 1600
});

export const UPSERT_CN_WORD_EXCEPTION = (e) => ({
  msg: e.message || 'upsert CN word exception',
  retcode: 2500
});

export const UPDATE_SENTENCE_EXCEPTION = (e) => ({
  msg: e.message || 'upsert sentence exception',
  retcode: 3500
});

export const SENTENCE_NOT_FOUND = (id) => ({
  msg: `sentence "${id}" not found`,
  retcode: 3600
});

export const CREATE_SENTENCE_EXCEPTION = (e) => ({
  msg: e.message || 'create sentence exception',
  retcode: 3700
});

export const LINK_WORD_SENTENCE_EXCEPTION = (e) => ({
  msg: e.message || 'link word sentence exception',
  retcode: 4500
});

export const ADD_WORD_SYNONYM_EXCEPTION = (e) => ({
  msg: e.message || 'add word synonym exception',
  retcode: 5500
});
