import { CnWord } from '@/db/models/types';
import { CnWordSearchResp, GetCnWordResp, UpsertCnWordResp } from '@/lib/backend/paramAndResp';
import { useState } from 'react';
import Form from 'antd/lib/form';
import Request from '@/lib/frontend/request';
import WordCnWordCommon from '@/components/WordCnWordCommon';

type EditWordForm = {
  note: string
};

function CnWordReadOnlyInfo({ createTime, modifyTime }: {
  createTime: string
  modifyTime: string
}) {
  return (
    <>
      <Form.Item label="Create Time">
        <span>{createTime}</span>
      </Form.Item>
      <Form.Item label="Modify Time">
        <span>{modifyTime}</span>
      </Form.Item>
    </>
  );
}

export default function CnWordPage() {
  const [createTime, setCreateTime] = useState('');
  const [modifyTime, setModifyTime] = useState('');

  const [searchResult, setSearchResult] = useState<CnWord[]>([]);
  const searchResultOptions = searchResult.map((wd) => ({ label: wd.word, value: wd.word }));

  const [editWordForm] = Form.useForm<EditWordForm>();
  const noteFieldValue = Form.useWatch('note', editWordForm);
  const initialValue = {
    note: ''
  };

  const handleWordSearch = async (newWord: string) => {
    try {
      const { result } = await Request.get<CnWordSearchResp>({ params: { search: newWord }, url: '/api/cnWord/search' });
      setSearchResult(result);
    } catch (e) {
      return;
    }
  };

  const afterGetWord = (cnWord: any) => {
    setCreateTime(cnWord.ctime);
    setModifyTime(cnWord.mtime);
  };

  const clearFieldsExceptWordKey = () => {
    setCreateTime('');
    setModifyTime('');
    editWordForm.setFieldValue('note', '');
  };

  const getWordReq = async (wordSearchKey: string) => {
    const getWordRes = await Request.get<GetCnWordResp>({ params: { word: wordSearchKey }, url: '/api/getCnWord' });
    return getWordRes.word;
  };

  const upsertRequest = async (upsertCnWordParams: any) => {
    const { created } = await Request.post<UpsertCnWordResp>({
      data: upsertCnWordParams,
      url: '/api/upsertCnWord'
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
        <CnWordReadOnlyInfo
          createTime={createTime}
          modifyTime={modifyTime}
        />
      }
      searchResultOptions={searchResultOptions}
      upsertRequest={upsertRequest}
    />
  );
}
