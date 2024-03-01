import { CnWord } from '@/db/models/types';
import { formLayout } from '@/lib/frontend/const';
import Form from 'antd/lib/form';
import LoadingInContainer from '../common/LoadingInContainer';
import MarkdownPreviewer from '../MarkdownPreviewer';
import Modal, { ModalProps } from 'antd/lib/modal';
import useGetCnWord from '@/lib/frontend/hooks/api/useGetCnWord';

/**
 * 单词详情对话框
 * @param {CnWord} externalData 若指定外部数据源，则直接使用，不发请求
 */

interface Props {
  word: string
  externalData?: CnWord
  open: boolean
  onCancel: ModalProps['onCancel']
}

export default function CnWordInfoDialog({ word, open, onCancel, externalData }: Props) {
  const { cnWord: cnWordRecord } = useGetCnWord({
    dialogOpen: open,
    externalData,
    params: { word }
  });

  return (
    <>
      <Modal
        title={word}
        open={open}
        onCancel={onCancel}
        width={1200}
        footer={[]}
      >
        {
          !cnWordRecord ? <LoadingInContainer /> : (
            <Form {...formLayout}>
              <Form.Item label="Create Time">
                <span>{cnWordRecord.ctime}</span>
              </Form.Item>
              <Form.Item label="Modify Time">
                <span>{cnWordRecord.mtime}</span>
              </Form.Item>
              <Form.Item label="Note">
                <MarkdownPreviewer value={cnWordRecord.note} />
              </Form.Item>
            </Form>
          )
        }
      </Modal>
    </>
  );
}
