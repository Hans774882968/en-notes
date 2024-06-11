export const apiUrls = {
  cnWord: {
    edit: '/api/upsertCnWord',
    get: '/api/getCnWord',
    list: '/api/cnWord/list',
    search: '/api/cnWord/search'
  },
  dashboard: {
    index: '/api/dashboard/dashboard'
  },
  export: {
    index: '/api/export'
  },
  sentence: {
    create: '/api/createSentence',
    edit: '/api/updateSentence',
    get: '/api/getSentence',
    list: '/api/sentence/list',
    search: '/api/sentence/search'
  },
  word: {
    addSynonym: '/api/addWordSynonym',
    edit: '/api/upsertWord',
    get: '/api/getWord',
    linkWordAndSentence: '/api/linkWordAndSentence',
    list: '/api/word/list',
    search: '/api/word/search'
  }
};
