import { CnWord } from '@/db/models/types';
import { KeyboardEvent, useState } from 'react';
import AutoComplete from 'antd/lib/auto-complete';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import Message from 'antd/lib/message';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import Request from '@/lib/frontend/request';
import Tooltip from 'antd/lib/tooltip';
import styles from './cn-word.module.scss';

const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 }
};

const btnLayout = {
  wrapperCol: { offset: 3, span: 19 }
};

const SEARCH_WORD = 1;
const CREATE_WORD = 2;
const UPDATE_WORD = 3;
type State = typeof SEARCH_WORD | typeof CREATE_WORD | typeof UPDATE_WORD;
const stateToText: Record<State, string> = {
  [CREATE_WORD]: 'Create Word',
  [SEARCH_WORD]: 'Search Word',
  [UPDATE_WORD]: 'Update Word'
};

type EditWordForm = {
  note: string
};

type CnWordSearchRes = {
  result: CnWord[]
};

type UpsertCnWordRes = {
  created: boolean
  word?: CnWord
};

// type GetAllCnWordsResp = {
//   words: CnWord[]
// };

// function useCnWords() {
//   const { data, isLoading } = useSWR<GetAllCnWordsResp, any, string>(
//     '/api/getAllCnWords',
//     (url) => Request.get({ url })
//   );
//   return { cnWords: data?.words, isLoading };
// }

export default function CnWordsDisplay() {
  // const { cnWords, isLoading } = useCnWords();

  // if (isLoading) {
  //   return <Spin />;
  // }

  // if (!cnWords) {
  //   return <Empty />;
  // }
  const [wordSearchKey, setWordSearchKey] = useState('');
  const [currentState, setCurrentState] = useState<State>(SEARCH_WORD);

  const [searchResult, setSearchResult] = useState<CnWord[]>([]);

  const [editWordForm] = Form.useForm<EditWordForm>();
  const noteFieldValue = Form.useWatch('note', editWordForm);
  const initialWordValue = {
    note: ''
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldShowNoteField = currentState !== SEARCH_WORD;
  const canNotSubmit = currentState === SEARCH_WORD || !noteFieldValue || isSubmitting;

  const preventAccidentSubmit = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const handleWordChange = (newWord: string) => {
    setWordSearchKey(newWord);
  };

  const handleWordSearch = async (newWord: string) => {
    try {
      const { result } = await Request.get<CnWordSearchRes>({ params: { search: newWord }, url: '/api/cnWord/search' });
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
      const { created } = await Request.post<UpsertCnWordRes>({
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
          <Form.Item label={modeToolTip}>
            <span>{stateToText[currentState]}</span>
          </Form.Item>

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
        </Form>
      </div>
    </EnLayout>
  );
}
