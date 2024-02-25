import {
  CN_WORDS_MD,
  SENTENCES_MD,
  SYNONYMS_MD,
  WORDS_MD,
  WORD_SENTENCES_MD
} from '@/lib/const';
import {
  cnWord,
  sentence,
  synonym,
  word,
  wordSentence
} from '../models';
import fs from 'fs';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());

type writeTableParams = {
  tableContent: string
  force: boolean
};

type entryMethodParams = {
  force: boolean
  sentenceForce: boolean
}

function writeToTableWord({ tableContent, force }: writeTableParams) {
  const separator = '\n\n## ';
  if (!tableContent.startsWith(separator)) {
    throw new Error(`wordsTableContent should start with "${separator}", but got: ${tableContent.substring(0, 5)}`);
  }
  tableContent.split(separator).forEach((recordStr) => {
    const idx = recordStr.indexOf('\n\n');
    if (idx === -1) return;
    const wordKey = recordStr.substring(0, idx).trim();
    const note = recordStr.substring(idx + 2).trim();
    if (force) {
      word.upsert({
        note,
        word: wordKey
      });
      return;
    }
    word.findOrCreate({
      defaults: {
        note
      },
      where: {
        word: wordKey
      }
    });
  });
}

function writeToTableCnWord({ tableContent, force }: writeTableParams) {
  const separator = '\n\n## ';
  if (!tableContent.startsWith(separator)) {
    throw new Error(`cnWordsTableContent should start with "${separator}", but got: ${tableContent.substring(0, 5)}`);
  }
  tableContent.split(separator).forEach((recordStr) => {
    const idx = recordStr.indexOf('\n\n');
    if (idx === -1) return;
    const wordKey = recordStr.substring(0, idx).trim();
    const note = recordStr.substring(idx + 2).trim();
    if (force) {
      cnWord.upsert({
        note,
        word: wordKey
      });
      return;
    }
    cnWord.findOrCreate({
      defaults: {
        note
      },
      where: {
        word: wordKey
      }
    });
  });
}

function writeToTableSentence({ tableContent, force }: writeTableParams) {
  const separator = '\n\n## ';
  if (!tableContent.startsWith(separator)) {
    throw new Error(`sentencesTableContent should start with "${separator}", but got: ${tableContent.substring(0, 5)}`);
  }
  tableContent.split(separator).forEach(async(recordStr) => {
    const idx = recordStr.indexOf('\n\n');
    if (idx === -1) return;
    const sentenceStr = recordStr.substring(0, idx).trim();
    const note = recordStr.substring(idx + 2).trim();
    const originalSentenceRecords = await sentence.findAll({
      where: {
        sentence: sentenceStr
      }
    });
    if (!originalSentenceRecords.length) {
      await sentence.create({
        note,
        sentence: sentenceStr
      });
      return;
    }
    if (originalSentenceRecords.length > 1) {
      console.warn(`found duplicate sentences! These sentence records won't be updated: "${sentence}"`);
      return;
    }
    if (force) {
      sentence.update(
        {
          note
        },
        {
          where: {
            sentence: sentenceStr
          }
        }
      );
    }
  });
}

function writeToTableWordSentence({ tableContent, force }: writeTableParams) {
  tableContent.split('\n').forEach(async(recordStr) => {
    const idx = recordStr.indexOf('|');
    if (idx === -1) return;
    const sentenceId = recordStr.substring(0, idx).trim().toLowerCase();
    const wordKey = recordStr.substring(idx + 1).trim();
    const wordRecord = await word.findByPk(wordKey);
    if (!wordRecord) {
      return;
    }

    const sentenceRecord = await sentence.findByPk(sentenceId);
    if (!sentenceRecord) {
      return;
    }

    if (force) {
      wordSentence.upsert({
        sentenceId,
        wordWord: wordKey
      });
      return;
    }
    wordSentence.findOrCreate({
      where: {
        sentenceId,
        wordWord: wordKey
      }
    });
  });
}

function writeToTableSynonym({ tableContent, force }: writeTableParams) {
  tableContent.split('\n').forEach(async(recordStr) => {
    const idx = recordStr.indexOf('。');
    if (idx === -1) return;
    const lhs = recordStr.substring(0, idx).trim().toLowerCase();
    const rhs = recordStr.substring(idx + 1).trim().toLowerCase();
    const lhsRecord = await word.findByPk(lhs);
    if (!lhsRecord) {
      return;
    }

    const rhsRecord = await word.findByPk(rhs);
    if (!rhsRecord) {
      return;
    }

    const rhsLinkCandidates = [lhsRecord, ...await (lhsRecord as any).getItsSynonyms()];
    const lhsLinkCandidates = [rhsRecord, ...await (rhsRecord as any).getItsSynonyms()];

    await Promise.all([
      Promise.all(rhsLinkCandidates.map(async(lhsSynonym) => {
        const lhsSynonymPk = lhsSynonym.getDataValue('word');
        if (lhsSynonymPk === rhs) return;
        await synonym.upsert({
          lhs: lhsSynonymPk,
          rhs
        });
        await synonym.upsert({
          lhs: rhs,
          rhs: lhsSynonymPk
        });
      })),
      Promise.all(lhsLinkCandidates.map(async(rhsSynonym) => {
        const rhsSynonymPk = rhsSynonym.getDataValue('word');
        if (rhsSynonymPk === lhs) return;
        await synonym.upsert({
          lhs,
          rhs: rhsSynonymPk
        });
        await synonym.upsert({
          lhs: rhsSynonymPk,
          rhs: lhs
        });
      }))
    ]);
  });
}

