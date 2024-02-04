import { CnWord } from '@/db/models/types';
import { CnWordSearchResp, UpsertCnWordResp } from '@/lib/backend/paramAndResp';
import { KeyboardEvent, useState } from 'react';
import { btnLayout, formLayout } from '@/lib/const';
import AutoComplete from 'antd/lib/auto-complete';
import Button from 'antd/lib/button';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import Message from 'antd/lib/message';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import Request from '@/lib/frontend/request';
import Tooltip from 'antd/lib/tooltip';
import styles from './cn-word.module.scss';
import useCreateUpdateInOne from '@/lib/frontend/hooks/useCreateUpdateInOne';

type EditWordForm = {
  note: string
};

function ModeField({ stateText }: { stateText: string }) {
  const modeIntro = (
    <>
      <span>Search Word: Please start by searching a word</span><br />
      <span>Create Word: word record is not found, your action will create a new word</span><br />
      <span>Update Word: your action will update existing word</span>
    </>
  );
  const modeToolTip = (
    <>
      <Tooltip placement="top" title={modeIntro}>
        <QuestionCircleOutlined className={styles.formTooltipIcon} />
      </Tooltip>
      Mode
    </>
  );
  return (
    <Form.Item label={modeToolTip}>
      <span>{stateText}</span>
    </Form.Item>
  );
}

export default function CnWordsDisplay() {
  const {
    isSearchWordState,
    isUpdateWordState,
    changeToCreateWordState,
    changeToSearchWordState,
    changeToUpdateWordState,
    stateText
  } = useCreateUpdateInOne();

  const [wordSearchKey, setWordSearchKey] = useState('');

  const [searchResult, setSearchResult] = useState<CnWord[]>([]);

  const [editWordForm] = Form.useForm<EditWordForm>();
  const noteFieldValue = Form.useWatch('note', editWordForm);
  const initialWordValue = {
    note: ''
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldShowNoteField = !isSearchWordState;
  const canNotSubmit = isSearchWordState || !noteFieldValue || isSubmitting;

  const preventAccidentSubmit = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const handleWordChange = (newWord: string) => {
    setWordSearchKey(newWord);
  };

  const handleWordSearch = async (newWord: string) => {
    try {
      const { result } = await Request.get<CnWordSearchResp>({ params: { search: newWord }, url: '/api/cnWord/search' });
      setSearchResult(result);
    } catch (e) {
      return;
    }
  };

  const getCnWord = async () => {

  };
  const onFinish = async (editWordFormData: EditWordForm) => {
    if (canNotSubmit) return;

    const upsertCnWordParams = {
      ...editWordFormData, word: wordSearchKey
    };
    setIsSubmitting(true);
    try {
      const { created } = await Request.post<UpsertCnWordResp>({
        data: upsertCnWordParams,
        url: '/api/upsertCnWord'
      });
      Message.success(`${created ? 'Create' : 'Update'} topic "${wordSearchKey}" success`);
    } catch (e) {
      return;
    } finally {
      setIsSubmitting(false);
    }

    // 提交成功后获取单词信息失败，会回到 SEARCH_WORD 状态并清掉表单内容，我认为 it is ok
    getCnWord();
  };

  return (
    <EnLayout>
      <div className={styles.word}>
        <Form
          {...formLayout}
          form={editWordForm}
          name="editWordForm"
          initialValues={initialWordValue}
          onFinish={onFinish}
          autoComplete="off"
        >
          <ModeField stateText={stateText} />

          <Form.Item label="Word">
            <AutoComplete
              autoFocus
              placeholder="Search word"
              options={searchResult.map((wd) => ({ label: wd.word, value: wd.word }))}
              onChange={handleWordChange}
              onSearch={handleWordSearch}
              onBlur={getCnWord}
              onInputKeyDown={(e) => preventAccidentSubmit(e)}
            />
          </Form.Item>

          <Form.Item {...btnLayout}>
            <Button
              className={styles.btn}
              type="primary"
              htmlType="submit"
              disabled={canNotSubmit}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </EnLayout>
  );
}
