import { GetWordResp, UpsertWordResp, WordSearchResp } from '@/lib/backend/paramAndResp';
import { Sentence, Word } from '@/db/models/types';
import { useState } from 'react';
import Form from 'antd/lib/form';
import Request from '@/lib/frontend/request';
import WordCnWordCommon from '@/components/WordCnWordCommon';
import styles from './word.module.scss';

type EditWordForm = {
  note: string
};

function Sentences({ sentences }: { sentences: Sentence[] }) {
  return (
    <Form.Item label="Sentences">
      {
        !sentences.length ? <span>No sentences recorded yet</span> : (
          <ol className={styles.sentences}>
            {
              sentences.map(({ sentence }) => {
                return (
                  <li key={sentence}>{sentence}</li>
                );
              })
            }
          </ol>
        )
      }
    </Form.Item>
  );
}

function WordReadOnlyInfo({ createTime, modifyTime, sentences, synonymsText }: {
  createTime: string
  modifyTime: string
  sentences: Sentence[]
  synonymsText: string
}) {
  return (
    <>
      <Form.Item label="Synonyms">
        <span>{synonymsText || 'No synonyms recorded yet'}</span>
      </Form.Item>
      <Sentences sentences={sentences} />
      <Form.Item label="Create Time">
        <span>{createTime}</span>
      </Form.Item>
      <Form.Item label="Modify Time">
        <span>{modifyTime}</span>
      </Form.Item>
    </>
  );
}

export default function WordPage() {
  const [synonymsText, setSynonymsText] = useState('');
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [createTime, setCreateTime] = useState('');
  const [modifyTime, setModifyTime] = useState('');

  const [searchResult, setSearchResult] = useState<Word[]>([]);
  const searchResultOptions = searchResult.map((wd) => ({ label: wd.word, value: wd.word }));

  const [editWordForm] = Form.useForm<EditWordForm>();
  const noteFieldValue = Form.useWatch('note', editWordForm);
  const initialValue = {
    note: ''
  };

  const handleWordSearch = async (newWord: string) => {
    try {
      const { result } = await Request.get<WordSearchResp>({ params: { search: newWord }, url: '/api/word/search' });
      setSearchResult(result);
    } catch (e) {
      return;
    }
  };

  const afterGetWord = (word: any) => {
    setCreateTime(word.ctime);
    setModifyTime(word.mtime);
    setSynonymsText(word.itsSynonyms.map(({ word }: any) => word).join('; '));
    setSentences(word.sentences);
  };

  const clearFieldsExceptWordKey = () => {
    setCreateTime('');
    setModifyTime('');
    editWordForm.setFieldValue('note', '');
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
      noteFieldValue={noteFieldValue}
      readOnlyInfo={
        <WordReadOnlyInfo
          createTime={createTime}
          modifyTime={modifyTime}
          sentences={sentences}
          synonymsText={synonymsText}
        />
      }
      searchResultOptions={searchResultOptions}
      upsertRequest={upsertRequest}
    />
  );
}
