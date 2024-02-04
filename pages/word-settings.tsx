import { AddWordSynonymResp, LinkWordAndSentenceResp, SentenceSearchResp, WordSearchResp } from '@/lib/backend/paramAndResp';
import { Sentence, Word } from '@/db/models/types';
import { btnLayout, formLayout } from '@/lib/const';
import { useState } from 'react';
import AutoComplete from 'antd/lib/auto-complete';
import Button from 'antd/lib/button';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import Message from 'antd/lib/message';
import Request from '@/lib/frontend/request';
import Select from 'antd/lib/select';
import styles from './word-settings.module.scss';

function LinkWordAndSentenceForm() {
  const [word, setWord] = useState('');
  const [sentenceId, setSentenceId] = useState('');
  const [wordSearchResult, setWordSearchResult] = useState<Word[]>([]);
  const [sentenceSearchResult, setSentenceSearchResult] = useState<Sentence[]>([]);
  const wordSearchResultOptions = wordSearchResult.map((wd) => ({ label: wd.word, value: wd.word }));
  const sentenceSearchResultOptions = sentenceSearchResult.map((st) => ({ label: st.sentence, value: st.id }));

  const canNotSubmit = !word || !sentenceId;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWordChange = (newWord: string) => {
    setWord(newWord);
  };

  const handleWordSearch = async (newWord: string) => {
    try {
      const { result } = await Request.get<WordSearchResp>({ params: { search: newWord }, url: '/api/word/search' });
      setWordSearchResult(result);
    } catch (e) {
      return;
    }
  };

  const handleSentenceChange = (newSentenceId: string) => {
    setSentenceId(newSentenceId);
  };

  const handleSentenceSearch = async (newSentence: string) => {
    try {
      const { result } = await Request.get<SentenceSearchResp>({ params: { search: newSentence }, url: '/api/sentence/search' });
      setSentenceSearchResult(result);
    } catch (e) {
      return;
    }
  };

  const onFinish = async () => {
    const submitWord = word.trim().toLowerCase();

    const params = { sentenceId, word: submitWord };
    setIsSubmitting(true);
    try {
      const { created } = await Request.post<LinkWordAndSentenceResp>({ data: params, url: '/api/linkWordAndSentence' });
      const msg = created ? 'Link success' : 'This word and sentence has been previously linked';
      Message.success({ content: msg });
    } catch (e) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      {...formLayout}
      onFinish={onFinish}
    >
      <Form.Item label="Word">
        <AutoComplete
          placeholder="Search word"
          options={wordSearchResultOptions}
          onChange={handleWordChange}
          onSearch={handleWordSearch}
        />
      </Form.Item>
      <Form.Item label="Sentence">
        <Select
          placeholder="Search sentence"
          options={sentenceSearchResultOptions}
          onChange={handleSentenceChange}
          onSearch={handleSentenceSearch}
          showSearch
          filterOption={false}
        />
      </Form.Item>
      <Form.Item {...btnLayout}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={canNotSubmit}
          loading={isSubmitting}
        >
          Link
        </Button>
      </Form.Item>
    </Form>
  );
}

function AddSynonymForm() {
  const [lhs, setLhs] = useState('');
  const [rhs, setRhs] = useState('');
  const [lhsWordSearchResult, setLhsWordSearchResult] = useState<Word[]>([]);
  const [rhsWordSearchResult, setRhsWordSearchResult] = useState<Word[]>([]);
  function getWordSearchResultOptions(wordSearchResult: Word[]) {
    return wordSearchResult.map((wd) => ({ label: wd.word, value: wd.word }));
  }
  const lhsWordSearchResultOptions = getWordSearchResultOptions(lhsWordSearchResult);
  const rhsWordSearchResultOptions = getWordSearchResultOptions(rhsWordSearchResult);

  const canNotSubmit = !lhs || !rhs;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLhsWordChange = (newWord: string) => {
    setLhs(newWord);
  };

  const handleLhsWordSearch = async (newWord: string) => {
    try {
      const { result } = await Request.get<WordSearchResp>({ params: { search: newWord }, url: '/api/word/search' });
      setLhsWordSearchResult(result);
    } catch (e) {
      return;
    }
  };

  const handleRhsWordChange = (newWord: string) => {
    setRhs(newWord);
  };

  const handleRhsWordSearch = async (newWord: string) => {
    try {
      const { result } = await Request.get<WordSearchResp>({ params: { search: newWord }, url: '/api/word/search' });
      setRhsWordSearchResult(result);
    } catch (e) {
      return;
    }
  };

  const onFinish = async () => {
    const submitLhs = lhs.trim().toLowerCase();
    const submitRhs = rhs.trim().toLowerCase();
    if (submitLhs === submitRhs) {
      Message.error({
        content: `Word 1 and Word 2 should not be equal, but got "${submitLhs}"`
      });
      return;
    }

    const params = { lhs: submitLhs, rhs: submitRhs };
    setIsSubmitting(true);
    try {
      const { created } = await Request.post<AddWordSynonymResp>({ data: params, url: '/api/addWordSynonym' });
      const msg = created ? 'Add synonym success' : 'This synonym pair has been previously added';
      Message.success({ content: msg });
    } catch (e) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      {...formLayout}
      onFinish={onFinish}
    >
      <Form.Item label="Word 1">
        <AutoComplete
          placeholder="Search word"
          options={lhsWordSearchResultOptions}
          onChange={handleLhsWordChange}
          onSearch={handleLhsWordSearch}
        />
      </Form.Item>
      <Form.Item label="Word 2">
        <AutoComplete
          placeholder="Search word"
          options={rhsWordSearchResultOptions}
          onChange={handleRhsWordChange}
          onSearch={handleRhsWordSearch}
        />
      </Form.Item>
      <Form.Item {...btnLayout}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={canNotSubmit}
          loading={isSubmitting}
        >
          Add Synonym
        </Button>
      </Form.Item>
    </Form>
  );
}

export default function WordSettings() {
  return (
    <EnLayout>
      <div className={styles.wordSettings}>
        <AddSynonymForm />
        <LinkWordAndSentenceForm />
      </div>
    </EnLayout>
  );
}
