import { GetWordResp, UpsertWordResp, WordSearchResp } from '@/lib/backend/paramAndResp';
import { KeyboardEvent, useState } from 'react';
import { Sentence, Word } from '@/db/models/types';
import { btnLayout, formLayout } from '@/lib/const';
import { isMac, isWindows } from '@/lib/frontend/get-platform';
import AutoComplete from 'antd/lib/auto-complete';
import Button from 'antd/lib/button';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import MarkdownEditor from '@/components/MarkdownEditor';
import Message from 'antd/lib/message';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import Request from '@/lib/frontend/request';
import Tooltip from 'antd/lib/tooltip';
import styles from './word.module.scss';
import useCreateUpdateInOne from '@/lib/frontend/hooks/useCreateUpdateInOne';

type EditWordForm = {
  note: string
};

const rules = {
  note: [{ message: 'note should not be empty', required: true }]
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

function WordReadOnlyInfo({ synonymsText, sentences, createTime, modifyTime }: {
  synonymsText: string,
  sentences: Sentence[],
  createTime: string,
  modifyTime: string
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
  const {
    isSearchWordState,
    isUpdateWordState,
    changeToCreateWordState,
    changeToSearchWordState,
    changeToUpdateWordState,
    stateText
  } = useCreateUpdateInOne();

  const [wordSearchKey, setWordSearchKey] = useState('');
  const [synonymsText, setSynonymsText] = useState('');
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [createTime, setCreateTime] = useState('');
  const [modifyTime, setModifyTime] = useState('');

  const [searchResult, setSearchResult] = useState<Word[]>([]);
  const searchResultOptions = searchResult.map((wd) => ({ label: wd.word, value: wd.word }));

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
      const { result } = await Request.get<WordSearchResp>({ params: { search: newWord }, url: '/api/word/search' });
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
    changeToSearchWordState();
    if (!wordSearchKey) {
      clearFieldsExceptWordKey();
      return;
    }
    let word: Word | null = null;
    try {
      const getWordRes = await Request.get<GetWordResp>({ params: { word: wordSearchKey }, url: '/api/getWord' });
      word = getWordRes.word;
    } catch (e) {
      Message.error({ content: 'get word info failed' });
      clearFieldsExceptWordKey();
      changeToSearchWordState();
      return;
    }
    if (!word) {
      clearFieldsExceptWordKey();
      changeToCreateWordState();
      return;
    }
    changeToUpdateWordState();
    setSynonymsText(word.itsSynonyms.map(({ word }) => word).join('; '));
    setSentences(word.sentences);
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
      const { created } = await Request.post<UpsertWordResp>({
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
              options={searchResultOptions}
              onChange={handleWordChange}
              onSearch={handleWordSearch}
              onBlur={getWord}
              onInputKeyDown={(e) => preventAccidentSubmit(e)}
            />
          </Form.Item>

          {
            isUpdateWordState && (
              <WordReadOnlyInfo
                createTime={createTime}
                modifyTime={modifyTime}
                sentences={sentences}
                synonymsText={synonymsText}
              />
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
                <Button className={styles.btn} onClick={cleanNote}>
                  Clean Note
                </Button>
              )
            }
          </Form.Item>
        </Form>
      </div>
    </EnLayout>
  );
}
