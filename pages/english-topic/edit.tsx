import { CnWord } from '@/db/models/types';
import { CnWordSearchResp, GetCnWordResp, UpsertCnWordResp } from '@/lib/backend/paramAndResp';
import { GetServerSideProps } from 'next';
import { UserSession, noEditPerm } from '@/lib/backend/noPermInterceptor';
import { apiUrls } from '@/lib/backend/urls';
import { useState } from 'react';
import Form from 'antd/lib/form';
import Request from '@/lib/frontend/request';
import WordCnWordCommon from '@/components/WordCnWordCommon';
import useCreateUpdateStateMachine from '@/lib/frontend/hooks/useCreateUpdateStateMachine';

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
  const stateMachine = useCreateUpdateStateMachine();
  const {
    changeToSearchState
  } = stateMachine;

  const [createTime, setCreateTime] = useState('');
  const [modifyTime, setModifyTime] = useState('');

  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [searchResult, setSearchResult] = useState<CnWord[]>([]);
  const searchResultOptions = searchResult.map((wd) => ({ label: wd.word, value: wd.word }));

  const [editWordForm] = Form.useForm<EditWordForm>();
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
      const { result } = await Request.get<CnWordSearchResp>({ params: { search: newWord }, url: apiUrls.cnWord.search });
      setSearchResult(result);
    } catch (e) {
      return;
    } finally {
      setIsFetchingOptions(false);
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
    const getWordRes = await Request.get<GetCnWordResp>({ params: { word: wordSearchKey }, url: apiUrls.cnWord.get });
    return getWordRes.word;
  };

  const upsertRequest = async (upsertCnWordParams: any) => {
    const { created } = await Request.post<UpsertCnWordResp>({
      data: upsertCnWordParams,
      url: apiUrls.cnWord.edit
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
        <CnWordReadOnlyInfo
          createTime={createTime}
          modifyTime={modifyTime}
        />
      }
      searchResultOptions={searchResultOptions}
      stateMachine={stateMachine}
      upsertRequest={upsertRequest}
    />
  );
}

export const getServerSideProps: GetServerSideProps<UserSession> = (context) => {
  return noEditPerm(context);
};