function importFromSeparateMds({ force, sentenceForce }: entryMethodParams) {
  function wordsMd() {
    const wordsMdPath = path.resolve(appDirectory, WORDS_MD);
    if (!fs.existsSync(wordsMdPath)) return;
    const wordsMdStr = fs.readFileSync(wordsMdPath, 'utf-8');
    const wordsMdIdx  = wordsMdStr.indexOf('\n\n');
    if (wordsMdStr.substring(0, wordsMdIdx).trim().toLowerCase() !== '[toc]') {
      throw new Error(`${wordsMdPath} content should start with "[toc]"`);
    }
    const wordsTableContent = wordsMdStr.substring(wordsMdIdx).trim();
    writeToTableWord({ force, tableContent: wordsTableContent });
  }

  function cnWordsMd() {
    const cnWordsMdPath = path.resolve(appDirectory, CN_WORDS_MD);
    if (!fs.existsSync(cnWordsMdPath)) return;
    const cnWordsMdStr = fs.readFileSync(cnWordsMdPath, 'utf-8');
    const cnWordsMdIdx  = cnWordsMdStr.indexOf('\n\n');
    if (cnWordsMdStr.substring(0, cnWordsMdIdx).trim().toLowerCase() !== '[toc]') {
      throw new Error(`${cnWordsMdPath} content should start with "[toc]"`);
    }
    const cnWordsTableContent = cnWordsMdStr.substring(cnWordsMdIdx).trim();
    writeToTableCnWord({ force, tableContent: cnWordsTableContent });
  }

  function sentencesMd() {
    const sentencesMdPath = path.resolve(appDirectory, SENTENCES_MD);
    if (!fs.existsSync(sentencesMdPath)) return;
    const sentencesMdStr = fs.readFileSync(sentencesMdPath, 'utf-8');
    const sentencesMdIdx  = sentencesMdStr.indexOf('\n\n');
    if (sentencesMdStr.substring(0, sentencesMdIdx).trim().toLowerCase() !== '[toc]') {
      throw new Error(`${sentencesMdPath} content should start with "[toc]"`);
    }
    const sentencesTableContent = sentencesMdStr.substring(sentencesMdIdx).trim();
    writeToTableSentence({ force: sentenceForce, tableContent: sentencesTableContent });
  }

  function wordSentencesMd() {
    const wordSentencesMdPath = path.resolve(appDirectory, WORD_SENTENCES_MD);
    if (!fs.existsSync(wordSentencesMdPath)) return;
    const wordSentencesMdStr = fs.readFileSync(wordSentencesMdPath, 'utf-8');
    const wordSentencesTableContent = wordSentencesMdStr.trim();
    writeToTableWordSentence({ force, tableContent: wordSentencesTableContent });
  }

  function synonymsMd() {
    const synonymsMdPath = path.resolve(appDirectory, SYNONYMS_MD);
    if (!fs.existsSync(synonymsMdPath)) return;
    const synonymsMdStr = fs.readFileSync(synonymsMdPath, 'utf-8');
    const synonymsTableContent = synonymsMdStr.trim();
    writeToTableSynonym({ force, tableContent: synonymsTableContent });
  }

  wordsMd();
  cnWordsMd();
  sentencesMd();
  wordSentencesMd();
  synonymsMd();
}

function importFromMergedMd({ force, sentenceForce }: entryMethodParams) {
  const mergedMdPath = path.resolve(appDirectory, 'en_notes.md');
  const mdStr = fs.readFileSync(mergedMdPath, 'utf-8');
  const tableStrs = mdStr.split('\n\n# ');
  if (!tableStrs.length || tableStrs[0].trim().toLowerCase() !== '[toc]') {
    throw new Error(`${mergedMdPath} content should start with "[toc]"`);
  }
  tableStrs.slice(1).forEach((tableStr) => {
    const idx = tableStr.indexOf('\n\n');
    if (idx === -1) return;
    const tableDescriptor = tableStr.substring(0, idx).trim();
    const tableContent = tableStr.substring(idx);
    if (tableDescriptor === 'words') writeToTableWord({ force, tableContent });
    else if (tableDescriptor === 'cnWords') writeToTableCnWord({ force, tableContent });
    else if (tableDescriptor === 'sentences') writeToTableSentence({ force: sentenceForce, tableContent });
    else if (tableDescriptor === 'wordSentences') writeToTableWordSentence({ force, tableContent });
    else if (tableDescriptor === 'synonyms') writeToTableSynonym({ force, tableContent });
  });
}

function main() {
  const force = true, sentenceForce = true;
  if (process.argv[0] === 'separate') {
    importFromSeparateMds({ force, sentenceForce });
    return;
  }
  importFromMergedMd({ force, sentenceForce });
}

main();
