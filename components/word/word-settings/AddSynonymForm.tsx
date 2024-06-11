import { AddWordSynonymResp, WordSearchResp } from '@/lib/backend/paramAndResp';
import { DEBOUNCE_DEFAULT_OPTION, DEBOUNCE_DEFAULT_TIMEOUT, btnLayout, formLayout } from '@/lib/frontend/const';
import { Word } from '@/db/models/types';
import { apiUrls } from '@/lib/backend/urls';
import { parseAsString, useQueryState } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import AutoComplete from 'antd/lib/auto-complete';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import LoadingInContainer from '@/components/common/LoadingInContainer';
import Message from 'antd/lib/message';
import Request from '@/lib/frontend/request';
import Spin from 'antd/lib/spin';

export default function AddSynonymForm() {
  const [lhs, setLhs] = useQueryState('word1', parseAsString.withDefault(''));
  const [rhs, setRhs] = useQueryState('word2', parseAsString.withDefault(''));
  const [lhsWordSearchResult, setLhsWordSearchResult] = useState<Word[]>([]);
  const [rhsWordSearchResult, setRhsWordSearchResult] = useState<Word[]>([]);
  function getWordSearchResultOptions(wordSearchResult: Word[]) {
    return wordSearchResult.map((wd) => ({ label: wd.word, value: wd.word }));
  }
  const lhsWordSearchResultOptions = getWordSearchResultOptions(lhsWordSearchResult);
  const rhsWordSearchResultOptions = getWordSearchResultOptions(rhsWordSearchResult);

  const [isFetchingLhsOptions, setIsFetchingLhsOptions] = useState(false);
  const [isFetchingRhsOptions, setIsFetchingRhsOptions] = useState(false);

  const canNotSubmit = !lhs || !rhs;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLhsWordChange = (newWord: string) => {
    setLhs(newWord);
  };

  const handleLhsWordSearch = useDebouncedCallback(
    async (newWord: string) => {
      if (!newWord) {
        setLhsWordSearchResult([]);
        return;
      }
      setIsFetchingLhsOptions(true);
      try {
        const { result } = await Request.get<WordSearchResp>({ params: { search: newWord }, url: apiUrls.word.search });
        setLhsWordSearchResult(result);
      } catch (e) {
        return;
      } finally {
        setIsFetchingLhsOptions(false);
      }
    },
    DEBOUNCE_DEFAULT_TIMEOUT,
    DEBOUNCE_DEFAULT_OPTION
  );

  const handleRhsWordChange = (newWord: string) => {
    setRhs(newWord);
  };

  const handleRhsWordSearch = useDebouncedCallback(
    async (newWord: string) => {
      if (!newWord) {
        setRhsWordSearchResult([]);
        return;
      }
      setIsFetchingRhsOptions(true);
      try {
        const { result } = await Request.get<WordSearchResp>({ params: { search: newWord }, url: apiUrls.word.search });
        setRhsWordSearchResult(result);
      } catch (e) {
        return;
      } finally {
        setIsFetchingRhsOptions(false);
      }
    },
    DEBOUNCE_DEFAULT_TIMEOUT,
    DEBOUNCE_DEFAULT_OPTION
  );

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
      const { created } = await Request.post<AddWordSynonymResp>({ data: params, url: apiUrls.word.addSynonym });
      const msg = created ? 'Add synonym success' : 'This synonym pair has been previously added';
      Message.success({ content: msg });
    } catch (e) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Spin spinning={isSubmitting}>
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
            value={lhs}
            notFoundContent={isFetchingLhsOptions ? <LoadingInContainer /> : null}
          />
        </Form.Item>
        <Form.Item label="Word 2">
          <AutoComplete
            placeholder="Search word"
            options={rhsWordSearchResultOptions}
            onChange={handleRhsWordChange}
            onSearch={handleRhsWordSearch}
            value={rhs}
            notFoundContent={isFetchingRhsOptions ? <LoadingInContainer /> : null}
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
    </Spin>
  );
}
