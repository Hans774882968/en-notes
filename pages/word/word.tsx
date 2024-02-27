import { GetWordResp, UpsertWordResp, WordSearchResp } from '@/lib/backend/paramAndResp';
import { Sentence, Word } from '@/db/models/types';
import { useState } from 'react';
import Form from 'antd/lib/form';
import Request from '@/lib/frontend/request';
import WordCnWordCommon from '@/components/WordCnWordCommon';
import WordReadOnlyInfo from '@/components/word/WordReadOnlyInfo';
import useCreateUpdateStateMachine from '@/lib/frontend/hooks/useCreateUpdateStateMachine';

type EditWordForm = {
  note: string
};

export default function WordPage() {
  const stateMachine = useCreateUpdateStateMachine();
  const {
    changeToSearchState
  } = stateMachine;

  const [belongWord, setBelongWord] = useState('');
  const [synonyms, setSynonyms] = useState<Word[]>([]);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [createTime, setCreateTime] = useState('');
  const [modifyTime, setModifyTime] = useState('');

  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [searchResult, setSearchResult] = useState<Word[]>([]);
  const searchResultOptions = searchResult.map((wd) => ({ label: wd.word, value: wd.word }));

  const [editWordForm] = Form.useForm<EditWordForm>();
  // antd 给出的类型标注不对，它可能是 undefined ，所以要保证它真的是 string
  const noteFieldValue = Form.useWatch('note', editWordForm) || '';
  const initialValue = {
    note: ''
  };

  const handleWordSearch = async (newWord: string) => {
    if (!newWord) {
      setSearchResult([]);
      changeToSearchState();
      return;
    }
    setIsFetchingOptions(true);
    try {
      const { result } = await Request.get<WordSearchResp>({ params: { search: newWord }, url: '/api/word/search' });
      setSearchResult(result);
    } catch (e) {
      return;
    } finally {
      setIsFetchingOptions(false);
    }
  };

  const afterGetWord = (word: any) => {
    setCreateTime(word.ctime);
    setModifyTime(word.mtime);
    setSynonyms(word.itsSynonyms);
    setSentences(word.sentences);
    setBelongWord(word.word);
  };

  const clearFieldsExceptWordKey = () => {
    setCreateTime('');
    setModifyTime('');
    editWordForm.setFieldValue('note', '');
    setBelongWord('');
  };

  const getWordReq = async (wordSearchKey: string) => {
    const getWordRes = await Request.get<GetWordResp>({ params: { word: wordSearchKey }, url: '/api/getWord' });
    return getWordRes.word;
  };

  const upsertRequest = async (upsertWordParams: any) => {
    const { created } = await Request.post<UpsertWordResp>({
      data: upsertWordParams,
      url: '/api/upsertWord'
    });
    return created;
  };

  return (
    <WordCnWordCommon
      afterGetWord={afterGetWord}
      clearFieldsExceptWordKey={clearFieldsExceptWordKey}
      editWordForm={editWordForm}
      getWordReq={getWordReq}
      handleWordSearch={handleWordSearch}
      initialValue={initialValue}
      isFetchingOptions={isFetchingOptions}
      noteFieldValue={noteFieldValue}
      readOnlyInfo={
        <WordReadOnlyInfo
          belongWord={belongWord}
          createTime={createTime}
          modifyTime={modifyTime}
          sentences={sentences}
          synonyms={synonyms}
        />
      }
      searchResultOptions={searchResultOptions}
      stateMachine={stateMachine}
      upsertRequest={upsertRequest}
    />
  );
}
