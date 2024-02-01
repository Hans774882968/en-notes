import { KeyboardEvent, useState } from 'react';
import { ThemeProvider } from '@/components/ThemeContext';
import { isMac, isWindows } from '@/lib/frontend/get-platform';
import AutoComplete from 'antd/lib/auto-complete';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import MarkdownEditor from './MarkdownEditor';
import Message from 'antd/lib/message';
import Navbar from '@/components/Navbar';
import Request from '@/lib/frontend/request';
import styles from './word.module.sass';

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
  [SEARCH_WORD]: 'Search Word (Please start by searching a word)',
  [UPDATE_WORD]: 'Update Word'
};

type EditWordForm = {
  note: string
};

const rules = {
  note: [{ message: 'note should not be empty', required: true }]
};

type Word = {
  word: string
  note: string
  ctime: string
  mtime: string
};

type WordSearchRes = {
  result: Word[]
};

type GetWordRes = {
  word: Word | null
};

type UpsertWordRes = {
  created: boolean
  word?: Word
};

export default function WordPage() {
  const [wordSearchKey, setWordSearchKey] = useState('');
  const [currentState, setCurrentState] = useState<State>(SEARCH_WORD);
  const [createTime, setCreateTime] = useState('');
  const [modifyTime, setModifyTime] = useState('');

  const [searchResult, setSearchResult] = useState<Word[]>([]);

  const [editWordForm] = Form.useForm<EditWordForm>();
  const noteFieldValue = Form.useWatch('note', editWordForm);
  const initialWordValue = {
    note: ''
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldShowNoteField = currentState !== SEARCH_WORD;
  const canNotSubmit = currentState === SEARCH_WORD || !noteFieldValue || isSubmitting;

  const preventAutoSubmit = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const handleWordChange = (newWord: string) => {
    setWordSearchKey(newWord);
  };

  const handleWordSearch = async (newWord: string) => {
    try {
      const { result } = await Request.get<WordSearchRes>({ params: { search: newWord }, url: '/api/word/search' });
      setSearchResult(result);
    } catch (e) {
      return;
    }
  };

  const clearFieldsExceptWordKey = () => {
    setCreateTime('');
    setModifyTime('');
    editWordForm.setFieldValue('note', '');
  };

  const getWord = async () => {
    setCurrentState(SEARCH_WORD);
    if (!wordSearchKey) {
      clearFieldsExceptWordKey();
      return;
    }
    let word: Word | null = null;
    try {
      const getWordRes = await Request.get<GetWordRes>({ params: { word: wordSearchKey }, url: '/api/getWord' });
      word = getWordRes.word;
    } catch (e) {
      Message.error({ content: 'get word info failed' });
      clearFieldsExceptWordKey();
      setCurrentState(SEARCH_WORD);
      return;
    }
    if (!word) {
      clearFieldsExceptWordKey();
      setCurrentState(CREATE_WORD);
      return;
    }
    setCurrentState(UPDATE_WORD);
    setCreateTime(word.ctime);
    setModifyTime(word.mtime);
    editWordForm.setFieldValue('note', word.note);
  };

  const mdEditorKeyDown = (e: KeyboardEvent) => {
    if (!((isWindows() && e.ctrlKey) || (isMac() && e.metaKey)) || e.code !== 'KeyS') return;
    e.preventDefault();
    editWordForm.submit();
  };

  const onFinish = async (editWordFormData: EditWordForm) => {
    if (canNotSubmit) return;

    const upsertWordParams = {
      ...editWordFormData, word: wordSearchKey
    };
    setIsSubmitting(true);
    try {
      const { created } = await Request.post<UpsertWordRes>({
        data: upsertWordParams,
        url: '/api/upsertWord'
      });
      Message.success(`${created ? 'Create' : 'Update'} word "${wordSearchKey}" success`);
    } catch (e) {
      return;
    } finally {
      setIsSubmitting(false);
    }

    // 提交成功后获取单词信息失败，会回到 SEARCH_WORD 状态并清掉表单内容，我认为 it is ok
    getWord();
  };

  const cleanNote = () => {
    const cleanedNote = noteFieldValue.trim().replace(/  +/g, ' ');
    editWordForm.setFieldValue('note', cleanedNote);
  };

  return (
    <ThemeProvider>
      <Navbar />

      <div className={styles.word}>
        <Form
          {...formLayout}
          form={editWordForm}
          name="editWordForm"
          initialValues={initialWordValue}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Mode">
            <span>{stateToText[currentState]}</span>
          </Form.Item>

          <Form.Item label="Word">
            <AutoComplete
              autoFocus
              placeholder="Search word"
              options={searchResult.map((wd) => ({ label: wd.word, value: wd.word }))}
              onChange={handleWordChange}
              onSearch={handleWordSearch}
              onBlur={getWord}
              onInputKeyDown={(e) => preventAutoSubmit(e)}
            />
          </Form.Item>

          {
            (currentState === UPDATE_WORD) && (
              <Form.Item label="Create Time">
                <span>{createTime}</span>
              </Form.Item>
            )
          }

          {
            (currentState === UPDATE_WORD) && (
              <Form.Item label="Modify Time">
                <span>{modifyTime}</span>
              </Form.Item>
            )
          }

          {
            shouldShowNoteField && (
              <Form.Item label="Note" name="note" rules={rules.note}>
                <MarkdownEditor onKeyDown={mdEditorKeyDown} />
              </Form.Item>
            )
          }

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

            {
              shouldShowNoteField && (
                <Button className={styles.btn} onClick={cleanNote}>Clean Note</Button>
              )
            }
          </Form.Item>
        </Form>
      </div>
    </ThemeProvider>
  );
}
