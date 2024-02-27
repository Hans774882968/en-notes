import { DEBOUNCE_DEFAULT_OPTION, DEBOUNCE_DEFAULT_TIMEOUT, btnLayout, formLayout } from '@/lib/frontend/const';
import { LinkWordAndSentenceResp, SentenceSearchResp, WordSearchResp } from '@/lib/backend/paramAndResp';
import { Sentence, Word } from '@/db/models/types';
import { decodeSentenceInfo } from '@/lib/frontend/encDecSentenceInfo';
import { parseAsString, useQueryState } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import AutoComplete from 'antd/lib/auto-complete';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import LoadingInContainer from '@/components/common/LoadingInContainer';
import Message from 'antd/lib/message';
import Request from '@/lib/frontend/request';
import Select from 'antd/lib/select';

export default function LinkWordAndSentenceForm() {
  const [encodedSentenceInfo] = useQueryState('sentence', parseAsString.withDefault(''));
  const getInitialSentenceId = () => {
    const { id: initialSentenceId } = decodeSentenceInfo(encodedSentenceInfo);
    return initialSentenceId;
  };
  const getInitialSentenceSearchResult = () => {
    const { id: initialSentenceId, text: initialSentenceText } = decodeSentenceInfo(encodedSentenceInfo);
    return initialSentenceId && initialSentenceText ? [
      { ctime: '', id: initialSentenceId, mtime: '', note: '', sentence: initialSentenceText, words: [] }
    ] : [];
  };

  const [word, setWord] = useQueryState('word', parseAsString.withDefault(''));
  const [sentenceId, setSentenceId] = useState(getInitialSentenceId);
  const [wordSearchResult, setWordSearchResult] = useState<Word[]>([]);
  const [sentenceSearchResult, setSentenceSearchResult] = useState<Sentence[]>(getInitialSentenceSearchResult);
  const wordSearchResultOptions = wordSearchResult.map((wd) => ({ label: wd.word, value: wd.word }));
  const sentenceSearchResultOptions = sentenceSearchResult.map((st) => ({ label: st.sentence, value: st.id }));

  const [isFetchingWordOptions, setIsFetchingWordOptions] = useState(false);
  const [isFetchingSentenceOptions, setIsFetchingSentenceOptions] = useState(false);

  const canNotSubmit = !word || !sentenceId;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWordChange = (newWord: string) => {
    setWord(newWord);
  };

  const handleWordSearch = useDebouncedCallback(
    async (newWord: string) => {
      if (!newWord) {
        setWordSearchResult([]);
        return;
      }
      setIsFetchingWordOptions(true);
      try {
        const { result } = await Request.get<WordSearchResp>({ params: { search: newWord }, url: '/api/word/search' });
        setWordSearchResult(result);
      } catch (e) {
        return;
      } finally {
        setIsFetchingWordOptions(false);
      }
    },
    DEBOUNCE_DEFAULT_TIMEOUT,
    DEBOUNCE_DEFAULT_OPTION
  );

  const handleSentenceChange = (newSentenceId: string) => {
    setSentenceId(newSentenceId);
  };

  const handleSentenceSearch = useDebouncedCallback(
    async (newSentence: string) => {
      if (!newSentence) {
        setSentenceSearchResult([]);
        return;
      }
      setIsFetchingSentenceOptions(true);
      try {
        const { result } = await Request.get<SentenceSearchResp>({ params: { search: newSentence }, url: '/api/sentence/search' });
        setSentenceSearchResult(result);
      } catch (e) {
        return;
      } finally {
        setIsFetchingSentenceOptions(false);
      }
    },
    DEBOUNCE_DEFAULT_TIMEOUT,
    DEBOUNCE_DEFAULT_OPTION
  );

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
          value={word}
          notFoundContent={isFetchingWordOptions ? <LoadingInContainer /> : null}
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
          value={sentenceId}
          notFoundContent={isFetchingSentenceOptions ? <LoadingInContainer /> : null}
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
