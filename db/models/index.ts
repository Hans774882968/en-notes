import { sentence } from './sentence';
import { synonym } from './synonym';
import { word } from './word';
import { wordSentence } from './wordSentence';

export { cnWord } from './cnWord';
export { word } from './word';
export { sentence } from './sentence';
export { wordSentence } from './wordSentence';
export { synonym } from './synonym';

function initRelations() {
  word.belongsToMany(sentence, { through: wordSentence });
  sentence.belongsToMany(word, { through: wordSentence });

  word.belongsToMany(word, { as: 'itsSynonyms', foreignKey: 'lhs', otherKey: 'rhs', through: synonym });
  word.belongsToMany(word, { as: 'synonymsOfIt', foreignKey: 'rhs', otherKey: 'lhs', through: synonym });
}

initRelations();
