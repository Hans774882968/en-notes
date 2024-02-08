import { CnWord, Word } from '@/db/models/types';
import { DEBOUNCE_DEFAULT_OPTION, DEBOUNCE_DEFAULT_TIMEOUT, btnLayout, formLayout } from '@/lib/const';
import { DefaultOptionType } from 'antd/lib/select';
import { ReactNode, useState } from 'react';
import { Store } from 'antd/lib/form/interface';
import { ctrlSAction, preventAccidentSubmitAction } from '@/lib/frontend/keydownActions';
import { useDebouncedCallback } from 'use-debounce';
import AutoComplete from 'antd/lib/auto-complete';
import Button from 'antd/lib/button';
import EnLayout from './EnLayout';
import Form, { FormInstance } from 'antd/lib/form';
import MarkdownEditor from '@/components/MarkdownEditor';
import Message from 'antd/lib/message';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import Tooltip from 'antd/lib/tooltip';
import styles from './WordCnWordCommon.module.scss';
import useCreateUpdateStateMachine from '@/lib/frontend/hooks/useCreateUpdateStateMachine';

interface Props {
  afterGetWord: (word: Word | CnWord) => void
  clearFieldsExceptWordKey: () => void
  editWordForm: FormInstance
  getWordReq: (wordSearchKey: string) => Promise<Word | CnWord | null>
  handleWordSearch: (newWord: string) => void
  initialValue: Store
  noteFieldValue: string
  readOnlyInfo: ReactNode
  searchResultOptions: DefaultOptionType[]
  upsertRequest: (params: any) => Promise<boolean>
}

type EditWordForm = {
  note: string
};

const rules = {
  note: [{ message: 'note should not be empty', required: true }]
};

function ModeField({ stateText }: { stateText: string }) {
  const modeIntro = (
    <>
      <span>Search: Please start by inputing a keyword</span><br />
      <span>Create: record is not found, your action will create a new record</span><br />
      <span>Update: your action will update existing record</span>
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

export default function WordCnWordCommon({
  afterGetWord,
  clearFieldsExceptWordKey,
  editWordForm,
  getWordReq,
  handleWordSearch,
  initialValue,
  noteFieldValue,
  readOnlyInfo,
  searchResultOptions,
  upsertRequest
}: Props) {
  const {
    isSearchWordState,
    isUpdateWordState,
    changeToCreateWordState,
    changeToSearchWordState,
    changeToUpdateWordState,
    stateText
  } = useCreateUpdateStateMachine();

  const [wordSearchKey, setWordSearchKey] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldShowNoteField = !isSearchWordState;
  const canNotSubmit = isSearchWordState || !noteFieldValue || isSubmitting;

  const preventAccidentSubmit = preventAccidentSubmitAction();

  const handleWordChange = (newWord: string) => {
    setWordSearchKey(newWord);
  };

  const debounceHandleWordSearch = useDebouncedCallback(
    handleWordSearch,
    DEBOUNCE_DEFAULT_TIMEOUT,
    DEBOUNCE_DEFAULT_OPTION
  );

  const getWord = async () => {
    changeToSearchWordState();
    if (!wordSearchKey) {
      clearFieldsExceptWordKey();
      return;
    }
    let word: Word | CnWord | null = null;
    try {
      word = await getWordReq(wordSearchKey);
    } catch (e) {
      Message.error({ content: 'get info failed' });
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
    afterGetWord(word);
    editWordForm.setFieldValue('note', word.note);
  };

  const mdEditorKeyDown = ctrlSAction(() => editWordForm.submit());

  const onFinish = async (editWordFormData: EditWordForm) => {
    if (canNotSubmit) return;

    const upsertWordParams = {
      ...editWordFormData, word: wordSearchKey
    };
    setIsSubmitting(true);
    try {
      const created = await upsertRequest(upsertWordParams);
      Message.success(`${created ? 'Create' : 'Update'} "${wordSearchKey}" success`);
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
          initialValues={initialValue}
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
              onSearch={debounceHandleWordSearch}
              onBlur={getWord}
              onInputKeyDown={(e) => preventAccidentSubmit(e)}
            />
          </Form.Item>

          {isUpdateWordState && readOnlyInfo}

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
